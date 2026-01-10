import { CanvasImage } from "../util/images";
import type { Blockstate } from "./Blockstate";
import type { AnyMcMeta, PackMcMeta } from "./McMeta";
import type { BlockModel, Image, Model, Pack, PackFormatVersion, Pathed } from "./Pack";
import JSON5 from "json5";

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
		this.renameMcMeta(from, to);
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
        this.deleteMcMeta(path);
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
		this.zip[path] = { path, textContent: JSON.stringify(cb(model ? JSON5.parse(model.textContent!) : fallback!), null, "\t") };
		return true;
	}
	updateBlockModel(path: string, cb: (model: BlockModel) => BlockModel, fallback?: BlockModel): boolean {
		return this.updateModel(path, cb, fallback);
	}
	updateMcMeta(path: string, cb: (model: AnyMcMeta) => AnyMcMeta, fallback?: AnyMcMeta): boolean {
		path = parsePath(path, "mcmeta");
		const meta = this.zip[path];
		if (!meta && !fallback) return false;
		this.zip[path] = { path, textContent: JSON.stringify(cb(meta ? JSON5.parse(meta.textContent!) : fallback!), null, "\t") };
		return true;
	}
	mcMetas(): Pathed<AnyMcMeta>[] {
		return Object.values(this.zip)
			.filter(x => x.path.endsWith(".png.mcmeta"))
			.map(x => {
				try {
					return { path: x.path, content: JSON5.parse(x.textContent!) };
				} catch {
					console.warn(`Something went wrong decoding ${x.path}`);
					return { path: x.path, content: {} };
				}
			});
	}
	blockModels(): Pathed<BlockModel>[] {
		return Object.values(this.zip)
			.filter(x => x.path.endsWith(".json") && x.path.includes("models/block/"))
			.map(x => ({ path: x.path, content: JSON5.parse(x.textContent!) }));
	}
	blockstates(): Pathed<Blockstate>[] {
		return Object.values(this.zip)
			.filter(x => x.path.endsWith(".json") && x.path.includes("blockstates/"))
			.map(x => ({ path: x.path, content: JSON5.parse(x.textContent!) }));
	}
	images(): Pathed<Image>[] {
		return Object.values(this.zip)
			.filter(x => x.path.endsWith(".png"))
			.map(x => this.toImage(x));
	}
	setFormatVersion(version: PackFormatVersion): void {
		const packMcMeta = this.packMcMeta();
		if (typeof version !== "number" || version >= 65) {
			this.zip["pack.mcmeta"] = {
				path: "pack.mcmeta",
				textContent: JSON.stringify(
					{
						...packMcMeta,
						pack: {
							...packMcMeta.pack,
							pack_format: version,
							min_format: version,
							max_format: version,
						},
					},
					null,
					"\t"
				),
			};
		} else {
			this.zip["pack.mcmeta"] = {
				path: "pack.mcmeta",
				textContent: JSON.stringify(
					{
						...packMcMeta,
						pack: {
							...packMcMeta.pack,
							pack_format: version,
						},
					},
					null,
					"\t"
				),
			};
		}
	}
	getFormatVersion(): PackFormatVersion {
		const packMcMeta = this.packMcMeta();
		return packMcMeta.pack.pack_format!;
	}
	mcMeta(path: string): Pathed<AnyMcMeta> | undefined {
		path = parsePath(path, "mcmeta");
		const found = this.zip[path];
		if (!found) return;
		return { path, content: JSON5.parse(found.textContent!) };
	}
	renameMcMeta(path: string, to: string): Pathed<AnyMcMeta> | undefined {
		path = parsePath(path, "mcmeta");
		to = parsePath(to, "mcmeta");
		const found = this.zip[path];
		if (!found) return;
		delete this.zip[path];
		const renamed = { ...found, path: to };
		this.zip[to] = renamed;
		return { path: to, content: JSON5.parse(renamed.textContent!) };
	}
	deleteMcMeta(path: string): Pathed<AnyMcMeta> | undefined {
		path = parsePath(path, "mcmeta");
		const found = this.zip[path];
		if (!found) return;
		delete this.zip[path];
		return { path, content: JSON5.parse(found.textContent!) };
	}
	packMcMeta(): PackMcMeta {
		const found = this.zip["pack.mcmeta"];
		return JSON5.parse(found.textContent!);
	}
	renameDirectory(from: string, to: string): void {
		from = parsePath(from, "folder");
		to = parsePath(to, "folder");
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
	static async fromZip(zip: Record<string, Uint8Array<ArrayBuffer>>): Promise<ZipPack> {
		return new ZipPack(
			Object.fromEntries(
				await Promise.all(
					Object.entries(zip).map(async ([path, file]) => {
						if (path.endsWith(".png")) {
							const bitmap = await createImageBitmap(new Blob([file], { type: "image/png" }));
							return [
								path,
								{
									path,
									bitmap,
									content: file,
								},
							] as const;
						} else if (path.endsWith(".json") || path.endsWith(".mcmeta")) {
							return [
								path,
								{
									path,
									content: file,
									textContent: td.decode(file),
								},
							] as const;
						} else {
							return [
								path,
								{
									path,
									content: file,
								},
							] as const;
						}
					})
				)
			)
		);
	}
}

const te = new TextEncoder();
const td = new TextDecoder();
