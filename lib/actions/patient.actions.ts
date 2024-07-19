"use server"
import { ID, Query } from "node-appwrite"
import { BUCKET_ID, databases, DB_ID, ENDPOINT, PATIENT_COLLECTION_ID, PROJECT_ID, storage, users } from "../appwrite.config"
import { parseStringify } from "../utils"
import { InputFile } from 'node-appwrite/file'

export const createUser = async (user: CreateUserParams) => {
    try{
        const newUser = await users.create(ID.unique(), user.email, user.phone, undefined, user.name)
        return parseStringify(newUser);
    } catch(err: any){
        if(err && err?.code === 409) {
            const documents = await users.list([
                Query.equal('email', [user.email])
            ])

            return documents?.users[0]
        }
    }
}

export const getUser = async (userId: string) => {
    try{
        const user = await users.get(userId);
        return parseStringify(user);
    } catch(err){
        console.log(err)
    }
}

export const getPatient = async (userId: string) => {
  try{
      const patient = await databases.listDocuments(DB_ID, PATIENT_COLLECTION_ID, [ Query.equal('userId', userId)]);
      return parseStringify(patient.documents[0]);
  } catch(err){
      console.log(err)
  }
}

export const registerPatient = async (patientData: RegisterUserParams) => {
    try {
      let fileId;
      let identificationDocumentUrl;
      if (patientData.identificationDocument) {
        const file = await storage.createFile(
          BUCKET_ID!,
          ID.unique(),
          patientData.identificationDocument.get('file') as File,
        );
        fileId = file.$id;
        identificationDocumentUrl = `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${fileId}/view?project=${PROJECT_ID}`;
      }
  
      const newPatient = await databases.createDocument(
        DB_ID!,
        PATIENT_COLLECTION_ID!,
        ID.unique(),
        {
          ...patientData,
          identificationDocumentId: fileId || null,
          identificationDocumentUrl: identificationDocumentUrl || null,
          identificationDocument: undefined, // Remove this field as we've handled the file separately
        }
      );
  
      return newPatient;
    } catch (err) {
      console.error("Error in registerPatient:", err);
      throw err;
    }
  };