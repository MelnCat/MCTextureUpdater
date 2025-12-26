import { inRange } from "../../util/math";
import { omit } from "../../util/utils";
import { getBlockstateModels } from "../Blockstate";
import type { VersionDown, VersionUp } from "../Pack";

export const version = 60;
export const up: VersionUp = (conv, pack) => {
    // maybe check panoramas
};
export const down: VersionDown = (conv, pack) => {
};
