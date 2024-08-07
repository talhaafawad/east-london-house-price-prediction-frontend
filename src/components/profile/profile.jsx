import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import ProfileHeader from "./header";
import { auth } from "../../services/authService";
import { userService } from "../../services/userService";
import { gigService } from "../../services/gigService";
import { getLocalStorageItem } from "../../utils/localStorage";

function Profile() {
  const [userDetails, setUserDetails] = useState({});
  const [gigs, setGigs] = useState([]);
  const [showHireButton, setShowHireButton] = useState(false);
  const [showAboutMe, setShowAboutMe] = useState(false);
  const [aboutMe, setAboutMe] = useState("");
  const { id } = useParams();

  useEffect(() => {
    fetchGigs(id);
    fetchUserData(id);
  }, [id]);

  const fetchGigs = async (id) => {
    try {
      const response = await gigService.getMyGigs(id);
      setGigs(response.data);
    } catch (error) {}
  };

  const fetchUserData = async (id) => {
    try {
      const response = await userService.userDetails(id);
      const userData = response.data;
      setShowHireButton(userData._id !== auth.getCurrentUserDetails()._id ? true : false);
      setUserDetails({ ...userData });
      setAboutMe(userData?.aboutMe ? userData?.aboutMe : "Not available");

      console.log("1111111111 auth.getCurrentUserDetails ", auth.getCurrentUserDetails());
      console.log("1111111111 userData ", userData);
    } catch (error) {}
  };

  const handleSubmit = async () => {
    try {
      await userService.updateUser({ id, aboutMe });
    } catch (error) {
    } finally {
      setShowAboutMe(!showAboutMe);
    }
  };

  return (
    <div className="profilePage">
      <ProfileHeader
        name={userDetails?.name?.toUpperCase()}
        profilePic={userDetails.profilePicture}
        gigs={gigs.length}
        showHireMe={showHireButton}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          // backgroundColor: "red",
          width: "30rem",
          maxHeight: "20rem",
        }}
      >
        <div style={{ alignSelf: "center" }}>
          <button className="button" onClick={() => {}}>
            About me
          </button>

          {userDetails?.experience && (
            <button className="button" onClick={() => {}} style={{ margin: "1rem" }}>
              {userDetails?.experience} YOE
            </button>
          )}

          {userDetails?.phoneNo && (
            <button className="button" onClick={() => {}} style={{ margin: "1rem" }}>
              Ph: {userDetails?.phoneNo}
            </button>
          )}
        </div>

        {!showAboutMe && <p>{aboutMe}</p>}

        {!showAboutMe ? (
          <div style={{ alignSelf: "flex-end", margin: "1rem" }}>
            {auth.getCurrentUserDetails()._id === id && (
              <button className="button" onClick={() => setShowAboutMe(!showAboutMe)}>
                Edit
              </button>
            )}
          </div>
        ) : (
          <>
            <div>
              <textarea
                name="description"
                id=""
                placeholder="Enter details about yourself"
                // cols="40"
                // rows="16"
                value={aboutMe}
                onChange={(e) => setAboutMe(e.target.value)}
                style={{ margin: "10px", width: "90%", height: "10rem" }}
              ></textarea>
            </div>
            <div style={{ alignSelf: "flex-end", margin: "1rem" }}>
              <button className="button" onClick={handleSubmit}>
                Save
              </button>
            </div>
          </>
        )}
      </div>

      <div className="cards">
        {gigs.map((gig) => (
          <div className="profile-work">
            <img src={gig.image} alt="" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Profile;
