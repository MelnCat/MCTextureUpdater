import { mergeSheet, splitSheet } from "../../util/images";
import type { VersionDown, VersionUp } from "../Pack";


export const version = 22;
export const up: VersionUp = (conv, pack) => {
	if (pack.rename("textures/block/grass", "textures/block/short_grass")) {
		conv.info(`textures/block/grass was renamed to short_grass in 22`);
	}
	if (pack.rename("textures/item/grass", "textures/item/short_grass")) {
		conv.info(`textures/item/grass was renamed to short_grass in 22`);
	}
};
export const down: VersionDown = (conv, pack) => {
	if (pack.rename("textures/block/short_grass", "textures/block/grass")) {
		conv.info(`textures/block/grass was renamed to short_grass in 22`);
	}
	if (pack.rename("textures/item/short_grass", "textures/item/grass")) {
		conv.info(`textures/item/grass was renamed to short_grass in 22`);
	}
};
