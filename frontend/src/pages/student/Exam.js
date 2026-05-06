
import { useState, useEffect } from "react";
import { useNavigate,useLocation } from "react-router-dom";
import API from "../../services/api";

import Navbar from "../../components/Navbar";
import Timer from "../../components/Timer";
import QuestionCard from "../../components/QuestionCard";
import QuestionPalette from "../../components/QuestionPalette";

function Exam() {
  const EXAMTIME = process.env.REACT_APP_EXAMTIME;
  const navigate = useNavigate();
  const location = useLocation();

  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);



  // useEffect(() => {
  //   const handleVisibility = () => {
  //     if (document.visibilityState === "hidden") {
  //       const token = localStorage.getItem("token");
        

  //       // logout only if logged in
  //       if (token) {
  //         localStorage.removeItem("token");
  //         localStorage.removeItem("user");
  //         navigate("/login");
  //       }
  //     }
  //   };

  //   document.addEventListener("visibilitychange", handleVisibility);

  //   return () => {
  //     document.removeEventListener("visibilitychange", handleVisibility);
  //   };
  // }, [navigate, location]);

  useEffect(() => {
  const logoutUser = () => {
    const token = localStorage.getItem("token");

    if (token) {
      console.log("Logout Triggered");

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      window.location.replace("/login");
    }
  };

  const handleVisibility = () => {
    console.log(document.visibilityState);

    if (document.visibilityState === "hidden") {
      logoutUser();
    }
  };

  const handleBlur = () => {
    logoutUser();
  };

  document.addEventListener("visibilitychange", handleVisibility);
  window.addEventListener("blur", handleBlur);

  return () => {
    document.removeEventListener("visibilitychange", handleVisibility);
    window.removeEventListener("blur", handleBlur);
  };
}, []);


  useEffect(() => {
  API.get("/admin", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
    .then((res) => setQuestions(res.data))
    .catch((err) => console.log(err));
}, []);
   
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    navigate("/login");
    return;
  }

  const handleAnswer = (option) => {
    setAnswers({
      ...answers,
      [current]: option,
    });
  };

  const submitExam = async () => {
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
  },
  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  }
);
      alert("Exam Submitted Successfully");

      localStorage.setItem("score", res.data.score);

      navigate("/result");
    } catch (err) {
      console.log(err);
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

      <div className="max-w-7xl mx-auto p-5">
        <div className="flex justify-end mb-4">
          <Timer duration={EXAMTIME} onTimeUp={submitExam} />
        </div>

        <div className="grid grid-cols-4 gap-5">
          <div className="col-span-3 bg-white p-6 rounded shadow">
            <QuestionCard
              question={questions[current]}
              selected={answers[current]}
              handleAnswer={handleAnswer}
            />

            <div className="flex justify-between mt-8">
              <button
                onClick={() => setCurrent(current - 1)}
                disabled={current === 0}
                className="bg-gray-500 text-white px-4 py-2 rounded disabled:opacity-50"
              >
                Previous
              </button>

              <div className="flex gap-3">
                <button
                  onClick={() => setCurrent(current + 1)}
                  disabled={current === questions.length - 1}
                  className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                  Next
                </button>

                <button
                  onClick={submitExam}
                  disabled={loading}
                  className="bg-green-600 text-white px-4 py-2 rounded"
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