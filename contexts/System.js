import { useContext } from "react";
import { createContext } from 'react';

const SystemContext = createContext();

export default function System({ children, value }) {
    return <SystemContext.Provider value={value}>{children}</SystemContext.Provider>;
}

export function useSystem() {
    return useContext(SystemContext);
};