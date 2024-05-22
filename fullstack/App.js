import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import Home from './components/Home';
import AddEditCar from './components/AddEditCar';
import AddEditOwner from './components/AddEditOwner';
import ShowCarDetails from './components/ShowCarDetails';
import ShowOwnerDetails from './components/ShowOwnerDetails';
import { ToastContainer } from 'react-toastify';

const App = () => {
  return (
    <div className="App">
      <ToastContainer position="top-center" />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add" element={<AddEditCar />} />
          <Route path="/update/:id" element={<AddEditCar />} />
          <Route path="/showDetails/:id" element={<ShowCarDetails />} />
          <Route path="/addOwner" element={<AddEditOwner />} />
          <Route path="/updateOwner/:id" element={<AddEditOwner />} />
          <Route path="/showOwnerDetails/:id" element={<ShowOwnerDetails />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;