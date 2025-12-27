import { mergeSheet, splitSheet } from "../../util/images";
import type { VersionDown, VersionUp } from "../Pack";

export const version = 9;
export const up: VersionUp = (conv, pack) => {
};
export const down: VersionDown = (conv, pack) => {
    if ("filter" in pack.packMcMeta()) {
        conv.warning("Filter is only supported in pack.mcmeta starting in 9.");
    }
};
