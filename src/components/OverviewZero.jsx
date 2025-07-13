import { useState } from "react";
import { ChevronDown, Home, Upload, User, X } from "lucide-react";
import Oleftsidbar from "./Oleftsidbar";
import Orightcontaint from "./Orightcontaint";
import OSyllabus from "./OSyllabus";
import Opattern from "./Opattern";
import Oeligibility from "./Oeligibility";
import Oregistration from "./Oregistration";
import Oawards from "./Oawards";
import "./OverviewZero.css";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';  
import settings from '../images/settings.png'
import AccountHistory from '../images/clock.png' 
import LogOut from '../images/sign-out.png' 
import Help from '../images/help.png'
import { useParams } from "react-router-dom";
import Organisersheader from "./Organisersheader";

const OverviewZero = () => {
  const [page, setpage] = useState(0);
  const [ID, setID] = useState("")
  const { id } = useParams();

  const sibarbarData = (i, Id) => {
    setpage(i)
    setID(Id || id)
    console.log(i,"page", "ID:", Id);
  }
   const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };
  return (
    <>
        <Organisersheader/>
    
    <div className="OverviewZero">
      <div className="app-container">
        {/* Header */}
        {/* <header className="header">
          <div className="logo">Prodigi</div>
          <div className="nav">
            <button className="nav-button">
              <Home size={18} />
              <span>Home</span>
            </button>
            <button className="nav-button">Profile</button>
            <div className="avatar"  onClick={handleClick} style={{cursor:"pointer"}}>
              <User size={16} />
            </div>
          </div>
        </header> */}

        

        <div className="main-content">
          <Oleftsidbar fun={sibarbarData} page={page} ID={ID} />

          <div className="flexgrow">

            {
              page == 0 &&
              <Orightcontaint fun={sibarbarData} ID={ID} />
            }

            {
              page == 1 &&
              <OSyllabus fun={sibarbarData} ID={ID} />
            }

            {
              page == 2 &&
              <Opattern fun={sibarbarData} ID={ID} />
            }

            {
              page == 3 &&
              <Oeligibility fun={sibarbarData} ID={ID} />
            }
            {
              page == 4 &&
              <Oregistration fun={sibarbarData} ID={ID} />
            }
            {
              page == 5 &&
              <Oawards fun={sibarbarData} ID={ID} />
            }
            {/* {
          page == 6 &&
          <Oawards/> 
        } */}
          </div>

        </div>

      </div>
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
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleClose} className="flex flex-column justify-content-start align-items-start">
        Admin Name
        <p className="text-themcolor">Oberoi International School</p> 
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <img src={settings} alt="" /> &nbsp;&nbsp;
          Account Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <img src={AccountHistory} alt="help"/>
          </ListItemIcon>
          Account History
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <img src={Help} alt="help"/>
          </ListItemIcon>
          Help Center
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <img src={LogOut}alt="logout"/>
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </>
  )
}

export default OverviewZero;