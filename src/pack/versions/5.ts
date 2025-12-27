import { createImage, mergeSheet, placeImages, splitSheet } from "../../util/images";
import type { Image, VersionDown, VersionUp } from "../Pack";

interface Mapping {
	// lock top left
	w: number;
	h: number;
	old: { x: number; y: number };
	new: { x: number; y: number };
	extra?: "rotate180" | "flipV";
}
const chestMappings: Mapping[] = [
	{
		// lock top left
		w: 2,
		h: 1,
		old: { x: 3, y: 0 },
		new: { x: 1, y: 0 },
	},
	{
		// lock top right
		w: 2,
		h: 1,
		old: { x: 1, y: 0 },
		new: { x: 3, y: 0 },
	},
	{
		// lock bottom right
		w: 5,
		h: 4,
		old: { x: 1, y: 1 },
		new: { x: 1, y: 1 },
		extra: "rotate180",
	},
	{
		// lock bottom left
		w: 1,
		h: 4,
		old: { x: 0, y: 1 },
		new: { x: 0, y: 1 },
		extra: "flipV",
	},
	{
		// top inside
		w: 14,
		h: 14,
		old: { x: 28, y: 0 },
		new: { x: 14, y: 0 },
		extra: "flipV",
	},
	{
		// top outside
		w: 14,
		h: 14,
		old: { x: 14, y: 0 },
		new: { x: 28, y: 0 },
		extra: "flipV",
	},
	{
		// lid side 1
		w: 14,
		h: 5,
		old: { x: 0, y: 14 },
		new: { x: 0, y: 14 },
		extra: "rotate180",
	},
	{
		// lid side 2
		w: 14,
		h: 5,
		old: { x: 42, y: 14 },
		new: { x: 14, y: 14 },
		extra: "rotate180",
	},
	{
		// lid side 3
		w: 14,
		h: 5,
		old: { x: 28, y: 14 },
		new: { x: 28, y: 14 },
		extra: "rotate180",
	},
	{
		// lid side 4
		w: 14,
		h: 5,
		old: { x: 14, y: 14 },
		new: { x: 42, y: 14 },
		extra: "rotate180",
	},
	{
		// bottom inside
		w: 14,
		h: 14,
		old: { x: 28, y: 19 },
		new: { x: 14, y: 19 },
		extra: "flipV",
	},
	{
		// bottom outside
		w: 14,
		h: 14,
		old: { x: 14, y: 19 },
		new: { x: 28, y: 19 },
		extra: "flipV",
	},
	{
		// lid side 1
		w: 14,
		h: 10,
		old: { x: 0, y: 33 },
		new: { x: 0, y: 33 },
		extra: "rotate180",
	},
	{
		// lid side 2
		w: 14,
		h: 10,
		old: { x: 42, y: 33 },
		new: { x: 14, y: 33 },
		extra: "rotate180",
	},
	{
		// lid side 3
		w: 14,
		h: 10,
		old: { x: 28, y: 33 },
		new: { x: 28, y: 33 },
		extra: "rotate180",
	},
	{
		// lid side 4
		w: 14,
		h: 10,
		old: { x: 14, y: 33 },
		new: { x: 42, y: 33 },
		extra: "rotate180",
	},
];
const doubleChestMappings: (Mapping & { new: { dir: "l" | "r" } })[] = [
	{
		// lock
		w: 1,
		h: 1,
		new: { x: 1, y: 0, dir: "l" },
		old: { x: 2, y: 0 },
	},
	{
		// lock
		w: 1,
		h: 1,
		new: { x: 2, y: 0, dir: "l" },
		old: { x: 4, y: 0 },
	},
	{
		// lock
		w: 1,
		h: 1,
		new: { x: 1, y: 0, dir: "r" },
		old: { x: 1, y: 0 },
	},
	{
		// lock
		w: 1,
		h: 1,
		new: { x: 2, y: 0, dir: "r" },
		old: { x: 3, y: 0 },
	},
	{
		// lockc
		w: 1,
		h: 4,
		new: { x: 1, y: 1, dir: "l" },
		old: { x: 1, y: 1 },
		extra: "flipV",
	},
	{
		// lockc
		w: 1,
		h: 4,
		new: { x: 2, y: 1, dir: "l" },
		old: { x: 0, y: 1 },
		extra: "flipV",
	},
	{
		// lockc
		w: 1,
		h: 4,
		new: { x: 3, y: 1, dir: "l" },
		old: { x: 2, y: 1 },
		extra: "flipV",
	},
	{
		// lockc
		w: 1,
		h: 4,
		new: { x: 0, y: 1, dir: "r" },
		old: { x: 3, y: 1 },
		extra: "flipV",
	},
	{
		// lockc
		w: 1,
		h: 4,
		new: { x: 1, y: 1, dir: "r" },
		old: { x: 5, y: 1 },
		extra: "flipV",
	},
	{
		// lockc
		w: 1,
		h: 4,
		new: { x: 3, y: 1, dir: "r" },
		old: { x: 4, y: 1 },
		extra: "flipV",
	},
	{
		// chest inside
		w: 15,
		h: 14,
		new: { x: 14, y: 0, dir: "l" },
		old: { x: 59, y: 0 },
		extra: "flipV",
	},
	{
		// chest inside
		w: 15,
		h: 14,
		new: { x: 14, y: 0, dir: "r" },
		old: { x: 44, y: 0 },
		extra: "flipV",
	},
	{
		// chest top
		w: 15,
		h: 14,
		new: { x: 29, y: 0, dir: "l" },
		old: { x: 29, y: 0 },
		extra: "flipV",
	},
	{
		// chest top
		w: 15,
		h: 14,
		new: { x: 29, y: 0, dir: "r" },
		old: { x: 14, y: 0 },
		extra: "flipV",
	},
	/////
	{
		// chest inside
		w: 15,
		h: 14,
		new: { x: 14, y: 19, dir: "l" },
		old: { x: 59, y: 19 },
		extra: "flipV",
	},
	{
		// chest inside
		w: 15,
		h: 14,
		new: { x: 14, y: 19, dir: "r" },
		old: { x: 44, y: 19 },
		extra: "flipV",
	},
	{
		// chest top
		w: 15,
		h: 14,
		new: { x: 29, y: 19, dir: "l" },
		old: { x: 29, y: 19 },
		extra: "flipV",
	},
	{
		// chest top
		w: 15,
		h: 14,
		new: { x: 29, y: 19, dir: "r" },
		old: { x: 14, y: 19 },
		extra: "flipV",
	},
	//////
	{
		// chest side
		w: 15,
		h: 5,
		new: { x: 14, y: 14, dir: "l" },
		old: { x: 58, y: 14 },
		extra: "rotate180",
	},
	{
		// chest side
		w: 14,
		h: 5,
		new: { x: 29, y: 14, dir: "l" },
		old: { x: 44, y: 14 },
		extra: "rotate180",
	},
	{
		// chest side
		w: 15,
		h: 5,
		new: { x: 43, y: 14, dir: "l" },
		old: { x: 29, y: 14 },
		extra: "rotate180",
	},
	{
		// chest side
		w: 14,
		h: 5,
		new: { x: 0, y: 14, dir: "r" },
		old: { x: 0, y: 14 },
		extra: "rotate180",
	},
	{
		// chest side
		w: 15,
		h: 5,
		new: { x: 14, y: 14, dir: "r" },
		old: { x: 73, y: 14 },
		extra: "rotate180",
	},
	{
		// chest side
		w: 15,
		h: 5,
		new: { x: 43, y: 14, dir: "r" },
		old: { x: 14, y: 14 },
		extra: "rotate180",
	},
	////
	{
		// chest side
		w: 15,
		h: 10,
		new: { x: 14, y: 33, dir: "l" },
		old: { x: 58, y: 33 },
		extra: "rotate180",
	},
	{
		// chest side
		w: 14,
		h: 10,
		new: { x: 29, y: 33, dir: "l" },
		old: { x: 44, y: 33 },
		extra: "rotate180",
	},
	{
		// chest side
		w: 15,
		h: 10,
		new: { x: 43, y: 33, dir: "l" },
		old: { x: 29, y: 33 },
		extra: "rotate180",
	},
	{
		// chest side
		w: 14,
		h: 10,
		new: { x: 0, y: 33, dir: "r" },
		old: { x: 0, y: 33 },
		extra: "rotate180",
	},
	{
		// chest side
		w: 15,
		h: 10,
		new: { x: 14, y: 33, dir: "r" },
		old: { x: 73, y: 33 },
		extra: "rotate180",
	},
	{
		// chest side
		w: 15,
		h: 10,
		new: { x: 43, y: 33, dir: "r" },
		old: { x: 14, y: 33 },
		extra: "rotate180",
	},
	////
] as const;
const chests = ["normal", "ender", "christmas", "trapped"];
const doubleChests = ["normal", "christmas", "trapped"];
const imageTransform = (image: Image, extra?: "rotate180" | "flipV" | undefined) => {
	if (extra === "rotate180") return image.rotated(180);
	if (extra === "flipV") return image.flipped("v");
	return image;
};
export const version = 5;
export const up: VersionUp = (conv, pack) => {
	for (const chest of chests) {
		const path = `textures/entity/chest/${chest}`;
		const image = pack.image(path);
		if (!image) continue;
		const scale = image.getWidth() / 64;
		pack.add(
			path,
			placeImages(
				image.getWidth(),
				image.getHeight(),
				chestMappings.map(m => ({
					x: m.new.x * scale,
					y: m.new.y * scale,
					image: imageTransform(image.getSubimage(m.old.x * scale, m.old.y * scale, m.w * scale, m.h * scale), m.extra),
				}))
			)
		);
		conv.info(`Chest format updated to 5.`, { path });
	}
	for (const doubleChest of doubleChests) {
		const path = `textures/entity/chest/${doubleChest}_double`;
		const image = pack.image(path);
		if (!image) continue;
		const scale = image.getWidth() / 64;
		pack.add(
			`textures/entity/chest/${doubleChest}_left`,
			placeImages(
				image.getWidth(),
				image.getHeight(),
				doubleChestMappings
					.filter(m => m.new.dir === "l")
					.map(m => ({
						x: m.new.x * scale,
						y: m.new.y * scale,
						image: imageTransform(image.getSubimage(m.old.x * scale, m.old.y * scale, m.w * scale, m.h * scale), m.extra),
					}))
			)
		);
		pack.add(
			`textures/entity/chest/${doubleChest}_right`,
			placeImages(
				image.getWidth(),
				image.getHeight(),
				doubleChestMappings
					.filter(m => m.new.dir === "r")
					.map(m => ({
						x: m.new.x * scale,
						y: m.new.y * scale,
						image: imageTransform(image.getSubimage(m.old.x * scale, m.old.y * scale, m.w * scale, m.h * scale), m.extra),
					}))
			)
		);
		conv.info(`Double chest format updated to 5.`, {
			paths: [`textures/entity/chest/${doubleChest}_left`, `textures/entity/chest/${doubleChest}_right`],
		});
	}
	const banners = pack.images().filter(x => x.path.includes("textures/entity/banner/") || x.path.includes("textures/entity/shield/"));
	if (banners.length) {
		for (const banner of banners) {
			pack.add(banner.path, banner.content.bWAlpha());
		}
		conv.info(`Banners changed to use transparency for 5 changes.`, {
			paths: banners,
		});
	}
};
export const down: VersionDown = (conv, pack) => {
	for (const chest of chests) {
		const path = `textures/entity/chest/${chest}`;
		const image = pack.image(path);
		if (!image) continue;
		const scale = image.getWidth() / 64;
		pack.add(
			path,
			placeImages(
				image.getWidth(),
				image.getHeight(),
				chestMappings.map(m => ({
					x: m.old.x * scale,
					y: m.old.y * scale,
					image: imageTransform(image.getSubimage(m.new.x * scale, m.new.y * scale, m.w * scale, m.h * scale), m.extra),
				}))
			)
		);
		conv.info(`Chest format downgraded from 5.`, { path });
	}
	for (const doubleChest of doubleChests) {
		const imageLeft = pack.image(`textures/entity/chest/${doubleChest}_left`);
		const imageRight = pack.image(`textures/entity/chest/${doubleChest}_right`);
		if (!imageLeft && !imageRight) continue;
		if (!imageLeft || !imageRight) {
			conv.urgent(`Only half of a double chest has a texture: ${doubleChest}. Failed to convert to pre-5 format.`);
			continue;
		}
		const scale = imageLeft.getWidth() / 64;
		pack.add(
			`textures/entity/chest/${doubleChest}_double`,
			placeImages(
				imageLeft.getWidth(),
				imageLeft.getHeight(),
				doubleChestMappings.map(m => ({
					x: m.old.x * scale,
					y: m.old.y * scale,
					image: imageTransform(
						(m.new.dir === "l" ? imageLeft : imageRight).getSubimage(
							m.new.x * scale,
							m.new.y * scale,
							m.w * scale,
							m.h * scale
						),
						m.extra
					),
				}))
			)
		);
		conv.info(`Double chest format downgraded from 5.`, {
			path: `textures/entity/chest/${doubleChest}_double`,
		});
	}
	const banners = pack.images().filter(x => x.path.includes("textures/entity/banner/") || x.path.includes("textures/entity/shield/"));
	if (banners.length) {
		for (const banner of banners) {
			const scale = banner.content.getWidth() / 64;
			pack.add(
				banner.path,
				placeImages(64 * scale, 64 * scale, [
					banner.path.includes("banner")
						? { x: 0, y: 0, image: createImage(42 * scale, 41 * scale, "#000000") }
						: { x: 2, y: 2, image: createImage(10 * scale, 20 * scale, "#000000") },
					{ x: 0, y: 0, image: banner.content },
				])
			);
		}
		conv.info(`Banners changed to not use transparency for reverting 5 changes.`, {
			paths: banners,
		});
	}
};
