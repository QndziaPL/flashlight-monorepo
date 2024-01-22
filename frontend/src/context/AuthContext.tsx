import { onAuthStateChanged, User } from "firebase/auth";
import { createContext, FC, ReactNode, useContext, useEffect, useState } from "react";
import { auth } from "../firebase.ts";

type AuthContextState = {
  user: User | null;
};
const AuthContext = createContext<AuthContextState>({ user: null });

export const useAuth = () => useContext(AuthContext);

export const AuthContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return <AuthContext.Provider value={{ user: currentUser }}>{!loading && children}</AuthContext.Provider>;
};
