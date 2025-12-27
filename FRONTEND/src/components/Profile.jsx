import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const Profile = () => {
  const user = useSelector((store) => store.user);

  // Redirect if not logged in
  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex justify-center mt-10">
      <div className="card bg-base-300 w-96 shadow-md">
        <div className="card-body text-center">
          <h1 className="text-xl font-bold mb-3">Profile</h1>

          <p>
            <span className="font-semibold">Name:</span> {user.firstName}{" "}
            {user.lastName}
          </p>

          <p>
            <span className="font-semibold">Email:</span> {user.emailId}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
