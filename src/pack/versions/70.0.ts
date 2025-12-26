import { inRange } from "../../util/math";
import { omit } from "../../util/utils";
import { getBlockstateModels } from "../Blockstate";
import type { VersionDown, VersionUp } from "../Pack";

export const version = 70;
export const up: VersionUp = (conv, pack) => {
};
export const down: VersionDown = (conv, pack) => {
	const redstoneDust = ["glass", "glass_pane_top"];
	for (const path of redstoneDust) {
		if (pack.image(`textures/block/${path}`)?.hasFeature("translucency")) {
			conv.warning(`Glass and glass panes only support translucency in 70.0+. Consider editing the texture.`, {
				path: `textures/block/${path}`,
			});
		}
	}
};
