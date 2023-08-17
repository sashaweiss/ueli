import { ReactElement } from "react";
import { Appearance } from "./Appearance";
import { General } from "./General";
import { SearchEngine } from "./SearchEngine";
import { Window } from "./Window";

export type SettingsPage = {
    label: string;
    absolutePath: string;
    relativePath: string;
    element: ReactElement;
};

export const settingsPages: SettingsPage[] = [
    {
        label: "General",
        relativePath: "general",
        absolutePath: "/settings/general",
        element: <General />,
    },
    {
        label: "Window",
        relativePath: "window",
        absolutePath: "/settings/window",
        element: <Window />,
    },
    {
        label: "Appearance",
        relativePath: "appearance",
        absolutePath: "/settings/appearance",
        element: <Appearance />,
    },
    {
        label: "Search Engine",
        relativePath: "search-engine",
        absolutePath: "/settings/search-engine",
        element: <SearchEngine />,
    },
];
