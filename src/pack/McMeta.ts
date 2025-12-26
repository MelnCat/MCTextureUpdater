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
}

export type AnyMcMeta = LatestMcMeta & {
	texture?: {
		darkened_cutout_mipmap?: boolean;
	};
};
