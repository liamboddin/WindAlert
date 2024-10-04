import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import { ResetPassword } from "./pages/ResetPassword.tsx";
import { Login } from "./pages/Login.tsx";

export const App = () => {
    return (
        <>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/reset-password/:uuid" element={<ResetPassword />} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </>
    );
};

export default App;
