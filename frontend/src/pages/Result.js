function Result(){

const score=localStorage.getItem("score")

return(

<div className="result">

<h1>Exam Result</h1>

<h2>Your Score : {score}</h2>

</div>

)

}

export default Result