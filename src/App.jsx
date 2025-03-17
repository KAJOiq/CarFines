import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Header from "./components/Header";
import ShowUsers from "./components/ShowUsers";
import AddUsers from "./components/AddUsers";
import UpdateUsers from "./components/UpdateUsers";
import DisableUsers from "./components/DisableUsers";
import ChangePassword from "./components/ChangePassword"
import ShowFines from "./components/ShowFines"
import CreateFines from "./components/CreateFines"
import "./index.css";

const App = () => {
  const role = localStorage.getItem("role");

  const renderRoutes = () => {
    switch (role) {
      case "admin":
        return (
          <Routes>
            <Route path="/users" element={<ShowUsers/>}/>
            <Route path="/add-user" element={<AddUsers />} />
            <Route path="update-user/:userId" element={<UpdateUsers />} />
            <Route path="/disable-user" element={<DisableUsers />} />
            <Route path="/change-password" element={<ChangePassword />} /> 
            <Route path="/fines" element={<ShowFines/>}/>
            <Route path="*" element={<Navigate to="/users" />} />
          </Routes>
        );
      case "user":
        return (
          <Routes>
            <Route path="/fines" element={<ShowFines />} />
            <Route path="/fines/create" element={<CreateFines />} />
            <Route path="*" element={<Navigate to="/fines" />} />
          </Routes>
        );
      default:
        return (
          <Routes>
            <Route path="*" element={<Navigate to="/fines" />} />
          </Routes>
        );
    }
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col items-center">
        {/* Show Header if there's a role, since login is removed */}
        <Header role={role} />
        <main className="w-full max-w-7xl p-4">{renderRoutes()}</main>
      </div>
    </Router>
  );
};

export default App;
