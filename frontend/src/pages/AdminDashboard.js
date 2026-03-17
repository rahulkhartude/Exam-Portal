import { useState } from "react"
import API from "../services/api"

function AdminDashboard() {

    const [question, setQuestion] = useState("")
    const [options, setOptions] = useState(["", "", "", ""])
    const [answer, setAnswer] = useState("")

    const handleOptionChange = (value, index) => {

        const newOptions = [...options]
        newOptions[index] = value
        setOptions(newOptions)

    }

    // const addQuestion=async()=>{

    // await API.post("/admin/add-question",{
    // question,
    // options,
    // answer
    // })

    // alert("Question Added")

    // }


    const addQuestion = async () => {

        try {

            // console.log(  "que",question);
            //      console.log("options",options);
            //    console.log( "answer,",answer);
            await API.post("/admin/add-question", {
                question,
                options,
                answer
            })

            alert("Question Added Successfully")

        } catch (err) {

            console.log("admin dashboard catch called");
            console.log(err)
            alert("Error adding question")

        }

    }

    return (

        <div className="p-10 bg-gray-100 min-h-screen">

            <h1 className="text-3xl font-bold mb-6">
                Admin Dashboard
            </h1>

            <div className="bg-white p-6 rounded shadow max-w-lg">

                <input
                    type="text"
                    placeholder="Enter Question"
                    className="border p-2 w-full mb-4"
                    onChange={(e) => setQuestion(e.target.value)}
                />

                {options.map((opt, index) => (

                    <input
                        key={index}
                        type="text"
                        placeholder={`Option ${index + 1}`}
                        className="border p-2 w-full mb-3"
                        onChange={(e) => handleOptionChange(e.target.value, index)}
                    />

                ))}

                <input
                    type="text"
                    placeholder="Correct Answer"
                    className="border p-2 w-full mb-4"
                    onChange={(e) => setAnswer(e.target.value)}
                />

                <button
                    onClick={addQuestion}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >

                    Add Question

                </button>

            </div>

        </div>

    )

}

export default AdminDashboard