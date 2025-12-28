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
    if (feed) return;

    const getFeed = async () => {
      try {
        const res = await axios.get(BASE_URL + "/feed", {
          withCredentials: true,
        });

        // ✅ SAFELY HANDLE BACKEND RESPONSE
        const feedData = Array.isArray(res.data) ? res.data : res.data.data;

        dispatch(addFeed(feedData));
      } catch (err) {
        console.log("Error while fetching feed", err);
      }
    };

    getFeed();
  }, [feed, dispatch]);

  if (!Array.isArray(feed) || feed.length === 0) return null;

  return (
    <div className="flex justify-center my-10">
      <UserCard user={feed[0]} />
    </div>
  );
};

export default Feed;
