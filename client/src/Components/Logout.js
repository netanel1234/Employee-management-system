import { useEffect } from "react";

function Logout() {
  useEffect(() => {
    localStorage.removeItem("token");
    window.location = "/login";
  });

  return null;
}

export default Logout;
