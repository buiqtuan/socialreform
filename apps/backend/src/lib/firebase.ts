import * as admin from 'firebase-admin'
/// <reference types="node" />

// Check if required Firebase environment variables are present
const requiredEnvVars = [
  'FIREBASE_PROJECT_ID',
  'FIREBASE_PRIVATE_KEY',
  'FIREBASE_CLIENT_EMAIL'
];

const missingEnvVars = requiredEnvVars.filter(
  envVar => !process.env[envVar]
);

if (missingEnvVars.length > 0) {
  console.error(`Missing Firebase environment variables: ${missingEnvVars.join(', ')}`);
}

const serviceAccount = {
  type: "service_account",
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  })
}

export const messaging = admin.messaging()
export const auth = admin.auth()

export async function sendPushNotification(
  token: string,
  title: string,
  body: string,
  data?: Record<string, string>
) {
  try {
    const message = {
      notification: {
        title,
        body,
      },
      data,
      token,
    }

    const response = await messaging.send(message)
    console.log('Successfully sent message:', response)
    return response
  } catch (error) {
    console.error('Error sending message:', error)
    throw error
  }
}
