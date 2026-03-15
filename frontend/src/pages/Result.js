// function Result(){

// const score=localStorage.getItem("score")

// return(

// <div className="result">

// <h1>Exam Result</h1>

// <h2>Your Score : {score}</h2>

// </div>

// )

// }

// export default Result
import { useEffect, useState } from "react"

function Result(){

const [score,setScore] = useState(0)

useEffect(()=>{

const savedScore = localStorage.getItem("score")

if(savedScore){
setScore(savedScore)
}

},[])

return(

<div className="flex items-center justify-center h-screen bg-gray-100">

<div className="bg-white p-10 rounded shadow text-center">

<h1 className="text-3xl font-bold mb-6">
Exam Completed
</h1>

<h2 className="text-xl mb-4">
Your Score
</h2>

<div className="text-5xl font-bold text-blue-600">
{score}
</div>

</div>

</div>

)

}

export default Result