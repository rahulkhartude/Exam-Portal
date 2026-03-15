// function Navbar(){

// return(

// <div className="navbar">

// <h2>Live Exam Portal</h2>

// <div className="profile">
// Student
// </div>

// </div>

// )

// }

// export default Navbar

function Navbar() {

return (

<div className="bg-blue-700 text-white p-4 flex justify-between">

<h1 className="text-xl font-bold">
Live Exam Portal
</h1>

<div className="flex gap-6">
<span>Candidate: Rahul</span>
<span className="bg-white text-blue-700 px-3 py-1 rounded">
Exam Active
</span>
</div>

</div>

)

}

export default Navbar