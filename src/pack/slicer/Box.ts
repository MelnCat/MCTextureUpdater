// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license. 

export class Box {
	constructor(public x: number, public y: number, public w: number, public h: number, public totalW: number, public totalH: number) {}
	public scaleX(imgWidth: number): number {
		return (this.x * imgWidth) / this.totalW;
	}

	public scaleY(imgHeight: number): number {
		return (this.y * imgHeight) / this.totalH;
	}

	public scaleW(imgWidth: number): number {
		return (this.w * imgWidth) / this.totalW;
	}

	public scaleH(imgHeight: number): number {
		return (this.h * imgHeight) / this.totalH;
	}
}
