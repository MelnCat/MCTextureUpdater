import { inRange } from "../../util/math";
import { omit } from "../../util/utils";
import { getBlockstateModels } from "../Blockstate";
import type { VersionDown, VersionUp } from "../Pack";

export const version = 53;
export const up: VersionUp = (conv, pack) => {
	if (pack.exists("textures/item/spawn_egg") || pack.exists("textures/item/spawn_egg_overlay")) {
		conv.warning(`Spawn egg textures have been updated in 53. textures/item/spawn_egg annd spawn_egg_overlay are no longer used.`, {
			paths: [
				...(pack.exists("textures/item/spawn_egg") ? ["textures/item/spawn_egg"] : []),
				...(pack.exists("textures/item/spawn_egg_overlay") ? ["textures/item/spawn_egg_overlay"] : []),
			],
		});
	}
};
export const down: VersionDown = (conv, pack) => {
	const spawnEggs = pack.images().filter(x => x.path.match(/textures\/item\/\w+_spawn_egg/));
	if (spawnEggs.length) {
		conv.warning(
			`Spawn egg textures were updated in 53. textures/item/spawn_egg annd spawn_egg_overlay should be used for versions before 53.`,
			{ paths: spawnEggs }
		);
	}
};
