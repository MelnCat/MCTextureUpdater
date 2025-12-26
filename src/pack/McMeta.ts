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
