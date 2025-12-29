import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { addUser } from "../utils/userSlice";
import NavBar from "./NavBar";
import Footer from "./Footer";
import { useEffect } from "react";

const PUBLIC_ROUTES = ["/login", "/signup"];

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((store) => store.user);

  useEffect(() => {
    // Login / Signup pe auth check mat karo
    if (PUBLIC_ROUTES.includes(location.pathname)) {
      return;
    }

    // User already store me hai → skip API
    if (user) return;

    const fetchUser = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/profile/view`, {
          withCredentials: true,
        });
        dispatch(addUser(res.data));
      } catch (err) {
        navigate("/login", { replace: true });
      }
    };

    fetchUser();
  }, [location.pathname, user, dispatch, navigate]);

  return (
    <>
      <NavBar />
      <Outlet />
      <Footer />
    </>
  );
};

export default Body;
