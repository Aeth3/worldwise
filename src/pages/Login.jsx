import { useNavigate } from "react-router-dom";
import PageNav from "../components/PageNav";
import { useAuth } from "../hooks/useAuth";
import styles from "./Login.module.css";
import { useEffect, useState } from "react";
import Button from "../components/Button";
export default function Login() {
  // PRE-FILL FOR DEV PURPOSES
  const { login, isAuthenticated, FAKE_USER, isError } = useAuth();
  const [email, setEmail] = useState(FAKE_USER.email);
  const [password, setPassword] = useState(FAKE_USER.password);
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    if (email && password) {
      login(email, password);
    }
  }
  useEffect(
    function () {
      if (isAuthenticated) navigate("/app", { replace: true });
    },
    [isAuthenticated, navigate]
  );
  return (
    <main className={styles.login}>
      <PageNav />
      <form className={styles.form} onSubmit={(e) => handleSubmit(e)}>
        <div className={styles.row}>
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>

        <div className={styles.row}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>

        <div>
          <Button type={"primary"}>Login</Button>
        </div>
        {isError && <h2>Incorrect Email or Password</h2>}
      </form>
    </main>
  );
}
