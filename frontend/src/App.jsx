import React from "react";
import Toaster from "react-hot-toast";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
      <Toaster />
    </>
  );
};

export default App;
