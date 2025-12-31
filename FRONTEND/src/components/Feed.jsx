import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { addFeed } from "../utils/feedSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import UserCard from "./UserCard";

const Feed = () => {
  const dispatch = useDispatch();
  const feed = useSelector((store) => store.feed);
  const user = useSelector((store) => store.user);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const getFeed = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/user/feed`, // ✅ FIXED
          { withCredentials: true }
        );

        dispatch(addFeed(res.data.data || res.data));
      } catch (err) {
        console.error("Feed error:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    getFeed();
  }, [dispatch, user]);

  const removeUserFromFeed = (userId) => {
    dispatch(addFeed(feed.filter((u) => u._id !== userId)));
  };

  if (loading) {
    return <p className="text-center mt-10 text-gray-400">Loading feed...</p>;
  }

  if (!feed || feed.length === 0) {
    return (
      <p className="text-center mt-10 text-gray-500">No users available</p>
    );
  }

  return (
    <div className="flex justify-center my-10">
      <UserCard user={feed[0]} onAction={removeUserFromFeed} />
    </div>
  );
};

export default Feed;
