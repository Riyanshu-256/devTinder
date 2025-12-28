const UserCard = ({ user }) => {
  if (!user) return null;

  const { firstName, lastName, photoUrl, age, gender, about } = user;

  return (
    <div className="card bg-base-100 w-96 shadow-md">
      <figure>
        <img
          src={
            photoUrl || "https://cdn-icons-png.flaticon.com/512/149/149071.png"
          }
          alt="profile"
          className="w-full h-72 object-cover"
        />
      </figure>

      <div className="card-body">
        <h2 className="card-title">
          {firstName} {lastName}
        </h2>

        {age && gender && (
          <p>
            {age} • {gender}
          </p>
        )}

        {about && <p>{about}</p>}

        <div className="card-actions justify-end">
          <button className="btn btn-outline">Ignore</button>
          <button className="btn btn-primary">Interested</button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
