import React, {useState}from "react";
import '../App.css';
import logo from '../assests/budget.gif';
import { Link } from "react-router-dom";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () =>{
        setIsOpen(!isOpen);
    }

    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <Link to={"/home"}>
                    <img src={logo} alt="logo of my salary tracker" />
                </Link>
            </div>
            <div className="nav-div">
                <ul className={`nav-links ${isOpen ? "open" : ""}`}>
                    <li><Link to={"/home"} onClick={() => setIsOpen(false)}>Home</Link></li>
                    {/* <li><Link to={"/history"} onClick={() => setIsOpen(false)}>History</Link></li> */}
                    {/* <li><Link to={"/salary"} onClick={() => setIsOpen(false)}>Salary</Link></li> */}
                </ul>
            </div>

            <div className="hamburger-button" onClick={toggleMenu}>
                &#x2630;
            </div>
        </nav>
    );
};

export default Navbar;