import { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useSelector, useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { addToast } from "../utils/toastSlice";

const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

const EditProfile = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [about, setAbout] = useState("");
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Prefill data
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setPhotoUrl(user.photoUrl || "");
      setAge(user.age || "");
      setGender(user.gender || "");
      setAbout(user.about || "");
      setSkills(user.skills || []);
    }
  }, [user]);

  const handleAddSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.patch(
        `${BASE_URL}/profile/edit`,
        {
          firstName,
          lastName,
          photoUrl,
          age: age ? Number(age) : undefined,
          gender,
          about,
          skills,
        },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      dispatch(addUser(res.data.data || res.data));
      dispatch(addToast({ message: "Profile updated successfully!", type: "success" }));
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data ||
        "Something went wrong";
      setError(errorMsg);
      dispatch(addToast({ message: errorMsg, type: "error" }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 gradient-text">Edit Profile</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* LEFT : EDIT FORM */}
          <div className="card-modern p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                First Name
              </label>
              <input
                className="input-modern"
                placeholder="John"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Last Name
              </label>
              <input
                className="input-modern"
                placeholder="Doe"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Photo URL
              </label>
              <input
                className="input-modern"
                placeholder="https://example.com/photo.jpg"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Age
                </label>
                <input
                  type="number"
                  className="input-modern"
                  placeholder="25"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Gender
                </label>
                <input
                  className="input-modern"
                  placeholder="Male/Female/Other"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                About
              </label>
              <textarea
                className="input-modern resize-none"
                rows={4}
                placeholder="Tell us about yourself..."
                value={about}
                onChange={(e) => setAbout(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Skills
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  className="input-modern flex-1"
                  placeholder="Add a skill (e.g., React, Node.js)"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddSkill()}
                />
                <button
                  onClick={handleAddSkill}
                  className="btn-modern-outline whitespace-nowrap"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-500/20 text-primary-300 border border-primary-500/30"
                  >
                    {skill}
                    <button
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-primary-400 hover:text-primary-200 transition-colors"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              className="btn-modern w-full"
              onClick={handleSaveProfile}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </span>
              ) : (
                "Save Profile"
              )}
            </button>
          </div>

          {/* RIGHT : LIVE PREVIEW */}
          <div className="card-modern p-8 sticky top-24">
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="relative">
                <div className="avatar-ring">
                  <img
                    src={photoUrl || DEFAULT_AVATAR}
                    alt="profile"
                    className="w-40 h-40 rounded-full object-cover border-4 border-dark-border"
                    onError={(e) => (e.currentTarget.src = DEFAULT_AVATAR)}
                  />
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-gray-100">
                  {firstName || "First"} {lastName || "Last"}
                </h3>
                {(age || gender) && (
                  <p className="text-sm text-gray-400 mt-1">
                    {age && `${age} years`}
                    {age && gender && " • "}
                    {gender}
                  </p>
                )}
              </div>

              {about && (
                <p className="text-sm text-gray-300 leading-relaxed max-w-sm">
                  {about}
                </p>
              )}

              {skills.length > 0 && (
                <div className="w-full">
                  <h4 className="text-sm font-medium text-gray-400 mb-3">
                    Skills
                  </h4>
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

              {!firstName && !lastName && !about && skills.length === 0 && (
                <p className="text-gray-500 text-sm italic">
                  Your profile preview will appear here
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
