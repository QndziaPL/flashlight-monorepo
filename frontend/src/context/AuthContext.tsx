import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { createContext, FC, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { auth } from "../firebase.ts";

type AuthContextState = {
  user: User | null;
  logout: () => Promise<void>;
};
const AuthContext = createContext<AuthContextState>({ user: null, logout: async () => undefined });

export const useAuth = () => useContext(AuthContext);

export const AuthContextProvider: FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return () => {
      unsubscribe();
      setCurrentUser(null);
    };
  }, []);

  const logout = useCallback(async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error(`Failed to logout: ${error}`);
    }
  }, []);

  useEffect(() => {
    console.log(currentUser);
  }, [currentUser]);

  return <AuthContext.Provider value={{ user: currentUser, logout }}>{!loading && children}</AuthContext.Provider>;
};
