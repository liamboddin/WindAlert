import { Box, Button, IconButton, InputAdornment, Link, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { login } from "../api/callApi.ts";
import { useNavigate } from "react-router-dom";
import { TokenDTO } from "../dto/InfoDTO.ts";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    return (
        <>
            <Box className={"w-full px-4 py-5 mx-auto md:w-4/5 lg:w-2/5"}>
                <Stack spacing={2} direction={"column"}>
                    <TextField
                        className={"w-full flex justify-center"}
                        label={"Benutzername"}
                        onChange={(event) => {
                            setUsername(event.target.value);
                        }}
                    >
                    </TextField>
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
                    <Button className="w-full" variant={"contained"}
                            onClick={() => {
                                login(username, password)
                                    .then((dto: TokenDTO) => {
                                        localStorage.setItem("token", dto.token);
                                        navigate("/");
                                    });
                            }}>
                        Einloggen
                    </Button>
                    <Button variant={"outlined"} onClick={() => {
                        navigate("/register");
                    }}>
                        Registrieren
                    </Button>
                    <Typography variant="body2" align="center">
                        Passwort vergessen?{" "}
                        <Link
                            component="button"
                            variant="body2"
                            onClick={() => navigate("/password-reset")}
                            underline="hover"
                        >
                            Hier zurücksetzen
                        </Link>
                    </Typography>

                </Stack>
            </Box>
        </>);
};