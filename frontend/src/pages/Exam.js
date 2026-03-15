// import { useEffect, useState } from "react";
// import API from "../services/api";

// import Navbar from "../components/Navbar";
// import Timer from "../components/Timer";
// import QuestionCard from "../components/QuestionCard";
// import QuestionNavigator from "../components/QuestionNavigator";

// function Exam(){

// const [questions,setQuestions]=useState([])
// const [current,setCurrent]=useState(0)
// const [answers,setAnswers]=useState({})

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

// const submitExam=()=>{

// let score=0

// questions.forEach((q,index)=>{

// if(answers[index]===q.answer){
// score++
// }

// })

// localStorage.setItem("score",score)

// window.location="/result"

// }

// if(!questions.length) return <h2>Loading...</h2>

// return(

// <div>

// <Navbar/>

// <Timer duration={1800} onTimeUp={submitExam}/>

// <div className="exam-layout">

// <div className="left">

// <QuestionCard
// question={questions[current]}
// selected={answers[current]}
// handleAnswer={handleAnswer}
// />

// <div className="navigation-buttons">

// <button
// disabled={current===0}
// onClick={()=>setCurrent(current-1)}
// >

// Previous

// </button>

// <button
// disabled={current===questions.length-1}
// onClick={()=>setCurrent(current+1)}
// >

// Next

// </button>

// </div>

// </div>

// <QuestionNavigator
// questions={questions}
// current={current}
// setCurrent={setCurrent}
// answers={answers}
// />

// </div>

// <button
// className="finish"
// onClick={submitExam}
// >

// Finish Exam

// </button>

// </div>

// )

// }

// export default Exam


import { useEffect, useState } from "react";
import API from "../services/api";

import Navbar from "../components/Navbar";
import Timer from "../components/Timer";
import QuestionCard from "../components/QuestionCard";
import QuestionNavigator from "../components/QuestionNavigator";

import "../styles.css";

function Exam(){

const [questions,setQuestions]=useState([])
const [current,setCurrent]=useState(0)
const [answers,setAnswers]=useState({})

useEffect(()=>{

API.get("/questions")
.then(res=>setQuestions(res.data))

},[])

const handleAnswer=(option)=>{

setAnswers({
...answers,
[current]:option
})

}

const submitExam=()=>{

let score=0

questions.forEach((q,index)=>{

if(answers[index]===q.answer){
score++
}

})

alert("Your Score : "+score)

}

if(!questions.length) return <h2>Loading...</h2>

return(

<div className="exam-container">

<Navbar/>

<div className="exam-header">

<h2>JavaScript Fundamentals</h2>

<Timer duration={1800} onTimeUp={submitExam}/>

</div>

<div className="exam-body">

<div className="question-section">

<QuestionCard
question={questions[current]}
selected={answers[current]}
handleAnswer={handleAnswer}
/>

<div className="nav-buttons">

<button
disabled={current===0}
onClick={()=>setCurrent(current-1)}
>
Previous
</button>

<button
disabled={current===questions.length-1}
onClick={()=>setCurrent(current+1)}
>
Next
</button>

</div>

</div>

<QuestionNavigator
questions={questions}
current={current}
setCurrent={setCurrent}
answers={answers}
/>

</div>

<div className="finish-area">

<button onClick={submitExam} className="finish-btn">
Finish Exam
</button>

</div>

</div>

)

}

export default Exam