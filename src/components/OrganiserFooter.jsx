import React from "react";
import "./OrganiserProfileEdit.css";
import { FaUpload } from "react-icons/fa";
import "./Compition.css";
import {
  socialIcon1,
  socialIcon2,
  socialIcon,
  socialIcon11,
  sendIcon,
} from "../assets/images";
const OrganiserFooter = () => {
  return (
    <div>
         <footer>
                <div class="footer-content">
                  <div class="footer-logo">
                    <p class="logo-text">Prodigi</p>
                    <p>
                      Thakur Village, Kandivali (East),
                      <br />
                      Mumbai - 400101
                    </p>
                    <div class="social-links">
                      <a href="#">
                        <img src={socialIcon1} alt="Instagram" />
                      </a>
                      <a href="#">
                        <img src={socialIcon2} alt="Facebook" />
                      </a>
                      <a href="#">
                        <img src={socialIcon} alt="Twitter" />
                      </a>
                      <a href="#">
                        <img src={socialIcon11} alt="YouTube" />
                      </a>
                    </div>
                  </div>
                  <div class="footer-links">
                    <div class="link-column">
                      <h4>Company</h4>
                      <a href="#">About us</a>
                      <a href="#">Contact us</a>
                      <a href="#">Testimonials</a>
                    </div>
                    <div class="link-column">
                      <h4>Support</h4>
                      <a href="#">Help center</a>
                      <a href="#">Terms of service</a>
                      <a href="#">Privacy policy</a>
                      <a href="#">Status</a>
                    </div>
                    <div class="newsletter">
                      <h4>Stay up to date</h4>
                      <div class="subscribe">
                        <input type="email" placeholder="Your email address" />
                        <button type="submit">
                          <img src={sendIcon} alt="Send" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </footer>
    </div>
  )
}

export default OrganiserFooter