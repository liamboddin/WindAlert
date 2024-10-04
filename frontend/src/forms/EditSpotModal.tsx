import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Box, Button, Modal, Stack, TextField, Typography } from "@mui/material";
import { createSpot, updateSpot } from "../api/callApi";
import { InfoDTO } from "../dto/InfoDTO.ts";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import MapPositionPicker from "../util/MapPositionPicker.tsx";
import { LatLngLiteral } from "leaflet";

interface EditSpotModalProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    dto?: InfoDTO;
    isCreateSpot: boolean;
    refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<InfoDTO[], Error>>;
}

export const EditSpotModal = (props: EditSpotModalProps) => {
    const { open, setOpen, dto: propDTO, isCreateSpot } = props;
    const [name, setName] = useState(!isCreateSpot ? propDTO?.spotName : "");
    const [position, setPosition] = useState<LatLngLiteral>({
        lat: !isCreateSpot && propDTO?.spotLatitude != undefined ? propDTO.spotLatitude : 54.4667,
        lng: !isCreateSpot && propDTO?.spotLongitude != undefined ? propDTO.spotLongitude : 10,
    });
    const [nameError, setNameError] = useState(false);

    useEffect(() => {
        setPosition({
            lat: !isCreateSpot && propDTO?.spotLatitude != undefined ? propDTO.spotLatitude : 54.4667,
            lng: !isCreateSpot && propDTO?.spotLongitude != undefined ? propDTO.spotLongitude : 10,
        });
    }, [isCreateSpot, propDTO]);

    useEffect(() => {
        setName(!isCreateSpot ? propDTO?.spotName : "");
    }, [isCreateSpot, propDTO]);

    if (!isCreateSpot && propDTO == undefined) {
        return <></>;
    }
    return (
        <>
            <Modal
                open={open}
                onClose={() => setOpen(false)}
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                }}
            >
                <Box
                    className={"flex content-center justify-center focus:outline-0"}
                    style={{ backgroundColor: "white" }}
                    alignSelf={"center"}
                    display={"flex"}
                    justifyContent={"center"}
                >
                    <Box
                        className={"max-h-xl flex max-w-2xl flex-col gap-y-10 rounded-2xl bg-white p-5"}
                        alignSelf={"center"}
                    >
                        <Typography className="!font-semibold" id="modal-modal-title" variant="h5" component="h2"
                                    padding={"20px"}>
                            {isCreateSpot ? "Spot erstellen" : "Spot bearbeiten"}
                        </Typography>
                        <Box id="modal-modal-description" className={"overflow-auto"}>
                            <Stack spacing={2} direction={"column"} alignItems={"left"}
                                   alignSelf={"center"}
                                   paddingX={"20px"} paddingBottom={"20px"}
                            >
                                <MapPositionPicker position={position} setPosition={setPosition} />
                                <TextField
                                    label={"Breitengrad"}
                                    type={"number"}
                                    value={position.lat}
                                    onChange={e => setPosition({ ...position, lat: Number.parseFloat(e.target.value) })}
                                />
                                <TextField
                                    label={"Längengrad"}
                                    type={"number"}
                                    value={position.lng}
                                    onChange={e => setPosition({ ...position, lng: Number.parseFloat(e.target.value) })}
                                />
                                <TextField
                                    label={"Name*"}
                                    value={name}
                                    error={nameError}
                                    helperText={nameError ? "Der Name darf nicht leer sein!" : ""}
                                    onChange={e => {
                                        setNameError(e.target.value.trim() == "");
                                        setName(e.target.value);
                                    }
                                    } />
                            </Stack>
                        </Box>
                        <Box className="grid grid-cols-2 gap-5" justifyContent={"space-evenly"}
                             paddingBottom={"20px"} paddingX={"20px"}>
                            <Button
                                style={{ marginRight: "20px" }}
                                variant={"contained"}
                                className="button button-secondary"
                                onClick={() => {
                                    setNameError(false);
                                    setOpen(false);
                                }
                                }
                            >
                                Schließen
                            </Button>
                            <Button
                                variant={"contained"}
                                className="button button-primary"
                                onClick={() => {
                                    if (!name || !position?.lat || !position.lng) {
                                        toast.warning("Es sind noch nicht alle Werte gesetzt!");
                                        if (!name || name.trim() == "") {
                                            setNameError(true);
                                        }
                                        return;
                                    }

                                    setNameError(false);


                                    if (isCreateSpot) {
                                        createSpot({ name: name, latitude: position.lat, longitude: position.lng })
                                            .then(() => props.refetch())
                                            .then(() => setOpen(false));
                                    } else {
                                        if (!propDTO?.spotId) {
                                            toast.error("Etwas ist schief gelaufen!");
                                            return;
                                        }
                                        updateSpot({
                                            id: propDTO.spotId,
                                            name: name,
                                            latitude: position.lat,
                                            longitude: position.lng,
                                        })
                                            .then(() => props.refetch())
                                            .then(() => setOpen(false));
                                    }
                                }
                                }>
                                Bestätigen
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Modal>
        </>
    );
};
