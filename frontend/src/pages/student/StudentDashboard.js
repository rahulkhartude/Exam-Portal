
import Navbar from "../../components/Navbar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

function StudentDashboard() {
  const navigate = useNavigate();
  const [attempted, setAttempted] = useState(false);
  const [loadingAttempt, setLoadingAttempt] = useState(true);
  const [attemptInfo, setAttemptInfo] = useState(null);

  useEffect(() => {
    const checkAttempt = async () => {
      try {
        const res = await API.get("/result/me");
        const data = res.data;

        if (data?.latest && data?.canRetake === false) {
          setAttempted(true);
          setAttemptInfo(data.latest);
          localStorage.setItem("examAttempted", "true");
        } else {
          setAttempted(false);
          setAttemptInfo(data?.latest || null);
          localStorage.removeItem("examAttempted");
        }
      } catch (err) {
        if (localStorage.getItem("examAttempted") === "true") {
          setAttempted(true);
        }
      } finally {
        setLoadingAttempt(false);
      }
    };
    checkAttempt();
  }, []);

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const startExam = () => {
    navigate("/exam");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      
      <Navbar />

      <div className="flex flex-col items-center justify-center mt-10 px-4">

        <div className="bg-white shadow-lg rounded-2xl p-6 sm:p-8 w-full max-w-md text-center">

          <h2 className="text-2xl font-bold mb-2">
            Welcome {user?.name || "Student"}
          </h2>

          <p className="text-sm text-gray-700 mb-6">
            Ready to start the Exam? Click the button below to begin. Good luck!
          </p>

          {loadingAttempt ? (
            <p className="text-gray-600 mb-4">Checking your exam status...</p>
          ) : attempted ? (
            <div className="mb-4 p-4 bg-yellow-50 rounded border border-yellow-200 text-left">
              <p className="text-yellow-700 font-semibold mb-2">You have already taken the exam.</p>
              {attemptInfo?.score != null && (
                <p>Your score: <span className="font-semibold">{attemptInfo.score}</span></p>
              )}
              <p className="text-sm text-gray-600 mt-2">If you believe this is an error, contact the administrator.</p>
            </div>
          ) : null}

          <button
            onClick={startExam}
            disabled={attempted || loadingAttempt}
            className={`w-full py-2 rounded-lg mb-4 text-white transition ${attempted || loadingAttempt ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
          >
            Start Exam
          </button>

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
