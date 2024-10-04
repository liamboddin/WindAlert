import { CreateSpotDTO } from "../dto/CreateSpotDTO";
import { SpotDTO } from "../dto/SpotDTO";
import { WindWindowDTO } from "../dto/WindWIndowDTO";
import { deleteRequest, get, post, put } from "./restApi";
import { InfoDTO } from "../dto/InfoDTO.ts";

export const getSpotInfo = async (): Promise<InfoDTO[]> => {
    return await get("/api/v1/spot");
};

export const createSpot = async (createSpotDTO: CreateSpotDTO): Promise<SpotDTO> => {
    return await post("/api/v1/spot", createSpotDTO);
};

export const updateSpot = async (updateSpotDTO: SpotDTO): Promise<SpotDTO> => {
    return await put("/api/v1/spot", updateSpotDTO);
};

export const deleteSpot = async (id: number): Promise<void> => {
    return await deleteRequest("/api/v1/spot/" + id);
};

export const createWindWindow = async (createWindWindowDTO: WindWindowDTO): Promise<WindWindowDTO> => {
    return await post("/api/v1/window", createWindWindowDTO);
};

export const updateWindWindow = async (updateWindWindowDTO: WindWindowDTO): Promise<WindWindowDTO> => {
    return await put("/api/v1/window", updateWindWindowDTO);
};

export const deleteWindWindow = async (id: number): Promise<void> => {
    return await deleteRequest("/api/v1/window/" + id);
};

export const setPasswordRequest = async (uuid: string, password: string): Promise<void> => {
    return await post("/api/v1/reset-password", { uuid: uuid, password: password });
};

export const login = async (username: string, password: string): Promise<void> => {
    return await post("/api/v1/login", { username: username, password: password });
};
