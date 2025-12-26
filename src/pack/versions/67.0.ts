import { inRange } from "../../util/math";
import { omit } from "../../util/utils";
import { getBlockstateModels } from "../Blockstate";
import type { VersionDown, VersionUp } from "../Pack";

export const version = 67;
export const up: VersionUp = (conv, pack) => {
    if (pack.rename("textures/block/chain", "textures/block/iron_chain")) {
        conv.info(`textures/block/chain was renamed to iron_chain in 67.0`)
    }
};
export const down: VersionDown = (conv, pack) => {
    if (pack.rename("textures/block/iron_chain", "textures/block/chain")) {
        conv.info(`textures/block/chain was renamed to iron_chain in 67.0`)
    }
};
