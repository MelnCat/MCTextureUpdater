import type { VersionDown, VersionUp } from "../Pack";

export const version = 15;
export const up: VersionUp = (conv, pack) => {
    if (pack.exists("textures/gui/title/minecraft")) {
        conv.urgent("textures/gui/title/minecraft has a different incompatible format after 15.",
            { path: "textures/gui/title/minecraft" }
        )
    }
    if (pack.exists("realms:textures/gui/realms/invite_icon")) {
        conv.urgent("realms:textures/gui/realms/invite_icon has a different incompatible format after 15.",
            { path: "realms:textures/gui/realms/invite_icon" }
        )
    }
};
export const down: VersionDown = (conv, pack) => {
    if (pack.exists("textures/gui/title/minecraft")) {
        conv.urgent("textures/gui/title/minecraft had a different incompatible format before 15.",
            { path: "textures/gui/title/minecraft" }
        )
    }
    if (pack.exists("realms:textures/gui/realms/invite_icon")) {
        conv.urgent("realms:textures/gui/realms/invite_icon had a different incompatible format before 15.",
            { path: "realms:textures/gui/realms/invite_icon" }
        )
    }
};
