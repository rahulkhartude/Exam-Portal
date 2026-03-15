import Navbar from '../components/Navbar'

function Dashboard(){

return(

<div>

<Navbar/>

<div className="dashboard">

<h2>Welcome to Live Exam</h2>

<a href="/exam">
<button>Start Exam</button>
</a>

</div>

</div>

)

}

export default Dashboard