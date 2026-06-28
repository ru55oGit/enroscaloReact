import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WelcomeScreen from "./pages/Home";
import Game from "./pages/game";
import PrivacyPolicy from "./pages/PrivacyPolicy";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomeScreen />} />
        <Route path="/game" element={<Game />} />
        <Route path="/privacidad" element={<PrivacyPolicy />} />
      </Routes>
    </Router>
  );
}

export default App;
