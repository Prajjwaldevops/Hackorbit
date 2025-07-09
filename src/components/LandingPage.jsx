import React, { useRef, useEffect } from "react";
import styles from "./landingPage.module.css";
import AnimatedBackground from "./AnimatedBackground";

const LandingPage = ({ onGetStarted }) => {
  useEffect(() => {
    // Only add the script if it doesn't already exist
    if (!document.querySelector('script[data-spline-viewer]')) {
      const script = document.createElement('script');
      script.type = 'module';
      script.src = 'https://unpkg.com/@splinetool/viewer@1.10.24/build/spline-viewer.js';
      script.setAttribute('data-spline-viewer', 'true');
      document.body.appendChild(script);
    }
  }, []);

  const landingRef = useRef(null);

  const handleGetStarted = () => {
    if (landingRef.current) {
      landingRef.current.classList.add(styles.slideUp);
      setTimeout(() => {
        onGetStarted();
      }, 700); // matches animation duration
    } else {
      onGetStarted();
    }
  };

  return (
    <div ref={landingRef} className={styles.landingWrapper}>
      <button className={styles.topRightButton} onClick={handleGetStarted}>
        Get Started
      </button>
      <AnimatedBackground />
      <div className={styles.robotViewer}>
        <div className={styles.robotBgBox}>
          <span className={styles.gradientBlueText}>AI BASED CANCER ADVISORY AND MONITORING TOOL</span>
          <span className={styles.robotQuote}>
            "Early detection saves lives. Empower your journey with knowledge and hope."
          </span>
          <spline-viewer url="https://prod.spline.design/cd0JSPizqRmrcT93/scene.splinecode"></spline-viewer>
          <div className={styles.robotShadow}></div>
        </div>
      </div>
      <div className={styles.mainFlex}>
        <div className={styles.container}>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '2rem' }}>
            <header>
              <h1 className={styles.gradientText}>AI Counselling Guidance</h1>
              <p className={styles.gradientText}>
                Empowering your journey with smart, personalized advice
              </p>
            </header>
            <main>
              <button className={styles.neonPink} onClick={handleGetStarted}>
                Get Started
              </button>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
