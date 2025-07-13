import { useState } from 'react';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./AboutUshero.css"
import Slider from "react-slick";
import { Link, useNavigate } from 'react-router-dom';

import section2 from "../images/section2.png";
import headerlogo from "../images/headerlogo.png";
import AboutUshero from "../images/AboutUshero.jpg";
import Rectangle21 from "../images/Rectangle21.png";
import Rectangle22 from "../images/Rectangle22.png";
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
import Studentheaderhome from './Studentheaderhome';
import StudentFooter from './StudentFooter';

const testimonials = [
    {
        name: "Leo",
        title: "Lead Designer",
        message: "It was a very good experience",
        description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur rhoncus nec tortor vel malesuada. Suspendisse sed magna eget nibh iaculis lacinia.",
        image: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
        name: "Jane",
        title: "Project Manager",
        message: "Super smooth process!",
        description:
            "Suspendisse sed magna eget nibh iaculis lacinia. Fusce ut nisi a quam ultrices fermentum.",
        image: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
        name: "Alex",
        title: "Software Engineer",
        message: "Loved the teamwork",
        description:
            "Elementum felis magna tempus in tristique. Suspendisse sed magna eget nibh in turpis.",
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

function AboutUs() {
    return (
        <>
            <Studentheaderhome />
            <div className="AboutUshero">


                <section class="hero about-hero" style={{ backgroundImage: `url(${AboutUshero})` }}>
                    <div class="hero-content">
                        {/* <p class="subtitle">PARTICIPATE IN COMPETITIONS ACROSS THE WORLD</p>
                    <h1>Crafting winners,<br/>Creating futures</h1>
                    <p class="description">From first steps to final wins — your journey starts here.<br/>
                        Discover your strength and prove your skills!</p> */}
                    </div>
                    <div class="hero-image">
                        <div class="hero-content">
                            {/* <p class="subtitle">PARTICIPATE IN COMPETITIONS ACROSS THE WORLD</p> */}
                            <h1>Building the world’s Largest Competitions Management Platform</h1>
                            <p class="description">Creating a seamless competition Experience For Students, Schools and Competition Organisers</p>
                            <div className="hero-button">
                                <button className='bannerbut'>Register</button>
                                <button className='bannerbut'>Register School</button>
                                <button className='bannerbut'>Register Organisation</button>
                            </div>

                        </div>
                        {/* <img src={downloadPreview} alt="Winner with trophy"/> */}
                    </div>
                    <img class="top-images" src={Rectangle21} alt="Decore" />
                    <img class="top-images" src={Rectangle22} alt="Decore" />
                </section>
                <section class="partners pb-0">
                    <h2 class="hedi-text">Who are we?</h2>
                    <p>Prodigi is pleased to introduce its mission to transform the competition landscape for students across the world by fostering interoperability among exam institutions, schools, and students. Our initiative centers around building an all-in-one online platform for end-to-end competitions management.</p>
                    <p>Our goal is to break down existing barriers in the competitions ecosystem and ensure that every student—regardless of location—has equal access to competitive opportunities that support their academic and personal growth.</p>
                    <p>In parallel, we aim to support exam institutions in expanding their reach and efficiency by offering a robust digital infrastructure for managing registrations, distributing exam content, and engaging with schools directly.</p>
                    <p>We are committed to driving inclusive, accessible, and scalable innovation in the education sector.</p>

                </section>
                <section class="partners">
                    <h2 class="hedi-text">Our Partners</h2>
                    <p className='text-center'>We are partnered with 15+ top exam institutes globally</p>
                    <div class="partners-grid">
                        <div class="item-company"> <img src={logo} alt="Partner" /></div>
                        <div class="item-company"> <img src={logo1} alt="Partner" /></div>
                        <div class="item-company"> <img src={logo2} alt="Partner" /></div>
                        <div class="item-company"> <img src={logo3} alt="Partner" /></div>
                        <div class="item-company"> <img src={logo4} alt="Partner" /></div>
                        <div class="item-company"> <img src={logo5} alt="Partner" /></div>
                        <div class="item-company"> <img src={logo6} alt="Partner" /></div>
                    </div>
                </section>


                <section class="features">
                    <img class="section2" src={section2} alt="Exam" />
                    <h2 class="features-title">One Stop For All Your Competitions</h2>
                    <div class="features-grid">
                        <div class="feature-card">
                            <div class="icon">
                                <img src={frame37} alt="Exam" />
                            </div>
                            <h3>Exam Recommendations</h3>
                            <p>Built Wicket longer admire do barton vanity itself do in it.</p>
                        </div>
                        <div class="feature-card feature-card-2">
                            <div class="icon">
                                <img src={frame38} alt="Registration" />
                            </div>
                            <h3>Quick Registration</h3>
                            <p>Engrossed listening. Park gate sell they west hard for the.</p>
                        </div>
                        <div class="feature-card">
                            <div class="icon">
                                <img src={frame39} alt="Learning" />
                            </div>
                            <h3>Personalized Learning</h3>
                            <p>Barton vanity itself do in it. Preferd to men it engrossed listening.</p>
                        </div>
                        <div class="feature-card">
                            <div class="icon">
                                <img src={frame40} alt="Trophy" />
                            </div>
                            <h3>Tangible Achievements</h3>
                            <p>We deliver outsourced aviation services for military customers</p>
                        </div>
                    </div>
                </section>

                <div class="comb-sec">

                    <section class="testimonials">
                        <h2>What Our Students Say</h2>
                        <div class="testimonial-slider">
                            <Slider {...settings}>
                                {testimonials.map((testimonial, index) => (
                                    <div key={index} class="testimonial-card">
                                        <div class="profile">
                                            <img src={testimonial.image} alt={testimonial.name} class="profile-img" />
                                            <div class="profile-info">
                                                <h4>{testimonial.name}</h4>
                                                <p class="role">{testimonial.title}</p>
                                            </div>
                                        </div>
                                        <h3 class="title">{testimonial.message}</h3>
                                        <p class="testimonial">{testimonial.description}</p>
                                    </div>
                                ))}
                            </Slider>
                        </div>
                    </section>
                    <img src={decore1} alt="Decore" class="bottom-images" />
                </div>

                
            </div>
            <StudentFooter/>
        </>
    );
}

export default AboutUs; 