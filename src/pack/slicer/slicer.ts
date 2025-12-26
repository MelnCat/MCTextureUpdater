import type { Conversion, Pack } from "../Pack";

export let slicerConv: Conversion;
export const setSlicerConversion = (conv: Conversion) => {
	slicerConv = conv;
};

export let slicerPack: Pack;
export const setSlicerPack = (pack: Pack) => {
	slicerPack = pack;
};
