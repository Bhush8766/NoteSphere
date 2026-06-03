import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        'http://localhost:5000/api/auth/register',
        formData
      );

      localStorage.setItem(
        'token',
        response.data.token
      );

      localStorage.setItem(
        'user',
        JSON.stringify(response.data)
      );

      navigate('/dashboard');
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
        'Register Failed'
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f3ff]">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-10 rounded-3xl shadow-xl w-[450px]"
      >
        <h1 className="text-3xl font-bold mb-6 text-center text-purple-700">
          Create Account
        </h1>

        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border p-3 rounded-xl mb-4"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border p-3 rounded-xl mb-4"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full border p-3 rounded-xl mb-6"
          required
        />

        <button
          type="submit"
          className="bg-purple-600 text-white w-full p-3 rounded-xl"
        >
          Register
        </button>

        <p className="mt-5 text-center">
          Already have account?

          <Link
            className="text-purple-600 ml-2"
            to="/login"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;