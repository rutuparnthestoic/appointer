# Appointer : An Appointment management application

A Full stack Appointment management system developed using Next JS 14 and Appwrite.

# Key Features :
1. Easy sign-up: Just enter your name, email, and phone number.
2. Simple booking: Fill out a form, choose your doctor and date - all in one go.
3. Efficient management: Hospitals can easily schedule, cancel, and track appointments.
4. Instant SMS updates: Get SMS alerts about your appointment status.

## Tech Stack 

1. Next.js 14 
2. Appwrite
3. Twilio
4. Tailwind CSS
5. Shadcn UI


## Get Started

After cloning the project, follow these steps : 
1. Add .env.local file and add the following variables (get them from Appwrite)
- PROJECT_ID 
- API_KEY 
- DB_ID 
- PATIENT_COLLECTION_ID 
- DOCTOR_COLLECTION_ID
- APPOINTMENT_COLLECTION_ID
- NEXT_PUBLIC_BUCKET_ID 
- NEXT_PUBLIC_ENDPOINT = https://cloud.appwrite.io/v1
- NEXT_PUBLIC_ADMIN_PASSKEY 

2. Run the following commands : 
```
# Install the dependencies : 
npm install 

# Run the project locally
npm run dev 
```
