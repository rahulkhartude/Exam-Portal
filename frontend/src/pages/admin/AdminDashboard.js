
import React, { useCallback, useEffect, useState, useRef } from "react";
import AddQuestion from "../../components/addQuestion";
import Pagination from "../../components/pagination";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

function AdminDashboard() {
  const [questions, setQuestions] = useState([]);
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [answer, setAnswer] = useState("");
  const [editId, setEditId] = useState(null);
  const navigate = useNavigate();
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [highlightId, setHighlightId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 10;
  
  // 🆕 New features
  const [searchQuery, setSearchQuery] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [tags, setTags] = useState("");
  const [favorites, setFavorites] = useState(() => {
    const raw = localStorage.getItem("favoriteQuestions");
    if (!raw) return new Set();
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? new Set(parsed) : new Set();
    } catch {
      return new Set();
    }
  });
  const [selectedQuestions, setSelectedQuestions] = useState(new Set());
  // Settings
  const [cooldownHours, setCooldownHours] = useState(24);
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [userError, setUserError] = useState("");

  const handleAddQuestion = () => {
    if (!showAddQuestion) {
      setQuestion("");
      setOptions(["", "", "", ""]);
      setAnswer("");
      setDifficulty("medium");
      setTags("");
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
  const fetchQuestions = useCallback(async () => {
    try {
      const res = await API.get("/admin/allforAdmin");
      const arr = shuffleArray(res.data);
      setQuestions(arr);
      return arr;
    } catch (err) {
      return [];
    }
  }, []);

  useEffect(() => {
    fetchQuestions();

    const loadSettings = async () => {
      try {
        setSettingsLoading(true);
        const res = await API.get('/admin/settings');
        if (res?.data) {
          setCooldownHours(Number(res.data.exam_cooldown_hours) || 24);
        }
      } catch (e) {
        // ignore
      } finally {
        setSettingsLoading(false);
      }
    };

    const loadUsers = async () => {
      try {
        setUsersLoading(true);
        const res = await API.get('/admin/users');
        setUsers(res.data || []);
      } catch (e) {
        console.error('Error loading admin users:', e);
        setUserError(e?.response?.data?.message || e?.message || 'Unable to load users.');
      } finally {
        setUsersLoading(false);
      }
    };

    loadSettings();
    loadUsers();

    // 🔥 Auto focus on load
    questionRef.current?.focus();
  }, [fetchQuestions]);

  // ================= SEARCH/FILTER =================
  const filteredQuestions = questions.filter((q) =>
    q.question.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ================= PAGINATION =================
  const totalPages = Math.ceil(filteredQuestions.length / questionsPerPage);
  const startIndex = (currentPage - 1) * questionsPerPage;
  const endIndex = startIndex + questionsPerPage;
  const currentQuestions = filteredQuestions.slice(startIndex, endIndex);

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
  setDifficulty("medium");
  setTags("");
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
      const tagArray = tags.split(",").map((t) => t.trim()).filter((t) => t);
      const data = { 
        question, 
        options, 
        answer,
        difficulty,
        tags: tagArray
      };
      const isEdit = Boolean(editId);

      let focusId = null;
      if (isEdit) {
        await API.put(`/admin/questions/${editId}`, data);
        // focus the updated question after refresh
        focusId = editId;
        setEditId(null);
      } else {
        const res = await API.post("/admin/questions", data);
        focusId = res.data?._id || null;
      }

      // reset form fields for next action (keep form visible)
      setQuestion("");
      setOptions(["", "", "", ""]);
      setAnswer("");
      setDifficulty("medium");
      setTags("");
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
    setQuestion(q.question);
    setOptions(q.options);
    setAnswer(q.answer);
    setDifficulty(q.difficulty || "medium");
    setTags(q.tags ? q.tags.join(", ") : "");
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

  const handleToggleBypass = async (userId, currentValue) => {
    try {
      const res = await API.put(`/admin/users/${userId}/retake-bypass`, {
        retakeBypass: !currentValue,
      });
      setUsers((prev) => prev.map((user) => (user._id === userId ? { ...user, retakeBypass: res.data.retakeBypass } : user)));
    } catch (err) {
      alert(err?.response?.data?.message || err?.message || "Unable to update bypass setting.");
    }
  };

  // ================= FAVORITES =================
  const toggleFavorite = (id) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(id)) {
      newFavorites.delete(id);
    } else {
      newFavorites.add(id);
    }
    setFavorites(newFavorites);
    localStorage.setItem("favoriteQuestions", JSON.stringify([...newFavorites]));
  };

  // ================= BULK ACTIONS =================
  const toggleSelectQuestion = (id) => {
    const newSelected = new Set(selectedQuestions);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedQuestions(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedQuestions.size === currentQuestions.length) {
      setSelectedQuestions(new Set());
    } else {
      setSelectedQuestions(new Set(currentQuestions.map((q) => q._id)));
    }
  };

  const bulkDelete = async () => {
    if (selectedQuestions.size === 0) {
      alert("Select questions to delete");
      return;
    }
    if (!window.confirm(`Delete ${selectedQuestions.size} questions?`)) return;

    try {
      for (const id of selectedQuestions) {
        await API.delete(`/admin/questions/${id}`);
      }
      setSelectedQuestions(new Set());
      fetchQuestions();
    } catch (err) {
      alert("Error deleting questions");
    }
  };


  return (
    <>
    <div className="p-5 sm:p-10 bg-gray-100 min-h-screen px-4">
      
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-center sm:text-left">
            🧑‍💻 Admin Dashboard
          </h1>
          <p className="text-gray-600">Manage questions and review student results.</p>
        </div>
        <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-3 bg-white p-3 rounded shadow">
              <label className="text-sm text-gray-600">Exam Cooldown (hours)</label>
              <input type="number" min="0" value={cooldownHours} onChange={(e) => setCooldownHours(e.target.value)} className="border p-2 rounded w-24" />
              <button onClick={async () => {
                try {
                  setSettingsLoading(true);
                  await API.put('/admin/settings', { exam_cooldown_hours: Number(cooldownHours) });
                  alert('Settings saved');
                } catch (err) {
                  alert(err?.response?.data?.message || 'Error saving settings');
                } finally { setSettingsLoading(false); }
              }} className="bg-green-600 text-white px-3 py-1 rounded">Save</button>
            </div>
          <button
            onClick={() => navigate("/admin/results")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            View Results
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="bg-white rounded shadow p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div>
            <h2 className="text-xl font-semibold">Retake Bypass Management</h2>
            <p className="text-sm text-gray-600">Grant explicit cooldown bypass to individual users.</p>
          </div>
          {usersLoading && <span className="text-sm text-gray-500">Loading users...</span>}
        </div>

        {userError ? (
          <div className="text-sm text-red-600">{userError}</div>
        ) : (
          <div className="grid gap-3">
            {users.map((user) => (
              <div key={user._id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 rounded border border-gray-200">
                <div>
                  <div className="font-semibold">{user.name}</div>
                  <div className="text-sm text-gray-500">{user.email}</div>
                  <div className="text-sm text-gray-500">Role: {user.role}</div>
                </div>
                <button
                  onClick={() => handleToggleBypass(user._id, user.retakeBypass)}
                  className={`px-4 py-2 rounded text-white ${user.retakeBypass ? "bg-green-600 hover:bg-green-700" : "bg-gray-600 hover:bg-gray-700"}`}
                >
                  {user.retakeBypass ? "Bypass Enabled" : "Enable Bypass"}
                </button>
              </div>
            ))}
            {users.length === 0 && !usersLoading && (
              <div className="text-sm text-gray-500">No users found.</div>
            )}
          </div>
        )}
      </div>

      {/* ================= STATISTICS ================= */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow text-center">
          <h3 className="text-2xl font-bold text-blue-600">{questions.length}</h3>
          <p className="text-gray-600">Total Questions</p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <h3 className="text-2xl font-bold text-green-600">{filteredQuestions.length}</h3>
          <p className="text-gray-600">Searched Results</p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <h3 className="text-2xl font-bold text-yellow-600">{favorites.size}</h3>
          <p className="text-gray-600">Favorite</p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <h3 className="text-2xl font-bold text-red-600">{selectedQuestions.size}</h3>
          <p className="text-gray-600">Selected</p>
        </div>
      </div>

      {/* ================= SEARCH BAR ================= */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="🔍 Search questions..."
          className="w-full p-3 border rounded shadow"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
        />
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

{/* ================= BULK ACTIONS ================= */}
{selectedQuestions.size > 0 && (
  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded flex flex-col sm:flex-row justify-between items-center gap-3">
    <span className="text-red-600 font-semibold">{selectedQuestions.size} questions selected</span>
    <button
      onClick={bulkDelete}
      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
    >
      🗑️ Delete Selected
    </button>
  </div>
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
          difficulty={difficulty}
          setDifficulty={setDifficulty}
          tags={tags}
          setTags={setTags}
          editId={editId}
          questionRef={questionRef}
          handleOptionChange={handleOptionChange}
          handleSubmit={handleSubmit}
          handleBack={handleBack}
        />
      )}
    </div>

      {/* ================= SELECT ALL ================= */}
      {currentQuestions.length > 0 && (
        <div className="mb-4 p-4 bg-gray-50 rounded flex items-center gap-3">
          <input
            type="checkbox"
            checked={selectedQuestions.size === currentQuestions.length && currentQuestions.length > 0}
            onChange={toggleSelectAll}
            className="w-5 h-5"
          />
          <span className="text-gray-600">Select All ({currentQuestions.length})</span>
        </div>
      )}

      {/* ================= LIST ================= */}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">
          📋 Questions ({filteredQuestions.length}/{questions.length})
        </h2>

        {currentQuestions.map((q) => (
          <div
            key={q._id}
            id={`q-${q._id}`}
            tabIndex={-1}
            className={`p-5 rounded shadow mb-4 ${q._id === highlightId ? "bg-yellow-100 border border-yellow-500" : "bg-white"}`}
          >
            <div className="flex flex-col gap-4">
              {/* Header with checkbox, title, and actions */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={selectedQuestions.has(q._id)}
                  onChange={() => toggleSelectQuestion(q._id)}
                  className="w-5 h-5 mt-1"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{q.question}</h3>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleFavorite(q._id)}
                    className={`px-3 py-1 rounded ${favorites.has(q._id) ? "bg-yellow-300 text-yellow-700" : "bg-gray-200"}`}
                  >
                    ⭐
                  </button>
                  <button
                    onClick={() => handleEdit(q)}
                    className="bg-yellow-400 px-3 py-1 rounded"
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

              {/* Difficulty and Tags */}
              <div className="flex flex-wrap gap-2">
                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                  q.difficulty === "easy" ? "bg-green-100 text-green-700" :
                  q.difficulty === "medium" ? "bg-yellow-100 text-yellow-700" :
                  "bg-red-100 text-red-700"
                }`}>
                  {(q.difficulty || "medium").toUpperCase()}
                </span>
                {q.tags && q.tags.length > 0 && q.tags.map((tag, i) => (
                  <span key={i} className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-700">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Options */}
              <ul className="mt-2">
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