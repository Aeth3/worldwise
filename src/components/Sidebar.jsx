import { Outlet } from "react-router-dom";
import AppNav from "./AppNav";
import Logo from "./Logo";
import styles from "./Sidebar.module.css";
import Footer from "./footer";
import Spinner from "./Spinner";
import { useCities } from "../hooks/useCities";
export default function Sidebar() {
  const { status } = useCities();
  return (
    <div className={styles.sidebar}>
      <Logo />
      <AppNav />
      {status === "loading" && <Spinner />}
      {status === "failed" && <p>Failed to load cities</p>}
      {status === "ready" && <Outlet />}
      <Footer />
    </div>
  );
}
