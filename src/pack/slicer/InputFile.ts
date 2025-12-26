// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

import type { OutputFile } from "./OutputFile";
import { slicerPack } from "./slicer";

export class InputFile {
	private path: string;
	private _outputs: OutputFile[] = [];

	public constructor(path: string) {
		this.path = path;
	}

	public outputs(...files: OutputFile[]) {
		this._outputs.push(...files);
		return this;
	}

	public process(inputRoot: string, outputRoot: string, leftoverRoot: string | undefined) {
		const inputPath = inputRoot + this.path;
		// if (Files.exists(inputPath)) {
		const image = slicerPack.image(this.path);

		if (!image) return;
		for (const outputFile of this._outputs) {
			outputFile.process(outputRoot, inputPath, image);
		}
	}
}
