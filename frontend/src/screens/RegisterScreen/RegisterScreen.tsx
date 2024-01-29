import { FormEvent, useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase.ts";
import { useNavigate } from "react-router";
import { Button } from "../../components/Button.tsx";
import { Input } from "../../@/components/ui/input.tsx";
import { Label } from "../../@/components/ui/label.tsx";

export const RegisterScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatedPassword, setRepeatedPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

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
      navigate("/lobbys");
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>

      <div>
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>

      <div>
        <Label htmlFor="repeatedPassword">Repeat Password</Label>
        <Input
          id="repeatedPassword"
          type="password"
          value={repeatedPassword}
          onChange={(e) => setRepeatedPassword(e.target.value)}
          required
        />
      </div>

      {error && <p>{error}</p>}

      <Button type="submit">Sign up</Button>
    </form>
  );
};
