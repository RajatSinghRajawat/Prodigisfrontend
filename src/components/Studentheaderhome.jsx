import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import "./home.css"
import headerlogo from '../assets/Prodigi.png'
import { FaUserCircle } from "react-icons/fa";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import settings from "../images/settings.png";
import AccountHistory from "../images/clock.png";
import LogOut from "../images/sign-out.png";
import Help from "../images/help.png";
import { toast } from 'react-toastify';

const Studentheaderhome = () => {
  // Example: Assume token in localStorage means user is logged in
  const isLoggedIn = !!localStorage.getItem('token');

  // State for MUI Menu
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Logout handler
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      await fetch('http://localhost:3001/api/users/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
    } catch (err) {
      // Optionally handle error
    }
    localStorage.removeItem('token');
    handleClose();
    toast.success('Logout successful!');
    navigate('/');
  };

  return (
    <div>
      <header>
        <nav className="navbar">
          <div className="logo">
            <div className="logo-img">
              {/* <img src={headerlogo} alt="logo" /> */}
            </div>
            <Link style={{textDecoration:"none"}} to="/"><span className="logo-text">Prodigi</span></Link>
          </div>
          <div className="nav-links">
            <Link to="/" className="active">Home</Link>
            <Link to="/schoolHome">Schools</Link>
            <Link to="/organiser">Exam Institutes</Link>
            <Link to="#">Testimonial</Link>
            <Link to="/compition">Competitions</Link>
          
            {isLoggedIn ? (
              <>
                <Link to="/student/persnol-setting" className="profile mt-4">Profile</Link>
                <div
                  className="avatar"
                  style={{ cursor: "pointer" }}
                  onClick={handleClick}
                >
                  <FaUserCircle />
                </div>
                <Menu
                  anchorEl={anchorEl}
                  id="account-menu"
                  open={open}
                  onClose={handleClose}
                  onClick={handleClose}
                  slotProps={{
                    paper: {
                      elevation: 0,
                      sx: {
                        overflow: "visible",
                        filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                        mt: 1.5,
                        "& .MuiAvatar-root": {
                          width: 32,
                          height: 32,
                          ml: -0.5,
                          mr: 1,
                        },
                        "&::before": {
                          content: '""',
                          display: "block",
                          position: "absolute",
                          top: 0,
                          right: 14,
                          width: 10,
                          height: 10,
                          bgcolor: "background.paper",
                          transform: "translateY(-50%) rotate(45deg)",
                          zIndex: 0,
                        },
                      },
                    },
                  }}
                  transformOrigin={{ horizontal: "right", vertical: "top" }}
                  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                >
                  <MenuItem
                    onClick={handleClose}
                    className="flex flex-column justify-content-start align-items-start"
                  >
                    Admin Name
                    <p className="text-themcolor">Oberoi International School</p>
                  </MenuItem>
                  <MenuItem onClick={handleClose}>
                    <img src={settings} alt="" /> &nbsp;&nbsp; <Link to="/student/persnol-setting" style={{ textDecoration: 'none', color: 'inherit' }}>Account Settings</Link>
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleClose}>
                    <ListItemIcon>
                      <img src={AccountHistory} alt="help" />
                    </ListItemIcon>
                    Account History
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleClose}>
                    <ListItemIcon>
                      <img src={Help} alt="help" />
                    </ListItemIcon>
                    <Link to="/student/dashboard" style={{ textDecoration: 'none', color: 'inherit' }}>Student Dashboard</Link>
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                      <img src={LogOut} alt="logout" />
                    </ListItemIcon>
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Link to="/student/login" className="login">Login</Link>
                <Link to="/student/register/mobile" className="signup">Sign up</Link>
              </>
            )}
          
          </div>
        </nav>
      </header>
    </div>
  )
}

export default Studentheaderhome