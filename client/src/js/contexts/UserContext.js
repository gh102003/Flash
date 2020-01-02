import React from "react";

export const UserContext = React.createContext({
    currentUser: null,
    // This function will be filled in when the state is set by Page to 
    // update the state of Page, which is passed to UserContext.Provider
    changeUser: () => {} 
});

UserContext.displayName = "UserContext";