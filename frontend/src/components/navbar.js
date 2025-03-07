import React from "react";
import '../App.css';
import logo from '../assests/budget.gif';
import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <Link to={"/home"}>
                    <img src={logo} alt="logo of my salary tracker" />
                </Link>
            </div>
            <div>
                <ul className="nav-links">
                    <li><Link to={"/home"}>Home</Link></li>
                    <li><Link to={"/history"}>History</Link></li>
                    <li><Link to={"/salary"}>Salary</Link></li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;