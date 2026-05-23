 
import React from 'react'

const AddQuestion = ({ 
  question, 
  setQuestion, 
  options, 
  setOptions, 
  answer, 
  setAnswer, 
  difficulty,
  setDifficulty,
  tags,
  setTags,
  editId, 
  questionRef, 
  handleOptionChange, 
  handleSubmit, 
  handleBack 
}) => {
  return (
    <div className="bg-white p-6 rounded shadow max-w-2xl mx-auto mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {editId ? "✏️ Edit Question" : "➕ Add Question"}
        </h2>

        <input
          ref={questionRef}
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
          value={answer || ""}
          onChange={(e) => setAnswer(e.target.value)}
        >
          <option value="">Select Correct Answer</option>
          {options.map((opt, i) => (
            <option key={i} value={opt} disabled={!opt}>
              {opt || `Option ${i + 1}`}
            </option>
          ))}
        </select>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Difficulty Level</label>
            <select
              className="border p-2 w-full rounded"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Tags (comma separated)</label>
            <input
              type="text"
              placeholder="e.g. math, algebra, geometry"
              className="border p-2 w-full rounded"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700"
        >
          {editId ? "Update Question" : "Submit Question"}
        </button>

        <button
          onClick={handleBack}
          className="bg-gray-500 text-white px-4 py-2 rounded w-full mt-3 hover:bg-gray-600"
        >
          Cancel
        </button>

      </div>
  )
}

export default AddQuestion
