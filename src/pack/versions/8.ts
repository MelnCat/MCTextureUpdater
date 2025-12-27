import { mergeSheet, splitSheet } from "../../util/images";
import type { VersionDown, VersionUp } from "../Pack";

export const version = 8;
export const up: VersionUp = (conv, pack) => {
    if (pack.exists("textures/gui/container/inventory")) {
        conv.urgent("textures/gui/container/inventory has an extra sprite for compact effects in 8.")
    }
};
export const down: VersionDown = (conv, pack) => {
};
