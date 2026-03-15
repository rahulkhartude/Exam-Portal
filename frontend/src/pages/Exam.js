// // // import { useEffect, useState } from "react";
// // // import API from "../services/api";

// // // import Navbar from "../components/Navbar";
// // // import Timer from "../components/Timer";
// // // import QuestionCard from "../components/QuestionCard";
// // // import QuestionNavigator from "../components/QuestionNavigator";

// // // function Exam(){

// // // const [questions,setQuestions]=useState([])
// // // const [current,setCurrent]=useState(0)
// // // const [answers,setAnswers]=useState({})

// // // useEffect(()=>{

// // // API.get("/questions")
// // // .then(res=>setQuestions(res.data))

// // // },[])

// // // const handleAnswer=(option)=>{

// // // setAnswers({
// // // ...answers,
// // // [current]:option
// // // })

// // // }

// // // const submitExam=()=>{

// // // let score=0

// // // questions.forEach((q,index)=>{

// // // if(answers[index]===q.answer){
// // // score++
// // // }

// // // })

// // // localStorage.setItem("score",score)

// // // window.location="/result"

// // // }

// // // if(!questions.length) return <h2>Loading...</h2>

// // // return(

// // // <div>

// // // <Navbar/>

// // // <Timer duration={1800} onTimeUp={submitExam}/>

// // // <div className="exam-layout">

// // // <div className="left">

// // // <QuestionCard
// // // question={questions[current]}
// // // selected={answers[current]}
// // // handleAnswer={handleAnswer}
// // // />

// // // <div className="navigation-buttons">

// // // <button
// // // disabled={current===0}
// // // onClick={()=>setCurrent(current-1)}
// // // >

// // // Previous

// // // </button>

// // // <button
// // // disabled={current===questions.length-1}
// // // onClick={()=>setCurrent(current+1)}
// // // >

// // // Next

// // // </button>

// // // </div>

// // // </div>

// // // <QuestionNavigator
// // // questions={questions}
// // // current={current}
// // // setCurrent={setCurrent}
// // // answers={answers}
// // // />

// // // </div>

// // // <button
// // // className="finish"
// // // onClick={submitExam}
// // // >

// // // Finish Exam

// // // </button>

// // // </div>

// // // )

// // // }

// // // export default Exam


// // import { useEffect, useState } from "react";
// // import API from "../services/api";

// // import Navbar from "../components/Navbar";
// // import Timer from "../components/Timer";
// // import QuestionCard from "../components/QuestionCard";
// // import QuestionNavigator from "../components/QuestionNavigator";

// // import "../styles.css";

// // function Exam(){

// // const [questions,setQuestions]=useState([])
// // const [current,setCurrent]=useState(0)
// // const [answers,setAnswers]=useState({})

// // useEffect(()=>{

// // API.get("/questions")
// // .then(res=>setQuestions(res.data))

// // },[])

// // const handleAnswer=(option)=>{

// // setAnswers({
// // ...answers,
// // [current]:option
// // })

// // }

// // const submitExam=()=>{

// // let score=0

// // questions.forEach((q,index)=>{

// // if(answers[index]===q.answer){
// // score++
// // }

// // })

// // alert("Your Score : "+score)

// // }

// // if(!questions.length) return <h2>Loading...</h2>

// // return(

// // <div className="exam-container">

// // <Navbar/>

// // <div className="exam-header">

// // <h2>JavaScript Fundamentals</h2>

// // <Timer duration={1800} onTimeUp={submitExam}/>

// // </div>

// // <div className="exam-body">

// // <div className="question-section">

// // <QuestionCard
// // question={questions[current]}
// // selected={answers[current]}
// // handleAnswer={handleAnswer}
// // />

// // <div className="nav-buttons">

// // <button
// // disabled={current===0}
// // onClick={()=>setCurrent(current-1)}
// // >
// // Previous
// // </button>

// // <button
// // disabled={current===questions.length-1}
// // onClick={()=>setCurrent(current+1)}
// // >
// // Next
// // </button>

// // </div>

// // </div>

// // <QuestionNavigator
// // questions={questions}
// // current={current}
// // setCurrent={setCurrent}
// // answers={answers}
// // />

// // </div>

// // <div className="finish-area">

// // <button onClick={submitExam} className="finish-btn">
// // Finish Exam
// // </button>

// // </div>

// // </div>

// // )

// // }

// // export default Exam

// import {useState,useEffect} from "react"
// import API from "../services/api"

// import Navbar from "../components/Navbar"
// import Timer from "../components/Timer"
// import QuestionCard from "../components/QuestionCard"
// import QuestionPalette from "../components/QuestionPalette"

// function Exam(){

// const [questions,setQuestions] = useState([])
// const [current,setCurrent] = useState(0)
// const [answers,setAnswers] = useState({})

// useEffect(()=>{

// API.get("/questions")
// .then(res=>setQuestions(res.data))

// },[])

// const handleAnswer=(option)=>{

// setAnswers({
// ...answers,
// [current]:option
// })

// }

// if(!questions.length) return <h2>Loading...</h2>

// return(

// <div className="bg-gray-100 min-h-screen">

// <Navbar/>

// <div className="max-w-7xl mx-auto p-5">

// <div className="flex justify-end mb-3">
// <Timer/>
// </div>

// <div className="grid grid-cols-4 gap-5">

// {/* Question Section */}

// <div className="col-span-3 bg-white p-6 rounded shadow">

// <QuestionCard
// question={questions[current]}
// selected={answers[current]}
// handleAnswer={handleAnswer}
// />

// <div className="flex justify-between mt-6">

// <button
// onClick={()=>setCurrent(current-1)}
// disabled={current===0}
// className="bg-gray-500 text-white px-4 py-2 rounded"
// >

// Previous

// </button>

// <button
// onClick={()=>setCurrent(current+1)}
// disabled={current===questions.length-1}
// className="bg-blue-600 text-white px-4 py-2 rounded"
// >

// Next

// </button>

// </div>

// </div>

// {/* Palette */}

// <div className="bg-white p-4 rounded shadow">

// <QuestionPalette
// questions={questions}
// current={current}
// setCurrent={setCurrent}
// answers={answers}
// />

// </div>

// </div>

// </div>

// </div>

// )

// }

// export default Exam

import { useState, useEffect } from "react"
import API from "../services/api"

import Navbar from "../components/Navbar"
import Timer from "../components/Timer"
import QuestionCard from "../components/QuestionCard"
import QuestionPalette from "../components/QuestionPalette"

function Exam(){

const [questions,setQuestions] = useState([])
const [current,setCurrent] = useState(0)
const [answers,setAnswers] = useState({})

useEffect(()=>{

API.get("/questions")
.then(res=>setQuestions(res.data))
.catch(err=>console.log(err))

},[])

const handleAnswer=(option)=>{

setAnswers({
...answers,
[current]:option
})

}

const submitExam=()=>{

let score = 0

questions.forEach((q,index)=>{

if(answers[index] === q.answer){
score++
}

})

alert("Your Score : "+score)

localStorage.setItem("score",score)

window.location="/result"

}

if(!questions.length) return <h2 className="text-center mt-10">Loading Questions...</h2>

return(

<div className="bg-gray-100 min-h-screen">

<Navbar/>

<div className="max-w-7xl mx-auto p-5">

{/* Timer */}

<div className="flex justify-end mb-4">

<Timer duration={1800} onTimeUp={submitExam}/>

</div>

<div className="grid grid-cols-4 gap-5">

{/* Question Section */}

<div className="col-span-3 bg-white p-6 rounded shadow">

<QuestionCard
question={questions[current]}
selected={answers[current]}
handleAnswer={handleAnswer}
/>

<div className="flex justify-between mt-8">

<button
onClick={()=>setCurrent(current-1)}
disabled={current===0}
className="bg-gray-500 text-white px-4 py-2 rounded disabled:opacity-50"
>
Previous
</button>

<div className="flex gap-3">

<button
onClick={()=>setCurrent(current+1)}
disabled={current===questions.length-1}
className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
>
Next
</button>

<button
onClick={submitExam}
className="bg-green-600 text-white px-4 py-2 rounded"
>
Submit Exam
</button>

</div>

</div>

</div>

{/* Question Palette */}

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

)

}

export default Exam