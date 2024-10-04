import { Box, Button, Stack, TextField } from "@mui/material";
import { useState } from "react";
import { login } from "../api/callApi.ts";
import { useNavigate } from "react-router-dom";

export const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    return (
        <>
            <Box sx={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
            }}>
                <Stack spacing={2} direction={"column"}
                       sx={{
                           display: "flex",
                           justifyContent: "center",
                           width: "20%",
                       }}>
                    <Box sx={{ display: "flex", justifyContent: "center", width: "auto" }}>
                        <TextField
                            label={"Benutzername"}
                            onChange={(event) => {
                                setUsername(event.target.value);
                            }}
                        >
                        </TextField>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "center", width: "auto" }}>
                        <TextField
                            label={"Passwort"}
                            type="password"
                            onChange={(event) => {
                                setPassword(event.target.value);
                            }}
                        >
                        </TextField>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "center", width: "auto" }}>
                        <Button variant={"outlined"}
                                onClick={() => {
                                    login(username, password)
                                        .then(() => navigate("/"));
                                }}>
                            Einloggen
                        </Button>
                    </Box>
                </Stack>
            </Box>
        </>);
};