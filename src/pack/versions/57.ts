import { inRange } from "../../util/math";
import { omit } from "../../util/utils";
import { getBlockstateModels } from "../Blockstate";
import type { VersionDown, VersionUp } from "../Pack";

export const version = 57;
export const up: VersionUp = (conv, pack) => {};
export const down: VersionDown = (conv, pack) => {
	const models = pack.blockModels().filter(x => x.content.elements?.some(y => y.rotation));
	if (models.length) {
		const hasNonMultiple = models.filter(x =>
			x.content.elements?.some(y => y.rotation && "angle" in y.rotation && y.rotation.angle % 22.5 !== 0)
		);
		if (hasNonMultiple.length)
			conv.warning(`Block model rotations that aren't multiples of 22.5 are only available in 57+.`, {
				paths: hasNonMultiple,
			});
	}
};
