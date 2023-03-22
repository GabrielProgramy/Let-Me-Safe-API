import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
	apiKey: process.env.GOOGLE_API_KEY,
	authDomain: process.env.GOOGLE_AUTH_DOMAIN,
	projectId: process.env.GOOGLE_PROJECT_ID,
	storageBucket: process.env.GOOGLE_STORAGE_BUCKET,
	messagingSenderId: process.env.GOOGLE_MESSAGING_SENDER_ID,
	appId: process.env.GOOGLE_APP_ID,
}

const app = initializeApp(firebaseConfig)
const storage = getStorage(app)

export { storage }
