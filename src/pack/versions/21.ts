import { mergeSheet, splitSheet } from "../../util/images";
import type { VersionDown, VersionUp } from "../Pack";


export const version = 21;
export const up: VersionUp = (conv, pack) => {
	const nonPng = pack.images().filter(x => !x.path.endsWith(".png"))
	if (nonPng.length) conv.warning(`Only PNG format images are supported starting in 21.`, {
		paths: nonPng
	})
};
export const down: VersionDown = (conv, pack) => {
};
