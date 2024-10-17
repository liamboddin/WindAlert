import { useState } from "react";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    CircularProgress,
    Grid2,
    IconButton,
    Stack,
} from "@mui/material";
import { deleteSpot, deleteWindWindow, getSpotInfo, sendMail } from "../api/callApi";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { InfoDTO, WindWindow } from "../dto/InfoDTO.ts";
import { Add, ExpandMore } from "@mui/icons-material";
import { EditSpotModal } from "../forms/EditSpotModal.tsx";
import { EditWindowModal } from "../forms/EditWindowModal.tsx";
import { useQuery } from "@tanstack/react-query";
import queryKeys from "../api/queryKeys.ts";

const useSpotInfoQuery = () => {
    return useQuery<InfoDTO[]>({
        queryKey: queryKeys.spots,
        queryFn: () => getSpotInfo(),
        retry: false,
        refetchOnWindowFocus: true,
    });
};

export const Home = () => {
    const { data: spots, refetch, isFetching } = useSpotInfoQuery();
    const [openEditSpotModal, setOpenEditSpotModal] = useState<boolean>(false);
    const [openEditWindowModal, setOpenEditWindowModal] = useState<boolean>(false);
    const [selectedSpot, setSelectedSpot] = useState<InfoDTO>();
    const [selectedWindow, setSelectedWindow] = useState<WindWindow>();
    const [isCreateSpot, setIsCreateSpot] = useState(true);
    const [isCreateWindow, setIsCreateWindow] = useState(true);

    return isFetching ?
        <>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
                <CircularProgress style={{ alignSelf: "center" }} />
            </Box>
        </>
        : spots == undefined ? (
            <>
                <Box sx={{ width: "20%", display: "center", justifyContent: "left", paddingTop: "20%" }}>
                    <Stack spacing={2} direction={"column"}
                           sx={{ width: "20%", display: "center", justifyContent: "center", paddingTop: "20%" }}>
                        <Button sx={{ display: "center", justifyContent: "center" }} onClick={() => refetch()}>
                            Neu laden
                        </Button>
                        <Button
                            variant={"contained"}
                            onClick={() => {
                                setIsCreateSpot(true);
                                setOpenEditSpotModal(true);
                            }
                            }
                        >
                            Spot erstellen
                        </Button>
                    </Stack>
                </Box>
            </>
        ) : (
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
                               width: "30%",
                           }}>
                        <Box sx={{ display: "flex", justifyContent: "center", width: "auto" }}>
                            <Button
                                onClick={() => sendMail()}>
                                Manuell Wind checken
                            </Button>
                        </Box>
                        {spots.map(dto => {
                            return <>
                                <Grid2 container spacing={1}
                                       sx={{
                                           fontFamily: "Arial",
                                           borderStyle: "solid",
                                           borderWidth: "2px",
                                           borderColor: "#DDDDFF",
                                           padding: "10px",
                                       }}>
                                    <Grid2 size={9} sx={{ fontSize: "20px", fontWeight: "bold" }}>
                                        {dto.spotName}
                                    </Grid2>
                                    <Grid2 size={1.5}>
                                        <IconButton
                                            sx={{ color: "#FF4444", padding: "0" }}
                                            onClick={() => {
                                                deleteSpot(dto.spotId).then(() => refetch());
                                            }}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </Grid2>
                                    <Grid2 size={1.5}>
                                        <IconButton
                                            color={"primary"}
                                            sx={{ padding: 0 }}
                                            onClick={() => {
                                                setIsCreateSpot(false);
                                                setSelectedSpot(dto);
                                                setOpenEditSpotModal(true);
                                            }}>
                                            <EditIcon />
                                        </IconButton>
                                    </Grid2>
                                    <Grid2 size={12}>
                                        Breitengrad: {dto.spotLatitude}
                                    </Grid2>
                                    <Grid2 size={12}>
                                        Längengrad: {dto.spotLongitude}
                                    </Grid2>
                                    <Grid2>
                                        {dto.windows.length != 0 ?
                                            <Accordion sx={{ fontFamily: "Arial" }}>
                                                <AccordionSummary
                                                    expandIcon={<ExpandMore />}
                                                    sx={{ fontSize: "19px" }}
                                                >Windfenster</AccordionSummary>
                                                <AccordionDetails>
                                                    <Stack>
                                                        {dto.windows.map(window =>
                                                            <>
                                                                <Grid2 container spacing={1}
                                                                       sx={{
                                                                           paddingTop: "20px",
                                                                           borderStyle: "solid none none none",
                                                                           borderWidth: "2px",
                                                                           borderColor: "#DDDDFF",
                                                                           paddingBottom: "20px",
                                                                       }}>
                                                                    <Grid2 size={9}>
                                                                        Windgeschwindigkeit: {window.speed} Knoten
                                                                    </Grid2>
                                                                    <Grid2 size={1.5}>
                                                                        <IconButton
                                                                            sx={{ color: "#FF4444", padding: "0" }}
                                                                            onClick={() => {
                                                                                deleteWindWindow(window.windWindowId).then(() => refetch());
                                                                            }
                                                                            }>
                                                                            <DeleteIcon />
                                                                        </IconButton>
                                                                    </Grid2>
                                                                    <Grid2 size={1.5}>
                                                                        <IconButton
                                                                            color={"primary"}
                                                                            sx={{ padding: 0 }}
                                                                            onClick={async () => {
                                                                                setIsCreateWindow(false);
                                                                                setSelectedSpot(dto);
                                                                                setSelectedWindow(window);
                                                                                setOpenEditWindowModal(true);
                                                                            }}><EditIcon /></IconButton>
                                                                    </Grid2>
                                                                    <Grid2 size={12}>
                                                                        Startwinkel: {window.startAngle}
                                                                    </Grid2>
                                                                    <Grid2 size={12}>
                                                                        Endwinkel: {window.endAngle}
                                                                    </Grid2>
                                                                </Grid2>
                                                            </>)}
                                                        <Button
                                                            sx={{ marginTop: "10px" }}
                                                            variant="outlined"
                                                            startIcon={<Add />}
                                                            onClick={() => {
                                                                setIsCreateWindow(true);
                                                                setSelectedSpot(dto);
                                                                setOpenEditWindowModal(true);
                                                            }}
                                                        >Windfenster hinzufügen</Button>
                                                    </Stack>
                                                </AccordionDetails>
                                            </Accordion> :
                                            <Button
                                                variant="outlined"
                                                startIcon={<Add />}
                                                onClick={() => {
                                                    setIsCreateWindow(true);
                                                    setSelectedSpot(dto);
                                                    setOpenEditWindowModal(true);
                                                }}
                                            >Windfenster hinzufügen</Button>}
                                    </Grid2>
                                </Grid2>
                            </>;
                        })}
                        <Box sx={{ display: "flex", justifyContent: "center", width: "auto" }}>
                            <Button

                                variant={"contained"}
                                onClick={() => {
                                    setIsCreateSpot(true);
                                    setOpenEditSpotModal(true);
                                }
                                }
                            >
                                Spot erstellen
                            </Button>
                        </Box>
                    </Stack>
                </Box>

                <EditSpotModal open={openEditSpotModal} setOpen={setOpenEditSpotModal} dto={selectedSpot}
                               isCreateSpot={isCreateSpot} refetch={refetch} />
                {
                    selectedSpot &&
                    (<>
                        <EditWindowModal open={openEditWindowModal} setOpen={setOpenEditWindowModal}
                                         spot={selectedSpot} dto={selectedWindow} refetch={refetch}
                                         isCreateWindow={isCreateWindow} />
                    </>)
                }

            </>);
};

export default Home;