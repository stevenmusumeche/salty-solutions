import { useAuth0 } from "@auth0/auth0-react";
import React from "react";

interface Props {
  message: string;
}

const LoginTeaser: React.FC<Props> = ({ message }) => {
  const { loginWithRedirect } = useAuth0();

  return (
    <div className="text-center">
      <div>
        <button
          className="focus:outline-none text-lg bg-blue-700 hover:bg-blue-600 text-white px-5 py-2 rounded-md"
          onClick={() => loginWithRedirect()}
        >
          Login Now
        </button>
      </div>
      <div className="mt-1 text-gray-700">{message}</div>
    </div>
  );
};

export default LoginTeaser;
