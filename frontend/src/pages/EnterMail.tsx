import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Stack, TextField } from "@mui/material";
import { register, resetPassword } from "../api/callApi.ts";
import { toast } from "react-toastify";

export interface EnterMailProps {
    isRegister: boolean;
}

export const EnterMail = ({ isRegister }: EnterMailProps) => {
    const [username, setUsername] = useState("");
    const navigate = useNavigate();

    return (
        <>
            <Box className={"w-full px-4 py-5 mx-auto md:w-4/5 lg:w-2/5"}>
                <Stack spacing={2} direction={"column"}>
                    <Box className={"flex justify-center w-full"}>
                        <TextField
                            className={"w-full"}
                            label={"E-Mail"}
                            onChange={(event) => {
                                setUsername(event.target.value);
                            }}
                        >
                        </TextField>
                    </Box>
                    <Box className={"flex justify-center"}>
                        <Button variant={"contained"}
                                onClick={() => {
                                    if (isRegister) {
                                        register(username)
                                            .then(() => {
                                                toast.success("Registrierung erfolgreich! Bitte schauen Sie in ihr E-Mail-Postfach nach, um Ihr Konto zu aktivieren.");
                                                navigate("/login");
                                            });
                                    } else {
                                        resetPassword(username)
                                            .then(() => {
                                                toast.success("Passwort Anfrage erfolgreich! Bitte schauen Sie in ihr E-Mail-Postfach nach, um Ihr Passwort zu setzen.");
                                                navigate("/login");
                                            });
                                    }

                                }}>
                            {isRegister ? "Registrieren" : "Passwort neu setzen"}
                        </Button>
                    </Box>
                </Stack>
            </Box>
        </>);
};