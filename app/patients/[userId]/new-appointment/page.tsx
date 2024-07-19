import NewAppointmentForm from "@/components/forms/NewAppointmentForm";
import PatientForm from "@/components/forms/PatientForm";
import { Button } from "@/components/ui/button";
import { getPatient } from "@/lib/actions/patient.actions";
import Image from "next/image";
import Link from "next/link";
import * as Sentry from '@sentry/nextjs'

export default async function NewAppointment({params: {userId}}: SearchParamProps ) {
  const patient = await getPatient(userId);
  Sentry.metrics.set("user_view_new-appointment", patient.name);
  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container my-auto"> 
        <div className="sub-container max-w-[560px]">
          <Image 
          src="/assets/icons/logo-full.png"
          alt="logo"
          height={1000}
          width={1000}
          className="mb-12 h-14 w-fit"
          />
          <NewAppointmentForm type='create' userId={userId} patientId={patient.$id}/>
          <div className="mt-20 flex justify-between text-14-regular">
            <p className="justify-items-end text-dark-600 xl:text-left">
             Developed by Rutuparn Kakade
            </p>
          </div>
        </div>
      </section>

      <Image 
      src="/assets/images/appointment-img.png"
      alt="appointment-img"
      height={1000}
      width={1000}
      className="side-img max-w-[390px] bg-bottom"
      />
    </div>
  );
}
