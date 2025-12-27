import { createImage, mergeSheet, placeImages, splitSheet } from "../../util/images";
import type { Image, VersionDown, VersionUp } from "../Pack";

export const version = 4;
export const up: VersionUp = (conv, pack) => {
    const uppercase = pack.images().filter(x => x.path.match(/\/(.+?)\.png/)?.[0].match(/[A-Z]/));
    if (uppercase.length) {
        for (const path of uppercase) {
            pack.rename(path.path, path.path.replace(/\/(.+?)\.png/, x => x.toLowerCase()));
        }
        conv.info(`Uppercase filenames are no longer allowed in 3+.`, {
            paths: uppercase.map(x => x.path.replace(/\/(.+?)\.png/, x => x.toLowerCase()))
        })
    }
};
export const down: VersionDown = (conv, pack) => {
};
