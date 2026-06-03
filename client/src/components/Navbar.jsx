import { useEffect, useState } from "react";

const Navbar = () => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  useEffect(() => {
    const updateUser = () => {
      setUser(JSON.parse(localStorage.getItem("user")));
    };

    window.addEventListener("userUpdated", updateUser);

    return () =>
      window.removeEventListener("userUpdated", updateUser);
  }, []);

  // get first letter of name
  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : "U";
  };

  return (
    <div className="flex items-center gap-3">

      {/* AVATAR INITIAL */}
      <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">
        {getInitial(user?.name)}
      </div>

      {/* NAME */}
      <span className="font-semibold">
        {user?.name}
      </span>

    </div>
  );
};

export default Navbar;