import React, { createContext, useContext, useState } from 'react';

// Create the context
const EmailContext = createContext();

// Create a Provider component
export const EmailProvider = ({ children }) => {
  const [emailInContext, setEmailInContext] = useState("unknown");

  return (
    <EmailContext.Provider value={{emailInContext:emailInContext, setEmailInContext:setEmailInContext }}>
      {children}
    </EmailContext.Provider>
  );
};

// Hook to use the EmailContext
export const useEmail = () => {
  const context = useContext(EmailContext);
  if (!context) {
    throw new Error("useEmail must be used within a EmailProvider");
  }
  return context;
};
