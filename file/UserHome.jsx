import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css"; // Import AOS styles
import "./Style.css"; // Ensure your styles are in a separate file
import video from "../video3.mp4"; // Import the video file
import { useNavigate } from "react-router-dom";
import EmergencyContactDialog from "./EmergencyContactDialog";

const UserHome = () => {
  const [livesSaved, setLivesSaved] = useState(0);
  const [hasIncremented, setHasIncremented] = useState(false); // Flag to check if increment has started
  const livesSavedRef = useRef(null); // Ref for the lives saved section
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false); // State to control dialog
  const userId = localStorage.getItem("userId");

  const openPop = () => {
    setDialogOpen(true); // Open the dialog
  };

  const handleDialogClose = () => {
    setDialogOpen(false); // Close the dialog
  };

  const handleSaveContact = (contact) => {
    console.log("Saved contact:", contact); // Handle saving the contact
    // Add any additional logic to save the contact
  };
  const openWeather = () => {
    navigate("/weather");
  };
  const openTrack = () => {
    navigate("/loc");
  };

  useEffect(() => {
    AOS.init({
      duration: 1000, // Duration of animations in ms
      once: false, // If 'false', animations will trigger every time you scroll
      easing: "ease", // You can change the easing here
      offset: 120, // Distance in pixels before the element triggers animation
    });

    const incrementLivesSaved = () => {
      const target = 1299; // The target number to increment to
      let count = 0;
      const increment = Math.ceil(target / 100); // Control increment speed
      const duration = 2000; // Total duration for the increment animation
      const stepTime = Math.abs(Math.floor(duration / (target / increment))); // Time between increments

      const interval = setInterval(() => {
        count += increment;
        if (count >= target) {
          count = target;
          clearInterval(interval);
        }
        setLivesSaved(count); // Update state with the new count
      }, stepTime);

      return () => clearInterval(interval);
    };

    const handleScroll = (entries) => {
      if (entries[0].isIntersecting && !hasIncremented) {
        setHasIncremented(true); // Set flag to true
        incrementLivesSaved(); // Start incrementing
      }
    };

    const observer = new IntersectionObserver(handleScroll, {
      threshold: 0.1, // Trigger when 10% of the section is in view
    });

    if (livesSavedRef.current) {
      observer.observe(livesSavedRef.current); // Observe the lives saved section
    }

    return () => {
      if (livesSavedRef.current) {
        observer.unobserve(livesSavedRef.current); // Cleanup observer on unmount
      }
    };
  }, [hasIncremented]); // Add hasIncremented to dependencies

  return (
    <div className="app">
      {/* Navbar */}
      <nav className="navbar">
        <h1>Safe Track</h1>
        <ul>
          <li>
            <Link to="/user">Home</Link>
          </li>
          <li>
            <Link to="/sign">Sign Up</Link>
          </li>
          <li>
            <Link to="/">Login</Link>
          </li>
        </ul>
      </nav>

      {/* Background Video */}
      <div className="video-container">
        <video autoPlay muted loop id="background-video">
          <source src={video} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="overlay-text" data-aos="fade-up">
          <br />
          <br />
          <h1>Anticipate the Unexpected: Revolutionizing Road Safety</h1>
          <p>Smart Prevention and Instant Assistance at Your Fingertips</p>
        </div>
      </div>

      {/* Cards Section */}
      <div className="card-section">
        <div className="card" data-aos="fade-up" onClick={openPop}>
          <h3>Add Emergency Contacts</h3>
          <p>
            Manage emergency contacts for quick notifications during critical
            situations.
          </p>
        </div>
        <div
          className="card"
          data-aos="fade-up"
          data-aos-delay="200"
          onClick={openTrack}
        >
          <h3>Track the path</h3>
          <p>
            Monitor your vehicle's route in real-time to ensure safe driving and
            prompt issue detection.
          </p>
        </div>
        <div
          className="card"
          data-aos="fade-up"
          data-aos-delay="400"
          onClick={openWeather}
        >
          <h3>Weather Conditions</h3>
          <p>
            Real-time weather updates and alerts to help drivers take proactive
            measures and ensure safety on the road.
          </p>
        </div>
        <div className="card" data-aos="fade-up" data-aos-delay="600">
          <h3>24/7 Support</h3>
          <p>Our team is always ready to assist you.</p>
        </div>
      </div>

      {/* Lives Saved Section */}
      <div
        className="lives-saved-section"
        ref={livesSavedRef} // Attach the ref to the section
        data-aos="fade-up"
        style={{ position: "relative", textAlign: "center", margin: "20px" }}
      >
        <div
          className="lives-saved-title"
          style={{
            backgroundColor: "black",
            color: "white",
            padding: "50px",
            borderRadius: "10px",
            position: "relative", // Keep this relative to allow the counter to overlap
          }}
        >
          <h2>Lives Saved by Our App</h2>
          <br />
        </div>

        <div
          className="lives-saved-counter"
          style={{
            backgroundColor: "grey", // Background color for count
            color: "#d9410a",
            // color: "#a80303",
            left: "360px",
            padding: "20px", // Padding for aesthetics
            borderRadius: "0px", // Rounded corners
            marginTop: "-40px", // Negative margin to overlap the title
            width: "50%", // Set width smaller than the title
            margin: "0 auto", // Center align count
            position: "absolute", // Relative positioning

            transition: "background-color 0.3s", // Smooth transition for background color
          }}
        >
          <h1>{livesSaved}</h1> {/* Display the incrementing lives saved */}
        </div>
      </div>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <footer className="footer">
        <div className="footer-content">
          <h2>Accident Prevention App</h2>
          <p>Revolutionizing Road Safety through Smart Technology</p>
          <div className="footer-links">
            <a href="/about">About Us</a>
            <a href="/features">Features</a>
            <a href="/contact">Contact</a>
          </div>
          <div className="footer-contact">
            <h3>Contact Us</h3>
            <div className="social-icons">
              <a href="#" className="social-icon">
                FB
              </a>
              <a href="#" className="social-icon">
                IG
              </a>
              <a href="#" className="social-icon">
                TW
              </a>
              <a href="#" className="social-icon">
                LN
              </a>
            </div>
            <br />
            <p>Email: support@accidentpreventionapp.com</p>
            <p>Phone: +123 456 7890</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>
            &copy; {new Date().getFullYear()} Accident Prevention App. All
            rights reserved.
          </p>
        </div>
      </footer>
      <EmergencyContactDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        onSave={handleSaveContact}
        userId={userId}
      />
    </div>
  );
};

export default UserHome;
