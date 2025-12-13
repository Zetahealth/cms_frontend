import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Api from "../Api/Api";
import logo from "../../public/logo4.jpg";



export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  // const handleLogin = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const res = await axios.post(`${Api}/users/sign_in`, {
  //       user: { email, password },
  //     });

  //     console.log(res.data);
  //     localStorage.setItem("token", res.data.token); // store JWT if used
  //     navigate("/dashboard");
  //   } catch (err) {
  //     setError("Invalid email or password");
  //   }
  // };


    const handleLogin = async (e) => {
      e.preventDefault();
      setLoading(true);
      try {
        const response = await fetch(`${Api}/users/sign_in`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            user: { email, password },
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          alert("Login failed: " + (errorData.error || "Invalid credentials"));
          setLoading(false);
          return;
        }

        const data = await response.json();
        console.log("Login success:", data);

        const token = data.token;
        sessionStorage.setItem("authToken", token); // ✅ store in sessionStorage

        // Map numeric role to string
        let roleName = data.user.role;
        // switch (data.user.role) {
        //   case 1:
        //     roleName = "admin";
        //     break;
        //   case 2:
        //     roleName = "user";
        //     break;
        //   default:
        //     roleName = "user";
        // }
        console.log("User role:", data.user.role);
        sessionStorage.setItem("role", data.user.role); // ✅ also store role in sessionStorage

        alert("Login successful!");

        // Navigate based on role
        if (roleName === "admin") {
          navigate("/admin/screens");
        } else {
          navigate("/admin/screens");
        }
      } catch (error) {
        console.error("Network error:", error);
        alert("Something went wrong. Please try again later.");
      } finally {
        setLoading(false);
      }
    };



  return (
    // <div className="flex items-center justify-center h-screen bg-gray-100">
    //   <div className="bg-white shadow-lg rounded-lg p-8 w-96">
    //     <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
    //     <form onSubmit={handleLogin} className="flex flex-col gap-4">
    //       <input
    //         type="email"
    //         placeholder="Email"
    //         className="border rounded-lg px-4 py-2"
    //         value={email}
    //         onChange={(e) => setEmail(e.target.value)}
    //         required
    //       />
    //       <input
    //         type="password"
    //         placeholder="Password"
    //         className="border rounded-lg px-4 py-2"
    //         value={password}
    //         onChange={(e) => setPassword(e.target.value)}
    //         required
    //       />
    //       {error && <p className="text-red-500 text-sm">{error}</p>}
    //       <button
    //         type="submit"
    //         className="bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700"
    //       >
    //         Login
    //       </button>
    //     </form>
    //     <p className="text-sm mt-4 text-center">
    //       Don't have an account?{" "}
    //       <Link to="/signup" className="text-blue-600 hover:underline">
    //         Sign up
    //       </Link>
    //     </p>
    //   </div>
    // </div>
     <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-96">
        {/* --- Logo Section --- */}
        <div className="flex justify-center mb-4">
          <img
            src={logo}
            alt="App Logo"
            className="h-28 w-auto object-contain"
          />
        </div>

        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            className="border rounded-lg px-4 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="border rounded-lg px-4 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700 transition-colors"
          >
            Login
          </button>
        </form>

        <p className="text-sm mt-4 text-center">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
        
      </div>
    </div>
  );
}
// const Login = () => <h1>Login Page</h1>;
// export default Login;
