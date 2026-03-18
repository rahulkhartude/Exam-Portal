// import { useState } from "react";
// import API from "../services/api";
// import { useNavigate } from "react-router-dom";

// function Signup() {
//     const navigate = useNavigate();

//     const [form, setForm] = useState({
//         name: "",
//         email: "",
//         password: ""
//     });

//     const [loading, setLoading] = useState(false);

//     // handle input change
//     const handleChange = (e) => {
//         setForm({
//             ...form,
//             [e.target.name]: e.target.value
//         });
//     };

//     // register function
//     const register = async () => {
//         if (!form.name || !form.email || !form.password) {
//             alert("Please fill all fields");
//             return;
//         }

//         try {
//             setLoading(true);

//             const res = await API.post("/auth/register", form);

//             console.log("Register Response:", res.data);

//             alert("Registered successfully ✅");

//             // redirect to login
//             navigate("/login");

//         } catch (err) {
//             console.log(err);
//             alert(err?.response?.data?.message || "Registration failed");
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="flex items-center justify-center h-screen bg-gray-100">
//             <div className="bg-white p-8 rounded shadow w-80">

//                 <h2 className="text-2xl font-bold mb-6 text-center">
//                     Register
//                 </h2>

//                 <input
//                     type="text"
//                     name="name"
//                     placeholder="Name"
//                     className="border p-2 w-full mb-3"
//                     onChange={handleChange}
//                 />

//                 <input
//                     type="email"
//                     name="email"
//                     placeholder="Email"
//                     className="border p-2 w-full mb-3"
//                     onChange={handleChange}
//                 />

//                 <input
//                     type="password"
//                     name="password"
//                     placeholder="Password"
//                     className="border p-2 w-full mb-4"
//                     onChange={handleChange}
//                 />

//                 <button
//                     onClick={register}
//                     disabled={loading}
//                     className={`w-full p-2 rounded text-white ${loading ? "bg-gray-400" : "bg-green-600"
//                         }`}
//                 >
//                     {loading ? "Registering..." : "Register"}
//                 </button>

//                 <p className="mt-4 text-center">
//                     Already have an account?{" "}
//                     <span
//                         onClick={() => navigate("/login")}
//                         className="text-blue-600 font-bold cursor-pointer"
//                     >
//                         Login
//                     </span>
//                 </p>

//             </div>
//         </div>
//     );
// }

// export default Signup;

import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

    setErrors({
      ...errors,
      [e.target.name]: "",
      api: ""
    });
  };

  // ✅ Validation (same as backend rules)
  const validate = () => {
    let newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Name is required";
    } else if (form.name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const register = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      const res = await API.post("/auth/register", form);

      alert("Registered successfully ✅");
      navigate("/login");

    } catch (err) {
      setErrors({
        ...errors,
        api: err?.response?.data?.message || "Registration failed"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow w-96">

        <h2 className="text-2xl font-bold mb-6 text-center">
          Register
        </h2>

        {/* API Error */}
        {errors.api && (
          <p className="text-red-500 text-sm mb-3 text-center">
            {errors.api}
          </p>
        )}

        {/* Name */}
        <input
          type="text"
          name="name"
          placeholder="Name"
          className={`border p-2 w-full mb-1 ${
            errors.name ? "border-red-500" : ""
          }`}
          onChange={handleChange}
        />
        {errors.name && (
          <p className="text-red-500 text-sm mb-2">{errors.name}</p>
        )}

        {/* Email */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          className={`border p-2 w-full mb-1 ${
            errors.email ? "border-red-500" : ""
          }`}
          onChange={handleChange}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mb-2">{errors.email}</p>
        )}

        {/* Password */}
        <input
          type="password"
          name="password"
          placeholder="Password"
          className={`border p-2 w-full mb-1 ${
            errors.password ? "border-red-500" : ""
          }`}
          onChange={handleChange}
        />
        {errors.password && (
          <p className="text-red-500 text-sm mb-3">
            {errors.password}
          </p>
        )}

        <button
          onClick={register}
          disabled={loading}
          className={`w-full p-2 rounded text-white ${
            loading ? "bg-gray-400" : "bg-green-600"
          }`}
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="mt-4 text-center">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-600 font-bold cursor-pointer"
          >
            Login
          </span>
        </p>

      </div>
    </div>
  );
}

export default Signup;