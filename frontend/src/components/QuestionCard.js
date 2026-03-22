
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

        </div>

    )

}

export default QuestionCard