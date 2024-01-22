import { FormEvent, useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase.ts";
import { redirect } from "react-router";

export const RegisterScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatedPassword, setRepeatedPassword] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    if (password !== repeatedPassword) {
      setError("Both passwords needs to be identical");
      return;
    }

    if (password.length < 8) {
      setError("Password needs to be at least 8 characters long");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log(userCredential.user);
      redirect("/lobbys");
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>

      <div>
        <label htmlFor="repeatedPassword">Repeat Password</label>
        <input
          id="repeatedPassword"
          type="password"
          value={repeatedPassword}
          onChange={(e) => setRepeatedPassword(e.target.value)}
          required
        />
      </div>

      {error && <p>{error}</p>}

      <button type="submit">Sign up</button>
    </form>
  );
};
