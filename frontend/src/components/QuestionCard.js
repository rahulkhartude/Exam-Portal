
function QuestionCard({ question, selected, handleAnswer }) {


    return (

        <div>

            <h2 className="text-xl font-semibold mb-6">

                {question.question}
            </h2>

            <div className="space-y-3">

                {question.options.map((opt, index) => (

                    <label
                        key={index}
                        className={`block border p-3 rounded cursor-pointer 
                            ${selected === opt ? "bg-blue-100 border-blue-500" : ""}
                            `}
                    >

                        <input
                            type="radio"
                            className="mr-2"
                            checked={selected === opt}
                            onChange={() => handleAnswer(opt)}
                        />

                        {opt}

                    </label>

                ))}

            </div>

            {/* Clear answer button: allows student to unselect an answer */}
            {selected && (
                <div className="mt-4">
                    <button
                        onClick={() => handleAnswer(null)}
                        className="bg-gray-300 text-gray-800 px-3 py-2 rounded"
                    >
                        Clear Answer
                    </button>
                </div>
            )}

        </div>

    )

}

export default QuestionCard