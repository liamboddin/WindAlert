import { useLocation, useNavigate } from "react-router-dom";
import { Box, Button, IconButton, InputAdornment, Stack, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { activateAccount } from "../api/callApi.ts";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { toast } from "react-toastify";


export const RegisterPassword = () => {
    const location = useLocation();
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tokenParam = params.get("token");
        setToken(tokenParam);
    }, [location]);

    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [passwordRepeat, setPasswordRepeat] = useState("");
    const [showPasswordRepeat, setShowPasswordRepeat] = useState(false);
    const navigate = useNavigate();
    return <>
        <Box className={"w-full px-4 py-5 mx-auto md:w-4/5 lg:w-2/5"}>
            <Stack spacing={2} direction={"column"}>
                <TextField
                    label="Passwort"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    slotProps={{
                        input: {
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() => setShowPassword((prev) => !prev)}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        },
                    }}
                />
                <TextField
                    className={"flex justify-center"}
                    label={"Passwort wiederholen"}
                    type={showPasswordRepeat ? "text" : "password"}
                    value={passwordRepeat}
                    onChange={(event) => {
                        setPasswordRepeat(event.target.value);
                    }}
                    slotProps={{
                        input: {
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() => setShowPasswordRepeat((prev) => !prev)}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        },
                    }}
                />
                <Box sx={{ display: "flex", justifyContent: "center", width: "auto" }}>
                    <Button variant={"contained"}
                            onClick={() => {
                                if (password === passwordRepeat && token != undefined) {
                                    activateAccount(token, password)
                                        .then(() => navigate("/login"));
                                    toast.success("Ihr Konto wurde erfolgreich aktiviert!");
                                } else if (password !== passwordRepeat) {
                                    toast.warn("Die Passwörter stimmen nicht überein!");
                                } else {
                                    toast.error("Der Link ist nicht richtig! Bitte versuchen Sie es erneut.");
                                }
                            }}>
                        Passwort setzen
                    </Button>
                </Box>
            </Stack>
        </Box>
    </>;
};