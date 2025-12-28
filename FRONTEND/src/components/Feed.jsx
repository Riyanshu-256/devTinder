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
        const res = await axios.get(BASE_URL + "/feed", {
          withCredentials: true,
        });

        const feedData = Array.isArray(res.data) ? res.data : res.data.data;

        dispatch(addFeed(feedData));
      } catch (err) {
        console.log("Error while fetching feed", err);
      }
    };

    getFeed();
  }, [dispatch]);

  if (!Array.isArray(feed) || feed.length === 0) {
    return (
      <p className="text-center mt-10 text-gray-500">No users available</p>
    );
  }

  return (
    <div className="flex justify-center my-10">
      <UserCard user={feed[0]} />
    </div>
  );
};

export default Feed;
