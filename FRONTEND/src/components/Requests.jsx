import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { setRequests, removeRequest } from "../utils/requestSlice";
import { addToast } from "../utils/toastSlice";
import Skeleton from "./Skeleton";

const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

const Requests = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((store) => store.user);
  const requests = useSelector((store) => store.requests);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (!user) return;

    const fetchRequests = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/user/request/received`, {
          withCredentials: true,
        });

        dispatch(setRequests(res.data.data));
      } catch (err) {
        if (err.response?.status === 401) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [dispatch, user, navigate]);

  const handleReview = async (status, requestId) => {
    try {
      setActionLoading(requestId);

      await axios.post(
        `${BASE_URL}/request/review/${status}/${requestId}`,
        {},
        { withCredentials: true }
      );

      dispatch(removeRequest(requestId));
      dispatch(
        addToast({
          message: `Request ${status === "accepted" ? "accepted" : "rejected"}!`,
          type: status === "accepted" ? "success" : "info",
        })
      );
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/login");
      } else {
        dispatch(addToast({ message: "Action failed", type: "error" }));
      }
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-200px)] px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton variant="title" className="h-8 w-64" />
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card-modern p-6">
              <div className="flex gap-6">
                <Skeleton variant="avatar" />
                <div className="flex-1 space-y-3">
                  <Skeleton variant="title" className="h-6 w-48" />
                  <Skeleton variant="text" className="w-full" />
                  <Skeleton variant="text" className="w-3/4" />
                  <div className="flex gap-2">
                    <Skeleton variant="button" className="h-6 w-16" />
                    <Skeleton variant="button" className="h-6 w-16" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!requests || requests.length === 0) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex flex-col items-center justify-center text-center px-4">
        <div className="card-modern p-12 max-w-md">
          <div className="text-6xl mb-4">📬</div>
          <h2 className="text-2xl font-bold text-gray-100 mb-2">
            No Connection Requests
          </h2>
          <p className="text-gray-400">
            You don't have any pending connection requests at the moment
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-200px)] px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-2">
            Connection Requests
          </h1>
          <p className="text-gray-400">
            {requests.length} {requests.length === 1 ? "request" : "requests"} pending
          </p>
        </div>

        <div className="space-y-4">
          {requests.map((req) => {
            const requestUser = req.fromUserId;
            if (!requestUser) return null;

            const isLoading = actionLoading === req._id;

            return (
              <div
                key={req._id}
                className="card-modern card-modern-hover p-6 animate-fade-in"
              >
                <div className="flex flex-col sm:flex-row gap-6">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <div className="avatar-ring">
                      <img
                        src={requestUser.photoUrl || DEFAULT_AVATAR}
                        alt="profile"
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-dark-border"
                        onError={(e) => (e.currentTarget.src = DEFAULT_AVATAR)}
                      />
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 space-y-3">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-100">
                        {requestUser.firstName} {requestUser.lastName}
                      </h2>
                      <p className="text-sm text-gray-400 mt-1">
                        {requestUser.emailId}
                      </p>
                    </div>

                    {(requestUser.age || requestUser.gender) && (
                      <p className="text-sm text-gray-400">
                        {requestUser.age && `${requestUser.age} years`}
                        {requestUser.age && requestUser.gender && " • "}
                        {requestUser.gender}
                      </p>
                    )}

                    {requestUser.about && (
                      <p className="text-sm text-gray-300 leading-relaxed">
                        {requestUser.about}
                      </p>
                    )}

                    {requestUser.skills?.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {requestUser.skills.map((skill, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 rounded-lg bg-primary-500/20 text-primary-300 text-xs border border-primary-500/30"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex sm:flex-col gap-3 sm:justify-start">
                    <button
                      className="btn-modern flex-1 sm:flex-none min-w-[100px] disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isLoading}
                      onClick={() => handleReview("accepted", req._id)}
                    >
                      {isLoading ? (
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        "✓ Accept"
                      )}
                    </button>

                    <button
                      className="btn-modern-outline flex-1 sm:flex-none min-w-[100px] disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isLoading}
                      onClick={() => handleReview("rejected", req._id)}
                    >
                      {isLoading ? (
                        <span className="w-4 h-4 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
                      ) : (
                        "✕ Reject"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Requests;
