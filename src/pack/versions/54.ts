import { inRange } from "../../util/math";
import { omit } from "../../util/utils";
import { getBlockstateModels } from "../Blockstate";
import type { VersionDown, VersionUp } from "../Pack";

export const version = 54;
export const up: VersionUp = (conv, pack) => {
	if (pack.rename("textures/misc/enchanted_glint_entity", "textures/misc/enchanted_glint_armor")) {
		conv.info(`textures/misc/enchanted_glint_entity was renamed to enchanted_glint_armor in 56.0`);
	}
};
export const down: VersionDown = (conv, pack) => {
	if (pack.rename("textures/misc/enchanted_glint_armor", "textures/misc/enchanted_glint_entity")) {
		conv.info(`textures/misc/enchanted_glint_armor was renamed to enchanted_glint_entity in 56.0`);
	}
};
