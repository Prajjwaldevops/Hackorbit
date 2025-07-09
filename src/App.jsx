
import React, { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { Sidebar, Navbar } from "./components";
import ThreeDBackground from "./components/ThreeDBackground";
import { Home, Profile, Onboarding } from "./pages";
import MedicalRecords from "./pages/records/index";
import ScreeningSchedule from "./pages/ScreeningSchedule";
import SingleRecordDetails from "./pages/records/single-record-details";
import { useStateContext } from "./context";
import LandingPage from "./components/LandingPage";

const App = () => {
  const { user, authenticated, ready, login, currentUser } = useStateContext();
  const navigate = useNavigate();
  const [showLanding, setShowLanding] = useState(true);

  useEffect(() => {
    if (ready && !authenticated) {
      login();
    } else if (user && !currentUser) {
      navigate("/onboarding");
    }
  }, [user, authenticated, ready, login, currentUser, navigate]);

  return (
    <>
      {showLanding && <LandingPage onGetStarted={() => setShowLanding(false)} />}
      {!showLanding && (
        <div className="sm:-8 relative flex min-h-screen flex-row p-4" style={{background: 'none'}}>
          <ThreeDBackground />
          <div className="relative mr-10 hidden sm:flex z-10">
            <Sidebar />
          </div>
          <div className="mx-auto max-w-[1280px] flex-1 max-sm:w-full sm:pr-5 z-10">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/medical-records" element={<MedicalRecords />} />
              <Route
                path="/medical-records/:id"
                element={<SingleRecordDetails />}
              />
              <Route path="/screening-schedules" element={<ScreeningSchedule />} />
            </Routes>
          </div>
        </div>
      )}
    </>
  );
};

export default App;

