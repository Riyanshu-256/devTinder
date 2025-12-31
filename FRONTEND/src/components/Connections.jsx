import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { addConnections } from "../utils/feedSlice";
import Skeleton, { SkeletonConnectionCard } from "./Skeleton";

const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

const Connections = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((store) => store.user);
  const connections = useSelector((store) => store.feed);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const fetchConnections = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/user/connections`, {
        withCredentials: true,
      });

      dispatch(addConnections(res.data));
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/login");
      } else {
        setError(
          err.response?.data?.message ||
            "Failed to load connections. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchConnections();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-200px)] px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <Skeleton variant="title" className="h-8 w-64" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <SkeletonConnectionCard key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex flex-col items-center justify-center text-center px-4">
        <div className="card-modern p-8 max-w-md">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-100 mb-2">Oops!</h2>
          <p className="text-red-400 mb-6">{error}</p>
          <button onClick={fetchConnections} className="btn-modern">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!connections || connections.length === 0) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex flex-col items-center justify-center text-center px-4">
        <div className="card-modern p-12 max-w-md">
          <div className="text-6xl mb-4">🔗</div>
          <h2 className="text-2xl font-bold text-gray-100 mb-2">
            No Connections Yet
          </h2>
          <p className="text-gray-400 mb-6">
            Start connecting with developers to grow your network
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-200px)] px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-2">
            Your Connections
          </h1>
          <p className="text-gray-400">
            {connections.length} {connections.length === 1 ? "connection" : "connections"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {connections.map((connection) => (
            <div
              key={connection._id}
              className="card-modern card-modern-hover p-6 group"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="relative">
                  <div className="avatar-ring">
                    <img
                      src={connection.photoUrl || DEFAULT_AVATAR}
                      alt="profile"
                      className="w-24 h-24 rounded-full object-cover border-4 border-dark-border group-hover:border-primary-500/50 transition-colors"
                      onError={(e) => (e.currentTarget.src = DEFAULT_AVATAR)}
                    />
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-100">
                    {connection.firstName} {connection.lastName}
                  </h2>
                  {(connection.age || connection.gender) && (
                    <p className="text-xs text-gray-400 mt-1">
                      {connection.age && `${connection.age} years`}
                      {connection.age && connection.gender && " • "}
                      {connection.gender}
                    </p>
                  )}
                </div>

                {connection.about && (
                  <p className="text-sm text-gray-300 line-clamp-3 leading-relaxed">
                    {connection.about}
                  </p>
                )}

                {connection.skills?.length > 0 && (
                  <div className="flex flex-wrap gap-2 justify-center w-full">
                    {connection.skills.slice(0, 4).map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 rounded-lg bg-primary-500/20 text-primary-300 text-xs border border-primary-500/30"
                      >
                        {skill}
                      </span>
                    ))}
                    {connection.skills.length > 4 && (
                      <span className="px-3 py-1 rounded-lg bg-dark-border text-gray-400 text-xs">
                        +{connection.skills.length - 4}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Connections;
