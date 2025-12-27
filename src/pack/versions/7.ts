import { mergeSheet, splitSheet } from "../../util/images";
import type { VersionDown, VersionUp } from "../Pack";

export const version = 7;
export const up: VersionUp = (conv, pack) => {
    if (pack.rename("textures/block/grass_path_side", "textures/block/dirt_path_side")) {
        conv.info("textures/block/grass_path_side was renamed to dirt_path_side in 7.", {
            path: "textures/block/dirt_path_side"
        })
    }
    if (pack.rename("textures/block/grass_path_top", "textures/block/dirt_path_top")) {
        conv.info("textures/block/grass_path_top was renamed to dirt_path_top in 7.", {
            path: "textures/block/dirt_path_top"
        })
    }
    if (pack.exists("textures/gui/container/gamemode_switcher")) {
        conv.urgent("textures/gui/container/gamemode_switcher changed layout in 7.", {
            path: "textures/gui/container/gamemode_switcher"
        })
    }
};
export const down: VersionDown = (conv, pack) => {
    if (pack.rename("textures/block/dirt_path_side", "textures/block/grass_path_side")) {
        conv.info("textures/block/grass_path_side was renamed to dirt_path_side in 7.", {
            path: "textures/block/grass_path_side"
        })
    }
    if (pack.rename("textures/block/dirt_path_top", "textures/block/grass_path_top")) {
        conv.info("textures/block/grass_path_top was renamed to dirt_path_top in 7.", {
            path: "textures/block/grass_path_top"
        })
    }
    if (pack.exists("textures/gui/container/gamemode_switcher")) {
        conv.urgent("textures/gui/container/gamemode_switcher changed layout in 7.", {
            path: "textures/gui/container/gamemode_switcher"
        })
    }
};
