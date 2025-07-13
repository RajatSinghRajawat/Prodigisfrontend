import { useState } from 'react';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import './schoolHome.css';
import {Link ,useNavigate} from 'react-router-dom';

import section2 from "../images/section2.png";
import headerlogo from "../images/headerlogo.png";
import herosec2 from "../images/trophy.png";
import Leo from "../images/Leo.png";
import {
    decore,
    decore1,
    frame37,
    frame38,
    // frame39,
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
    // socialIcon11,
    sendIcon,
} from '../assets/images'
import Studentheaderhome from './Studentheaderhome';

const testimonials = [
    {
      name: "Leo",
      title: "Lead Designer",
      message: "It was a very good experience",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cursus nibh mauris, nec turpis orci lectus maecenas. Suspendisse sed magna eget nibh in turpis. Consequat duis diam lacus arcu. Faucibus venenatis felis id augue sit cursus pellentesque enim arcu. Elementum felis magna pretium in tincidunt. Suspendisse sed magna eget nibh in turpis. Consequat duis diam lacus arcu.",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      name: "Leo",
      title: "Lead Designer",
      message: "It was a very good experience",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cursus nibh mauris, nec turpis orci lectus maecenas. Suspendisse sed magna eget nibh in turpis. Consequat duis diam lacus arcu. Faucibus venenatis felis id augue sit cursus pellentesque enim arcu. Elementum felis magna pretium in tincidunt. Suspendisse sed magna eget nibh in turpis. Consequat duis diam lacus arcu.",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      name: "Leo",
      title: "Lead Designer",
      message: "It was a very good experience",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cursus nibh mauris, nec turpis orci lectus maecenas. Suspendisse sed magna eget nibh in turpis. Consequat duis diam lacus arcu. Faucibus venenatis felis id augue sit cursus pellentesque enim arcu. Elementum felis magna pretium in tincidunt. Suspendisse sed magna eget nibh in turpis. Consequat duis diam lacus arcu.",
      image: "https://randomuser.me/api/portraits/men/45.jpg",
    },
];

var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    centerMode: true,
    centerPadding: '0',
    focusOnSelect: true,
    responsive: [
        {
            breakpoint: 1024,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 1,
            }
        },
        {
            breakpoint: 600,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                arrows: false
            }
        }
    ]
};

function SchoolHome() {
    return (
        <>
        <div className="schoolHome">
            <Studentheaderhome/>

            <section className="hero">
                <div className="hero-content">
                    <p className="subtitle">Empower your students</p>
                    <h1>Igniting potential,<br/>
                    Nurturing Winners</h1>
                    <p className="description">Where school talent thrives — in academics, and beyond.<br/>
                    Join us to shape tomorrow's leaders through healthy competition</p>
                </div>
                <div className="hero-image">
                    <img src={herosec2} alt="Winner with trophy"/>
                </div>
            </section>

            <img className="top-images" src={decore} alt="Decore"/>
            
            <section className="features">
            <img className="section2" src={section2} alt="Exam"/>
                <h2 className="features-title">One Stop For All Your Competitions</h2>
                <div className="features-grid">
                    <div className="feature-card">
                        <div className="icon">
                            <img src={frame37} alt="Exam"/>
                        </div>
                        <h3>Exam Recommendations</h3>
                        <p>Built Wicket longer admire do barton vanity itself do in it.</p>
                    </div>
                    <div className="feature-card feature-card-2">
                        <div className="icon">
                            <img src={frame38} alt="Registration"/>
                        </div>
                        <h3>Quick Registration</h3>
                        <p>Engrossed listening. Park gate sell they west hard for the.</p>
                    </div>
                   
                    <div className="feature-card">
                        <div className="icon">
                            <img src={frame40} alt="Trophy"/>
                        </div>
                        <h3>Tangible Achievements</h3>
                        <p>We deliver outsourced aviation services for military customers</p>
                    </div>
                </div>
            </section>

            <div className="comb-sec">
                <section className="partners">
                    <h2 className="hedi-text">Our Partners</h2>
                    <p>We are partnered with 15+ top exam institutes globally</p>
                    <div className="partners-grid">
                       <div className="item-company"> <img src={logo} alt="Partner"/></div>
                       <div className="item-company"> <img src={logo1} alt="Partner"/></div>
                       <div className="item-company"> <img src={logo2} alt="Partner"/></div>
                       <div className="item-company"> <img src={logo3} alt="Partner"/></div>
                       <div className="item-company"> <img src={logo4} alt="Partner"/></div>
                       <div className="item-company"> <img src={logo5} alt="Partner"/></div>
                       <div className="item-company"> <img src={logo6} alt="Partner"/></div>
                    </div>
                </section>

                <section className="testimonials">
                    <h2>Testimonials From Schools</h2>
                    <div className="testimonial-slider">
                        <Slider {...settings}>
                            {testimonials.map((testimonial, index) => (
                                <div key={index} className="testimonial-card">
                                    <div className="profile">
                                        <img src={Leo} alt={testimonial.name} className="profile-img"/>
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
                <img src={decore1} alt="Decore" className="bottom-images"/>
            </div>

            <footer>
                <div className="footer-content">
                    <div className="footer-logo">
                        <p className="logo-text">Prodigi</p>
                        <p>Thakur Village, Kandivali (East),<br/>Mumbai - 400101</p>
                        <div className="social-links">
                            <Link to="#"><img src={socialIcon1} alt="Instagram"/></Link>
                            <Link to="#"><img src={socialIcon2} alt="Facebook"/></Link>
                            <Link to="#"><img src={socialIcon} alt="Twitter"/></Link>
                            {/* <Link to="#"><img src={socialIcon11} alt="YouTube"/></Link> */}
                        </div>
                    </div>
                    <div className="footer-links">
                        <div className="link-column">
                            <h4>Company</h4>
                            <Link to="/AboutUs">About us</Link>
                            <Link to="#">Contact us</Link>
                            <Link to="#">Testimonials</Link>
                        </div>
                        <div className="link-column">
                            <h4>Support</h4>
                            <Link to="#">Help center</Link>
                            <Link to="#">Terms of service</Link>
                            <Link to="#">Privacy policy</Link>
                            <Link to="#">Status</Link>
                        </div>
                        <div className="newsletter">
                            <h4>Stay up to date</h4>
                            <div className="subscribe">
                                <input type="email" placeholder="Your email address"/>
                                <button type="submit"><img src={sendIcon} alt="Send"/></button>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
            </div>
        </>
    );
}

export default SchoolHome; 