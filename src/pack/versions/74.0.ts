import { inRange } from "../../util/math";
import { getBlockstateModels } from "../Blockstate";
import type { VersionDown, VersionUp } from "../Pack";

export const version = 74;
export const up: VersionUp = (conv, pack) => {
	if (pack.image("textures/block/beacon")?.hasFeature("translucency")) {
		conv.warning(`Beacons no longer support translucency in 74.0. Consider editing the texture.`, {
			path: "textures/block/beacon",
		});
	}
};
export const down: VersionDown = (conv, pack) => {
	const models = pack
		.blockModels()
		.filter(x => x.content.elements?.some(y => y.rotation && ("x" in y.rotation || "y" in y.rotation || "z" in y.rotation)));
	if (models.length) {
		const hasFixable = models.filter(x =>
			x.content.elements?.some(y => y.rotation && ["x", "y", "z"].filter(z => z in y.rotation!).length === 1)
		);
		const multiAxis = models.filter(x =>
			x.content.elements?.some(y => y.rotation && ["x", "y", "z"].filter(z => z in y.rotation!).length > 1)
		);
		if (multiAxis.length)
			conv.warning(`Multi-axis block model rotation is only supported on 74.0+.`, {
				paths: multiAxis,
			});
		const outOfRange = models.filter(x =>
			x.content.elements?.some(
				y =>
					y.rotation &&
					(("x" in y.rotation && !inRange(y.rotation.x!, -45, 45)) ||
						("y" in y.rotation && !inRange(y.rotation.y!, -45, 45)) ||
						("z" in y.rotation && !inRange(y.rotation.z!, -45, 45)) ||
						("angle" in y.rotation && !inRange(y.rotation.angle!, -45, 45)))
			)
		);
		if (outOfRange.length)
			conv.warning(`Block model rotations outside of [-45, 45] are only supported on 74.0+.`, {
				paths: outOfRange,
			});

		for (const fixable of hasFixable) {
			pack.updateBlockModel(fixable.path, m => ({
				...m,
				elements: m.elements?.map(e =>
					e.rotation && ["x", "y", "z"].filter(z => z in e.rotation!).length === 1
						? {
								...e,
								rotation: {
									origin: e.rotation!.origin,
									axis: "x" in e.rotation ? "x" : "y" in e.rotation ? "y" : "z",
									angle:
										"x" in e.rotation
											? e.rotation.x
											: "y" in e.rotation
											? e.rotation.y
											: "z" in e.rotation
											? e.rotation.z
											: 0,
									...(e.rotation.rescale ? { rescale: e.rotation.rescale } : null),
								},
						  }
						: e
				),
			}));
		}
		conv.info(`Downgraded block model rotation format.`, { paths: hasFixable });
	}
	const blockstates = pack.blockstates();
	const zRotation = blockstates.filter(x => getBlockstateModels(x.content).some(x => "z" in x));
	if (zRotation.length) conv.warning(`Z rotation in blockstates is only supported in 74.0+.`, { paths: zRotation });
};
