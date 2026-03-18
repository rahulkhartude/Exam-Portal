
import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const login = async () => {
        // ✅ Validation
        if (!email || !password) {
            alert("Please enter email and password");
            return;
        }

        try {
            setLoading(true);

            const res = await API.post("/auth/login", { email, password });

            const { token, user } = res.data;

            console.log("Login Response:", res.data); // 🔍 Debug log


            // ✅ Safety check
            if (!user || !user.role) {
                alert("Invalid response from server");
                return;
            }

            // ✅ Save data
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));

            // ✅ Role-based navigation
            if (user.role === "admin") {
                navigate("/admin");
            } else if (user.role === "student") {
                navigate("/student");
            } else {
                navigate("/"); // fallback
            }

        } catch (err) {
            console.log(err);
            alert(err?.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async () => {
        navigate("/register");
    }   

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="bg-white p-8 rounded shadow w-80">
                <h2 className="text-2xl font-bold mb-6 text-center">
                    Live Exam Portal
                </h2>

                <input
                    type="email"
                    placeholder="Email"
                    className="border p-2 w-full mb-3"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Password"
                    className="border p-2 w-full mb-4"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button
                    type="button"
                    onClick={login}
                    disabled={loading}
                    className={`w-full p-2 rounded text-white ${
                        loading ? "bg-gray-400" : "bg-blue-600"
                    }`}
                >
                    {loading ? "Logging in..." : "Login"}
                </button>
                <p className="mt-4">Don't have an account? <span onClick={handleRegister} className="text-blue-600 font-bold" >Register </span></p>
            </div>
        </div>
    );
}

export default Login;