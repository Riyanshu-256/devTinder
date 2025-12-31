import { useDispatch, useSelector } from "react-redux";
import { removeUser } from "../utils/userSlice";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { addToast } from "../utils/toastSlice";
import { useMemo } from "react";

/* ================= ICONS ================= */

const UserIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);

const LinkIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656"
    />
  </svg>
);

const MailIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8"
    />
  </svg>
);

const LogoutIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M17 16l4-4m0 0l-4-4m4 4H7"
    />
  </svg>
);

/* ================= NAVBAR ================= */

const NavBar = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Profile completion %
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
    return Math.round((fields.filter(Boolean).length / fields.length) * 100);
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
      dispatch(addToast({ message: "Logout failed", type: "error" }));
    }
  };

  return (
    <nav className="sticky top-0 z-40 glass-strong border-b border-dark-border backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          {/* LOGO */}
          <Link
            to="/"
            className="flex items-center gap-2 hover:scale-105 transition-transform"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold shadow-lg">
              D
            </div>
            <span className="text-xl font-bold gradient-text">DevTinder</span>
          </Link>

          {/* USER MENU */}
          {user && (
            <div className="ml-auto flex items-center gap-3">
              <span className="hidden sm:block text-gray-300 text-sm font-medium">
                {user.firstName}
              </span>

              <div className="dropdown dropdown-end">
                <label
                  tabIndex={0}
                  className="btn btn-ghost btn-circle avatar p-0 hover:ring-2 hover:ring-primary-500/50"
                >
                  <div className="w-10 h-10 rounded-full ring-2 ring-primary-500/30 overflow-hidden">
                    <img
                      src={
                        user.photoUrl ||
                        "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                      }
                      alt="profile"
                      className="object-cover"
                    />
                  </div>
                </label>

                {/* DROPDOWN */}
                <ul
                  tabIndex={0}
                  className="dropdown-content bg-dark-card/95 backdrop-blur-xl
                             border border-dark-border rounded-2xl shadow-2xl
                             w-64 p-2 mt-2 z-50"
                >
                  {/* NAV ITEMS */}
                  {[
                    { label: "Profile", to: "/profile", icon: UserIcon },
                    {
                      label: "Connections",
                      to: "/connections",
                      icon: LinkIcon,
                    },
                    { label: "Requests", to: "/requests", icon: MailIcon },
                  ].map(({ label, to, icon: Icon }) => (
                    <li key={label}>
                      <Link
                        to={to}
                        className="grid grid-cols-[40px_1fr_16px] items-center
                                   px-3 py-2.5 rounded-xl
                                   hover:bg-primary-500/10 transition-all"
                      >
                        <div className="w-9 h-9 rounded-lg bg-primary-500/20 flex items-center justify-center">
                          <Icon className="w-4 h-4 text-primary-400" />
                        </div>
                        <span className="font-medium text-gray-100">
                          {label}
                        </span>
                        <span className="text-gray-500">›</span>
                      </Link>
                    </li>
                  ))}

                  <div className="divider my-1 border-dark-border" />

                  {/* LOGOUT */}
                  <li>
                    <button
                      onClick={handleLogout}
                      className="grid grid-cols-[40px_1fr_16px] items-center
                                 px-3 py-2.5 rounded-xl w-full text-left
                                 text-red-400 hover:bg-red-500/10 transition-all"
                    >
                      <div className="w-9 h-9 rounded-lg bg-red-500/20 flex items-center justify-center">
                        <LogoutIcon className="w-4 h-4 text-red-400" />
                      </div>
                      <span className="font-medium">Logout</span>
                      <span />
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
