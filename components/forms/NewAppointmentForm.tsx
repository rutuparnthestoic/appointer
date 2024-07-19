"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Form
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import CustomFormField from "../CustomFormField"
import SubmitButton from "../SubmitButton"
import { Dispatch, SetStateAction, useState } from "react"
import { getAppointmentSchema } from "@/lib/validation"
import { useRouter } from "next/navigation"
import { createUser } from "@/lib/actions/patient.actions"
import { Doctors } from "@/constants"
import { SelectItem } from "../ui/select"
import Image from "next/image"
import { Stats } from "fs"
import { createAppointment, updateAppointment } from "@/lib/actions/appointment.actions"
import { Appointment } from "@/types/appwrite.types"

export enum FormFieldType {
    INPUT = 'input',
    CHECKBOX = 'checkbox',
    TEXTAREA = 'textarea',
    PHONE_INPUT = 'phoneInput',
    DATE_PICKER = 'datePicker',
    SELECT = 'select',
    SKELETON = 'skeleton'
}
 
const NewAppointmentForm = ({userId, patientId, type, appointment, setOpen} : {userId: string, patientId: string, type: 'create' | 'cancle' | 'schedule', appointment?: Appointment, setOpen?: Dispatch<SetStateAction<boolean>>;}) => {
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);

    let buttonLabel;

    const AppointmentFormValidation = getAppointmentSchema(type);
  
  const form = useForm<z.infer<typeof AppointmentFormValidation>>({
    resolver: zodResolver(AppointmentFormValidation),
    defaultValues: {
      primaryPhysician: appointment ? appointment.primaryPhysician : '',
      schedule: appointment ? new Date(appointment.schedule) : new Date(Date.now()),
      reason: appointment ? appointment.reason : '',
      note: appointment?.note || '',
      cancellationReason: appointment?.cancellationReason || "",
    },
  })
  
  async function onSubmit(values: z.infer<typeof AppointmentFormValidation>) {
    setIsLoading(true);

    let status;

    switch (type) {
        case 'schedule':
            status='scheduled';
            break;
        case 'cancle':
            status="cancelled";
            break;
        default:
            status='pending';
            break;
    }
  
    try {
      if(type === 'create' && patientId) {
        const appointmentData = {
            userId,
            patient: patientId,
            primaryPhysician: values.primaryPhysician,
            schedule: new Date(values.schedule),
            reason: values.reason!,
            note: values.note,
            status: status as Status
        }
       const appointment = await createAppointment(appointmentData);

       if(appointment) {
        form.reset();
        router.push(`/patients/${userId}/new-appointment/success?appointmentId=${appointment.$id}`)
       }
    } else {
      const appointmentToUpdate = {
        userId,
        appointmentId: appointment.$id!,
        appointment:{
          primaryPhysician: values?.primaryPhysician,
          schedule: new Date(values?.schedule),
          status: status as Status,
          cancellationReason:  values?.cancellationReason
        },
        type
      
    }
    const updatedAppointment = await updateAppointment(appointmentToUpdate);

    if(updatedAppointment){
      setOpen && setOpen(false);
      form.reset();
    }
    }

     
    } catch (err) {
      console.error("Error creating user:", err);
      // Optionally set an error state here
    } 
  }

  switch (type) {
    case 'cancle':
        buttonLabel = 'Request Cancellation';
        break;
    case 'create':
        buttonLabel = 'Request an appointment';
        break;
    case 'schedule':
        buttonLabel = 'Submit'
        break;
    default:
        break;
  }

  return (
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
       {type === 'create' &&  <section className="mb-4 space-y-4">
            <h1 className="header">
                Hello there 👋
            </h1>
            <p className="text-dark-700">Request a new appointment</p>

        </section>
      }

        {type !== "cancle" && (
            <>
     <CustomFormField 
      control = {form.control}
      fieldType = {FormFieldType.SELECT}
      name = "primaryPhysician"
      label ="Doctor"
      placeholder = "Select your doctor"
      >
        {Doctors.map((doctor) => (
          <SelectItem key={doctor.name} value={doctor.name}>
            <div className="flex cursor-pointer items-center gap-2">
              <Image 
              src={doctor.image}
              width={32}
              height={32}
              alt={doctor.name}
              className="rounded-full border border-dark-500"
              />
              <p>{doctor.name}</p>
            </div>
          </SelectItem>
        ))}
      </CustomFormField>

      <CustomFormField fieldType={FormFieldType.DATE_PICKER} control={form.control} name="schedule" label="Expected appointment date" showTimeSelect dateFormat="dd/MM/yyyy -h:mm aa">
      </CustomFormField>
      <div className="flex flex-col gap-6 xl:flex-row">
        <CustomFormField
        fieldType={FormFieldType.TEXTAREA}
        control={form.control}
        name="reason"
        label="Reason for appointment request"
        placeholder="ex. Full body annual check-up"
        />
         <CustomFormField
        fieldType={FormFieldType.TEXTAREA}
        control={form.control}
        name="note"
        label="Additional Comments"
        placeholder="Anything else you would like to tell us?"
        />

      </div>
            </>
        )} 

      {type === 'cancle' && (
        <CustomFormField
        fieldType={FormFieldType.TEXTAREA}
        control={form.control}
        name="cancellationReason"
        label="Reason for cancellation"
        placeholder="Why are you cancelling the appointment?"
        />
      )}

      <SubmitButton isLoading={isLoading} className={`${type === 'cancle' ? 'w-full shad-danger-btn hover:shad-onHover-danger-btn' : 'shad-primary-btn w-full hover:shad-onHover-primary-btn'}`}>
        {buttonLabel}
      </SubmitButton>
    </form>
  </Form>
  )
}

export default NewAppointmentForm
