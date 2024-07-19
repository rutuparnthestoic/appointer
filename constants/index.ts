export const GenderOptions = ["Male", "Female", "Other"];

export const PatientFormDefaultValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  birthDate: new Date(Date.now()),
  gender: "Male" as Gender,
  address: "",
  occupation: "",
  emergencyContactName: "",
  emergencyContactNumber: "",
  primaryPhysician: "",
  insuranceProvider: "",
  insurancePolicyNumber: "",
  allergies: "",
  currentMedication: "",
  familyMedicalHistory: "",
  pastMedicalHistory: "",
  identificationType: "Birth Certificate",
  identificationNumber: "",
  identificationDocument: [],
  treatmentConsent: false,
  disclosureConsent: false,
  privacyConsent: false,
};

export const IdentificationTypes = [
  "Aadhar Card",
  "Pan Card",
  "Birth Certificate",
  "Driver's License",
  "Passport",
  "Voter ID Card",
];

export const Doctors = [
  {
    image: "/assets/images/dr-green.png",
    name: "Billy Butcher",
  },
  {
    image: "/assets/images/dr-cameron.png",
    name: "Victoria Neuman",
  },
  {
    image: "/assets/images/dr-livingston.png",
    name: "Hughie Campbell",
  },
  {
    image: "/assets/images/dr-peter.png",
    name: "Charles Harper",
  },
  {
    image: "/assets/images/dr-powell.png",
    name: "Berta Jones",
  },
  {
    image: "/assets/images/dr-remirez.png",
    name: "Lara Croft",
  },
  {
    image: "/assets/images/dr-lee.png",
    name: "Kimiko Miyashiro",
  },
  {
    image: "/assets/images/dr-cruz.png",
    name: "Ashley Barret",
  },
  {
    image: "/assets/images/dr-sharma.png",
    name: "Nathan Drake",
  },
];

export const StatusIcon = {
  scheduled: "/assets/icons/check.svg",
  pending: "/assets/icons/pending.svg",
  cancelled: "/assets/icons/cancelled.svg",
};