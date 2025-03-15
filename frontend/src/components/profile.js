import React, {useState}from "react";
import "../App.css";
import defaultProfile from "../assests/profile-icon.png";


const Profile = () => {
    const [profileImg, setProfileImg] = useState(defaultProfile);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if(file){
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImg(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };
    return (
        <div className="profile">
            <div className="profile-photo">
                <img src={profileImg} alt="User profile" />
                <input 
                    type="file"
                    accept="image/*"
                    id="input-file"
                    style={{display: 'none'}}
                    onChange={handleImageChange}
                />
                <button className="edit-profile" onClick={() => document.getElementById('input-file').click()}>+</button>
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