import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WelcomeScreen from "./pages/Home";
import Game from "./pages/game";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomeScreen />} />
        <Route path="/game" element={<Game />} />
      </Routes>
    </Router>
  );
}

export default App;
