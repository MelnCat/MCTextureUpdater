import type { Blockstate } from "./Blockstate";
import type { AnyMcMeta, PackMcMeta } from "./McMeta";

export interface Pathed<T> {
	content: T;
	path: string;
}

export interface Model {
	parent?: string;
	textures?: Record<string, string>;
}

export interface BlockModel extends Model {
	elements?: {
		name?: string;
		from: [x: number, y: number, z: number];
		to: [x: number, y: number, z: number];
		rotation?:
			| { origin: [x: number, y: number, z: number]; axis: "x" | "y" | "z"; angle: number; rescale?: boolean }
			| { origin: [x: number, y: number, z: number]; x?: number; y?: number; z?: number; rescale?: boolean };
	}[];
}

export interface Image {
	hasFeature(feature: "translucency"): boolean;

	getWidth(): number;
	getHeight(): number;
	getSubimage(x: number, y: number, w: number, h: number): Image;
    
    scaled(w: number, h: number): Image;
    rotated(degrees: number): Image;
    flipped(direction: "v" | "h"): Image;

    bWAlpha(): Image;

	toImageSource(): CanvasImageSource;
	toBlob(): Promise<Blob>;
}


export interface Pack {
	rename(from: string, to: string): Pathed<Image> | undefined;
	delete(path: string): Pathed<Image> | undefined;
	exists(path: string): boolean;
	image(path: string): Image | undefined;
	
	add(path: string, image: Image): void;
	addMcMeta(path: string, meta: AnyMcMeta): void;

    deleteFolder(path: string): void;

	updateModel(path: string, cb: (model: Model) => Model, fallback?: Model): boolean;
	updateBlockModel(path: string, cb: (model: BlockModel) => BlockModel, fallback?: BlockModel): boolean;
	updateMcMeta(path: string, cb: (model: AnyMcMeta) => AnyMcMeta, fallback?: AnyMcMeta): boolean;

	mcMetas(): Pathed<AnyMcMeta>[];
	blockModels(): Pathed<BlockModel>[];
	blockstates(): Pathed<Blockstate>[];
	images(): Pathed<Image>[];

	setFormatVersion(version: number): void;

	mcMeta(path: string): Pathed<AnyMcMeta> | undefined;
	renameMcMeta(path: string, to: string): Pathed<AnyMcMeta> | undefined;
	deleteMcMeta(path: string): Pathed<AnyMcMeta> | undefined;

    packMcMeta(): PackMcMeta
    
	renameDirectory(from: string, to: string): void;

	toZip(): Promise<Record<string,Uint8Array<ArrayBuffer>>>
}

export interface Conversion {
	pack: Pack;
	info(info: string, opts?: { path?: string | Pathed<unknown>; paths?: string[] | Pathed<unknown>[] }): void;
	warning(warn: string, opts?: { path?: string | Pathed<unknown>; paths?: string[] | Pathed<unknown>[] }): void;
	urgent(warn: string, opts?: { path?: string | Pathed<unknown>; paths?: string[] | Pathed<unknown>[] }): void;
    
    vanillaFile(path: string): Image;

    loadVanilla(): Promise<void>;
}

export type VersionUp = (conv: Conversion, pack: Pack) => void | Promise<void>;
export type VersionDown = (conv: Conversion, pack: Pack) => void | Promise<void>;
