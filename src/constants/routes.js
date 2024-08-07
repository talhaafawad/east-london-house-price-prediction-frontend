import Home from "../pages/home/Home";
import Login from "../pages/login/Login";
import Register from "../pages/register/Register";
import Profile from "../components/profile/profile";

export const navbarItems = [
  {
    name: "Home",
    path: "/",
    permissions: ["buyer", "seller"],
  },
];

export const links = [
  {
    path: "/",
    component: Home,
    permissions: ["buyer", "seller"],
    others: { exact: true },
  },
  {
    path: "/login",
    component: Login,
    permissions: ["buyer", "seller"],
  },
  {
    path: "/register",
    component: Register,
    permissions: ["buyer", "seller"],
  },

  {
    path: "/profile/:id",
    component: Profile,
    permissions: ["buyer", "seller"],
  },

  {
    path: "*",
    component: Home,
    permissions: [""],
  },
];
