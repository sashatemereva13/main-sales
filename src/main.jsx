import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./css/index.css";
import App from "./App.jsx";
import DesignStudio from "./designchoice/DesignStudio.jsx";
import Colors from "./designchoice/colors/Colors.jsx";
import TypographyChoice from "./designchoice/typo/TypographyChoice.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/designstudio" element={<DesignStudio />} />
        <Route path="/designstudio/colors" element={<Colors />} />
        <Route path="/designstudio/fonts" element={<TypographyChoice />} />
      </Routes>
    </Router>
  </StrictMode>,
);
