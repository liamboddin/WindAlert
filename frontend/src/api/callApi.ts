import { CreateSpotDTO } from "../dto/CreateSpotDTO";
import { SpotDTO } from "../dto/SpotDTO";
import { WindWindowDTO } from "../dto/WindWIndowDTO";
import { deleteRequest, get, post, put } from "./restApi";
import { InfoDTO, TokenDTO } from "../dto/InfoDTO.ts";

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

export const register = async (username: string) => {
    return await post("/api/v1/register", { username: username, baseUrl: window.location.origin });
};

export const resetPassword = async (username: string) => {
    return await post("/api/v1/password-reset", { username: username, baseUrl: window.location.origin });
};

export const login = async (username: string, password: string): Promise<TokenDTO> => {
    return await post("/api/v1/login", { username: username, password: password });
};

export const sendMail = async (): Promise<void> => {
    return await post("/api/v1/check-wind", {});
};

export const activateAccount = async (token: string, password: string): Promise<void> => {
    return await post("/api/v1/activate", { token: token, password: password });
};