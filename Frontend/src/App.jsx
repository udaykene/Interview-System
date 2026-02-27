import {
  SignInButton,
  SignOutButton,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";

import ProblemsPage from "./pages/ProblemsPage";
import { Toaster } from "react-hot-toast";
const App = () => {
  const { isSignedIn } = useUser();

  return (
    <>
      <Routes>
        {/* <h1 className="text-red-600">Welcome to Interview Platform</h1> */}
        <Route path="/" element={<HomePage />} />

        <Route
          path="/problems"
          element={isSignedIn ? <ProblemsPage /> : <Navigate to={"/"} />}
        />
      </Routes>
      <Toaster toastOptions={{duration:3000}} />
    </>
  );
};

export default App;


// tw, daisyui, react-router, react-hot-toast
// todo: react-query aka tanstack query, axios
