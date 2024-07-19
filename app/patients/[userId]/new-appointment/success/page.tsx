import Link from 'next/link'
import React from 'react'
import Image from 'next/image'
import { getAppointment } from '@/lib/actions/appointment.actions';
import { Doctors } from '@/constants';
import { formatDateTime } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import * as Sentry from '@sentry/nextjs'
import { getUser } from '@/lib/actions/patient.actions';

const Success = async ({params: {userId}, searchParams} : SearchParamProps) => {
    const appointmentId = (searchParams?.appointmentId as string) || '';
    const appointment = await getAppointment(appointmentId);
    const user = await getUser(userId);

    const doctor = Doctors.find((doc) => doc.name === appointment.primaryPhysician);

    Sentry.metrics.set("user_view_appointment-success", user.name);

  return (
    <div className='flex h-screen max-h-screen px-[5%]'>
        <div className='success-img'>
            <Link href='/'>
            <Image 
            src="/assets/icons/logo-full.png"
            height={1000}
            width={1000}
            alt='logo'
            className='h-14 w-fit'
            />
            </Link>
            <section className='flex flex-col items-center '>
                <Image 
                src='/assets/gifs/success.gif'
                height={300}
                width={280}
                alt='success'
                />
            <h2 className='header mb-6 max-w-[600px] text-center'>
                We <span className='text-green-500'>successfully recieved</span> your appointment request!
            </h2>
            <p>
                Your appointment will be processed very soon and confirmation will be sent to you!
            </p>
            </section>

            <section className='request-details'>
                <p>
                    Appointment details : 
                </p>
                <div className='flex items-center gap-3'>
                    <Image 
                    src={doctor?.image!}
                    alt='doctor'
                    width={100}
                    height={100}
                    className='size-6'
                    />
                    <p className='whitespace-nowrap'>
                        Dr. {doctor?.name}
                    </p>
                </div>
                <div className='flex gap-2'>
                    <Image 
                    src='/assets/icons/calendar.svg'
                    width={24}
                    height={24}
                    alt='calendar'
                    />
                    <p>
                        {formatDateTime(appointment.schedule).dateTime}
                    </p>
                </div>
            </section>
            
            <Button variant='outline' className='shad-primary-btn' asChild>
                <Link href={`/patients/${userId}/new-appointment`}>
                Request another appointment
                </Link>
            </Button>
            <p className='copyright'>Developed by Rutuparn Kakade</p>
            
        </div>
    </div>
  )
}

export default Success