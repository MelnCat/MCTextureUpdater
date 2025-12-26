import { mergeSheet, splitSheet } from "../../util/images";
import type { VersionDown, VersionUp } from "../Pack";

export const version = 21;
export const up: VersionUp = (conv, pack) => {
	if (pack.exists("textures/entity/bat")) {
		conv.warning("The bat model changed in 21 along with the texture mappings. Old bat textures no longer fit properly.", {
			path: "textures/entity/bat",
		});
	}
};
export const down: VersionDown = (conv, pack) => {
	if (pack.exists("textures/entity/bat")) {
		conv.warning("The bat model changed in 21 along with the texture mappings. New bat textures do not work with the old model.", {
			path: "textures/entity/bat",
		});
	}
};
