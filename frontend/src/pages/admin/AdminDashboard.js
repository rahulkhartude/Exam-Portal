
import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../../services/api";

function AdminDashboard() {
  const [questions, setQuestions] = useState([]);
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [answer, setAnswer] = useState("");
  const [editId, setEditId] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // 🔥 Tab change logout
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

  // 🔥 REF for focus
  const questionRef = useRef(null);

  // ================= SHUFFLE =================
  const shuffleArray = (array) => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  // ================= FETCH =================
  const fetchQuestions = async () => {
    try {
      const res = await API.get("/admin");
      console.log("All questions",res.data);
      setQuestions(shuffleArray(res.data));
    } catch (err) {
      
      console.log("--Error fetching questions:--", err);
    }
  };

  useEffect(() => {
    fetchQuestions();

    // 🔥 Auto focus on load
    questionRef.current?.focus();
  }, []);

  // ================= OPTIONS =================
  const handleOptionChange = (value, index) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

const handleBack = () => {
  setQuestion("");
  setOptions(["", "", "", ""]);
  setAnswer("");
  setEditId(null);
};


  // ================= SUBMIT =================
  const handleSubmit = async () => {

    try {
      const data = { question, options, answer };

      if (editId) {
        await API.put(`/admin/questions/${editId}`, data);
        setEditId(null);
      } else {
        await API.post("/admin/questions", data);
       }

      // reset form
      setQuestion("");
      setOptions(["", "", "", ""]);
      setAnswer("");

      // 🔥 focus again after submit
      setTimeout(() => {
        questionRef.current?.focus();
      }, 0);

      fetchQuestions();
    } catch (err) {
      alert("Error while saving question");
    }
  };

  // ================= EDIT =================
  const handleEdit = (q) => {
    setQuestion(q.question);
    setOptions(q.options);
    setAnswer(q.answer);
    setEditId(q._id);

    // 🔥 focus on input
    setTimeout(() => {
      questionRef.current?.focus();
    }, 0);
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this question?")) return;

    try {
      await API.delete(`/admin/questions/${id}`);
      fetchQuestions();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">
        🧑‍💻 Admin Dashboard
      </h1>

      {/* ================= FORM ================= */}
      <div className="bg-white p-6 rounded shadow max-w-lg mx-auto mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {editId ? "✏️ Edit Question" : "➕ Add Question"}
        </h2>

        <input
          ref={questionRef} // 🔥 focus ref
          type="text"
          placeholder="Enter Question"
          className="border p-2 w-full mb-4 rounded"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />

        {options.map((opt, index) => (
          <input
            key={index}
            type="text"
            placeholder={`Option ${index + 1}`}
            className="border p-2 w-full mb-3 rounded"
            value={opt}
            onChange={(e) =>
              handleOptionChange(e.target.value, index)
            }
          />
        ))}

        {/* Select Answer */}
        <select
          className="border p-2 w-full mb-4 rounded"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
        >
          <option value="">Select Correct Answer</option>
          {options.map((opt, i) => (
            <option key={i} value={opt}>
              {opt || `Option ${i + 1}`}
            </option>
          ))}
        </select>

        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700"
        >
          {editId ? "Update Question" : "Add Question"}
        </button>

     {editId && 
       <button
          onClick={handleBack}
          className="bg-red-600 text-white px-4 py-2 rounded w-full mt-3"
        >
          Back
        </button> 
}

      </div>

      {/* ================= LIST ================= */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">
          📋 All Questions 
        </h2>

        {questions.map((q) => (
          <div
            key={q._id}
            className="bg-white p-5 rounded shadow mb-4"
          >
            <div className="flex justify-between">
              <h3 className="font-semibold text-lg">
                {q.question}
              </h3>

              <div>
                <button
                  onClick={() => handleEdit(q)}
                  className="bg-yellow-400 px-3 py-1 rounded mr-2"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(q._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>

            <ul className="mt-3">
              {shuffleArray(q.options).map((opt, i) => (
                <li
                  key={i}
                  className={`p-2 rounded mb-1 ${
                    opt === q.answer
                      ? "bg-green-100 text-green-700 font-semibold"
                      : "bg-gray-100"
                  }`}
                >
                  {opt} {opt === q.answer && "✅"}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;