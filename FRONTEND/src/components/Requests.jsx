import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { setRequests, removeRequest } from "../utils/requestSlice";

const DEFAULT_AVATAR = "https://geographyandyou.com/images/user-profile.png";

const Requests = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((store) => store.user);
  const requests = useSelector((store) => store.requests);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  /* ================= AUTH GUARD ================= */
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  /* ================= FETCH REQUESTS ================= */
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

  /* ================= ACCEPT / REJECT ================= */
  const handleReview = async (status, requestId) => {
    try {
      setActionLoading(requestId);

      await axios.post(
        `${BASE_URL}/request/review/${status}/${requestId}`,
        {},
        { withCredentials: true }
      );

      dispatch(removeRequest(requestId));
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setActionLoading(null);
    }
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-36 bg-base-300 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  /* ================= EMPTY ================= */
  if (!requests || requests.length === 0) {
    return (
      <div className="text-center mt-16 text-gray-400 text-lg">
        No connection requests
      </div>
    );
  }

  /* ================= UI ================= */
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Connection Requests</h1>

      {requests.map((req) => {
        const user = req.fromUserId;
        if (!user) return null;

        return (
          <div
            key={req._id}
            className="bg-base-300 rounded-xl p-6 shadow-md flex gap-6 items-center"
          >
            <img
              src={user.photoUrl || DEFAULT_AVATAR}
              alt="profile"
              className="w-24 h-24 rounded-full object-cover border"
            />

            <div className="flex-1 space-y-2">
              <h2 className="text-xl font-semibold">
                {user.firstName} {user.lastName}
              </h2>

              <p className="text-sm text-gray-400">📧 {user.emailId}</p>

              {(user.age || user.gender) && (
                <p className="text-sm text-gray-400">
                  {user.age && `${user.age} yrs`}
                  {user.gender && ` • ${user.gender}`}
                </p>
              )}

              {user.skills?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {user.skills.map((skill, i) => (
                    <span key={i} className="badge badge-primary badge-outline">
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <button
                className="btn btn-primary btn-sm"
                disabled={actionLoading === req._id}
                onClick={() => handleReview("accepted", req._id)}
              >
                Accept
              </button>

              <button
                className="btn btn-outline btn-sm"
                disabled={actionLoading === req._id}
                onClick={() => handleReview("rejected", req._id)}
              >
                Reject
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Requests;
