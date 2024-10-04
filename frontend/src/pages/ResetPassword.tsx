import { useNavigate, useParams } from "react-router-dom";
import { Box, Button, Stack, TextField } from "@mui/material";
import { useState } from "react";
import { setPasswordRequest } from "../api/callApi.ts";

export const ResetPassword = () => {
    const { uuid } = useParams();
    const [password, setPassword] = useState("");
    const [passwordRepeat, setPasswordRepeat] = useState("");
    const navigate = useNavigate();
    return <>
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
                        label={"Passwort setzen"}
                        type="password"
                        onChange={(event) => {
                            setPassword(event.target.value);
                        }}
                    >
                    </TextField>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "center", width: "auto" }}>
                    <TextField
                        label={"Passwort wiederholen"}
                        type="password"
                        onChange={(event) => {
                            setPasswordRepeat(event.target.value);
                        }}
                    >
                    </TextField>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "center", width: "auto" }}>
                    <Button variant={"outlined"}
                            onClick={() => {
                                if (password === passwordRepeat && uuid != undefined) {
                                    setPasswordRequest(uuid, password)
                                        .then(() => navigate("/login"));
                                }
                            }}>
                        Passwort setzen
                    </Button>
                </Box>
            </Stack>
        </Box>
    </>;
};