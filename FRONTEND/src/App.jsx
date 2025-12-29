import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";

import appStore from "./utils/appStore";
import Body from "./components/Body";
import Feed from "./components/Feed";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Connections from "./components/Connections";
import Requests from "./components/Requests";
import EditProfile from "./components/EditProfile";

function App() {
  return (
    <Provider store={appStore}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Body />}>
            <Route index element={<Feed />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route path="profile" element={<EditProfile />} />
            <Route path="connections" element={<Connections />} />
            <Route path="requests" element={<Requests />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
