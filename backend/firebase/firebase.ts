import { FirebaseApp, FirebaseOptions, initializeApp } from "firebase/app";
import dotenv from "dotenv";
import { addDoc, collection, deleteDoc, doc, Firestore, getDocs, getFirestore } from "firebase/firestore";
import { removeKeysWithUndefinedValues } from "../../shared/helpers/mappers";
import { CreateLobbyProps, ILobby } from "../../shared/types/lobby";

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

  async getCollection<T extends { id: string }>(collectionName: string): Promise<T[] | undefined> {
    try {
      const docRef = collection(this._db, collectionName);
      const querySnapshot = await getDocs(docRef);

      const documents: T[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data() as T;
        documents.push({ ...data, id: doc.id });
      });

      return documents;
    } catch (error) {
      console.error(`Error getting collection "${collectionName}": ${error}`);
    }
  }

  async createLobby(lobbyData: CreateLobbyProps) {
    const lobbyRef = collection(this._db, "lobbys");
    const preparedLobbyData = removeKeysWithUndefinedValues(lobbyData);
    try {
      const docRef = await addDoc(lobbyRef, preparedLobbyData);
      console.log(`Lobby created successfully with ID: ${docRef.id}`);
      return docRef.id;
    } catch (error) {
      console.error(`Error creating lobby: ${error}. Data for creation: ${JSON.stringify(preparedLobbyData)}`);
    }
  }

  async deleteLobby(lobbyId: ILobby["id"]) {
    try {
      const lobbyRef = doc(this._db, "lobbys", lobbyId);
      await deleteDoc(lobbyRef);
      console.log(`Lobby with ID ${lobbyId} deleted successfully`);
    } catch (error) {
      console.error(`Error during deleting lobby: ${error}`);
    }
  }
}
