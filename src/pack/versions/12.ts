import { mergeSheet, splitSheet } from "../../util/images";
import type { VersionDown, VersionUp } from "../Pack";

export const version = 12;
export const up: VersionUp = (conv, pack) => {
	if (pack.exists("textures/entity/vex")) {
		conv.urgent("The vex model changed in 12 along with the texture mappings. Old bat textures no longer fit properly.", {
			path: "textures/entity/bat",
		});
	}
    if (pack.exists("textures/gui/container/creative_inventory/tabs")) {
		conv.urgent("textures/gui/container/creative_inventory/tabs changed size in 12.", {
			path: "textures/gui/container/creative_inventory/tabs",
		});
    }
};
export const down: VersionDown = (conv, pack) => {
	if (pack.exists("textures/entity/vex")) {
		conv.urgent("The vex model changed in 12 along with the texture mappings. New bat textures do not work with the old model.", {
			path: "textures/entity/bat",
		});
	}
    if (pack.exists("textures/gui/container/creative_inventory/tabs")) {
		conv.urgent("textures/gui/container/creative_inventory/tabs changed size in 12.", {
			path: "textures/gui/container/creative_inventory/tabs",
		});
    }
};
