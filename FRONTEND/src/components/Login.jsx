import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { BASE_URL } from "../utils/constants";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!emailId || !password) {
      setError("Email and Password are required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await axios.post(
        `${BASE_URL}/login`,
        { emailId, password },
        { withCredentials: true }
      );

      // Save user to Redux
      dispatch(addUser(res.data));

      // Redirect after login
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center my-16">
      <div className="card bg-base-300 w-96 shadow-md">
        <div className="card-body gap-3">
          <h2 className="card-title justify-center text-2xl">Login</h2>

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
              placeholder="Enter your password"
            />
          </fieldset>

          {/* Error */}
          {error && <p className="text-error text-sm text-center">{error}</p>}

          {/* Button */}
          <div className="card-actions justify-center mt-2">
            <button
              className="btn btn-primary w-full"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
