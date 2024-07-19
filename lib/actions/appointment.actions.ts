"use server"

import { ID, Query } from "node-appwrite";
import { APPOINTMENT_COLLECTION_ID, databases, DB_ID, messaging } from "../appwrite.config";
import { formatDateTime, parseStringify } from "../utils";
import { Appointment } from "@/types/appwrite.types";
import { revalidatePath } from "next/cache";
import { getUser } from "./patient.actions";

export const createAppointment = async (appointment: CreateAppointmentParams) => {
    try{
        const newAppointment = await databases.createDocument(
            DB_ID!,
            APPOINTMENT_COLLECTION_ID!,
            ID.unique(),
            appointment
          );
      
          return parseStringify(newAppointment);
    } catch (err) {
        console.log(err)
    }
}

export const getAppointment = async (appointmentId: string) => {
    try{
        const appointment = await databases.getDocument(DB_ID!, APPOINTMENT_COLLECTION_ID!, appointmentId)

        
        return parseStringify(appointment);
    } catch(err) {
        console.log(err);
    }
}

export const getRecentAppointments = async () => {
    try {
        const timestamp = new Date().getTime();
        const appointments = await databases.listDocuments(
            DB_ID!,
            APPOINTMENT_COLLECTION_ID!,
            [
                Query.orderDesc('$createdAt'),
                Query.limit(100),
                Query.notEqual('$id', 'force_cache_bypass_' + timestamp) // This will always be true, forcing a fresh fetch
            ]
        )

        console.log(appointments);

        const initialCounts = {
            scheduledCount: 0,
            pendingCount: 0,
            cancelledCount: 0
        }

        const counts = (appointments.documents as Appointment[]).reduce((acc, appointment) => {
            if(appointment.status === 'scheduled'){
                acc.scheduledCount += 1;
            } else if(appointment.status === 'pending'){
                acc.pendingCount += 1;
            } else if(appointment.status === 'cancelled'){
                acc.cancelledCount += 1;
            }

            return acc;
        }, initialCounts);

        const data = {
            totalCount : appointments.total,
            ...counts,
            documents: appointments.documents
        }

        return parseStringify(data);  // Use parseStringify here
    } catch(err) {
        console.error("Error fetching recent appointments:", err);
        throw err;  // Rethrow the error
    }
}

export const updateAppointment = async ({appointmentId, userId, appointment, type}: UpdateAppointmentParams)  => {
    try{
        const user = await getUser(userId);
        const updatedAppointment = await databases.updateDocument(
           DB_ID!,
           APPOINTMENT_COLLECTION_ID!,
           appointmentId,
           appointment
        )

        if(!updatedAppointment){
            throw new Error('Appointment not found')
        }

        const smsMessage = `
        Hi ${user.name} !
        Thank you for choosing Appointer !
        ${type === 'schedule' ? `Your appointment has been scheduled for ${formatDateTime(appointment.schedule!).dateTime} with Dr. ${appointment.primaryPhysician}`
            : `Sorry, your appointment has been cancelled for the following reason : ${appointment.cancellationReason}.`
        }
        
        `
        await sendSMSNotification(userId, smsMessage);
        revalidatePath('/admin')
        return parseStringify(updatedAppointment);
    } catch(err){
        console.log(err)
    }
}

export const sendSMSNotification = async (userId: string, content: string) => {
    try{
        const message = await messaging.createSms(
            ID.unique(),
            content,
            [],
            [userId]
        )
        return parseStringify(message)
    } catch(err){
        console.log(err)
    }
}