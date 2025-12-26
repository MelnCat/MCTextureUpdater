export type Blockstate =
	| {
			variants: Record<string, ModelDefinition | ModelDefinition[]>;
	  }
	| {
			multipart: MultipartElement[];
	  };

export interface ModelDefinition {
	model: string;
	x?: 0 | 90 | 180 | 270;
	y?: 0 | 90 | 180 | 270;
	z?: 0 | 90 | 180 | 270;
	uvlock?: boolean;
	weight?: number;
}

export interface MultipartElement {
	when?: MultipartCondition | MultipartLogicCondition;
	apply: ModelDefinition | ModelDefinition[];
}

export type MultipartCondition = Record<string, string>;

export interface MultipartLogicCondition {
	OR?: MultipartCondition[];
	AND?: MultipartCondition[];
}
export const getBlockstateModels = (blockstate: Blockstate): ModelDefinition[] => {
	const models: ModelDefinition[] = [];

	if ("variants" in blockstate) {
		for (const key in blockstate.variants) {
			const variantValue = blockstate.variants[key];
			if (Array.isArray(variantValue)) {
				models.push(...variantValue);
			} else {
				models.push(variantValue);
			}
		}
	}

	if ("multipart" in blockstate) {
		for (const part of blockstate.multipart) {
			if (Array.isArray(part.apply)) {
				models.push(...part.apply);
			} else {
				models.push(part.apply);
			}
		}
	}

	return models;
};
