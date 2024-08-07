import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

import "./Navbar.scss";
import { auth } from "../../services/authService";
import { userService } from "../../services/userService";

function Navbar() {
  const [userDetails, setUserDetails] = useState({});
  const [active, setActive] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    window.addEventListener("scroll", isActive);
    return () => {
      window.removeEventListener("scroll", isActive);
    };
  }, []);

  useEffect(() => {
    if (!userDetails.name) fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    const response = await userService.getMyDetails();
    if (response?.status === 200) {
      const { name, profilePicture, userType } = response.data;
      setUserDetails({ name, profilePicture, userType });
    }
  };

  const isActive = () => {
    window.scrollY > 0 ? setActive(true) : setActive(false);
  };

  return (
    <div className={active || pathname !== "/" ? "navbar active" : "navbar"}>
      <div className="container">
        <div className="logo">
          <Link className="link" to="/">
            <span className="text">Design Crafters</span>
          </Link>
        </div>
        <div className="links">
          <NavLink to="/artists" className="link" activeClassName="activeLink" exact>
            <span className="text">Artists</span>
          </NavLink>
          <NavLink to="/orders" className="link" activeClassName="activeLink" exact>
            <span className="text">My Projects</span>
          </NavLink>
          <NavLink to="/gigs" className="link" activeClassName="activeLink" exact>
            <span className="text">Gigs</span>
          </NavLink>

          {/* <Link className="link" to="/gigs">
            <span className="text">Artists</span>
          </Link>
          <Link className="link" to="/gigs">
            <span className="text">My Projects</span>
          </Link>
          <Link className="link" to="/gigs">
            <span className="text">Gigs</span>
          </Link> */}

          {userDetails ? (
            <div className="user" onClick={() => setOpen(!open)}>
              <img src={userDetails.profilePicture} alt="" />
              <span>{userDetails?.name}</span>
              {open && (
                <div className="options">
                  <Link className="link" to={`/profile/${auth.getCurrentUserDetails()._id}`}>
                    My Profile
                  </Link>
                  {userDetails.userType === "seller" && (
                    <>
                      <Link className="link" to="/mygigs">
                        My Gigs
                      </Link>
                      <Link className="link" to="/gig/add">
                        Add New Gig
                      </Link>
                    </>
                  )}
                  {/* <Link className="link" to="/orders">
                    Orders
                  </Link> */}
                  <div onClick={() => auth.logout()}>
                    <Link className="link" to="/">
                      Logout
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <span>Sign in</span>
              <Link className="link" to="/register">
                <button>Join</button>
              </Link>
            </>
          )}
        </div>
      </div>
      {(active || pathname !== "/") && (
        <>
          <hr />
          <div className="menu">
            <Link className="link menuLink" to="/gigs?category=digitalArtists">
              Digital Artists
            </Link>
            <Link className="link menuLink" to="/gigs?category=craftArtists">
              Craft Artists
            </Link>
            <Link className="link menuLink" to="/gigs?category=painters">
              Painters
            </Link>
            <Link className="link menuLink" to="/gigs?category=photographers">
              Photographers
            </Link>
            <Link className="link menuLink" to="/gigs?category=sculptors">
              Sculptors
            </Link>
            <Link className="link menuLink" to="/gigs?category=illustrators">
              Illustrators
            </Link>
            <Link className="link menuLink" to="/gigs?category=aiArtists">
              AI Artists
            </Link>
          </div>
          <hr />
        </>
      )}
    </div>
  );
}

export default Navbar;
