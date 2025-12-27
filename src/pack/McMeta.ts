export interface LatestMcMeta {
	texture?: {
		mipmap_strategy?: string;
		alpha_cutoff_bias?: string;
	};
	animation?: {
		interpolate?: boolean;
		width?: number;
		height?: number;
		frametime?: number;
		frames?: (number | { index: number; time: number })[];
	};
	gui?: {
		scaling?: {
			type?: "nine_slice";
			width?: number;
			height?: number;
			border?:
				| number
				| {
						left: number;
						top: number;
						right: number;
						bottom: number;
				  };
		};
	};
}

export type AnyMcMeta = LatestMcMeta & {
	texture?: {
		darkened_cutout_mipmap?: boolean;
	};
};
type PackFormat = number | [number] | [number, number];

interface FormatRange {
	min_inclusive: number;
	max_inclusive: number;
}

type SupportedFormats = PackFormat | FormatRange;
export interface PackMcMeta {
	pack: {
		description: string | unknown[];
		pack_format?: number;
		min_format: PackFormat;
		max_format: PackFormat;
		supported_formats: SupportedFormats;
	};
	features?: {
		enabled: string[];
	};
	filter?: {
		block: Array<{
			namespace?: string;
			path?: string;
		}>;
	};
	overlays?: {
		entries: Array<{
			directory: string;
			min_format: PackFormat;
			max_format: PackFormat;
			formats: SupportedFormats;
		}>;
	};
	language?: {
		[languageCode: string]: {
			name: string;
			region: string;
			bidirectional: boolean;
		};
	};
}
