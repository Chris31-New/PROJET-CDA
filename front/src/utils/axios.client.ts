import type { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import axios from "axios";
import { useAuthStore } from "../store/auth.store";
import { AuthApi } from "../services/api/auth.api";

//Verrou qui sert à éviter plusieurs refresh en parallèle
let refreshPromise: Promise<string> | null = null;

function axiosClient(): AxiosInstance{
const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}`,
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    const {accessToken} = useAuthStore.getState();

    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
});

api.interceptors.response.use((res) => res,

async (error) => {
    if (error.response?.status === 429) {
        const retryAfter = error.response.headers['retry-after'];
        const seconds = retryAfter ? parseInt(retryAfter, 10) : 60;
        return Promise.reject(
            new Error( `Too many requests. Please try again after ${seconds} seconds.`)
        );
   }

   const originalRequest = error.config as InternalAxiosRequestConfig & {
    _retry?: boolean;
   }

    if ( error.response?.status === 401) {

        // Empêche une même requête de retenter plusieurs fois
        if (originalRequest._retry) return Promise.reject(error);
        originalRequest._retry = true;

        try {
            
            //Si aucun refresh n'est en cours, on en crée un
            if (!refreshPromise) {
                refreshPromise = AuthApi.refresh()
                    .then((refreshResponse) => {
                        const newAccessToken = refreshResponse.accessToken;
                        const newUser = refreshResponse.user;
                        const {setAccessToken, setUser} = useAuthStore.getState();
                        setAccessToken(newAccessToken);
                        setUser(newUser);

                        //renvoie du nouveau token pour les autres requêtes
                        return newAccessToken;
                    })
                    .finally(() => {
                        //on libère le verou dès que la requête est finie
                        refreshPromise = null;
                    })
            }

            // Chaque nouvelle requête attend ici si un refresh est déjà en cours
            const newAccessToken = await refreshPromise;

            //Sécurité de l'objet header avant de le modifier
            originalRequest.headers = originalRequest.headers ?? {};
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return api(originalRequest);
        } catch (refreshError) {
            useAuthStore.getState().clearAuth();
            window.location.href = "/signin";
            return Promise.reject(refreshError);
        }

}

    return Promise.reject(error);
});

return api;

}

export const api = axiosClient();
