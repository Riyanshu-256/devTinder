const UserCard = ({ user }) => {
  const { firstName, lastName, photoUrl, age, gender, about, skills } = user;
  if (!user) return null; // 🔥 REQUIRED

  console.log("User from feed:", user);

  return (
    <div className="card bg-base-100 w-96 shadow-sm">
      <figure>
        <img
          src={user.photoUrl || "https://via.placeholder.com/300"}
          alt="photo"
        />
      </figure>

      <div className="card-body">
        <h2 className="card-title">{user.firstName + " " + user.lastName}</h2>

        {age && gender && <p>{age + " " + gender}</p>}
        <p>{user.about}</p>

        <div className="card-actions justify-end">
          <button className="btn btn-primary">Ignore</button>
          <button className="btn btn-primary">Interested</button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
