import { create } from "zustand";
import type { User } from "../interfaces/user";

export type AuthStatus = "guest" | "loading" | "auth";

type AuthState = {
    status: AuthStatus;
    user: User | null;
    accessToken: string | null;
    lastError: string | null;

    // state setters
    setUser: (data: User | null) => void;
    setAccessToken: (accessToken: string | null) => void;
    clearAuth: () => void;
}

/**
 * Store global d'authentification
 *
 * Ce store centralise :
 * - l'utilisateur connecté
 * - l'accessToken JWT
 * - l'état de connexion
 */
export const useAuthStore = create<AuthState>((set) => {
    /**
     * Fonction utilitaire interne
     * Applique une réponse d'authentification du backend
     * (login ou refresh token)
     */

    return {
        /**
         * Etat initial
         */
        status: "guest",
        user: null,
        accessToken: null,
        lastError: null,

        /**
         * Met à jour l'utilisateur dans le store
         */
        setUser: (data) => set({ user: data }),

        /**
         * Met à jour l'accessToken dans le store
         */
        setAccessToken: (accessToken) => set({ accessToken }),

        /**
         * Réinitialise totalement l'état d'authentification
         * (utilisé lors du logout ou si le refresh token échoue)
         */
        clearAuth: () =>
            set({
                status: "guest",
                accessToken: null,
                user: null,
                lastError: null,
            }),
    }
})