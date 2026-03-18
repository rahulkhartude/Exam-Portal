
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";

function StudentDashboard() {
  const navigate = useNavigate();

  // ✅ Get user from localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      
      <Navbar />

      <div className="flex flex-col items-center justify-center mt-10">

        {/* Card */}
        <div className="bg-white shadow-lg rounded-2xl p-8 w-96 text-center">

          <h2 className="text-2xl font-bold mb-2">
            Welcome {user?.name || "Student"}
          </h2>

          {/* ✅ Student Name */}
          <p className="text-lg text-gray-700 mb-6">
            {user?.name || "Student"}
          </p>

          {/* Start Exam Button */}
          <button
            onClick={() => navigate("/exam")}
            className="w-full bg-blue-600 text-white py-2 rounded-lg mb-4 hover:bg-blue-700 transition"
          >
            Start Exam
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>

        </div>

      </div>
    </div>
  );
}

export default StudentDashboard;