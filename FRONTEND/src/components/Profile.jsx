import { useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";

const DEFAULT_AVATAR = "https://geographyandyou.com/images/user-profile.png";

const Profile = () => {
  const user = useSelector((store) => store.user);
  const navigate = useNavigate();

  // ✅ SAFE LOGIN CHECK
  if (!user || !user._id) {
    return <Navigate to="/login" replace />;
  }

  const {
    firstName = "",
    lastName = "",
    emailId = "",
    photoUrl,
    about,
    skills = [],
  } = user;

  return (
    <div className="flex justify-center items-center min-h-screen bg-base-200">
      <div className="card bg-base-300 w-96 shadow-xl">
        <div className="card-body text-center gap-3">
          {/* PROFILE IMAGE */}
          <img
            src={photoUrl || DEFAULT_AVATAR}
            alt="profile"
            className="w-32 h-32 rounded-full object-cover mx-auto"
            onError={(e) => {
              e.currentTarget.src = DEFAULT_AVATAR;
            }}
          />

          <h1 className="text-2xl font-bold">Profile</h1>

          {/* NAME */}
          <p>
            <span className="font-semibold">Name:</span> {firstName} {lastName}
          </p>

          {/* EMAIL */}
          <p>
            <span className="font-semibold">Email:</span> {emailId}
          </p>

          {/* ABOUT */}
          {about && <p className="text-gray-400 text-sm">{about}</p>}

          {/* SKILLS */}
          {skills.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mt-2">
              {skills.map((skill, index) => (
                <span key={index} className="badge badge-outline">
                  {skill}
                </span>
              ))}
            </div>
          )}

          {/* EDIT BUTTON */}
          <button
            className="btn btn-primary w-full mt-4"
            onClick={() => navigate("/profile/edit")}
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
