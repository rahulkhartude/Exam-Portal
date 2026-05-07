
// import { useState, useEffect } from "react";
// import { useNavigate,useLocation } from "react-router-dom";
// import API from "../../services/api";

// import Navbar from "../../components/Navbar";
// import Timer from "../../components/Timer";
// import QuestionCard from "../../components/QuestionCard";
// import QuestionPalette from "../../components/QuestionPalette";

// function Exam() {
//   const EXAMTIME = process.env.REACT_APP_EXAMTIME;
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [questions, setQuestions] = useState([]);
//   const [current, setCurrent] = useState(0);
//   const [answers, setAnswers] = useState({});
//   const [loading, setLoading] = useState(false);



//   // useEffect(() => {
//   //   const handleVisibility = () => {
//   //     if (document.visibilityState === "hidden") {
//   //       const token = localStorage.getItem("token");
        

//   //       // logout only if logged in
//   //       if (token) {
//   //         localStorage.removeItem("token");
//   //         localStorage.removeItem("user");
//   //         navigate("/login");
//   //       }
//   //     }
//   //   };

//   //   document.addEventListener("visibilitychange", handleVisibility);

//   //   return () => {
//   //     document.removeEventListener("visibilitychange", handleVisibility);
//   //   };
//   // }, [navigate, location]);

//  useEffect(() => {
//   const logoutUser = () => {
//     console.log("Logout Triggered");

//     localStorage.removeItem("token");
//     localStorage.removeItem("user");

//     window.location.href = "/login";
//   };

//   const handleVisibilityChange = () => {
//     console.log(document.visibilityState);

//     if (document.visibilityState === "hidden") {
//       logoutUser();
//     }
//   };

//   document.addEventListener(
//     "visibilitychange",
//     handleVisibilityChange
//   );

//   return () => {
//     document.removeEventListener(
//       "visibilitychange",
//       handleVisibilityChange
//     );
//   };
// }, []);


//   useEffect(() => {
//   API.get("/admin", {
//     headers: {
//       Authorization: `Bearer ${localStorage.getItem("token")}`,
//     },
//   })
//     .then((res) => setQuestions(res.data))
//     .catch((err) => console.log(err));
// }, []);
   
//   const user = JSON.parse(localStorage.getItem("user"));
//   if (!user) {
//     navigate("/login");
//     return;
//   }

//   const handleAnswer = (option) => {
//     setAnswers({
//       ...answers,
//       [current]: option,
//     });
//   };

//   const submitExam = async () => {
//     try {
//       setLoading(true);

//       const formattedAnswers = Object.keys(answers).map((key) => ({
//         questionId: questions[Number(key)]._id,
//         selectedAnswer: answers[key],
//       }));

// const res = await API.post(
//   "/result/submit",
//   {
//     answers: formattedAnswers,
//     user: JSON.parse(localStorage.getItem("user")),
//   },
//   {
//     headers: {
//       Authorization: `Bearer ${localStorage.getItem("token")}`,
//     },
//   }
// );
//       alert("Exam Submitted Successfully");

//       localStorage.setItem("score", res.data.score);

//       navigate("/result");
//     } catch (err) {
//       console.log(err);
//       alert("Error submitting exam");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!questions.length)
//     return <h2 className="text-center mt-10">Loading Questions...</h2>;

//   return (
//     <div className="bg-gray-100 min-h-screen">
//       <Navbar />

//       <div className="max-w-7xl mx-auto p-5">
//         <div className="flex justify-end mb-4">
//           <Timer duration={EXAMTIME} onTimeUp={submitExam} />
//         </div>

//         <div className="grid grid-cols-4 gap-5">
//           <div className="col-span-3 bg-white p-6 rounded shadow">
//             <QuestionCard
//               question={questions[current]}
//               selected={answers[current]}
//               handleAnswer={handleAnswer}
//             />

//             <div className="flex justify-between mt-8">
//               <button
//                 onClick={() => setCurrent(current - 1)}
//                 disabled={current === 0}
//                 className="bg-gray-500 text-white px-4 py-2 rounded disabled:opacity-50"
//               >
//                 Previous
//               </button>

//               <div className="flex gap-3">
//                 <button
//                   onClick={() => setCurrent(current + 1)}
//                   disabled={current === questions.length - 1}
//                   className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
//                 >
//                   Next
//                 </button>

//                 <button
//                   onClick={submitExam}
//                   disabled={loading}
//                   className="bg-green-600 text-white px-4 py-2 rounded"
//                 >
//                   {loading ? "Submitting..." : "Submit Exam"}
//                 </button>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white p-4 rounded shadow">
//             <QuestionPalette
//               questions={questions}
//               current={current}
//               setCurrent={setCurrent}
//               answers={answers}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Exam;




import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import API from "../../services/api";

import Navbar from "../../components/Navbar";
import Timer from "../../components/Timer";
import QuestionCard from "../../components/QuestionCard";
import QuestionPalette from "../../components/QuestionPalette";

function Exam() {

  const EXAMTIME = process.env.REACT_APP_EXAMTIME;

  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);

  const [violations, setViolations] = useState(0);

  // =========================
  // CHECK LOGIN
  // =========================

  useEffect(() => {

    const user = JSON.parse(
      localStorage.getItem("user")
    );

    const token = localStorage.getItem("token");

    if (!user || !token) {
      navigate("/login", { replace: true });
    }

  }, [navigate]);

  // =========================
  // PREVENT BACK BUTTON
  // =========================

  useEffect(() => {

    window.history.pushState(
      null,
      "",
      window.location.href
    );

    const handleBackButton = () => {

      window.history.pushState(
        null,
        "",
        window.location.href
      );
    };

    window.addEventListener(
      "popstate",
      handleBackButton
    );

    return () => {

      window.removeEventListener(
        "popstate",
        handleBackButton
      );
    };

  }, []);

  // =========================
  // LOGOUT FUNCTION
  // =========================

  const logoutUser = useCallback(() => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login", { replace: true });

  }, [navigate]);

  // =========================
  // TAB SWITCH DETECTION
  // =========================

  // useEffect(() => {

  //   const handleVisibilityChange = () => {

  //     console.log(
  //       "Visibility:",
  //       document.visibilityState
  //     );

  //     if (document.hidden) {

  //       setViolations((prev) => {

  //         const updated = prev + 1;

  //         alert(
  //           `Warning: Tab switching detected (${updated}/3)`
  //         );

  //         if (updated >= 3) {

  //           alert(
  //             "Exam terminated due to multiple tab switches."
  //           );

  //           logoutUser();
  //         }

  //         return updated;
  //       });
  //     }
  //   };

  //   document.addEventListener(
  //     "visibilitychange",
  //     handleVisibilityChange
  //   );

  //   return () => {

  //     document.removeEventListener(
  //       "visibilitychange",
  //       handleVisibilityChange
  //     );
  //   };

  // }, [logoutUser]);

useEffect(() => {

  const handleViolation = () => {

    console.log("TAB SWITCH DETECTED");

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    alert("Tab change detected");

    navigate("/login", {
      replace: true,
    });
  };

  const handleBlur = () => {

    console.log("WINDOW BLUR");

    handleViolation();
  };

  const handleVisibility = () => {

    console.log(document.visibilityState);

    if (document.hidden) {

      handleViolation();
    }
  };

  window.addEventListener(
    "blur",
    handleBlur
  );

  document.addEventListener(
    "visibilitychange",
    handleVisibility
  );

  return () => {

    window.removeEventListener(
      "blur",
      handleBlur
    );

    document.removeEventListener(
      "visibilitychange",
      handleVisibility
    );
  };

}, [navigate]);

  // =========================
  // FETCH QUESTIONS
  // =========================

  useEffect(() => {

    const fetchQuestions = async () => {

      try {

        const res = await API.get("/admin", {
          headers: {
            Authorization:
              `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setQuestions(res.data);

      } catch (err) {

        console.log(err);

        alert("Failed to load questions");

      }
    };

    fetchQuestions();

  }, []);

  // =========================
  // HANDLE ANSWERS
  // =========================

  const handleAnswer = (option) => {

    setAnswers((prev) => ({
      ...prev,
      [current]: option,
    }));
  };

  // =========================
  // SUBMIT EXAM
  // =========================

  const submitExam = async () => {

    try {

      setLoading(true);

      const formattedAnswers =
        Object.keys(answers).map((key) => ({

          questionId:
            questions[Number(key)]._id,

          selectedAnswer:
            answers[key],

        }));

      const res = await API.post(
        "/result/submit",
        {
          answers: formattedAnswers,
          user: JSON.parse(
            localStorage.getItem("user")
          ),
        },
        {
          headers: {
            Authorization:
              `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("Exam Submitted Successfully");

      localStorage.setItem(
        "score",
        res.data.score
      );

      navigate("/result");

    } catch (err) {

      console.log(err);

      alert("Error submitting exam");

    } finally {

      setLoading(false);
    }
  };

  // =========================
  // LOADING
  // =========================

  if (!questions.length) {

    return (
      <h2 className="text-center mt-10">
        Loading Questions...
      </h2>
    );
  }

  // =========================
  // UI
  // =========================

  return (

    <div className="bg-gray-100 min-h-screen">

      <Navbar />

      <div className="max-w-7xl mx-auto p-5">

        <div className="flex justify-between mb-4">

          <div className="text-red-600 font-bold">
            Violations: {violations}/3
          </div>

          <Timer
            duration={EXAMTIME}
            onTimeUp={submitExam}
          />

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
                onClick={() =>
                  setCurrent(current - 1)
                }
                disabled={current === 0}
                className="bg-gray-500 text-white px-4 py-2 rounded disabled:opacity-50"
              >
                Previous
              </button>

              <div className="flex gap-3">

                <button
                  onClick={() =>
                    setCurrent(current + 1)
                  }
                  disabled={
                    current === questions.length - 1
                  }
                  className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                  Next
                </button>

                <button
                  onClick={submitExam}
                  disabled={loading}
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >
                  {loading
                    ? "Submitting..."
                    : "Submit Exam"}
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