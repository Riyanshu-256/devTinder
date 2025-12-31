import { useState } from "react";
import { useDispatch } from "react-redux";
import { sendIgnoredRequest, sendInterestedRequest } from "../utils/requestApi";
import { addToast } from "../utils/toastSlice";

const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

const UserCard = ({ user, onAction }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [actionType, setActionType] = useState(null);

  if (!user) return null;

  const { _id, firstName, lastName, photoUrl, about, age, gender, skills } =
    user;

  const handleAction = async (type) => {
    if (loading) return;

    try {
      setLoading(true);
      setActionType(type);

      if (type === "ignore") {
        await sendIgnoredRequest(_id);
        dispatch(addToast({ message: "Profile skipped", type: "info" }));
      } else {
        await sendInterestedRequest(_id);
        dispatch(addToast({ message: "Connection request sent!", type: "success" }));
      }

      // Small delay for animation
      setTimeout(() => {
        onAction?.(_id);
      }, 300);
    } catch (err) {
      console.error("Action failed", err.response?.data || err.message);
      dispatch(addToast({
        message: err.response?.data?.message || "Action failed",
        type: "error",
      }));
      setLoading(false);
      setActionType(null);
    }
  };

  return (
    <div className="w-full max-w-md animate-scale-in">
      <div className="card-modern p-8 space-y-6">
        {/* Avatar */}
        <div className="flex justify-center">
          <div className="avatar-ring">
            <img
              src={photoUrl || DEFAULT_AVATAR}
              alt="profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-dark-border"
              onError={(e) => {
                e.currentTarget.src = DEFAULT_AVATAR;
              }}
            />
          </div>
        </div>

        {/* Name & Info */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-gray-100">
            {firstName} {lastName}
          </h2>
          {(age || gender) && (
            <p className="text-sm text-gray-400">
              {age && `${age} years`}
              {age && gender && " • "}
              {gender}
            </p>
          )}
        </div>

        {/* About */}
        {about && (
          <div className="text-center">
            <p className="text-gray-300 leading-relaxed">{about}</p>
          </div>
        )}

        {/* Skills */}
        {skills && skills.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-400 text-center">
              Skills
            </h3>
            <div className="flex flex-wrap gap-2 justify-center">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 rounded-lg bg-primary-500/20 text-primary-300 text-sm border border-primary-500/30"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            className="btn-modern-outline flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => handleAction("ignore")}
            disabled={loading}
          >
            {loading && actionType === "ignore" ? (
              <span className="w-4 h-4 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
            ) : (
              "✕ Skip"
            )}
          </button>

          <button
            className="btn-modern flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => handleAction("interested")}
            disabled={loading}
          >
            {loading && actionType === "interested" ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              "✓ Connect"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
