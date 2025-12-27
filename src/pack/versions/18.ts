import { mergeSheet, placeImages, splitSheet } from "../../util/images";
import type { Image, Pathed, VersionDown, VersionUp } from "../Pack";
import { v18Misc, v18Sheets } from "../slicer/18data";

export const version = 18;
export const up: VersionUp = (conv, pack) => {
	if (pack.exists("realms:textures/gui/realms/expires_soon_icon")) {
		const image = pack.delete("realms:textures/gui/realms/expires_soon_icon")!;
		const scale = image.content.getWidth() / 20;
		conv.pack.add(
			"textures/gui/sprites/realm_status/expires_soon",
			mergeSheet(10, 28 * 2, [
				{ index: 0, image: image.content.getSubimage(0, 0, 10 * scale, 28 * scale) },
				{ index: 1, image: image.content.getSubimage(10 * scale, 0, 10 * scale, 28 * scale) },
			])
		);
		conv.pack.addMcMeta("textures/gui/sprites/realm_status/expires_soon", {
			animation: {
				frametime: 10,
				height: 28 * scale,
			},
		});
		conv.info("Converted into v18 format.", { path: "textures/gui/sprites/realm_status/expires_soon" });
	}
	for (const sheet of v18Sheets) {
		if (pack.exists(sheet.path)) {
			const image = pack.delete(sheet.path)!;
			const scale = image.content.getWidth() / sheet.sprites[0].box.totalW;
			for (const sprite of sheet.sprites) {
				pack.add(
					sprite.path,
					image.content.getSubimage(sprite.box.x * scale, sprite.box.y * scale, sprite.box.w * scale, sprite.box.h * scale)
				);
				if (sprite.meta) pack.addMcMeta(sprite.path, sprite.meta!);
			}
			conv.info("Converted into v18 format.", { paths: sheet.sprites.map(x => x.path) });
		}
	}
	if (pack.exists("textures/gui/container/loom")) {
		const image = pack.delete("textures/gui/container/loom")!;
		const scale = image.content.getWidth() / 256;
		conv.pack.add(
			"textures/gui/sprites/container/loom/error",
			image.content.getSubimage(176 * scale, 17 * scale, 17 * scale, 16 * scale).getSubimage(0, 0, 26 * scale, 26 * scale)
		);
		conv.info("Converted into v18 format.", { path: "textures/gui/sprites/container/loom/error" });
	}
	for (const move of v18Misc.movedRealms) {
		const from = `realms:textures/gui/${move}`;
		const to = `textures/gui/${move}`;
		if (pack.exists(from)) {
			pack.rename(from, to);
			pack.renameMcMeta(from, to);
			conv.info("Moved from realms: to minecraft: due to v18 changes.", { path: to });
		}
	}
	for (const clip of v18Misc.clip) {
		const from = `textures/gui/${clip.from}`;
		const to = `textures/gui/${clip.to}`;
		const image = pack.delete(from);
		if (image) {
			const scale = image.content.getWidth() / clip.box.totalW;
			pack.add(
				to,
				image.content
					.getSubimage(clip.box.x * scale, clip.box.y * scale, clip.box.w * scale, clip.box.h * scale)
					.getSubimage(0, 0, clip.box.totalW * scale, clip.box.totalH * scale)
			);
			conv.info("Converted into v18 format.", { path: to });
		}
	}
};
export const down: VersionDown = (conv, pack) => {
	const toClip: { image: Image; from: string; to: string }[] = [];

	for (const clip of v18Misc.clip) {
		const from = `textures/gui/${clip.to}`;
		const to = `textures/gui/${clip.from}`;
		const fromImage = pack.image(from);
		if (fromImage) {
			toClip.push({ from, to, image: fromImage });
			pack.delete(from);
		}
	}
	if (pack.exists("textures/gui/sprites/realm_status/expires_soon")) {
		const image = pack.delete("textures/gui/sprites/realm_status/expires_soon")!;
        const scale = image.content.getWidth() / 10;
		conv.pack.add(
			"realms:textures/gui/realms/expires_soon_icon",
			mergeSheet(20 * scale, 28 * scale, [
				{ index: 0, image: image.content.getSubimage(0, 0, 10 * scale, 28 * scale) },
				{ index: 1, image: image.content.getSubimage(0, 28 * scale, 10 * scale, 28 * scale) },
			])
		);
		conv.pack.deleteMcMeta("textures/gui/sprites/realm_status/expires_soon");
		conv.info("Converted from v18 format.", { path: "realms:textures/gui/realms/expires_soon_icon" });
	}
	for (const sheet of v18Sheets) {
		if (sheet.sprites.some(x => pack.exists(x.path))) {
			const images = sheet.sprites
				.filter(x => pack.exists(x.path))
				.map(x => ({ image: pack.delete(x.path)! ?? conv.vanillaFile(x.path), sprite: x }));
            const maxScale = Math.max(...images.map(x => x.image.content.getWidth() / x.sprite.box.w))
			pack.add(
				sheet.path,
				placeImages(
					sheet.sprites[0].box.totalW * maxScale,
					sheet.sprites[0].box.totalH * maxScale,
					images.map(x => ({
						x: x.sprite.box.x * maxScale,
						y: x.sprite.box.y * maxScale,
						image: x.image.content.scaled(x.sprite.box.w * maxScale, x.sprite.box.h * maxScale),
					}))
				)
			);
			for (const sprite of images) {
				pack.deleteMcMeta(sprite.image.path);
			}
			conv.info("Converted from v18 format.", { path: sheet.path });
		}
	}
	for (const move of v18Misc.movedRealms) {
		const from = `textures/gui/${move}`;
		const to = `realms:textures/gui/${move}`;
		if (pack.exists(from)) {
			pack.rename(from, to);
			pack.renameMcMeta(from, to);
			conv.info("Moved from minecraft: to realms: due to v18 changes.", { path: to });
		}
	}
	for (const clip of toClip) {
		const dest = pack.image(clip.to);
		if (dest) {
			pack.add(
				clip.to,
				placeImages(dest.getWidth(), dest.getHeight(), [
					{ x: 0, y: 0, image: dest },
					{ x: 0, y: 0, image: clip.image },
				])
			);
		} else {
			pack.add(clip.to, clip.image);
		}
		conv.info("Converted from v18 format.", { path: clip.to });
	}
};
