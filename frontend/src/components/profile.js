import React, { useState, useEffect}from "react";
import "../App.css";
import defaultProfile from "../assests/profile-icon.png";

const Profile = () => {
    const [profileImg, setProfileImg] = useState(defaultProfile);
    const [totalIncome, setTotalIncome] = useState(0);

    useEffect(() => {
        const fetchIncome = async () => {
            try {
                // const url = process.env.REACT_APP_API_INCOME;
                const response = await fetch(`https://my-salary-tracker.onrender.com/api/income`);
                if(!response.ok){
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                if(data.totalIncome !== undefined){
                    setTotalIncome(data.totalIncome);
                }
                else{
                    console.error('Unexpected response format:', data);
                }
            }
            catch(error) {
                console.error('Error fetching income data:', error);
            }
        }
        fetchIncome();
    }, []);

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
                <div>Hello, Trinh!</ div>
            </div>
            <hr className="straight-line"/>
            <h2>Total Income</h2>
            <div className="profile-total-income">
                <p>${totalIncome}</p>
            </div>
        </div>
    );
};

export default Profile;