
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

import Navbar from "../../components/Navbar";
import Timer from "../../components/Timer";
import QuestionCard from "../../components/QuestionCard";
import QuestionPalette from "../../components/QuestionPalette";

function Exam() {
  const EXAMTIME = process.env.REACT_APP_EXAMTIME;
  const navigate = useNavigate();
  // const location = useLocation();

  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const [attemptInfo, setAttemptInfo] = useState(null);

  // 🔥 Tab change logout
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "hidden") {
        const token = localStorage.getItem("token");
        

        // logout only if logged in
        if (token) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [navigate]);

 


  useEffect(() => {
    API.get("/result/me")
      .then((res) => {
        // New response shape: { latest, canRetake, nextAvailableAt }
        const data = res.data;
        if (!data) return;

        if (data.latest && !data.canRetake) {
          setAttempted(true);
          setAttemptInfo(data.latest);
          localStorage.setItem("examAttempted", "true");
        } else {
          // either no latest attempt, or can retake -> allow exam
          setAttempted(false);
          setAttemptInfo(data.latest || null);
        }
      })
      .catch(() => {
        if (localStorage.getItem("examAttempted") === "true") {
          setAttempted(true);
        }
      });

    API.get("/admin", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => setQuestions(res.data))
      .catch((err) => {});
  }, []);
   
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    navigate("/login");
    return;
  }

  if (attempted) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded shadow w-full max-w-lg text-center">
          <h2 className="text-2xl font-bold mb-4">Exam Already Attempted</h2>
          <p className="text-gray-700 mb-4">
            Our records show that you have already completed the exam.
          </p>
          {attemptInfo?.score != null && (
            <p className="text-lg font-semibold mb-4">Score: {attemptInfo.score}</p>
          )}
          <button
            onClick={() => navigate("/result")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            View Result
          </button>
        </div>
      </div>
    );
  }

  const handleAnswer = (option) => {
    if (option === null) {
      // clear the answer for the current question
      const newAnswers = { ...answers };
      delete newAnswers[current];
      setAnswers(newAnswers);
      return;
    }

    setAnswers({
      ...answers,
      [current]: option,
    });
  };

  const submitExam = async () => {
    const confirmSubmit = window.confirm(
      "Are you sure you want to submit the exam? You can return to review your answers if you cancel."
    );
    if (!confirmSubmit) return;

    try {
      setLoading(true);

      const formattedAnswers = Object.keys(answers).map((key) => ({
        questionId: questions[Number(key)]._id,
        selectedAnswer: answers[key],
      }));

      const res = await API.post(
        "/result/submit",
        {
          answers: formattedAnswers,
          user: JSON.parse(localStorage.getItem("user")),
        }
      );
      alert("Exam Submitted Successfully");

      localStorage.setItem("score", res.data.score);
      localStorage.setItem("examAttempted", "true");
      localStorage.setItem("resultData", JSON.stringify(res.data));

      navigate("/result");
    } catch (err) {
      alert("Error submitting exam");
    } finally {
      setLoading(false);
    }
  };

  if (!questions.length)
    return <h2 className="text-center mt-10">Loading Questions...</h2>;

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto p-4 sm:p-5">
        <div className="flex justify-end mb-4">
          <Timer duration={EXAMTIME} onTimeUp={submitExam} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
          <div className="lg:col-span-3 bg-white p-6 rounded shadow">
            <QuestionCard
              question={questions[current]}
              selected={answers[current]}
              handleAnswer={handleAnswer}
            />

            <div className="flex flex-col sm:flex-row justify-between gap-3 mt-8">
              <button
                onClick={() => setCurrent(current - 1)}
                disabled={current === 0}
                className="bg-gray-500 text-white px-4 py-2 rounded disabled:opacity-50"
              >
                Previous
              </button>

              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <button
                  onClick={() => setCurrent(current + 1)}
                  disabled={current === questions.length - 1}
                  className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50 w-full sm:w-auto"
                >
                  Next
                </button>

                <button
                  onClick={submitExam}
                  disabled={loading}
                  className="bg-green-600 text-white px-4 py-2 rounded w-full sm:w-auto"
                >
                  {loading ? "Submitting..." : "Submit Exam"}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <QuestionPalette
              questions={questions}
              current={current}
              setCurrent={setCurrent}
              answers={answers}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Exam;


