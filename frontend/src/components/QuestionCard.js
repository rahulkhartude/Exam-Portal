function QuestionCard({question,selected,handleAnswer}){

return(

<div className="question-card">

<h3>{question.question}</h3>

{question.options.map((opt,index)=>(
<div key={index}>

<input
type="radio"
checked={selected===opt}
onChange={()=>handleAnswer(opt)}
/>

<label>{opt}</label>

</div>
))}

</div>

)

}

export default QuestionCard