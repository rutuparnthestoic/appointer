import PatientForm from "@/components/forms/PatientForm";
import PasskeyModal from "@/components/PasskeyModal";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home({searchParams}: SearchParamProps) {
  const isAdmin = searchParams.admin === 'true';

  return (
    <div className="flex h-screen max-h-screen">
      {isAdmin && <PasskeyModal />}

      <section className="remove-scrollbar container my-auto"> 
        <div className="sub-container max-w-[496px]">
          <Image 
          src="/assets/icons/logo-full.png"
          alt="logo"
          height={1100}
          width={1100}
          className="mb-12 h-14 w-fit"
          />
          <PatientForm />
          <div className="mt-20 flex justify-between text-14-regular">
            <p className="justify-items-end text-dark-600 xl:text-left">
             Developed by Rutuparn Kakade
            </p>
            <Link href="/?admin=true" className="text-green-500">
            Admin
            </Link>
          </div>
        </div>
      </section>

      <Image 
      src="/assets/images/onboarding-img.png"
      alt="onboarding-img"
      height={1000}
      width={1000}
      className="side-img max-w-[50%]"
      />
    </div>
  );
}
