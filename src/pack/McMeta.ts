export interface LatestMcMeta {
	texture?: {
		mipmap_strategy?: string;
		alpha_cutoff_bias?: string;
	};
}

export type AnyMcMeta = LatestMcMeta & {
    texture: {
        darkened_cutout_mipmap?: boolean;
    }
};
