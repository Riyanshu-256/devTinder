import { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

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
        {
          firstName,
          lastName,
          photoUrl,
          age: age ? Number(age) : undefined,
          gender,
          about,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setSuccess(true);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data ||
          "Something went wrong"
      );
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

            <input
              className="input input-bordered input-sm w-full"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />

            <input
              className="input input-bordered input-sm w-full"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />

            <input
              className="input input-bordered input-sm w-full"
              placeholder="Photo URL"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
            />

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

            <textarea
              className="textarea textarea-bordered textarea-sm resize-none w-full"
              rows={3}
              placeholder="About"
              value={about}
              onChange={(e) => setAbout(e.target.value)}
            />

            {error && <p className="text-error text-sm text-center">{error}</p>}
            {success && (
              <p className="text-success text-sm text-center">
                Profile updated successfully
              </p>
            )}

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
              src={photoUrl || DEFAULT_AVATAR}
              alt="profile"
              className="w-32 h-32 rounded-xl object-cover"
              onError={(e) => (e.currentTarget.src = DEFAULT_AVATAR)}
            />

            <h3 className="text-xl font-bold">
              {firstName || "First"} {lastName || "Last"}
            </h3>

            <p className="text-sm text-gray-400">
              {age && `${age}, `} {gender}
            </p>

            <p className="text-sm text-gray-300">{about}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
