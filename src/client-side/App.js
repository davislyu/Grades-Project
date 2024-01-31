import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import InputPage from "./InputPage";
import HomePage from "./HomePage";
import "./App.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    // You can customize other theme properties like primary, secondary colors here
  },
});
function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <Router>
        <div className="App">
          <nav>
            <ul className="navbar">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/input">Input</Link>
              </li>
            </ul>
          </nav>

          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/input" element={<InputPage />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
