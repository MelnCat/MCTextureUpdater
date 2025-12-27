import { CanvasImage } from "../util/images";
import type { Blockstate } from "./Blockstate";
import type { AnyMcMeta, PackMcMeta } from "./McMeta";
import type { BlockModel, Image, Model, Pack, Pathed } from "./Pack";

type Entry = {
	path: string;
	image?: Image;
	bitmap?: ImageBitmap;
	content?: Uint8Array;
	textContent?: string;
};
export const parsePath = (path: string, type: "image" | "mcmeta" | "folder" | "json") => {
	const split = path.split(":");
	const namespace = split.length > 1 ? split[0] : "minecraft";
	const rest = split.length > 1 ? split[1] : path;
	const ext = {
		image: ".png",
		mcmeta: ".png.mcmeta",
		folder: "",
		json: ".json",
	}[type];
	const fullPath = `assets/${namespace}/${rest.endsWith(ext) ? rest : `${rest}${ext}`}`;
	return fullPath;
};
export class ZipPack implements Pack {
	constructor(public zip: Record<string, Entry>) {}
	private toImage(entry: Entry) {
		return { path: entry.path, content: (entry.image ??= CanvasImage.fromBitmap(entry.bitmap!)) };
	}

	rename(from: string, to: string): Pathed<Image> | undefined {
		from = parsePath(from, "image");
		to = parsePath(to, "image");
		const image = this.zip[from];
		if (!image) return;
		delete this.zip[from];
		const newImage = { ...image, path: to };
		this.zip[to] = newImage;
		return this.toImage(newImage);
	}
	delete(path: string): Pathed<Image> | undefined {
		path = parsePath(path, "image");
		const image = this.zip[path];
		if (!image) return;
		delete this.zip[path];
		return this.toImage(image);
	}
	exists(path: string): boolean {
		path = parsePath(path, "image");
		return path in this.zip;
	}
	image(path: string): Image | undefined {
		path = parsePath(path, "image");
		const image = this.zip[path];
		if (!image) return;
		return this.toImage(image).content;
	}
	add(path: string, image: Image): void {
		path = parsePath(path, "image");
		this.zip[path] = { path, image };
	}
	addMcMeta(path: string, meta: AnyMcMeta): void {
		path = parsePath(path, "mcmeta");
		this.zip[path] = { path, textContent: JSON.stringify(meta, null, "\t") };
	}
	deleteFolder(path: string): void {
		path = parsePath(path, "folder");
		this.zip = Object.fromEntries(Object.entries(this.zip).filter(x => !x[0].startsWith(path)));
	}
	updateModel(path: string, cb: (model: Model) => Model, fallback?: Model): boolean {
		path = parsePath(path, "json");
		const model = this.zip[path];
		if (!model && !fallback) return false;
		this.zip[path] = { path, textContent: JSON.stringify(cb(model ? JSON.parse(model.textContent!) : fallback), null, "\t") };
		return true;
	}
	updateBlockModel(path: string, cb: (model: BlockModel) => BlockModel, fallback?: BlockModel): boolean {
		return this.updateModel(path, cb, fallback);
	}
	updateMcMeta(path: string, cb: (model: AnyMcMeta) => AnyMcMeta, fallback?: AnyMcMeta): boolean {
		path = parsePath(path, "mcmeta");
		const meta = this.zip[path];
		if (!meta && !fallback) return false;
		this.zip[path] = { path, textContent: JSON.stringify(cb(meta ? JSON.parse(meta.textContent!) : fallback), null, "\t") };
		return true;
	}
	mcMetas(): Pathed<AnyMcMeta>[] {
		return Object.values(this.zip)
			.filter(x => x.path.endsWith(".png.mcmeta"))
			.map(x => ({ path: x.path, content: JSON.parse(x.textContent!) }));
	}
	blockModels(): Pathed<BlockModel>[] {
		return Object.values(this.zip)
			.filter(x => x.path.endsWith(".json") && x.path.includes("models/block/"))
			.map(x => ({ path: x.path, content: JSON.parse(x.textContent!) }));
	}
	blockstates(): Pathed<Blockstate>[] {
		return Object.values(this.zip)
			.filter(x => x.path.endsWith(".json") && x.path.includes("blockstates/"))
			.map(x => ({ path: x.path, content: JSON.parse(x.textContent!) }));
	}
	images(): Pathed<Image>[] {
		return Object.values(this.zip)
			.filter(x => x.path.endsWith(".png"))
			.map(x => this.toImage(x));
	}
	setFormatVersion(version: number): void {
		const packMcMeta = this.zip["pack.mcmeta"];
		this.zip["pack.mcmeta"] = {
			path: "pack.mcmeta",
			textContent: JSON.stringify(
				{
					...JSON.parse(packMcMeta.textContent!),
					pack_format: version,
				},
				null,
				"\t"
			),
		};
	}
	mcMeta(path: string): Pathed<AnyMcMeta> | undefined {
		path = parsePath(path, "mcmeta");
		const found = this.zip[path];
		if (!found) return;
		return { path, content: JSON.parse(found.textContent!) };
	}
	renameMcMeta(path: string, to: string): Pathed<AnyMcMeta> | undefined {
		path = parsePath(path, "mcmeta");
		to = parsePath(to, "mcmeta");
		const found = this.zip[path];
		if (!found) return;
		delete this.zip[path];
		const renamed = { ...found, path: to };
		this.zip[to] = renamed;
		return { path: to, content: JSON.parse(renamed.textContent!) };
	}
	deleteMcMeta(path: string): Pathed<AnyMcMeta> | undefined {
		path = parsePath(path, "mcmeta");
		const found = this.zip[path];
		if (!found) return;
		delete this.zip[path];
		return { path, content: JSON.parse(found.textContent!) };
	}
	packMcMeta(): PackMcMeta {
		const found = this.zip["pack.mcmeta"];
		return JSON.parse(found.textContent!);
	}
	renameDirectory(from: string, to: string): void {
		this.zip = Object.fromEntries(
			Object.entries(this.zip).map(x =>
				x[0].startsWith(from) ? [x[0].replace(from, to), { ...x[1], path: x[1].path.replace(from, to) }] : x
			)
		);
	}
	async toZip(): Promise<Record<string, Uint8Array<ArrayBuffer>>> {
		return Object.fromEntries(
			await Promise.all(
				Object.entries(this.zip).map(async ([path, data]) => {
					if (data.textContent) {
						return [path, te.encode(data.textContent)] as const;
					} else if (data.image) {
						return [path, new Uint8Array(await (await data.image.toBlob()).arrayBuffer())] as const;
					} else {
						return [path, data.content! as Uint8Array<ArrayBuffer>] as const;
					}
				})
			)
		);
	}
}

const te = new TextEncoder();
const td = new TextDecoder();

export const zipPackFromZip = async (zip: Record<string, Uint8Array<ArrayBuffer>>): Promise<ZipPack> => {
	const zipPack: Record<string, Entry> = {};
	for (const [path, file] of Object.entries(zip)) {
		if (path.endsWith(".png")) {
			const bitmap = await createImageBitmap(new Blob([file], { type: "image/png" }));
			zipPack[path] = {
				path,
				bitmap,
				content: file,
			};
		} else if (path.endsWith(".json") || path.endsWith(".mcmeta")) {
			zipPack[path] = {
				path,
				content: file,
				textContent: td.decode(file),
			};
		} else {
			zipPack[path] = {
				path,
				content: file,
			};
		}
	}
	return new ZipPack(zipPack);
};
