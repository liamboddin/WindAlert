import { useState } from "react";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    CircularProgress,
    Grid,
    IconButton,
    Stack,
    Typography,
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

const deleteButtonStyle = {
    color: "#A11",
    padding: 0,
    "&:hover": {
        backgroundColor: "#BBB",
        color: "#A11",
    },
} as const;


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
            <Box className={"flex justify-center"}>
                <CircularProgress className={"self-center"} />
            </Box>
        </>
        : spots == undefined ? (
            <>
                <Box className={"flex justify-center pt-[20%]"}>
                    <Stack spacing={2} direction={"column"}
                           className={"w-1/5 flex justify-center pt-1/5"}>
                        <Button className={"flex justify-center"} onClick={() => refetch()}>
                            Neu laden
                        </Button>
                        <Button
                            variant={"contained"}
                            onClick={() => {
                                setIsCreateSpot(true);
                                setOpenEditSpotModal(true);
                            }}
                        >
                            Spot erstellen
                        </Button>
                    </Stack>
                </Box>
            </>
        ) : (
            <>
                <Box className={"w-full"}>
                    <Stack spacing={2} direction={"column"}
                           className={"w-full px-4 mx-auto md:w-4/5 lg:w-2/5"}
                    >
                        <Box className={"flex justify-center w-auto"}>
                            <Button
                                onClick={() => sendMail()}>
                                Manuell Wind checken
                            </Button>
                        </Box>
                        {spots.map(dto => {
                            return (
                                <Grid key={dto.spotId} container spacing={1}
                                      className={"font-[Arial] border-solid border-2 border-[#DDDDFF] p-[10px]"}>
                                    <Grid size={9}>
                                        <Typography variant={"h4"}>
                                            {dto.spotName}
                                        </Typography>
                                    </Grid>
                                    <Grid size={1.5}>
                                        <IconButton
                                            sx={deleteButtonStyle}
                                            onClick={() => {
                                                deleteSpot(dto.spotId).then(() => refetch());
                                            }}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </Grid>
                                    <Grid size={1.5}>
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
                                    </Grid>
                                    <Grid size={12}>
                                        <Typography variant={"subtitle1"}>
                                            Breitengrad: {dto.spotLatitude}
                                        </Typography>
                                    </Grid>
                                    <Grid size={12}>
                                        <Typography variant={"subtitle1"}>
                                            Längengrad: {dto.spotLongitude}
                                        </Typography>
                                    </Grid>
                                    <Grid size={12}>
                                        {dto.windows.length != 0 ?
                                            <Accordion className={"font-[Arial]"}>
                                                <AccordionSummary expandIcon={<ExpandMore />}>
                                                    <Typography variant={"h6"}>
                                                        Windfenster
                                                    </Typography>
                                                </AccordionSummary>
                                                <AccordionDetails>
                                                    <Stack>
                                                        {dto.windows.map(window =>
                                                            (
                                                                <Grid key={window.windWindowId} container spacing={1}
                                                                      className={"py-[20px] border-t-2 border-[#DDDDFF]"}>
                                                                    <Grid size={9}>
                                                                        <Typography variant={"subtitle1"}>
                                                                            Windgeschwindigkeit: {window.speed} Knoten
                                                                        </Typography>
                                                                    </Grid>
                                                                    <Grid size={1.5}>
                                                                        <IconButton
                                                                            sx={deleteButtonStyle}
                                                                            onClick={() => {
                                                                                deleteWindWindow(window.windWindowId).then(() => refetch());
                                                                            }}>
                                                                            <DeleteIcon />
                                                                        </IconButton>
                                                                    </Grid>
                                                                    <Grid size={1.5}>
                                                                        <IconButton
                                                                            color={"primary"}
                                                                            sx={{ padding: 0 }}
                                                                            onClick={async () => {
                                                                                setIsCreateWindow(false);
                                                                                setSelectedSpot(dto);
                                                                                setSelectedWindow(window);
                                                                                setOpenEditWindowModal(true);
                                                                            }}><EditIcon /></IconButton>
                                                                    </Grid>
                                                                    <Grid size={12}>
                                                                        <Typography variant={"subtitle1"}>
                                                                            Startwinkel: {window.startAngle}
                                                                        </Typography>
                                                                    </Grid>
                                                                    <Grid size={12}>
                                                                        <Typography variant={"subtitle1"}>
                                                                            Endwinkel: {window.endAngle}
                                                                        </Typography>
                                                                    </Grid>
                                                                </Grid>
                                                            ))}
                                                        <Button
                                                            className={"mt-[10px]"}
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
                                    </Grid>
                                </Grid>);
                        })}
                        <Box className={"flex justify-center w-auto"}>
                            <Button
                                variant={"contained"}
                                onClick={() => {
                                    setIsCreateSpot(true);
                                    setOpenEditSpotModal(true);
                                }}>
                                Spot erstellen
                            </Button>
                        </Box>
                    </Stack>
                    <EditSpotModal open={openEditSpotModal} setOpen={setOpenEditSpotModal} dto={selectedSpot}
                                   isCreateSpot={isCreateSpot} refetch={refetch} />
                    {selectedSpot && (
                        <EditWindowModal open={openEditWindowModal} setOpen={setOpenEditWindowModal}
                                         spot={selectedSpot} dto={selectedWindow} refetch={refetch}
                                         isCreateWindow={isCreateWindow} />
                    )}
                </Box>
            </>);
};

export default Home;