import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Result() {
  const [score, setScore] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const savedScore = localStorage.getItem("score");

    localStorage.removeItem("score");
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    if (savedScore) {
      setScore(savedScore);
    }
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      
      <div className="bg-white p-10 rounded shadow text-center w-96">
        
        <h1 className="text-3xl font-bold mb-6">
          Exam Completed
        </h1>

        <h2 className="text-xl mb-4">
          Your Score
        </h2>

        <div className="text-5xl font-bold text-blue-600 mb-8">
          {score}
        </div>

        {/* ✅ Button with spacing */}
        <button
          onClick={() => navigate("/")}
          className="bg-teal-500 text-white px-6 py-2 rounded hover:bg-teal-600 transition"
        >
          Back To Home
        </button>

      </div>

    </div>
  );
}

export default Result;