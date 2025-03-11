import React from "react";
import Navbar from "./components/navbar";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import InputSalary from "./components/inputSalary";
import SalaryTable from "./components/salaryTable";
import TotalSalary from "./components/totalSalary";
import Profiler from "./components/profile";
import History from "./components/History";
import Statement from "./components/statement";
import "./App.css";

const App = () => {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<InputSalary />} />
          <Route path="/salary" element={<SalaryTable />} />
          <Route path="/history" element={<History />} />
        </Routes>
        <div className="body">
          <Profiler />
          <SalaryTable />
          <Statement />
        </div>
      </div>
    </Router>
  );
};

export default App;
