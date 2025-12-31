import { useDispatch, useSelector } from "react-redux";
import { removeUser } from "../utils/userSlice";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { addToast } from "../utils/toastSlice";
import { useMemo } from "react";

const NavBar = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Calculate profile completion
  const profileCompletion = useMemo(() => {
    if (!user) return 0;
    const fields = [
      user.firstName,
      user.lastName,
      user.photoUrl,
      user.age,
      user.gender,
      user.about,
      user.skills?.length > 0,
    ];
    const completed = fields.filter(Boolean).length;
    return Math.round((completed / fields.length) * 100);
  }, [user]);

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
        <div className="flex items-center h-16">
          {/* LEFT - Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 group transition-transform hover:scale-105"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-primary-500/50">
              D
            </div>
            <span className="text-2xl font-bold gradient-text">DevTinder</span>
          </Link>

          {/* RIGHT - User Menu */}
          {user && (
            <div className="flex items-center gap-3 ml-auto">
              <span className="hidden sm:block text-gray-300 font-medium text-sm">
                {user.firstName}
              </span>

              <div className="dropdown dropdown-end">
                <label
                  tabIndex={0}
                  className="btn btn-ghost btn-circle avatar cursor-pointer hover:ring-2 hover:ring-primary-500/50 transition-all p-0"
                >
                  <div className="w-10 h-10 rounded-full ring-2 ring-primary-500/30 overflow-hidden shadow-lg">
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
                  className="dropdown-content menu bg-dark-card/95 backdrop-blur-xl border border-dark-border rounded-2xl shadow-2xl w-64 p-2 mt-2 z-50 animate-slide-down"
                >
                  {/* Profile Section with Completion */}
                  <li>
                    <Link
                      to="/profile"
                      className="flex flex-col gap-2 px-3 py-2.5 rounded-xl hover:bg-primary-500/10 transition-all duration-200 group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary-500/20 flex items-center justify-center group-hover:bg-primary-500/30 transition-colors">
                          <svg
                            className="w-4 h-4 text-primary-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                        </div>
                        <span className="font-medium text-gray-100 flex-1">Profile</span>
                      </div>
                      {/* Profile Completion Bar */}
                      <div className="flex items-center gap-2 ml-11">
                        <div className="flex-1 h-1.5 bg-dark-surface rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-500 relative overflow-hidden"
                            style={{ width: `${profileCompletion}%` }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                          </div>
                        </div>
                        <span className="text-xs font-semibold text-primary-400 min-w-[2.5rem] text-right">
                          {profileCompletion}%
                        </span>
                      </div>
                    </Link>
                  </li>

                  {/* Connections */}
                  <li>
                    <Link
                      to="/connections"
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-primary-500/10 transition-all duration-200 group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-primary-500/20 flex items-center justify-center group-hover:bg-primary-500/30 transition-colors">
                        <svg
                          className="w-4 h-4 text-primary-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                          />
                        </svg>
                      </div>
                      <span className="font-medium text-gray-100 flex-1">Connections</span>
                    </Link>
                  </li>

                  {/* Requests */}
                  <li>
                    <Link
                      to="/requests"
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-primary-500/10 transition-all duration-200 group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-primary-500/20 flex items-center justify-center group-hover:bg-primary-500/30 transition-colors">
                        <svg
                          className="w-4 h-4 text-primary-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <span className="font-medium text-gray-100 flex-1">Requests</span>
                    </Link>
                  </li>

                  {/* Divider */}
                  <div className="divider my-1.5 mx-2 border-dark-border"></div>

                  {/* Logout */}
                  <li>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200 w-full text-left group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center group-hover:bg-red-500/30 transition-colors">
                        <svg
                          className="w-4 h-4 text-red-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                      </div>
                      <span className="font-medium flex-1">Logout</span>
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
