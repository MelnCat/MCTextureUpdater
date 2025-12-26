// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

import type { Image } from "../Pack";
import type { Box } from "./Box";

export class OutputFile {

    private path: string;
    private box: Box;
    private transformers: Array<(img: Image) => Image> = [];
    private _metadata: string | undefined;

    public constructor(path: string, box: Box) {
        this.path = path;
        this.box = box;
    }

    public process(root: string, imagePath: string, image: Image)  {
        const width = image.getWidth();
        const height = image.getHeight();

        const outputPath = root+(this.path);
        const x = this.box.scaleX(width);
        const y = this.box.scaleY(height);
        const w = this.box.scaleW(width);
        const h = this.box.scaleH(height);

        if (x == 0 && y == 0 && w == width && h == height && !this.transformers.length) {
            //Files.copy(imagePath, outputPath, StandardCopyOption.REPLACE_EXISTING);
            
        } else {
            let subImage = image.getSubimage(x, y, w, h);
            for (const op of this.transformers) {
                subImage = op(subImage);
            }
            // Slicer.writeImage(outputPath, subImage);
        }

        //final Path inputMetaPath = OutputFile.getMetaPath(imagePath);
        //if (Files.exists(inputMetaPath)) {
           // Files.copy(inputMetaPath, OutputFile.getMetaPath(outputPath), StandardCopyOption.REPLACE_EXISTING);
        //} else if (this.metadata != null) {
           // Files.writeString(OutputFile.getMetaPath(outputPath), this.metadata);
        //}
    }

    private static  getMetaPath(path: String) {
        return path + ".mcmeta";
    }

    public  apply(transform: (img: Image) => Image) {
       this.transformers.push(transform);
        return this;
    }

    public metadata(metadata: string) {
        this._metadata = metadata;
        return this;
    }
}