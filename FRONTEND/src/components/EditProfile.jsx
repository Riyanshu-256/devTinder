import { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const EditProfile = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [about, setAbout] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess(false);

      await axios.patch(
        `${BASE_URL}/profile/edit`,
        { firstName, lastName, photoUrl, age, gender, about },
        { withCredentials: true }
      );

      setSuccess(true);
    } catch (err) {
      setError(err.response?.data || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-start min-h-[85vh] bg-base-200 px-4 py-10 w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full">
        {/* ================= LEFT : EDIT FORM ================= */}
        <div className="card bg-base-300 shadow-xl">
          <div className="card-body gap-4">
            <h2 className="text-2xl font-semibold text-center">Edit Profile</h2>

            {/* First Name */}
            <input
              className="input input-bordered input-sm w-full"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />

            {/* Last Name */}
            <input
              className="input input-bordered input-sm w-full"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />

            {/* Photo URL */}
            <input
              className="input input-bordered input-sm w-full"
              placeholder="Photo URL"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
            />

            {/* Age + Gender */}
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                className="input input-bordered input-sm"
                placeholder="Age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
              <input
                className="input input-bordered input-sm"
                placeholder="Gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              />
            </div>

            {/* About */}
            <textarea
              className="textarea textarea-bordered textarea-sm resize-none w-full"
              rows={3}
              placeholder="About"
              value={about}
              onChange={(e) => setAbout(e.target.value)}
            />

            {/* Status */}
            {error && <p className="text-error text-sm text-center">{error}</p>}
            {success && (
              <p className="text-success text-sm text-center">
                Profile updated successfully
              </p>
            )}

            {/* Save Button */}
            <button
              className="btn btn-primary btn-sm w-full"
              onClick={handleSaveProfile}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </div>

        {/* ================= RIGHT : LIVE PREVIEW ================= */}
        <div className="card bg-base-300 shadow-xl">
          <div className="card-body items-center text-center gap-3">
            <img
              src={photoUrl}
              alt="profile"
              className="w-32 h-32 rounded-xl object-cover"
              onError={(e) => (e.target.src = " ")}
            />

            <h3 className="text-xl font-bold">
              {firstName} {lastName}
            </h3>

            <p className="text-sm text-gray-400">
              {age && `${age}, `} {gender}
            </p>

            <p className="text-sm text-gray-300">{about}</p>

            <div className="flex gap-3 mt-2">
              <button className="btn btn-outline btn-primary w-20">
                Ignore
              </button>
              <button className="btn btn-secondary btn-sm w-20">
                Interested
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
