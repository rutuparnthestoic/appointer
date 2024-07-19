import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import RegisterForm from '@/components/forms/RegisterForm'
import { getUser } from '@/lib/actions/patient.actions'
import * as Sentry from '@sentry/nextjs'

const Register = async ({params: {userId}} : SearchParamProps) => {
    const user = await getUser(userId);

    Sentry.metrics.set("user_view_register", user.name); //Tracks how many users visited this page

  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container "> 
        <div className="sub-container max-w-[860px] flex-1 flex-col py-10">
          <Image 
          src="/assets/icons/logo-full.png"
          alt="logo"
          height={1000}
          width={1000}
          className="mb-12 h-14 w-fit"
          />
          <RegisterForm user = {user}/>
          <div className="mt-20 flex justify-between text-14-regular">
            <p className="mb-20 justify-items-end text-dark-600 xl:text-left">
             Developed by Rutuparn Kakade
            </p>
          </div>
        </div>
      </section>

      <Image 
      src="/assets/images/register-img.png"
      alt="onboarding-img"
      height={1000}
      width={1000}
      className="side-img max-w-[560px]"
      />
    </div>
  )
}

export default Register