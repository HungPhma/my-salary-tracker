import React from "react";
import Navbar from "./components/navbar";
import { BrowserRouter as Router, Route, Routes} from "react-router-dom";
import InputSalary from "./components/inputSalary";
import SalaryTable from "./components/salaryTable";
import TotalSalary from "./components/totalSalary";
import "./App.css";

const App = () => {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/home" exact element={<InputSalary/>} />
          <Route path="/salary" element={<SalaryTable/>} />
          <Route path="/total" element={<TotalSalary/>} />
        </Routes>
      </div>
    </Router>    
  );
};

export default App;