import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Header from "./components/Header";
import ShowUsers from "./components/ShowUsers";
import Login from "./components/Login";
import AddUsers from "./components/AddUsers";
import UpdateUsers from "./components/UpdateUsers";
import DisableUsers from "./components/DisableUsers";
import ChangePassword from "./components/ChangePassword"
import ShowFines from "./components/ShowFines"
import CreateFines from "./components/CreateFines"
import "./index.css";

const App = () => {
  const [userName, setUserName] = useState(localStorage.getItem("userName") || "");
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("accessToken"));
  const role = localStorage.getItem("role");

  const handleLogin = (userName) => {
    setUserName(userName);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("role");
    localStorage.removeItem("userName");
    setIsLoggedIn(false);
  };

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

             {/*
            <Route path="/create-form" element={<CreateForm />} />
            <Route path="/create-form-version" element={<CreateFormVersion />} />
            <Route path="/change-password" element={<ChangePassword />} /> 
            <Route path="*" element={<Navigate to="/forms" />} /> */}
          </Routes>
        );
      default:
        return (
          <Routes>
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        );
    }
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col items-center">
        {isLoggedIn ? (
          <>
            <Header userName={userName} role={role} onLogout={handleLogout} />
            <main className="w-full max-w-7xl p-4">{renderRoutes()}</main>
          </>
        ) : (
          <Login onLogin={handleLogin} />
        )}
      </div>
    </Router>
  );
};

export default App;

