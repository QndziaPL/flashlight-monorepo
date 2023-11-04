import { FirebaseApp, FirebaseOptions, initializeApp } from "firebase/app";
import dotenv from "dotenv";
import { collection, Firestore, getDocs, getFirestore } from "firebase/firestore";

dotenv.config();

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.API_KEY,
  authDomain: "flashlight-monorepo.firebaseapp.com",
  projectId: "flashlight-monorepo",
  storageBucket: "flashlight-monorepo.appspot.com",
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: "G-68J8KBWLGH",
};

export class FirebaseClient {
  private static instance: FirebaseClient;
  private _app: FirebaseApp;
  private _db: Firestore;

  private constructor() {
    console.log(firebaseConfig);
    this._app = initializeApp(firebaseConfig);
    this._db = getFirestore(this._app);
  }

  public static getInstance(): FirebaseClient {
    if (!this.instance) {
      this.instance = new FirebaseClient();
    }

    return this.instance;
  }

  public get app() {
    return this._app;
  }

  public get db() {
    return this._db;
  }

  async getCollection<T>(collectionName: string): Promise<T[] | undefined> {
    try {
      const docRef = collection(this._db, collectionName);
      const querySnapshot = await getDocs(docRef);

      const documents: T[] = [];
      querySnapshot.forEach((doc) => {
        documents.push(doc.data() as T);
      });

      return documents;
    } catch (error) {
      console.error(`Error getting collection "${collectionName}": ${error}`);
    }
  }
}
