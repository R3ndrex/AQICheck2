"use client";
import { createContext, useContext } from "react";

export const UserLocationContext = createContext(null);
export function useUserLocation() {
    return useContext(UserLocationContext);
}
