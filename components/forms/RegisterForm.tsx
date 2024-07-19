"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Form,
  FormControl
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import CustomFormField from "../CustomFormField"
import SubmitButton from "../SubmitButton"
import { useState } from "react"
import { PatientFormValidation, UserFormValidation } from "@/lib/validation"
import { useRouter } from "next/navigation"
import {  registerPatient } from "@/lib/actions/patient.actions"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { Doctors, GenderOptions, IdentificationTypes, PatientFormDefaultValues } from "@/constants"
import { Label } from "../ui/label"
import { SelectItem } from "../ui/select"
import Image from "next/image"
import FileUploader from "../FileUploader"

export enum FormFieldType {
    INPUT = 'input',
    CHECKBOX = 'checkbox',
    TEXTAREA = 'textarea',
    PHONE_INPUT = 'phoneInput',
    DATE_PICKER = 'datePicker',
    SELECT = 'select',
    SKELETON = 'skeleton'
}
 
const RegisterForm = ({user} : {user: User}) => {
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<z.infer<typeof PatientFormValidation>>({
    resolver: zodResolver(PatientFormValidation),
    defaultValues: {
      ...PatientFormDefaultValues,
      name: "",
      email: "",
      phone: "",
    },
  })
  
  async function onSubmit(values: z.infer<typeof PatientFormValidation>) {
    setIsLoading(true);
  
    try {
      let formData;
      if (values.identificationDocument && values.identificationDocument.length > 0) {
        formData = new FormData();
        formData.append('file', values.identificationDocument[0]);
        formData.append('fileName', values.identificationDocument[0].name);
      }
  
      const patientData = {
        ...values,
        userId: user.$id,
        birthDate: new Date(values.birthDate).toISOString(),
        identificationDocument: formData,
      };
  
      console.log('Submitting patient data:', patientData);
  
      const patient = await registerPatient(patientData);
  
      if (patient) {
        console.log('Patient registered successfully:', patient);
        router.push(`/patients/${user.$id}/new-appointment`);
      } else {
        console.error("Patient registration failed");
        // Set an error state here
      }
    } catch (err) {
      console.error("Error registering patient:", err);
      // Set an error state here
    } 
  }
  return (
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12 flex-1">
        <section className="mb-4 space-y-4">
            <h1 className="header">
                Welcome !
            </h1>
            <p className="text-dark-700">Let us know more about yourself.</p>

        </section>
        <section className="mb-4 space-y-6">
            <div className="mb-9 space-y-1">
                <h2 className="sub-header">Personal Information</h2>
            </div>
        </section>
      
      <CustomFormField 
      control = {form.control}
      fieldType = {FormFieldType.INPUT}
      name = "name"
      placeholder = "Jane doe"
      label="Full Name"
      iconSrc ="/assets/icons/user.svg"
      iconAlt = "user"
      />

      <div className="flex flex-col gap-6 xl:flex-row">
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
      </div>

      <div className="flex flex-col gap-6 xl:flex-row">
      <CustomFormField 
      control = {form.control}
      fieldType = {FormFieldType.DATE_PICKER}
      name = "birthDate"
      label ="Date of Birth"
      placeholder="DD/MM/YYYY"
      />

      <CustomFormField 
      control = {form.control}
      fieldType = {FormFieldType.SKELETON}
      name = "gender"
      label ="Gender"
      renderSkeleton={(field) => (
        <FormControl>
            <RadioGroup className="flex h-11 gap-6 xl:justify-between" onValueChange={field.onChange} defaultValue={field.value}>
                {GenderOptions.map((option) => (
                    <div key={option} className="radio-group">
                        <RadioGroupItem 
                        value={option}
                        id={option}
                        />
                        <Label htmlFor={option} className="cursor-pointer">
                            {option}
                        </Label>
                    </div>
                ))}
            </RadioGroup>
        </FormControl>
      )}
      />
      </div>

      <div className="flex flex-col gap-6 xl:flex-row">
      <CustomFormField 
      control = {form.control}
      fieldType = {FormFieldType.INPUT}
      name = "address"
      label ="Address"
      placeholder = "Housing society, Pune"
      />
      <CustomFormField 
      control = {form.control}
      fieldType = {FormFieldType.INPUT}
      name = "occupation"
      label ="Occupation"
      placeholder = "Software Engineer"
      />
      </div>

      <div className="flex flex-col gap-6 xl:flex-row">
      <CustomFormField 
      control = {form.control}
      fieldType = {FormFieldType.INPUT}
      name = "emergencyContactName"
      label ="Emergency contact name"
      placeholder = "Name of your Guardian"
      />

      <CustomFormField 
      control = {form.control}
      fieldType = {FormFieldType.PHONE_INPUT}
      name = "emergencyContactNumber"
      label ="Emergency Contact Number"
      placeholder = "+91 123456789"
      />
      </div>

      <section className="mb-4 space-y-6">
            <div className="mb-9 space-y-1">
                <h2 className="sub-header">Medical Information</h2>
            </div>
      </section>

      <CustomFormField 
      control = {form.control}
      fieldType = {FormFieldType.SELECT}
      name = "primaryPhysician"
      label ="Primary Physician"
      placeholder = "Select your Physician"
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

      <div className="flex flex-col gap-6 xl:flex-row">
      <CustomFormField 
      control = {form.control}
      fieldType = {FormFieldType.INPUT}
      name = "insuranceProvider"
      label ="Insurance Policy Name"
      placeholder = "Your policy name"
      />

      <CustomFormField 
      control = {form.control}
      fieldType = {FormFieldType.INPUT}
      name = "insurancePolicyNumber"
      label ="Insurace Policy Number"
      placeholder = "Your policy number"
      />
      </div>

      <div className="flex flex-col gap-6 xl:flex-row">
      <CustomFormField 
      control = {form.control}
      fieldType = {FormFieldType.TEXTAREA}
      name = "allergies"
      label ="Allergies (if any)"
      placeholder = "Your allergies"
      />

      <CustomFormField 
      control = {form.control}
      fieldType = {FormFieldType.TEXTAREA}
      name = "currentMedication"
      label ="Current Medication (if any)"
      placeholder = "Your current medications"
      />
      </div>

      <div className="flex flex-col gap-6 xl:flex-row">
      <CustomFormField 
      control = {form.control}
      fieldType = {FormFieldType.TEXTAREA}
      name = "familyMedicalHistory"
      label ="Family Medical History (if any)"
      placeholder = "Your family medical history"
      />

      <CustomFormField 
      control = {form.control}
      fieldType = {FormFieldType.TEXTAREA}
      name = "pastMedicalHistory"
      label ="Past medical history (if any)"
      placeholder = "Your past medical history"
      />
      </div>

      <section className="mb-4 space-y-6">
            <div className="mb-9 space-y-1">
                <h2 className="sub-header">Identification & Verification</h2>
            </div>
      </section>

      <div className="flex flex-col gap-6">
      <CustomFormField 
      control = {form.control}
      fieldType = {FormFieldType.SELECT}
      name = "identificationType"
      label ="Identification Type"
      placeholder = "ex. Aadhar card"
      >
        {IdentificationTypes.map((type) => (
          <SelectItem key={type} value={type}>
          <div className="flex cursor-pointer items-center gap-2">
            <p>{type}</p>
          </div>
          </SelectItem>
        ))}
      </CustomFormField>

      <CustomFormField 
      control = {form.control}
      fieldType = {FormFieldType.INPUT}
      name = "identificationNumber"
      label ="Identification Number"
      placeholder = "ex. Aadhar card number"
      />

<CustomFormField 
      control = {form.control}
      fieldType = {FormFieldType.SKELETON}
      name = "identificationDocument"
      label ="Scanned copy of original document"
      renderSkeleton={(field) => (
        <FormControl>
          <FileUploader 
          files={field.value}
          onChange={(files) => field.onChange(files)}
          />
        </FormControl>
      )}
      />
      </div>

      <section className="mb-4 space-y-6">
            <div className="mb-9 space-y-1">
                <h2 className="sub-header">Privacy</h2>
            </div>
      </section>

      <CustomFormField 
      fieldType={FormFieldType.CHECKBOX}
      control={form.control}
      name='treatmentConsent'
      label="I consent to full treatment for my health condition"
      />

      <CustomFormField 
      fieldType={FormFieldType.CHECKBOX}
      control={form.control}
      name='disclosureConsent'
      label="I consent to disclosure my personal and health information for treatment purposes"
      />

      <CustomFormField 
      fieldType={FormFieldType.CHECKBOX}
      control={form.control}
      name='privacyConsent'
      label="I acknowledge that i have reviewed and agree to privacy policy"
      />

      

      <SubmitButton isLoading={isLoading}>
        Get Started
      </SubmitButton>
    </form>
  </Form>
  )
}

export default RegisterForm