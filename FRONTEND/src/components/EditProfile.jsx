import { useState, useEffect, useMemo } from "react";
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
  const [focusedField, setFocusedField] = useState(null);

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

  // Calculate profile completion percentage
  const profileCompletion = useMemo(() => {
    const fields = [
      firstName,
      lastName,
      photoUrl,
      age,
      gender,
      about,
      skills.length > 0,
    ];
    const completed = fields.filter(Boolean).length;
    return Math.round((completed / fields.length) * 100);
  }, [firstName, lastName, photoUrl, age, gender, about, skills]);

  const handleAddSkill = () => {
    const trimmedSkill = skillInput.trim();
    if (trimmedSkill && !skills.includes(trimmedSkill)) {
      setSkills([...skills, trimmedSkill]);
      setSkillInput("");
      dispatch(
        addToast({ message: `Added skill: ${trimmedSkill}`, type: "success" })
      );
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
    dispatch(
      addToast({ message: `Removed skill: ${skillToRemove}`, type: "info" })
    );
  };

  const handleSaveProfile = async () => {
    // Validation
    if (!firstName.trim() || !lastName.trim()) {
      setError("First name and last name are required");
      dispatch(
        addToast({
          message: "First name and last name are required",
          type: "error",
        })
      );
      return;
    }

    if (age && (Number(age) < 13 || Number(age) > 100)) {
      setError("Age must be between 13 and 100");
      dispatch(
        addToast({ message: "Age must be between 13 and 100", type: "error" })
      );
      return;
    }

    if (about && about.length > 500) {
      setError("About section cannot exceed 500 characters");
      dispatch(
        addToast({
          message: "About section cannot exceed 500 characters",
          type: "error",
        })
      );
      return;
    }

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
          gender: gender || undefined,
          about,
          skills,
        },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      dispatch(addUser(res.data));
      dispatch(
        addToast({
          message: "Profile updated successfully! 🎉",
          type: "success",
        })
      );
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
    <div className="min-h-[calc(100vh-200px)] px-4 py-8 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-bold gradient-text mb-1">
              Edit Profile
            </h1>
            <p className="text-gray-400 text-xs">
              Complete your profile to get better matches
            </p>
          </div>

          {/* Profile Completion Indicator */}
          <div className="flex items-center gap-3 bg-dark-card/50 backdrop-blur-sm px-4 py-2 rounded-lg border border-dark-border">
            <div className="flex flex-col items-end gap-0.5">
              <span className="text-[10px] text-gray-400 uppercase tracking-wide">
                Profile
              </span>
              <span className="text-xs font-semibold text-gray-300">
                Completion
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-32 h-2 bg-dark-surface rounded-full overflow-hidden border border-dark-border shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 transition-all duration-700 ease-out relative overflow-hidden"
                  style={{ width: `${profileCompletion}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                </div>
              </div>
              <span className="text-sm font-bold text-primary-400 min-w-[2.5rem] text-right">
                {profileCompletion}%
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[2fr_1.2fr] gap-8 lg:gap-12">
          {/* LEFT : EDIT FORM */}
          <div className="card-modern p-4 space-y-3 animate-slide-up">
            {/* Personal Information Section */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 mb-1.5">
                <div className="w-0.5 h-3 bg-gradient-to-b from-primary-500 to-primary-600 rounded-full" />
                <h2 className="text-sm font-semibold text-gray-200">
                  Personal Information
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="space-y-0.5">
                  <label className="block text-[10px] font-medium text-gray-300">
                    First Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    className={`input-modern py-1.5 px-3 text-xs transition-all ${
                      focusedField === "firstName"
                        ? "ring-2 ring-primary-500/50 scale-[1.01]"
                        : ""
                    }`}
                    placeholder="John"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    onFocus={() => setFocusedField("firstName")}
                    onBlur={() => setFocusedField(null)}
                  />
                </div>

                <div className="space-y-0.5">
                  <label className="block text-[10px] font-medium text-gray-300">
                    Last Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    className={`input-modern py-1.5 px-3 text-xs transition-all ${
                      focusedField === "lastName"
                        ? "ring-2 ring-primary-500/50 scale-[1.01]"
                        : ""
                    }`}
                    placeholder="Doe"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    onFocus={() => setFocusedField("lastName")}
                    onBlur={() => setFocusedField(null)}
                  />
                </div>
              </div>

              <div className="space-y-0.5">
                <label className="block text-[10px] font-medium text-gray-300">
                  Photo URL
                </label>
                <input
                  className={`input-modern py-1.5 px-3 text-xs transition-all ${
                    focusedField === "photoUrl"
                      ? "ring-2 ring-primary-500/50 scale-[1.01]"
                      : ""
                  }`}
                  placeholder="https://example.com/photo.jpg"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  onFocus={() => setFocusedField("photoUrl")}
                  onBlur={() => setFocusedField(null)}
                />
                {photoUrl && (
                  <p className="text-[9px] text-gray-500 mt-0.5 flex items-center gap-1">
                    <span>💡</span>
                    <span>Tip: Use a direct image link for best results</span>
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-0.5">
                  <label className="block text-[10px] font-medium text-gray-300">
                    Age
                  </label>
                  <input
                    type="number"
                    className={`input-modern py-1.5 px-3 text-xs transition-all ${
                      focusedField === "age"
                        ? "ring-2 ring-primary-500/50 scale-[1.01]"
                        : ""
                    }`}
                    placeholder="25"
                    min="13"
                    max="100"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    onFocus={() => setFocusedField("age")}
                    onBlur={() => setFocusedField(null)}
                  />
                </div>
                <div className="space-y-0.5">
                  <label className="block text-[10px] font-medium text-gray-300">
                    Gender
                  </label>
                  <select
                    className={`input-modern py-1.5 px-3 text-xs transition-all cursor-pointer ${
                      focusedField === "gender"
                        ? "ring-2 ring-primary-500/50 scale-[1.01]"
                        : ""
                    }`}
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    onFocus={() => setFocusedField("gender")}
                    onBlur={() => setFocusedField(null)}
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* About Section */}
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 mb-1.5">
                <div className="w-0.5 h-3 bg-gradient-to-b from-primary-500 to-primary-600 rounded-full" />
                <h2 className="text-sm font-semibold text-gray-200">About</h2>
              </div>
              <div className="flex items-center justify-between mb-0.5">
                <label className="block text-[10px] font-medium text-gray-300">
                  Tell us about yourself
                </label>
                <span
                  className={`text-[9px] font-medium transition-colors ${
                    about.length > 450
                      ? "text-yellow-400"
                      : about.length > 500
                      ? "text-red-400"
                      : "text-gray-500"
                  }`}
                >
                  {about.length}/500
                </span>
              </div>
              <textarea
                className={`input-modern resize-none py-1.5 px-3 text-xs transition-all ${
                  focusedField === "about"
                    ? "ring-2 ring-primary-500/50 scale-[1.01]"
                    : ""
                }`}
                rows={3}
                placeholder="Share your interests, goals, and what makes you unique..."
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                maxLength={500}
                onFocus={() => setFocusedField("about")}
                onBlur={() => setFocusedField(null)}
              />
            </div>

            {/* Skills Section */}
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 mb-1.5">
                <div className="w-0.5 h-3 bg-gradient-to-b from-primary-500 to-primary-600 rounded-full" />
                <h2 className="text-sm font-semibold text-gray-200">Skills</h2>
              </div>
              <label className="block text-[10px] font-medium text-gray-300 mb-1">
                Add your technical skills
              </label>
              <div className="flex gap-1.5 mb-1.5">
                <input
                  className={`input-modern flex-1 py-1.5 px-3 text-xs transition-all ${
                    focusedField === "skillInput"
                      ? "ring-2 ring-primary-500/50 scale-[1.01]"
                      : ""
                  }`}
                  placeholder="e.g., React, Node.js, Python..."
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddSkill()}
                  onFocus={() => setFocusedField("skillInput")}
                  onBlur={() => setFocusedField(null)}
                />
                <button
                  onClick={handleAddSkill}
                  className="btn-modern-outline whitespace-nowrap px-3 py-1.5 text-xs disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95"
                  disabled={!skillInput.trim()}
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-1 min-h-[1.5rem]">
                {skills.length === 0 ? (
                  <p className="text-[10px] text-gray-500 italic flex items-center gap-1">
                    <span>✨</span>
                    <span>
                      No skills added yet. Add your first skill above!
                    </span>
                  </p>
                ) : (
                  skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary-500/20 text-primary-300 text-[10px] border border-primary-500/30 hover:bg-primary-500/30 transition-all animate-scale-in group"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      {skill}
                      <button
                        onClick={() => handleRemoveSkill(skill)}
                        className="text-primary-400 hover:text-red-400 transition-colors text-xs leading-none font-bold opacity-70 group-hover:opacity-100"
                        title="Remove skill"
                        aria-label={`Remove ${skill}`}
                      >
                        ×
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>

            {error && (
              <div className="p-2 rounded-md bg-red-500/10 border border-red-500/30 text-red-400 text-[10px] animate-slide-down flex items-center gap-1">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <button
              className="btn-modern w-full text-xs py-2 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] transition-transform"
              onClick={handleSaveProfile}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-1.5">
                  <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving changes...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-1">
                  <span>💾</span>
                  <span>Save Profile</span>
                </span>
              )}
            </button>
          </div>

          {/* RIGHT : LIVE PREVIEW - Shifted More to Right */}
          <div className="xl:ml-auto">
            <div
              className="card-modern p-8 sticky top-24 animate-slide-up"
              style={{ animationDelay: "100ms" }}
            >
              <div className="flex flex-col items-center text-center space-y-6">
                {/* Avatar Section */}
                <div className="relative group">
                  <div className="avatar-ring">
                    <img
                      src={photoUrl || DEFAULT_AVATAR}
                      alt="profile"
                      className="w-44 h-44 rounded-full object-cover border-4 border-dark-border transition-transform group-hover:scale-105"
                      onError={(e) => (e.currentTarget.src = DEFAULT_AVATAR)}
                    />
                  </div>
                  {photoUrl && (
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-primary-500/90 text-white text-xs px-2 py-1 rounded-full">
                      ✓ Photo
                    </div>
                  )}
                </div>

                {/* Name and Basic Info */}
                <div className="w-full">
                  <h3 className="text-2xl font-bold text-gray-100 mb-1">
                    {firstName || "First"} {lastName || "Last"}
                  </h3>
                  {(age || gender) && (
                    <p className="text-sm text-gray-400 mt-1">
                      {age && `${age} years`}
                      {age && gender && " • "}
                      {gender &&
                        gender.charAt(0).toUpperCase() + gender.slice(1)}
                    </p>
                  )}
                </div>

                {/* About Section */}
                {about && (
                  <div className="w-full text-left">
                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                      About
                    </h4>
                    <p className="text-sm text-gray-300 leading-relaxed px-2 bg-dark-surface/50 rounded-lg p-3">
                      {about}
                    </p>
                  </div>
                )}

                {/* Skills Section */}
                {skills.length > 0 && (
                  <div className="w-full text-left">
                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                      Skills ({skills.length})
                    </h4>
                    <div className="flex flex-wrap gap-2 justify-start">
                      {skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1.5 rounded-lg bg-primary-500/20 text-primary-300 text-sm border border-primary-500/30 hover:bg-primary-500/30 transition-colors"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Empty State */}
                {!firstName && !lastName && !about && skills.length === 0 && (
                  <div className="w-full py-8">
                    <div className="text-4xl mb-2">👤</div>
                    <p className="text-gray-500 text-sm italic">
                      Your profile preview will appear here
                    </p>
                  </div>
                )}

                {/* Profile Stats */}
                <div className="w-full pt-4 border-t border-dark-border">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-dark-surface/50 rounded-lg p-3">
                      <p className="text-3xl font-bold text-primary-400 mb-1">
                        {skills.length}
                      </p>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">
                        Skills
                      </p>
                    </div>
                    <div className="bg-dark-surface/50 rounded-lg p-3">
                      <p className="text-3xl font-bold text-primary-400 mb-1">
                        {profileCompletion}%
                      </p>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">
                        Complete
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
