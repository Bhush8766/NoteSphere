import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import API from "../services/api";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    email: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const [passwordLoading, setPasswordLoading] = useState(false);

  // GET USER
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await API.get("/users/me");

        setUser(data);
        setForm({
          name: data.name || "",
          email: data.email || "",
        });

        localStorage.setItem("user", JSON.stringify(data));
      } catch (err) {
        console.log("FETCH ERROR:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // UPDATE PROFILE
  const updateProfile = async () => {
    try {
      const { data } = await API.put("/users/me", form);

      const updatedUser = data.user || data;

      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      window.dispatchEvent(new Event("userUpdated"));

      alert("Profile updated successfully");
    } catch (err) {
      console.log(err.response?.data || err.message);
      alert("Profile update failed");
    }
  };

  // CHANGE PASSWORD
  const changePassword = async () => {
    if (!passwordForm.oldPassword || !passwordForm.newPassword) {
      return alert("Please fill all fields");
    }

    setPasswordLoading(true);

    try {
      const { data } = await API.put(
        "/users/change-password",
        passwordForm
      );

      alert(data.message || "Password updated successfully");

      setPasswordForm({
        oldPassword: "",
        newPassword: "",
      });
    } catch (err) {
      console.log("PASSWORD ERROR:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Password change failed");
    } finally {
      setPasswordLoading(false);
    }
  };

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  // Avatar initial logic
  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : "U";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-purple-600 text-xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />

      <div className="flex-1 ml-64 p-8">
        <Navbar />

        <h1 className="text-3xl font-bold mt-6 mb-6">
          Profile
        </h1>

        <div className="grid lg:grid-cols-2 gap-6">

          {/* PROFILE CARD */}
          <div className="bg-white p-6 rounded-2xl shadow text-center">

            <div className="w-24 h-24 mx-auto rounded-full bg-purple-600 text-white flex items-center justify-center text-3xl font-bold">
              {getInitial(user?.name)}
            </div>

            <h2 className="text-xl font-bold mt-3">
              {user?.name}
            </h2>

            <p className="text-gray-500">
              {user?.email}
            </p>

            <button
              onClick={logout}
              className="bg-red-500 text-white px-4 py-2 mt-5 rounded-xl w-full"
            >
              Logout
            </button>
          </div>

          {/* EDIT PROFILE */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-xl font-bold mb-4">
              Edit Profile
            </h2>

            <input
              className="w-full border p-3 rounded-xl mb-3"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              placeholder="Name"
            />

            <input
              className="w-full border p-3 rounded-xl mb-3"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              placeholder="Email"
            />

            <button
              onClick={updateProfile}
              className="bg-green-600 text-white px-4 py-2 rounded-xl w-full"
            >
              Save Changes
            </button>
          </div>

          {/* CHANGE PASSWORD */}
          <div className="bg-white p-6 rounded-2xl shadow lg:col-span-2">
            <h2 className="text-xl font-bold mb-4">
              Change Password
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="password"
                className="w-full border p-3 rounded-xl"
                placeholder="Old Password"
                value={passwordForm.oldPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    oldPassword: e.target.value,
                  })
                }
              />

              <input
                type="password"
                className="w-full border p-3 rounded-xl"
                placeholder="New Password"
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    newPassword: e.target.value,
                  })
                }
              />
            </div>

            <button
              onClick={changePassword}
              disabled={passwordLoading}
              className="bg-purple-600 text-white px-4 py-2 rounded-xl mt-4 w-full disabled:opacity-50"
            >
              {passwordLoading
                ? "Updating..."
                : "Update Password"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;