import { BrowserRouter, Routes, Route } from "react-router-dom"

import Login from "./pages/Login"
import StudentDashboard from "./pages/student/StudentDashboard"
import Exam from "./pages/student/Exam"
import Result from "./pages/student/Result"
import AdminDashboard from "./pages/admin/AdminDashboard"
import ProtectedRoute from "./components/ProtectedRoute";


function App() {


    return (

        <BrowserRouter>

            <Routes>

                {/* <Route path="/" element={<Dashboard />} />
                <Route path="/exam" element={<Exam />} />
                <Route path="/result" element={<Result />} />
                <Route path="/admin" element={<AdminDashboard />} /> */}

                <Route path="/" element={<Login />} />

                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute role="admin">
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/student"
                    element={
                        <ProtectedRoute role="student">
                            <StudentDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/exam"
                    element={
                        <ProtectedRoute role="student">
                            <Exam />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/result"
                    element={
                        <ProtectedRoute role="student">
                            <Result />
                        </ProtectedRoute>
                    }
                />

            </Routes>

        </BrowserRouter>

    )

}

export default App