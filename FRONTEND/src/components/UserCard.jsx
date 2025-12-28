const UserCard = ({ user }) => {
  if (!user) return null;

  const { firstName, lastName, photoUrl, about } = user;

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
        <button className="btn btn-primary w-20">Ignore</button>
        <button className="btn btn-secondary w-20">Interested</button>
      </div>
    </div>
  );
};

export default UserCard;
