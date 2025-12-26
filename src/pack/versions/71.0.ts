import { inRange } from "../../util/math";
import { omit } from "../../util/utils";
import { getBlockstateModels } from "../Blockstate";
import type { VersionDown, VersionUp } from "../Pack";

export const version = 71;
export const up: VersionUp = (conv, pack) => {
	const darkenedCutout = pack.mcMetas().filter(x => x.content.texture && "darkened_cutout_mipmap" in x.content.texture);
	if (darkenedCutout.length) {
		for (const meta of darkenedCutout) {
			pack.updateMcMeta(meta.path, x => ({
				...x,
				texture: {
					...omit(x.texture!, "darkened_cutout_mipmap"),
					mipmap_strategy: x.texture!.darkened_cutout_mipmap ? "dark_cutout" : "auto",
				},
			}));
		}
		conv.info(`McMeta texture.darkened_cutout_mipmap has been replaced with texture.mipmap_strategy in 71.0+.`, {
			paths: darkenedCutout,
		});
	}
};
export const down: VersionDown = (conv, pack) => {
	const mipmapStrategy = pack.mcMetas().filter(x => x.content.texture && "mipmap_strategy" in x.content.texture);
	if (mipmapStrategy.length) {
		for (const meta of mipmapStrategy) {
			if (meta.content.texture!.mipmap_strategy !== "dark_cutout" && meta.content.texture!.mipmap_strategy !== "auto") {
				pack.updateMcMeta(meta.path, x => ({
					...x,
					texture: {
						...omit(x.texture!, "mipmap_strategy"),
						darkened_cutout_mipmap: x.texture!.mipmap_strategy === "dark_cutout",
					},
				}));
				conv.info(`McMeta texture.mipmap_strategy did not exist before 71.0. Uses have been replaced with texture.darkened_cutout_mipmap.`, {
					path: meta.path,
				});
			} else {
				pack.updateMcMeta(meta.path, x => ({
					...x,
					texture: {
						...omit(x.texture!, "mipmap_strategy"),
					},
				}));
				conv.warning(`McMeta texture.mipmap_strategy did not exist before 71.0.`, { path: meta.path });
			}
		}
	}

	if (pack.image("textures/block/beacon")?.hasFeature("translucency")) {
		conv.warning(`Beacons only support translucency in 71.0+<74.0. Consider editing the texture.`, {
			path: "textures/block/beacon",
		});
	}
	const redstoneDust = ["redstone_dust_dot", "redstone_dust_line0", "redstone_dust_line1", "redstone_dust_overlay"];
	for (const path of redstoneDust) {
		if (pack.image(`textures/block/${path}`)?.hasFeature("translucency")) {
			conv.warning(`Redstone dust only supports translucency in 71.0+<74.0. Consider editing the texture.`, {
				path: `textures/block/${path}`,
			});
		}
	}
};
