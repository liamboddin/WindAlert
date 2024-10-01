import { toast } from "react-toastify";

export const get = async <T>(url: string, acceptHeader = "application/json"): Promise<T> => {
    const headers: Headers = new Headers();
    headers.set("Accept", acceptHeader);
    const response = await fetch(url, { headers });
    return await convertApiResponse(response);
};

export const post = async <T>(url: string, body: unknown): Promise<T> => {
    const headers: Headers = new Headers();
    headers.set("Content-Type", "application/json");
    headers.set("Accept", "application/json");
    const response: Response = await fetch(url, { method: "POST", headers: headers, body: JSON.stringify(body) });
    return await convertApiResponse(response);
};

export const put = async <T>(url: string, body: unknown): Promise<T> => {
    const headers: Headers = new Headers();
    headers.set("Content-Type", "application/json");
    headers.set("Accept", "application/json");
    const response: Response = await fetch(url, { method: "PUT", headers: headers, body: JSON.stringify(body) });
    return await convertApiResponse(response);
};

export const deleteRequest = async <T>(url: string): Promise<T> => {
    const headers: Headers = new Headers();
    headers.set("Content-Type", "application/json");
    headers.set("Accept", "application/json");
    const response: Response = await fetch(url, { method: "DELETE", headers: headers });
    return await convertApiResponse(response);
};
const convertApiResponse = async <T>(response: Response): Promise<T> => {
    if (response.status >= 400) {
        toast.error(response.status);
        return Promise.reject(response);
    }
    let body;
    try {
        body = await response.json();
    } catch (e) {
        body = "{}";
    }
    return await body as T;
};