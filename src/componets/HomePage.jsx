                                                                            import React, { useState, useEffect, useRef } from 'react';
import ChangeBar from './ChangeBar';
import pic8 from '../images/pic8.jpg';
import pic2 from '../images/pic2.jpeg';
import pic1 from '../images/back.jpg';
import pic3 from '../images/pic3.png';
import pic4 from '../images/pic7.jpg';
import pic5 from '../images/pic5.jpg';
import axios from 'axios';
// import { toast } from 'react-toastify'; // Uncomment if you use toast
import toast, { Toaster, } from 'react-hot-toast';

// Custom Hook
function useRevealOnScroll() {
  const ref = useRef();
  const [isVisible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(ref.current);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return [ref, isVisible];
}

function HomePage() {
  const backgrounds = [pic8, pic1, pic2, pic3, pic4, pic5];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [aboutRef, aboutVisible] = useRevealOnScroll();
  const [detailsRef, detailsVisible] = useRevealOnScroll();
  const [sponsorsRef, sponsorsVisible] = useRevealOnScroll();
  const [contactRef, contactVisible] = useRevealOnScroll();
  const [isHovered, setIsHovered] = useState(false);
  const timeoutRef = useRef(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

const isNumber = (value) => /^\d+(\.\d+)?$/.test(value); // Optional decimal

const isValid = () => {
  return name && email && phone && message;
};

const sendMail = async () => {
  if (!isValid()) {
    return toast.error("All fields are required");
  }

  if (!isNumber(phone)) {
    return toast.error("Invalid phone number");
  }

  if (phone.length !== 8) {
    return toast.error("Phone number must be 8 digits long");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return toast.error("Invalid email address");
  }


      try {
        const res = await axios.post('http://localhost:2024/api/Admin/Contac-message', {
          name,
          email,
          message,
          Number,
        });
        if (res.status === 200) {
          // toast.success("Message sent successfully");
          console.log('Message sent successfully');
        }
      } catch (error) {
        console.log(error);
      }
    
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % backgrounds.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      setIsHovered(true);
    }, 200);
  };

  const handleMouseLeave = () => {
    clearTimeout(timeoutRef.current);
    setIsHovered(false);
  };

  return (
    <div className="Home">
      <ChangeBar />
      <div style={{ backgroundColor: 'white' }} id="Homeall">
        {/* About Section */}
        <div className={`aboutus reveal ${aboutVisible ? 'visible' : ''}`} ref={aboutRef}>
          <div className="head-last">
            <h1>Renting Playgrounds – A Platform for Every Player</h1>
          </div>
        </div>

        {/* Details Section */}
        <div className={`details reveal ${detailsVisible ? 'visible' : ''}`} ref={detailsRef}>
          <div className="dt">
            <div className="dt-1">
              <h3>Booking Made Simple</h3>
               <p>
                From mobile to desktop, booking your favorite sports field has never been easier.
                We walk you through the steps—from selecting a time slot to receiving instant
                confirmation—so you can focus on the game, not the process.
              </p>
            </div>
            <div className="dt-2">
              <h3>Choosing the Right Venue</h3>
                <p>
                Not sure which facility suits your game? Our guide helps you compare locations
                based on amenities, surface types, and proximity. Whether you're playing casually
                with friends or organizing a competitive match, we’ll help you find the perfect
                spot.
              </p>
            </div>
          </div>
          <div className="dt">
            <div className="dt-3">
              <h3>Manage & Modify with Ease</h3>
               <p>
                Plans changed? No worries. Learn how to cancel, reschedule, or update your
                reservations in just a few clicks. Stay in control of your schedule and avoid
                last-minute surprises with our flexible booking management tools.
              </p>
            </div>
            <div className="dt-4">
              <h3>Beginner's Guide</h3>
               <p>
                Our beginner’s guide provides essential information and tips for new users looking
                to book sports facilities with ease. Learn how to browse venues, check
                availability, make quick reservations, and manage your bookings confidently.
              </p>
            </div>
          </div>
        </div>

        {/* Sponsors Section */}
        {/* <div className={`ss reveal ${sponsorsVisible ? 'visible' : ''}`} ref={sponsorsRef} >
          <div className="sponsors">
            <div className="sponsor-1">
              <img src={Leage} alt="League" />
            </div>
            <div className={`sponsor-2`}>
              <h1 id="h1-1">Sponsored</h1>
              <h1 id="h1-2">by</h1>
            </div>
            <div className="sponsor-4">
              <img src={LS} alt="Sponsor LS" />
            </div>
          </div>
          <div className="sponsor-3">
            <img src={LGP} alt="Sponsor LGP" />
          </div>
        </div> */}

        {/* Contact Section */}
        <div className={`divcontactHome ${contactVisible ? 'visible' : ''}`} ref={contactRef}>
          <div>
            <h2 id='TContact' >Contactez-nous</h2>
            <div className="divcontact-1">
              <h3>
                Join our network of Sport Booking partners and make your venue easily accessible
                <span style={{ color: '#00E6AD' }}>
                  {' '}
                  — we’d love to hear from you!
                </span>
              </h3>
            </div>
            <div className="divcontact-2">
              <Toaster   containerStyle={{ marginTop: "15%" }}/>
              <input type="text" onChange={(e) => setName(e.target.value)} placeholder="Name" />
              <input type="text" onChange={(e) => setPhone(e.target.value)} placeholder="Phone Number" />
              <input type="text" onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
              <textarea placeholder="Your message" onChange={(e) => setMessage(e.target.value)}></textarea>
              <button className="sendcontact" onClick={sendMail}>
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
