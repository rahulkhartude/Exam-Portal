import { BrowserRouter, Routes, Route } from "react-router-dom"

import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import Exam from "./pages/Exam"
import Result from "./pages/Result"
import AdminDashboard from "./pages/AdminDashboard"



function App() {


    return (

        <BrowserRouter>

            <Routes>

                {/* <Route path="/" element={<Login/>}/> */}
                <Route path="/" element={<Dashboard />} />
                <Route path="/exam" element={<Exam />} />
                <Route path="/result" element={<Result />} />
                <Route path="/admin" element={<AdminDashboard />} />


            </Routes>

        </BrowserRouter>

    )

}

export default App