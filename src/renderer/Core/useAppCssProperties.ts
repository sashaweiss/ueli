import type { OperatingSystem } from "@common/Core";
import { useEffect, useState, type CSSProperties } from "react";
import { useContextBridge } from "./Hooks";

const getMacOsCssProperties = (vibrancy: string): CSSProperties =>
    vibrancy === "None" ? {} : { background: "transparent" };

const getWindowsCssProperties = (backgroundMaterial: string): CSSProperties => ({
    background: backgroundMaterial === "None" ? undefined : "transparent",
});

export const useAppCssProperties = () => {
    const { contextBridge } = useContextBridge();

    const operatingSystem = contextBridge.getOperatingSystem();

    const extendGlobalStyles = (cssProperties: CSSProperties) => ({ ...{ height: "100vh" }, ...cssProperties });

    const initialProperties: Record<OperatingSystem, CSSProperties> = {
        Linux: extendGlobalStyles({}),
        macOS: extendGlobalStyles(getMacOsCssProperties(contextBridge.getSettingValue("window.vibrancy", "None"))),
        Windows: extendGlobalStyles(
            getWindowsCssProperties(contextBridge.getSettingValue("window.backgroundMaterial", "Mica")),
        ),
    };

    const [appCssProperties, setAppCssProperties] = useState<CSSProperties>(initialProperties[operatingSystem]);

    useEffect(() => {
        if (operatingSystem === "Windows") {
            contextBridge.ipcRenderer.on(
                "settingUpdated[window.backgroundMaterial]",
                (_, { value }: { value: string }) => {
                    setAppCssProperties(extendGlobalStyles(getWindowsCssProperties(value)));
                },
            );
        }

        if (operatingSystem === "macOS") {
            contextBridge.ipcRenderer.on("settingUpdated[window.vibrancy]", (_, { value }: { value: string }) => {
                setAppCssProperties(extendGlobalStyles(getMacOsCssProperties(value)));
            });
        }
    }, []);

    return { appCssProperties };
};
