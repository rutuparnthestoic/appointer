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
import { useState } from "react"
import { UserFormValidation } from "@/lib/validation"
import { useRouter } from "next/navigation"
import { createUser } from "@/lib/actions/patient.actions"

export enum FormFieldType {
    INPUT = 'input',
    CHECKBOX = 'checkbox',
    TEXTAREA = 'textarea',
    PHONE_INPUT = 'phoneInput',
    DATE_PICKER = 'datePicker',
    SELECT = 'select',
    SKELETON = 'skeleton'
}
 
const PatientForm = () => {
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  })
  
  async function onSubmit({name, email, phone}: z.infer<typeof UserFormValidation>) {
    setIsLoading(true);
  
    try {
      const userData = {
        name,
        email,
        phone
      };
  
      const user = await createUser(userData);
  
      if (user) {
        router.push(`/patients/${user.$id}/register`);
      } else {
        // Handle the case where user is null or undefined
        console.error("User creation failed");
        // Optionally set an error state here
      }
    } catch (err) {
      console.error("Error creating user:", err);
      // Optionally set an error state here
    } 
  }

  return (
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        <section className="mb-4 space-y-4">
            <h1 className="header">
                Hello 👋
            </h1>
            <p className="text-dark-700">Welcome to <span className="font-bold">Appointer !</span><br /> Schedule an appointment with your doctor with just a few clicks!</p>

        </section>
      
      <CustomFormField 
      control = {form.control}
      fieldType = {FormFieldType.INPUT}
      name = "name"
      label ="Full Name"
      placeholder = "Jane doe"
      iconSrc ="/assets/icons/user.svg"
      iconAlt = "user"
      />

      <CustomFormField 
      control = {form.control}
      fieldType = {FormFieldType.INPUT}
      name = "email"
      label ="Email Address"
      placeholder = "example123@gmail.com"
      iconSrc ="/assets/icons/email.svg"
      iconAlt = "email"
      />

      <CustomFormField 
      control = {form.control}
      fieldType = {FormFieldType.PHONE_INPUT}
      name = "phone"
      label ="Phone Number"
      placeholder = "+91 123456789"
      />

      <SubmitButton isLoading={isLoading}>
        Get Started
      </SubmitButton>
    </form>
  </Form>
  )
}

export default PatientForm