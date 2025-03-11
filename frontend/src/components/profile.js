import React from "react";
import "../App.css";
import profile from "../assests/profile-icon.png";

const Profile = () => {
    return (
        <div className="profile">
            <div className="profile-photo">
                <img src={profile} alt="User profile" />
            </div>
            <div className="profile-name">
                <h3>Hello, Trinh Phan!</h3>
            </div>
            <hr className="straight-line"/>
            <div className="profile-total-income">
                <p>$1000</p>
            </div>
            <h3>Total Income</h3>
        </div>
    );
};

export default Profile;