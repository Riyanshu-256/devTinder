import { useDispatch, useSelector } from "react-redux";
import { removeUser } from "../utils/userSlice";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const NavBar = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });

      dispatch(removeUser());
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div className="navbar bg-base-300 shadow-md px-6">
      {/* LEFT */}
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-3xl font-bold">
          DevTinder
        </Link>
      </div>

      {/* RIGHT */}
      {user && (
        <div className="flex items-center gap-3">
          <span className="hidden sm:block font-medium">{user.firstName}</span>

          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img
                  alt="profile"
                  src={user.photoUrl || "https://i.pravatar.cc/150?img=3"}
                />
              </div>
            </label>

            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-4 p-2 shadow-lg bg-base-200 rounded-xl w-44 z-50"
            >
              <li>
                <Link to="/profile">Profile</Link>
              </li>

              <li>
                <a>Settings</a>
              </li>

              <div className="divider my-1"></div>

              <li>
                <button
                  onClick={handleLogout}
                  className="text-error hover:bg-error/10"
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavBar;
