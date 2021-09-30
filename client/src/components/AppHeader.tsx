import { useAuth0 } from "@auth0/auth0-react";
import React from "react";

const AppHeader: React.FC = () => {
  const { isLoading } = useAuth0();

  if (isLoading) return null;

  return (
    <div className="flex justify-center mr-2 items-center">
      <AuthButton />
    </div>
  );
};

export default AppHeader;

const StyledButton: React.FC<any> = ({ children, ...props }) => (
  <button
    className="focus:outline-none text-sm bg-gray-200 hover:bg-gray-100 text-gray-900 px-4 py-1 rounded-md"
    {...props}
  >
    {children}
  </button>
);

const AuthButton: React.FC = () => {
  const { loginWithRedirect, logout, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) return null;
  if (isAuthenticated)
    return (
      <StyledButton
        onClick={() => logout({ returnTo: window.location.origin })}
      >
        Log Out
      </StyledButton>
    );

  return (
    <StyledButton onClick={() => loginWithRedirect()}>Log In</StyledButton>
  );
};
