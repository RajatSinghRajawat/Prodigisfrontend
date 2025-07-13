import { useEffect, useState } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import "./schoolHome.css";

import section2 from "../images/section2.png";
import headerlogo from "../images/headerlogo.png";
import herosec3 from "../images/bannerimg.png";
import { decore, decore1, frame37, frame38, frame40, socialIcon1, socialIcon2, socialIcon, socialIcon11, sendIcon } from "../assets/images";
import { FaUserCircle } from "react-icons/fa";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import settings from "../images/settings.png";
import AccountHistory from "../images/clock.png";
import LogOut from "../images/sign-out.png";
import Help from "../images/help.png";
import { NavLink } from "react-router-dom";
import Organisersheader from "./Organisersheader";

const testimonials = [
  {
    name: "Leo",
    title: "Lead Designer",
    message: "It was a very good experience",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cursus nibh mauris, nec turpis orci lectus maecenas. Suspendisse sed magna eget nibh in turpis. Consequat duis diam lacus arcu.",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Jane",
    title: "Lead Developer",
    message: "Amazing platform for organizers",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cursus nibh mauris, nec turpis orci lectus maecenas. Suspendisse sed magna eget nibh in turpis. Consequat duis diam lacus arcu.",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "Sam",
    title: "Event Manager",
    message: "Streamlined our events",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cursus nibh mauris, nec turpis orci lectus maecenas. Suspendisse sed magna eget nibh in turpis. Consequat duis diam lacus arcu.",
    image: "https://randomuser.me/api/portraits/men/45.jpg",
  },
];

const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
  arrows: true,
  centerMode: true,
  centerPadding: "0",
  focusOnSelect: true,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
      },
    },
  ],
};

function Organiserhome() {
 
  return (
    <div className="schoolHome">
      <Organisersheader/>

      <section className="hero">
        <div className="hero-content">
          <p className="subtitle">Your Competition, Our Technology</p>
          <h1>Simplify Process, Deliver Excellence</h1>
          <p className="description">
            Digitizing Your Competitions for Wider Reach and Efficiency. From
            Registration to Results — All in One Platform.
          </p>
        </div>
        <div className="hero-image">
          <img src={herosec3} alt="Winner holding a trophy" />
        </div>
      </section>

      <img className="top-images" src={decore} alt="Decorative element" />

      <section className="features">
        <img className="section2" src={section2} alt="Competition illustration" />
        <h2 className="features-title">One Stop for All Your Competition Needs</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="icon">
              <img src={frame37} alt="Exam Recommendations Icon" />
            </div>
            <h3>Exam Recommendations</h3>
            <p>Built Wicket longer admire do barton vanity itself do in it.</p>
          </div>
          <div className="feature-card feature-card-2">
            <div className="icon">
              <img src={frame38} alt="Quick Registration Icon" />
            </div>
            <h3>Quick Registration</h3>
            <p>Engrossed listening. Park gate sell they west hard for the.</p>
          </div>
          <div className="feature-card">
            <div className="icon">
              <img src={frame40} alt="Tangible Achievements Icon" />
            </div>
            <h3>Tangible Achievements</h3>
            <p>We deliver outsourced aviation services for military customers.</p>
          </div>
        </div>
      </section>

      <div className="comb-sec">
        <section className="testimonials">
          <h2>Testimonials From Schools</h2>
          <div className="testimonial-slider">
            <Slider {...sliderSettings}>
              {testimonials.map((testimonial, index) => (
                <div key={index} className="testimonial-card">
                  <div className="profile">
                    <img
                      src={testimonial.image}
                      alt={`${testimonial.name}'s profile`}
                      className="profile-img"
                    />
                    <div className="profile-info">
                      <h4>{testimonial.name}</h4>
                      <p className="role">{testimonial.title}</p>
                    </div>
                  </div>
                  <h3 className="title">{testimonial.message}</h3>
                  <p className="testimonial">{testimonial.description}</p>
                </div>
              ))}
            </Slider>
          </div>
        </section>
        <img src={decore1} alt="Decorative element" className="bottom-images" />
      </div>

      <footer>
        <div className="footer-content">
          <div className="footer-logo">
            <p className="logo-text">Prodigi</p>
            <p>
              Thakur Village, Kandivali (East),
              <br />
              Mumbai - 400101
            </p>
            <div className="social-links">
              <a href="#" aria-label="Instagram">
                <img src={socialIcon1} alt="Instagram" />
              </a>
              <a href="#" aria-label="Facebook">
                <img src={socialIcon2} alt="Facebook" />
              </a>
              <a href="#" aria-label="Twitter">
                <img src={socialIcon} alt="Twitter" />
              </a>
              <a href="#" aria-label="YouTube">
                <img src={socialIcon11} alt="YouTube" />
              </a>
            </div>
          </div>
          <div className="footer-links">
            <div className="link-column">
              <h4>Company</h4>
              <a href="#">About us</a>
              <a href="#">Contact us</a>
              <a href="#">Testimonials</a>
            </div>
            <div className="link-column">
              <h4>Support</h4>
              <a href="#">Help center</a>
              <a href="#">Terms of service</a>
              <a href="#">Privacy policy</a>
              <a href="#">Status</a>
            </div>
            <div className="newsletter">
              <h4>Stay up to date</h4>
              <div className="subscribe">
                <input
                  type="email"
                  placeholder="Your email address"
                  aria-label="Email address for newsletter"
                />
                <button type="submit" aria-label="Subscribe to newsletter">
                  <img src={sendIcon} alt="Send" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Organiserhome;