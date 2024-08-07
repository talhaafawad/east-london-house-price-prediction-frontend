import React from "react";
import "./profile.scss"; // Import the SCSS file
import { auth } from "../../services/authService";

const ProfileHeader = ({ name, profilePic, gigs, showHireMe = true }) => {
  return (
    <div className="profile-header">
      <div className="profile-pic-container">
        <img className="profile-pic" src={profilePic} alt="Profile" />
      </div>
      <div className="profile-info">
        <div className="name">{name}</div>
        <div className="gigs">{gigs} Gigs</div>
      </div>
      {/* {showHireMe && auth.getCurrentUserDetails().userType === "buyer" && (
        <div className="hire-button">
          <button>Hire Me</button>
        </div>
      )} */}
    </div>
  );
};

export default ProfileHeader;
