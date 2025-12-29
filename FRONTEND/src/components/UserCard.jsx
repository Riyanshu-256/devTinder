import { sendIgnoredRequest, sendInterestedRequest } from "../utils/requestApi";

const UserCard = ({ user, onAction }) => {
  if (!user) return null;

  const { _id, firstName, lastName, photoUrl, about } = user;

  const handleIgnore = async () => {
    try {
      await sendIgnoredRequest(_id);
      onAction?.(_id);
    } catch (err) {
      console.error("Ignore failed", err.response?.data || err.message);
    }
  };

  const handleInterested = async () => {
    try {
      await sendInterestedRequest(_id);
      onAction?.(_id);
    } catch (err) {
      console.error("Interested failed", err.response?.data || err.message);
    }
  };

  return (
    <div className="card bg-base-300 w-96 shadow-xl p-4">
      {/* PROFILE IMAGE */}
      <img
        src={photoUrl || "https://geographyandyou.com/images/user-profile.png"}
        alt="profile"
        className="w-32 h-32 rounded-full object-cover mx-auto mb-4"
        onError={(e) => {
          e.target.src = "https://geographyandyou.com/images/user-profile.png";
        }}
      />

      {/* NAME */}
      <h2 className="text-xl font-semibold text-center">
        {firstName} {lastName}
      </h2>

      {/* ABOUT */}
      <p className="text-center text-gray-400 mt-2">{about}</p>

      {/* ACTION BUTTONS */}
      <div className="flex justify-center gap-4 mt-4">
        <button className="btn btn-primary w-24" onClick={handleIgnore}>
          Ignore
        </button>

        <button className="btn btn-secondary w-24" onClick={handleInterested}>
          Interested
        </button>
      </div>
    </div>
  );
};

export default UserCard;
