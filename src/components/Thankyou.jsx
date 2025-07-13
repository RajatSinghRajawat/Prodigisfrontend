import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./ForgotPassword.css";
import "./Thankyou.css";
import Button from "./common/Button";
import Card from "./common/Card";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

const schoolnewpassword = () => {
 
  return (
    <div className="contanier-fluid" >
      <div className="row" style={{width:'100%'}}>
        <div className="col-lg-6 left-panel"></div>
        <div className="col-lg-6 p-0" >
          <Card className="registration-form1 d-flex " >
            <div className="d-flex flex-column justify-content-center">
            <div className="text-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60" fill="none">
<circle cx="30" cy="30" r="30" fill="#388E3B"/>
<path d="M45.5 20L27.5147 39.5885L18 31.5" stroke="white" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
            </div>
            <h2 className="m-0">Thank you for your application.</h2>
            <p style={{color:'#242424',fontSize:'20px',textAlign:'center'}}>Our team will reach out to the school for further details.</p>

            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default schoolnewpassword;