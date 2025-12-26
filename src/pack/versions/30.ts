import { mergeSheet, splitSheet } from "../../util/images";
import type { VersionDown, VersionUp } from "../Pack";

const icons = [
	"player",
	"frame",
	"red_marker",
	"blue_marker",
	"target_x",
	"target_point",
	"player_off_map",
	"player_off_limits",
	"woodland_mansion",
	"ocean_monument",
	"white_banner",
	"orange_banner",
	"magenta_banner",
	"light_blue_banner",
	"yellow_banner",
	"lime_banner",
	"pink_banner",
	"gray_banner",
	"light_gray_banner",
	"cyan_banner",
	"purple_banner",
	"blue_banner",
	"brown_banner",
	"green_banner",
	"red_banner",
	"black_banner",
	"red_x",
	"desert_village",
	"plains_village",
	"savanna_village",
	"snowy_village",
	"taiga_village",
	"jungle_temple",
	"swamp_hut",
];

export const version = 30;
export const up: VersionUp = (conv, pack) => {
	const image = pack.delete("textures/map/map_icons");
	if (!image) return;
	const out = splitSheet(image.content, 8, 8, icons);
	for (const img of out) {
		pack.add(`textures/map/decorations/${img.name}`, img.image);
	}
	conv.info(`Map decorations split into separate icons due to changes from 30.`, {
		paths: out.map(x => `textures/map/decorations/${x.name}`),
	});
};
export const down: VersionDown = (conv, pack) => {
	const decorations = icons.map(x => ({ name: x, content: pack.image(`textures/map/decorations/${x}`) }));
	if (!decorations.some(x => x.content !== undefined)) return;
	const out = mergeSheet(
		128,
		128,
		decorations.flatMap((x, i) => (x ? { index: i, image: x.content! } : []))
	);
	for (const img of decorations) {
		pack.delete(`textures/map/decorations/${img.name}`);
	}
	pack.add(`textures/map/map_icons`, out);

	conv.info(`Map decorations merged into a single file due to changes from 30.`, {
		path: "textures/map/map_icons",
	});
};
