import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import MyRequsetPage from "./pages/MyRequestsPage";
import ErrorPage from "./pages/errorPage";
function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="*" element={<ErrorPage />} />
          <Route path="/" element={<LandingPage />} />
          <Route path="/api/groups/my" element={<MyRequsetPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
