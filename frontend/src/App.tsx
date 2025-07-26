import "./App.css";
import { Route, Routes, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import { RegisterPassword } from "./pages/RegisterPassword.tsx";
import { Login } from "./pages/Login.tsx";
import { EnterMail } from "./pages/EnterMail.tsx";
import { useEffect } from "react";
import { setNavigate } from "./api/navigation.ts";

export const App = () => {
    const navigate = useNavigate();

    useEffect(() => {
        setNavigate(navigate);
    }, [navigate]);

    return (
        <>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/activate" element={<RegisterPassword />} />
                <Route path="/reactivate" element={<RegisterPassword />} />
                <Route path="/login" element={<Login />} />
                <Route path={"/register"} element={<EnterMail isRegister={true} />} />
                <Route path={"/password-reset"} element={<EnterMail isRegister={false} />} />
            </Routes>
        </>
    );
};

export default App;
