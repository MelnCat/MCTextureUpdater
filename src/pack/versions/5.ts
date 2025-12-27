import { mergeSheet, splitSheet } from "../../util/images";
import type { VersionDown, VersionUp } from "../Pack";

const chestMappings = [
	{
		// lock top left
		old: { x: 3, y: 0, w: 2, h: 1 },
		new: { x: 1, y: 0, w: 2, h: 1 },
	},
	{
		// lock top right
		old: { x: 1, y: 0, w: 2, h: 1 },
		new: { x: 3, y: 0, w: 2, h: 1 },
	},
	{
		// lock bottom right
		old: { x: 1, y: 1, w: 5, h: 4 },
		new: { x: 1, y: 1, w: 5, h: 4 },
		extra: "rotate180",
	},
	{
		// lock bottom left
		old: { x: 0, y: 1, w: 1, h: 4 },
		new: { x: 0, y: 1, w: 1, h: 4 },
		extra: "flipV",
	},
	{
		// top inside
		old: { x: 28, y: 0, w: 14, h: 14 },
		new: { x: 14, y: 0, w: 14, h: 14 },
		extra: "flipV",
	},
	{
		// top outside
		old: { x: 14, y: 0, w: 14, h: 14 },
		new: { x: 28, y: 0, w: 14, h: 14 },
		extra: "flipV",
	},
	{
		// lid side 1
		old: { x: 0, y: 14, w: 14, h: 5 },
		new: { x: 0, y: 14, w: 14, h: 5 },
		extra: "rotate180",
	},
	{
		// lid side 2
		old: { x: 42, y: 14, w: 14, h: 5 },
		new: { x: 14, y: 14, w: 14, h: 5 },
		extra: "rotate180",
	},
	{
		// lid side 3
		old: { x: 28, y: 14, w: 14, h: 5 },
		new: { x: 28, y: 14, w: 14, h: 5 },
		extra: "rotate180",
	},
	{
		// lid side 4
		old: { x: 14, y: 14, w: 14, h: 5 },
		new: { x: 42, y: 14, w: 14, h: 5 },
		extra: "rotate180",
	},
	{
		// bottom inside
		old: { x: 28, y: 19, w: 14, h: 14 },
		new: { x: 14, y: 19, w: 14, h: 14 },
		extra: "flipV",
	},
	{
		// bottom outside
		old: { x: 14, y: 19, w: 14, h: 14 },
		new: { x: 28, y: 19, w: 14, h: 14 },
		extra: "flipV",
	},
	{
		// lid side 1
		old: { x: 0, y: 33, w: 14, h: 10 },
		new: { x: 0, y: 33, w: 14, h: 10 },
		extra: "rotate180",
	},
	{
		// lid side 2
		old: { x: 42, y: 33, w: 14, h: 10 },
		new: { x: 14, y: 33, w: 14, h: 10 },
		extra: "rotate180",
	},
	{
		// lid side 3
		old: { x: 28, y: 33, w: 14, h: 10 },
		new: { x: 28, y: 33, w: 14, h: 10 },
		extra: "rotate180",
	},
	{
		// lid side 4
		old: { x: 14, y: 33, w: 14, h: 10 },
		new: { x: 42, y: 33, w: 14, h: 10 },
		extra: "rotate180",
	},
];
const doubleChestMappings = [
	{
		// lock
		w: 1,
		h: 1,
		old: { x: 1, y: 0, dir: "l" },
		new: { x: 2, y: 0 },
	},
	{
		// lock
		w: 1,
		h: 1,
		old: { x: 2, y: 0, dir: "l" },
		new: { x: 4, y: 0 },
	},
	{
		// lock
		w: 1,
		h: 1,
		old: { x: 1, y: 0, dir: "r" },
		new: { x: 1, y: 0 },
	},
	{
		// lock
		w: 1,
		h: 1,
		old: { x: 2, y: 0, dir: "r" },
		new: { x: 3, y: 0 },
	},
	{
		// lockc
		w: 1,
		h: 4,
		old: { x: 1, y: 1, dir: "l" },
		new: { x: 1, y: 1 },
        extra: "flipV"
	},
	{
		// lockc
		w: 1,
		h: 4,
		old: { x: 2, y: 1, dir: "l" },
		new: { x: 0, y: 1 },
        extra: "flipV"
	},
	{
		// lockc
		w: 1,
		h: 4,
		old: { x: 3, y: 1, dir: "l" },
		new: { x: 2, y: 1 },
        extra: "flipV"
	},
	{
		// lockc
		w: 1,
		h: 4,
		old: { x: 0, y: 1, dir: "r" },
		new: { x: 3, y: 1 },
        extra: "flipV"
	},
	{
		// lockc
		w: 1,
		h: 4,
		old: { x: 1, y: 1, dir: "r" },
		new: { x: 5, y: 1 },
        extra: "flipV"
	},
	{
		// lockc
		w: 1,
		h: 4,
		old: { x: 3, y: 1, dir: "r" },
		new: { x: 4, y: 1 },
        extra: "flipV"
	},
	{
		// chest inside
		w: 15,
		h: 14,
		old: { x: 14, y: 0, dir: "l" },
		new: { x: 59, y: 0 },
        extra: "flipV"
	},
	{
		// chest inside
		w: 15,
		h: 14,
		old: { x: 14, y: 0, dir: "r" },
		new: { x: 44, y: 0 },
        extra: "flipV"
	},
	{
		// chest top
		w: 15,
		h: 14,
		old: { x: 29, y: 0, dir: "l" },
		new: { x: 29, y: 0 },
        extra: "flipV"
	},
	{
		// chest top
		w: 15,
		h: 14,
		old: { x: 29, y: 0, dir: "r" },
		new: { x: 14, y: 0 },
        extra: "flipV"
	},
    /////
	{
		// chest inside
		w: 15,
		h: 14,
		old: { x: 14, y: 19, dir: "l" },
		new: { x: 59, y: 19 },
        extra: "flipV"
	},
	{
		// chest inside
		w: 15,
		h: 14,
		old: { x: 14, y: 19, dir: "r" },
		new: { x: 44, y: 19 },
        extra: "flipV"
	},
	{
		// chest top
		w: 15,
		h: 14,
		old: { x: 29, y: 19, dir: "l" },
		new: { x: 29, y: 19 },
        extra: "flipV"
	},
	{
		// chest top
		w: 15,
		h: 14,
		old: { x: 29, y: 19, dir: "r" },
		new: { x: 14, y: 19 },
        extra: "flipV"
	},
    //////
	{
		// chest side
		w: 15,
		h: 5,
		old: { x: 14, y: 14, dir: "l" },
		new: { x: 58, y: 14 },
        extra: "rotate180"
	},
	{
		// chest side
		w: 14,
		h: 5,
		old: { x: 29, y: 14, dir: "l" },
		new: { x: 44, y: 14 },
        extra: "rotate180"
	},
	{
		// chest side
		w: 15,
		h: 5,
		old: { x: 43, y: 14, dir: "l" },
		new: { x: 29, y: 14 },
        extra: "rotate180"
	},
	{
		// chest side
		w: 14,
		h: 5,
		old: { x: 0, y: 14, dir: "r" },
		new: { x: 0, y: 14 },
        extra: "rotate180"
	},
	{
		// chest side
		w: 15,
		h: 5,
		old: { x: 14, y: 14, dir: "r" },
		new: { x: 73, y: 14 },
        extra: "rotate180"
	},
	{
		// chest side
		w: 15,
		h: 5,
		old: { x: 43, y: 14, dir: "r" },
		new: { x: 14, y: 14 },
        extra: "rotate180"
	},
    ////
	{
		// chest side
		w: 15,
		h: 10,
		old: { x: 14, y: 33, dir: "l" },
		new: { x: 58, y: 33 },
        extra: "rotate180"
	},
	{
		// chest side
		w: 14,
		h: 10,
		old: { x: 29, y: 33, dir: "l" },
		new: { x: 44, y: 33 },
        extra: "rotate180"
	},
	{
		// chest side
		w: 15,
		h: 10,
		old: { x: 43, y: 33, dir: "l" },
		new: { x: 29, y: 33 },
        extra: "rotate180"
	},
	{
		// chest side
		w: 14,
		h: 10,
		old: { x: 0, y: 33, dir: "r" },
		new: { x: 0, y: 33 },
        extra: "rotate180"
	},
	{
		// chest side
		w: 15,
		h: 10,
		old: { x: 14, y: 33, dir: "r" },
		new: { x: 73, y: 33 },
        extra: "rotate180"
	},
	{
		// chest side
		w: 15,
		h: 10,
		old: { x: 43, y: 33, dir: "r" },
		new: { x: 14, y: 33 },
        extra: "rotate180"
	},
    ////

];
export const version = 5;
export const up: VersionUp = (conv, pack) => {};
export const down: VersionDown = (conv, pack) => {};
