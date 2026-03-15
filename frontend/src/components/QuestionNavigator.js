// function QuestionNavigator({questions,current,setCurrent,answers}){

// return(

// <div className="navigator">

// <h4>Questions</h4>

// <div className="numbers">

// {questions.map((q,index)=>(

// <button
// key={index}
// className={answers[index]?"answered":""}
// onClick={()=>setCurrent(index)}
// >

// {index+1}

// </button>

// ))}

// </div>

// </div>

// )

// }

// export default QuestionNavigator

function QuestionNavigator({questions,current,setCurrent,answers}){

return(

<div className="navigator">

<h4>Question Overview</h4>

<div className="numbers">

{questions.map((q,index)=>(

<button
key={index}
className={answers[index]?"answered":""}
onClick={()=>setCurrent(index)}
>

{index+1}

</button>

))}

</div>

</div>

)

}

export default QuestionNavigator