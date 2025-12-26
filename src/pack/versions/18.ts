import { mergeSheet, placeImages, splitSheet } from "../../util/images";
import type { VersionDown, VersionUp } from "../Pack";
import { v18Sheets } from "../slicer/18data";

export const version = 18;
export const up: VersionUp = (conv, pack) => {
	if (pack.exists("realms:textures/gui/realms/expires_soon_icon")) {
		const image = pack.delete("realms:textures/gui/realms/expires_soon_icon")!;
		conv.pack.add(
			"textures/gui/sprites/realm_status/expires_soon",
			mergeSheet(10, 28 * 2, [
				{ index: 0, image: image.content.getSubimage(0, 0, 10, 28) },
				{ index: 1, image: image.content.getSubimage(10, 0, 10, 28) },
			])
		);
		conv.pack.addMcMeta("textures/gui/sprites/realm_status/expires_soon", {
			animation: {
				frametime: 10,
				height: 28,
			},
		});
		conv.info("Converted into v18 format.", { path: "textures/gui/sprites/realm_status/expires_soon" });
	}
	for (const sheet of v18Sheets) {
		if (pack.exists(sheet.path)) {
			const image = pack.delete(sheet.path)!;
			for (const sprite of sheet.sprites) {
				pack.add(sprite.path, image.content.getSubimage(sprite.box.x, sprite.box.y, sprite.box.w, sprite.box.h));
			}
			conv.info("Converted into v18 format.", { paths: sheet.sprites.map(x => x.path) });
		}
	}
	if (pack.exists("textures/gui/container/loom")) {
		const image = pack.delete("textures/gui/container/loom")!;
		conv.pack.add("textures/gui/sprites/container/loom/error", image.content.getSubimage(176, 17, 17, 16).getSubimage(0, 0, 26, 26));
		conv.info("Converted into v18 format.", { path: "textures/gui/sprites/container/loom/error" });
	}
};
export const down: VersionDown = (conv, pack) => {
	if (pack.exists("textures/gui/sprites/realm_status/expires_soon")) {
		const image = pack.delete("textures/gui/sprites/realm_status/expires_soon")!;
		conv.pack.add(
			"realms:textures/gui/realms/expires_soon_icon",
			mergeSheet(20, 28, [
				{ index: 0, image: image.content.getSubimage(0, 0, 10, 28) },
				{ index: 1, image: image.content.getSubimage(0, 28, 10, 28) },
			])
		);
		conv.pack.deleteMcMeta("textures/gui/sprites/realm_status/expires_soon");
		conv.info("Converted from v18 format.", { path: "realms:textures/gui/realms/expires_soon_icon" });
	}
	for (const sheet of v18Sheets) {
		if (sheet.sprites.some(x => pack.exists(x.path))) {
			const images = sheet.sprites.filter(x => pack.exists(x.path)).map(x => ({ image: pack.delete(x.path)!, sprite: x }));
			pack.add(
				sheet.path,
				placeImages(
					sheet.sprites[0].box.totalW,
					sheet.sprites[0].box.totalH,
					images.map(x => ({
						x: x.sprite.box.x,
						y: x.sprite.box.y,
						image: x.image.content,
					}))
				)
			);
			conv.info("Converted from v18 format.", { path: sheet.path });
		}
	}
};
