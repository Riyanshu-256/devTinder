import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { addConnections } from "../utils/feedSlice";

const DEFAULT_AVATAR = "https://geographyandyou.com/images/user-profile.png";

const Connections = () => {
  const dispatch = useDispatch();
  const connections = useSelector((store) => store.feed);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchConnections = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/user/connections`, {
        withCredentials: true,
      });

      dispatch(addConnections(res.data));
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load connections. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  /* ================== LOADING STATE ================== */
  if (loading) {
    return (
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse bg-base-300 rounded-2xl p-6 h-64"
          />
        ))}
      </div>
    );
  }

  /* ================== ERROR STATE ================== */
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center mt-20 text-center">
        <p className="text-error text-lg font-semibold">{error}</p>
        <button
          onClick={fetchConnections}
          className="btn btn-outline btn-primary mt-4"
        >
          Retry
        </button>
      </div>
    );
  }

  /* ================== EMPTY STATE ================== */
  if (!connections || connections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center mt-20 text-center">
        <h2 className="text-xl font-bold">No Connections Yet</h2>
        <p className="text-gray-400 mt-2">
          Start connecting with people to grow your network
        </p>
      </div>
    );
  }

  /* ================== MAIN UI ================== */
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Your Connections</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {connections.map((user) => (
          <div
            key={user._id}
            className="card bg-base-300 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="card-body items-center text-center">
              <img
                src={user.photoUrl || DEFAULT_AVATAR}
                alt="profile"
                className="w-24 h-24 rounded-full object-cover border-4 border-base-100"
              />

              <h2 className="card-title mt-4 text-lg">
                {user.firstName} {user.lastName}
              </h2>

              {user.about && (
                <p className="text-sm text-gray-400 line-clamp-2">
                  {user.about}
                </p>
              )}

              {user.skills?.length > 0 && (
                <div className="flex flex-wrap gap-2 justify-center mt-3">
                  {user.skills.map((skill, index) => (
                    <span key={index} className="badge badge-outline badge-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Connections;
