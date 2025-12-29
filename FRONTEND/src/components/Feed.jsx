import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { addFeed } from "../utils/feedSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import UserCard from "./UserCard";

const Feed = () => {
  const dispatch = useDispatch();
  const feed = useSelector((store) => store.feed);

  useEffect(() => {
    const getFeed = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/feed`, {
          withCredentials: true,
        });

        dispatch(addFeed(res.data.data || res.data));
      } catch (err) {
        console.log("Error fetching feed", err);
      }
    };

    getFeed();
  }, [dispatch]);

  const removeUserFromFeed = (userId) => {
    const updatedFeed = feed.filter((u) => u._id !== userId);
    dispatch(addFeed(updatedFeed));
  };

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
