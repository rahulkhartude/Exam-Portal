import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

function Result() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const savedJson = localStorage.getItem("resultData");
    const savedScore = localStorage.getItem("score");

    if (savedJson) {
      setResult(JSON.parse(savedJson));
      setLoading(false);
      return;
    }

    if (savedScore) {
      setResult({ score: savedScore });
      setLoading(false);
      return;
    }

    const fetchResult = async () => {
      try {
        const res = await API.get("/result/me");
        setResult(res.data);
      } catch (err) {
        setError("Unable to load result details.");
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, []);

  const handleBack = () => {
    localStorage.removeItem("score");
    localStorage.removeItem("resultData");
    navigate("/");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("score");
    localStorage.removeItem("resultData");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
        <div className="bg-white p-8 rounded shadow">Loading result...</div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-8 sm:p-10 rounded shadow text-center w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6">Exam Completed</h1>

        {error ? (
          <p className="text-red-600 mb-6">{error}</p>
        ) : (
          <>
            <h2 className="text-xl mb-4">Your Score</h2>
            <div className="text-5xl font-bold text-blue-600 mb-8">
              {result?.score ?? "N/A"}
            </div>
            {result?.user?.name && (
              <p className="text-gray-700 mb-2">Student: {result.user.name}</p>
            )}
            {result?.createdAt && (
              <p className="text-gray-500 text-sm">Attempted on {new Date(result.createdAt).toLocaleString()}</p>
            )}
          </>
        )}

        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
          <button
            onClick={handleBack}
            className="bg-teal-500 text-white px-6 py-2 rounded hover:bg-teal-600 transition"
          >
            Back To Home
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Result;