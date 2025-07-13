import React from 'react'
import {
    downloadPreview,
    decore,
    decore1,
    frame37,
    frame38,
    frame39,
    frame40,
    logo,
    logo1,
    logo2,
    logo3,
    logo4,
    logo5,
    logo6,
    socialIcon1,
    socialIcon2,
    socialIcon,
    socialIcon11,
    sendIcon,
} from '../assets/images'
import "./home.css"
import { Link } from 'react-router-dom'
const StudentFooter = () => {
  return (
    <div>
          <footer>
                <div class="footer-content">
                    <div class="footer-logo">
                        <p class="logo-text">Prodigi</p>
                        <p>Thakur Village, Kandivali (East),<br />Mumbai - 400101</p>
                        <div class="social-links">
                            <Link to="#"><img src={socialIcon1} alt="Instagram" /></Link>
                            <Link to="#"><img src={socialIcon2} alt="Facebook" /></Link>
                            <Link to="#"><img src={socialIcon} alt="Twitter" /></Link>
                            <Link to="#"><img src={socialIcon11} alt="YouTube" /></Link>
                        </div>
                    </div>
                    <div class="footer-links">
                        <div class="link-column">
                            <h4>Company</h4>
                            <Link to="/AboutUs">About us</Link>
                            <Link to="/StudentContactus">Contact us</Link>
                            <Link to="#">Testimonials</Link>
                        </div>
                        <div class="link-column">
                            <h4>Support</h4>
                            <Link to="#">Help center</Link>
                            <Link to="#">Terms of service</Link>
                            <Link to="#">Privacy policy</Link>
                            <Link to="#">Status</Link>
                        </div>
                        <div class="newsletter">
                            <h4>Stay up to date</h4>
                            <div class="subscribe">
                                <input type="email" placeholder="Your email address" />
                                <button type="submit"><img src={sendIcon} alt="Send" /></button>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
    </div>
  )
}

export default StudentFooter