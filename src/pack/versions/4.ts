import { createImage, mergeSheet, placeImages, splitSheet } from "../../util/images";
import type { Image, VersionDown, VersionUp } from "../Pack";
import { v4Data } from "../slicer/14data";
import { Box } from "../slicer/Box";
import items from "../slicer/14items.json" with { type: "json" };
import blocks from "../slicer/14blocks.json" with { type: "json" };

export const version = 4;
export const up: VersionUp = (conv, pack) => {
	pack.renameDirectory("textures/blocks", "textures/block");
	pack.renameDirectory("textures/items", "textures/item");

	for (const sheet of v4Data) {
		const image = pack.image(sheet.path);
		if (!image) continue;
		if (!sheet.path.includes("textures/gui/container/inventory")) pack.delete(sheet.path);
		const scale = image.getWidth() / sheet.sprites[0].box.totalW;
		for (const sprite of sheet.sprites) {
			pack.add(
				sprite.path,
				image.getSubimage(sprite.box.x * scale, sprite.box.y * scale, sprite.box.w * scale, sprite.box.h * scale)
			);
		}
		conv.info(`Converted to v4 format.`, { paths: sheet.sprites.map(x => x.path) });
	}

	for (const item of items) {
		if (pack.rename(`textures/block/${item[0]}`, `textures/block/${item[1]}`)) {
			conv.info("Renamed to v4 name.", { path: `textures/block/${item[1]}` });
		}
	}

	for (const block of blocks) {
		if (pack.rename(`textures/item/${block[0]}`, `textures/item/${block[1]}`)) {
			conv.info("Renamed to v4 name.", { path: `textures/item/${block[1]}` });
		}
	}
};
export const down: VersionDown = (conv, pack) => {
	pack.renameDirectory("textures/block", "textures/blocks");
	pack.renameDirectory("textures/item", "textures/items");

	for (const sheet of v4Data) {
		if (!sheet.sprites.some(x => pack.exists(x.path))) continue;
		const sprites = sheet.sprites.map(x => ({ sprite: x, image: pack.image(x.path) ?? conv.vanillaFile(x.path) }));
		const maxScale = Math.max(...sprites.map(x => x.image.getWidth() / x.sprite.box.w));
		if (sheet.path.includes("textures/gui/container/inventory")) {
			const inv = pack.image("textures/gui/container/inventory") ?? conv.vanillaFile("textures/gui/container/inventory");
			sprites.push({ sprite: { path: "textures/gui/container/inventory", box: new Box(0, 0, 256, 256, 256, 256) }, image: inv });
		}
		pack.add(
			sheet.path,
			placeImages(
				sprites[0].sprite.box.totalW * maxScale,
				sprites[0].sprite.box.totalH * maxScale,
				sprites.map(x => ({
					x: x.sprite.box.x * maxScale,
					y: x.sprite.box.y * maxScale,
					image: x.image.scaled(x.sprite.box.w * maxScale, x.sprite.box.h * maxScale),
				}))
			)
		);
		conv.info(`Converted from v4 format.`, { path: sheet.path });
	}
    
	for (const item of items) {
		if (pack.rename(`textures/blocks/${item[1]}`, `textures/blocks/${item[0]}`)) {
			conv.info("Renamed from v4 name.", { path: `textures/blocks/${item[0]}` });
		}
	}

	for (const block of blocks) {
		if (pack.rename(`textures/items/${block[1]}`, `textures/items/${block[0]}`)) {
			conv.info("Renamed from v4 name.", { path: `textures/items/${block[0]}` });
		}
	}
};
