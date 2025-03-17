import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Header from "./components/Header";
import ShowUsers from "./components/ShowUsers";
import AddUsers from "./components/AddUsers";
import UpdateUsers from "./components/UpdateUsers";
import DisableUsers from "./components/DisableUsers";
import ChangePassword from "./components/ChangePassword";
import ShowFines from "./components/ShowFines";
import CreateFines from "./components/CreateFines";
import "./index.css";

const App = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col items-center">
        <Header /> {/* No need for role-based condition here */}
        <main className="w-full max-w-7xl p-4">
          <Routes>
            <Route path="/users" element={<ShowUsers />} />
            <Route path="/add-user" element={<AddUsers />} />
            <Route path="/update-user/:userId" element={<UpdateUsers />} />
            <Route path="/disable-user" element={<DisableUsers />} />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="/fines" element={<ShowFines />} />
            <Route path="/fines/create" element={<CreateFines />} />
            <Route path="*" element={<Navigate to="/fines" />} /> {/* Default redirect */}
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
