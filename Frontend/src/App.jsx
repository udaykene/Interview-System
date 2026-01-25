import { SignInButton, SignOutButton, SignedIn, SignedOut, UserButton } from '@clerk/clerk-react'
import React from 'react'

const App = () => {
  return (
    <div>
      <h1>Welcome to Interview Platform</h1>
      
      {/* This only shows if the user is LOGGED OUT */}
      <SignedOut>
        <SignInButton mode="modal">
          <button className="your-style">Sign In</button>
        </SignInButton>
      </SignedOut>

      {/* This only shows if the user is LOGGED IN */}
      <SignedIn>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <p>You are logged in!</p>
          <UserButton />
          {/* Or a simple SignOutButton */}
          <SignOutButton />
        </div>
      </SignedIn>
    </div>
  )
}

export default App