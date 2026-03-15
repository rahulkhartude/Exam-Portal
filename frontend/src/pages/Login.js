// import {useState} from "react"
// import API from "../services/api"

// function Login(){

// const [email,setEmail]=useState("")
// const [password,setPassword]=useState("")

// const login=async()=>{

// const res=await API.post("/auth/login",{
// email,
// password
// })

// localStorage.setItem("token",res.data.token)

// window.location="/dashboard"

// }

// return(

// <div className="login">

// <h2>Login</h2>

// <input
// placeholder="Email"
// onChange={(e)=>setEmail(e.target.value)}
// />

// <input
// type="password"
// placeholder="Password"
// onChange={(e)=>setPassword(e.target.value)}
// />

// <button onClick={login}>Login</button>

// </div>

// )

// }

// export default Login

import {useState} from "react"
import API from "../services/api"

function Login(){

const [email,setEmail] = useState("")
const [password,setPassword] = useState("")

const login = async()=>{

await API.post("/auth/login",{email,password})

window.location="/dashboard"

}

return(

<div className="flex items-center justify-center h-screen bg-gray-100">

<div className="bg-white p-8 rounded shadow w-80">

<h2 className="text-2xl font-bold mb-6 text-center">
Live Exam Portal
</h2>

<input
type="email"
placeholder="Email"
className="border p-2 w-full mb-3"
onChange={(e)=>setEmail(e.target.value)}
/>

<input
type="password"
placeholder="Password"
className="border p-2 w-full mb-4"
onChange={(e)=>setPassword(e.target.value)}
/>

<button
onClick={login}
className="bg-blue-600 text-white w-full p-2 rounded"
>

Login

</button>

</div>

</div>

)

}

export default Login