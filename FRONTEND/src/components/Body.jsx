import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { addUser } from "../utils/userSlice";
import NavBar from "./NavBar";
import Footer from "./Footer";
import ToastContainer from "./ToastContainer";
import { useEffect, useCallback } from "react";

const PUBLIC_ROUTES = ["/login", "/signup"];

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((store) => store.user);

  const fetchUser = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/profile/view`, {
        withCredentials: true,
      });
      dispatch(addUser(res.data));
    } catch (err) {
      navigate("/login", { replace: true });
    }
  }, [dispatch, navigate]);

  useEffect(() => {
    if (PUBLIC_ROUTES.includes(location.pathname)) return;
    if (user && user._id) return;

    fetchUser();
  }, [location.pathname, user?._id, fetchUser]);

  return (
    <div className="min-h-screen flex flex-col bg-dark-bg">
      <NavBar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ToastContainer />
    </div>
  );
};

export default Body;
