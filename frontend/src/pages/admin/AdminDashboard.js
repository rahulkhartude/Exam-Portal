
import React, { useEffect, useState, useRef } from "react";
import AddQuestion from "../../components/addQuestion";
import Pagination from "../../components/pagination";
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
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [lastAddedId, setLastAddedId] = useState(null);
  const [highlightId, setHighlightId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 10;

  const handleAddQuestion = () => {
    if (!showAddQuestion) {
      setQuestion("");
      setOptions(["", "", "", ""]);
      setAnswer("");
      setEditId(null);
    }
    setShowAddQuestion((prev) => !prev);
  }

  // // 🔥 Tab change logout
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
      const res = await API.get("/admin/allforAdmin");
      console.log("Fetched Questions: ", res.data);
      const arr = shuffleArray(res.data);
      setQuestions(arr);
      return arr;
    } catch (err) {
      console.log("--Error fetching questions:--", err);
      return [];
    }
  };

  useEffect(() => {
    fetchQuestions();

    // 🔥 Auto focus on load
    questionRef.current?.focus();
  }, []);

  // ================= PAGINATION =================
  const totalPages = Math.ceil(questions.length / questionsPerPage);
  const startIndex = (currentPage - 1) * questionsPerPage;
  const endIndex = startIndex + questionsPerPage;
  const currentQuestions = questions.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // ================= OPTIONS =================
  const handleOptionChange = (value, index) => {
    const newOptions = [...options];
    const oldValue = newOptions[index];
    newOptions[index] = value;
    setOptions(newOptions);

    // Only keep the answer in sync when a previously selected option is edited.
    if (oldValue && oldValue === answer) {
      setAnswer(value);
    }
  };

const handleBack = () => {
  setQuestion("");
  setOptions(["", "", "", ""]);
  setAnswer("");
  setEditId(null);
  setShowAddQuestion(false); // 🔥 Hide the form when going back
};

const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  navigate("/login");
};


  // ================= SUBMIT =================
  const handleSubmit = async () => {
    if (!answer) {
      alert("Please select the correct answer before submitting.");
      return;
    }

    try {
      const data = { question, options, answer };
      const isEdit = Boolean(editId);

      let focusId = null;
      if (isEdit) {
        await API.put(`/admin/questions/${editId}`, data);
        // focus the updated question after refresh
        focusId = editId;
        setLastAddedId(editId);
        setEditId(null);
      } else {
        const res = await API.post("/admin/questions", data);
        focusId = res.data?._id || null;
        setLastAddedId(focusId);
      }

      // reset form fields for next action (keep form visible)
      setQuestion("");
      setOptions(["", "", "", ""]);
      setAnswer("");
      setShowAddQuestion(true);

      // reload questions then focus the newly added/updated item
      const all = await fetchQuestions();

      // Move any added or updated question to the top so it is clearly visible.
      if (focusId && all && all.length) {
        const found = all.find((q) => q._id === focusId);
        if (found) {
          const reordered = [found, ...all.filter((q) => q._id !== focusId)];
          setQuestions(reordered);
          // reset pagination to first page so item is visible
          setCurrentPage(1);
        }
      }

      setTimeout(() => {
        if (focusId) {
          const el = document.getElementById(`q-${focusId}`);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
            el.focus();
          }
          setHighlightId(focusId);
          setTimeout(() => setHighlightId(null), 3000);
          setLastAddedId(null);
        }
        // also ensure the input is focused for quick add
        questionRef.current?.focus();
      }, 100);
    } catch (err) {
      alert("Error while saving question");
    }
  };

  // ================= EDIT =================
  const handleEdit = (q) => {
    console.log("Editing Question: ", q);
    setQuestion(q.question);
    setOptions(q.options);
    setAnswer(q.answer);
    setEditId(q._id);
    setShowAddQuestion(true); // 🔥 Show the form when editing

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
    <>
    <div className="p-5 sm:p-10 bg-gray-100 min-h-screen px-4">
      
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold text-center sm:text-left">
          🧑‍💻 Admin Dashboard
        </h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      {/* ================= FORM ================= */}
      {/* <div className="bg-white p-6 rounded shadow max-w-lg mx-auto mb-8">
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

      </div> */}
{!showAddQuestion && !editId && (
  <button
    className="text-white font-bold mb-4 px-4 py-2 rounded bg-blue-500 hover:bg-blue-900 w-full max-w-xs"
    onClick={handleAddQuestion}
  >
    Add Question
  </button>
)}

    <div>
      {(showAddQuestion || editId) && (
        <AddQuestion
          question={question}
          setQuestion={setQuestion}
          options={options}
          setOptions={setOptions}
          answer={answer}
          setAnswer={setAnswer}
          editId={editId}
          questionRef={questionRef}
          handleOptionChange={handleOptionChange}
          handleSubmit={handleSubmit}
          handleBack={handleBack}
        />
      )}
    </div>

      {/* ================= LIST ================= */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">
          📋 All Questions ({questions.length})
        </h2>

        {currentQuestions.map((q) => (
          <div
            key={q._id}
            id={`q-${q._id}`}
            tabIndex={-1}
            className={`p-5 rounded shadow mb-4 ${q._id === highlightId ? "bg-yellow-100 border border-yellow-500" : "bg-white"}`}
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
                          opt === q.answer && q.answer !== ""
                            ? "bg-green-100 text-green-700 font-semibold"
                            : "bg-gray-100"
                        }`}
                      >
                        {opt} {opt === q.answer && q.answer !== "" && "✅"}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>

    
    <Pagination 
      questions={questions} 
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={handlePageChange}
    />
    </>
  );
  
}

export default AdminDashboard;