import { useDispatch, useSelector } from "react-redux";
import { removeUser } from "../utils/userSlice";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { addToast } from "../utils/toastSlice";

const NavBar = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(
        BASE_URL + "/auth/logout",
        {},
        { withCredentials: true }
      );

      dispatch(removeUser());
      dispatch(addToast({ message: "Logged out successfully", type: "info" }));
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
      dispatch(addToast({ message: "Logout failed", type: "error" }));
    }
  };

  return (
    <nav className="sticky top-0 z-40 glass-strong border-b border-dark-border backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* LEFT - Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 group transition-transform hover:scale-105"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-lg">
              D
            </div>
            <span className="text-2xl font-bold gradient-text">DevTinder</span>
          </Link>

          {/* RIGHT - User Menu */}
          {user && (
            <div className="flex items-center gap-4">
              <span className="hidden sm:block text-gray-300 font-medium">
                {user.firstName}
              </span>

              <div className="dropdown dropdown-end">
                <label
                  tabIndex={0}
                  className="btn btn-ghost btn-circle avatar cursor-pointer hover:ring-2 hover:ring-primary-500/50 transition-all"
                >
                  <div className="w-10 h-10 rounded-full ring-2 ring-primary-500/30 overflow-hidden">
                    <img
                      alt="profile"
                      src={
                        user.photoUrl ||
                        "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                      }
                      className="w-full h-full object-cover"
                    />
                  </div>
                </label>

                <ul
                  tabIndex={0}
                  className="menu menu-sm dropdown-content mt-3 p-2 glass-strong rounded-xl w-52 border border-dark-border shadow-2xl z-50 animate-slide-down"
                >
                  <li>
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary-500/10 transition-colors"
                    >
                      <span className="text-lg">👤</span>
                      <span>Profile</span>
                    </Link>
                  </li>

                  <li>
                    <Link
                      to="/connections"
                      className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary-500/10 transition-colors"
                    >
                      <span className="text-lg">🔗</span>
                      <span>Connections</span>
                    </Link>
                  </li>

                  <li>
                    <Link
                      to="/requests"
                      className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary-500/10 transition-colors"
                    >
                      <span className="text-lg">📬</span>
                      <span>Requests</span>
                    </Link>
                  </li>

                  <div className="divider my-2 border-dark-border"></div>

                  <li>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors w-full text-left"
                    >
                      <span className="text-lg">🚪</span>
                      <span>Logout</span>
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
