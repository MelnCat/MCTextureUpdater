import { omit } from "../../util/utils";
import type { VersionDown, VersionUp } from "../Pack";

export const version = 75;
export const up: VersionUp = (conv, pack) => {
	if (pack.exists("textures/item/leather_horse_armor"))
		conv.warning(
			`In 75.0+, leather horse armor can be split into two layers. Consider splitting your textures/item/leather_horse_armor into \
textures/item/leather_horse_armor and textures/item/leather_horse_armor_overlay.`,
			{
				path: "textures/item/leather_horse_armor_overlay",
			}
		);
};
export const down: VersionDown = (conv, pack) => {
	const alphaCutoffBias = pack.mcMetas().filter(x => x.content.texture && "alpha_cutoff_bias" in x.content.texture)
	if (alphaCutoffBias.length) {
        for (const meta of alphaCutoffBias) {
            pack.updateMcMeta(meta.path, x => ({ ...x, texture: omit(x.texture!, "alpha_cutoff_bias")}))
        }
		conv.warning(`McMeta texture.alpha_cutoff_bias is a 75.0 feature. Uses have been removed.`, { paths: alphaCutoffBias });
	}
	if (pack.exists("textures/item/leather_horse_armor_overlay")) {
		pack.updateModel(
			"model/item/leather_horse_armor",
			m => ({
				...m,
				textures: {
					...m.textures,
					layer1: "minecraft:item/leather_horse_armor_overlay",
				},
			}),
			{
				parent: "minecraft:item/generated",
				textures: {
					layer0: "minecraft:item/leather_horse_armor",
					layer1: "minecraft:item/leather_horse_armor_overlay",
				},
			}
		);
		conv.info(
			`textures/item/leather_horse_armor_overlay is only natively supported in 75.0+.
models/item/leather_horse_armor has been updated.`,
			{ path: "textures/item/leather_horse_armor_overlay" }
		);
	}
};
