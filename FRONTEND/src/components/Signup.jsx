import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { BASE_URL } from "../utils/constants";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignup = async () => {
    if (!firstName || !lastName || !emailId || !password) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await axios.post(
        `${BASE_URL}/signup`,
        {
          firstName,
          lastName,
          emailId,
          password,
        },
        { withCredentials: true }
      );

      // Save user in redux
      dispatch(addUser(res.data));

      // Redirect to feed
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center my-16">
      <div className="card bg-base-300 w-96 shadow-md">
        <div className="card-body gap-3">
          <h2 className="card-title justify-center text-2xl">Signup</h2>

          {/* First Name */}
          <fieldset className="fieldset">
            <legend className="fieldset-legend py-2">First Name</legend>
            <input
              type="text"
              className="input w-full"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Enter first name"
            />
          </fieldset>

          {/* Last Name */}
          <fieldset className="fieldset">
            <legend className="fieldset-legend py-2">Last Name</legend>
            <input
              type="text"
              className="input w-full"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Enter last name"
            />
          </fieldset>

          {/* Email */}
          <fieldset className="fieldset">
            <legend className="fieldset-legend py-2">Email</legend>
            <input
              type="email"
              className="input w-full"
              value={emailId}
              onChange={(e) => setEmailId(e.target.value)}
              placeholder="Enter your email"
            />
          </fieldset>

          {/* Password */}
          <fieldset className="fieldset">
            <legend className="fieldset-legend py-2">Password</legend>
            <input
              type="password"
              className="input w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
            />
          </fieldset>

          {/* Error */}
          {error && <p className="text-error text-sm text-center">{error}</p>}

          {/* Button */}
          <div className="card-actions justify-center mt-2">
            <button
              className="btn btn-primary w-full"
              onClick={handleSignup}
              disabled={loading}
            >
              {loading ? "Creating account..." : "Signup"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
