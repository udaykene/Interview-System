import React from "react";
import {
  SignInButton,
  SignOutButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/clerk-react";
import toast from 'react-hot-toast'
const HomePage = () => {
  return (
    <div>
      <button className="btn btn-secondary" onClick={() => toast.error("This is a success toast")}>Click Me</button>
      {/* This only shows if the user is LOGGED OUT */}
      <SignedOut>
        <SignInButton mode="modal">
          <button className="your-style">Sign In</button>
        </SignInButton>
      </SignedOut>

      {/* This only shows if the user is LOGGED IN */}
      <SignedIn>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <p>You are logged in!</p>
          <UserButton />
          {/* Or a simple SignOutButton */}
          <SignOutButton />
        </div>
      </SignedIn>
    </div>
  );
};

export default HomePage;
