import { useContext, useEffect } from "react";
import { Outlet, useNavigate, useSearchParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "./styles/dashboard.scss";
import { AuthContext } from "../context/AuthContext";

const Dashboard = () => {
  const { state } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (state?.isAuthenticated === false) {
      return navigate("/login", { replace: true });
    }
  }, [state]);

  const urlParams = new URLSearchParams(window.location.search);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (urlParams.get("refresh")) setSearchParams(``);
  }, [searchParams]);

  return (
    <div className="dashboard-container clients-container">
      <Sidebar />
      <main>
        <Navbar />
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;
