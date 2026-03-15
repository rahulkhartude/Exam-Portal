import {useState} from "react"
import API from "../services/api"

function Login(){

const [email,setEmail]=useState("")
const [password,setPassword]=useState("")

const login=async()=>{

const res=await API.post("/auth/login",{
email,
password
})

localStorage.setItem("token",res.data.token)

window.location="/dashboard"

}

return(

<div className="login">

<h2>Login</h2>

<input
placeholder="Email"
onChange={(e)=>setEmail(e.target.value)}
/>

<input
type="password"
placeholder="Password"
onChange={(e)=>setPassword(e.target.value)}
/>

<button onClick={login}>Login</button>

</div>

)

}

export default Login