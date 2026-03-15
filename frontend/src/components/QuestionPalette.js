function QuestionPalette({questions,current,setCurrent,answers}){

return(

<div>

<h3 className="font-bold mb-3">
Question Palette
</h3>

<div className="grid grid-cols-5 gap-2 mb-4">

{questions.map((q,index)=>{

let color="bg-gray-300"

if(answers[index]) color="bg-green-500 text-white"

if(index===current) color="bg-blue-600 text-white"

return(

<button
key={index}
className={`${color} p-2 rounded`}
onClick={()=>setCurrent(index)}
>

{index+1}

</button>

)

})}

</div>

{/* Legend */}

<div className="space-y-2 text-sm">

<div className="flex items-center gap-2">
<div className="w-4 h-4 bg-green-500"></div>
<span>Answered</span>
</div>

<div className="flex items-center gap-2">
<div className="w-4 h-4 bg-blue-600"></div>
<span>Current</span>
</div>

<div className="flex items-center gap-2">
<div className="w-4 h-4 bg-gray-300"></div>
<span>Not Answered</span>
</div>

</div>

</div>

)

}

export default QuestionPalette