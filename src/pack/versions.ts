import type { Conversion, Pack, PackFormatVersion, VersionDown, VersionUp } from "./Pack";
import formats from "./formats.json" with { type: "json" };
// [...$0.children[2].children].map(x=>[...x.children].map(y=>y.innerText)).map(x=>({version: x[0].includes(".") ? x[0].split(".").map(x=>+x) : +x[0], mcVersions: x[1], mcReleases: x[2], changes: x[3]}))
interface Version {
	version: PackFormatVersion;
	up: VersionUp;
	down: VersionDown;
	mcVersions: string;
	mcReleases: string;
}
const versionsEqual = (a: PackFormatVersion, b: PackFormatVersion) => {
	if (a === b) return true;
	if (a instanceof Array && b instanceof Array) {
		if (a.length > b.length) return a.every((x, i) => x === (b[i] ?? 0));
		return b.every((x, i) => x === (a[i] ?? 0));
	}
	if (a instanceof Array) {
		return a[0] === b && a[1] === 0;
	}
	if (b instanceof Array) {
		return b[0] === a && b[1] === 0;
	}
	return a === b;
};
const modules = import.meta.glob("./versions/*.ts", { eager: true });
const moduleVersions = Object.values(modules) as Omit<Version, "mcVersions">[];
export const versions = formats.map(x => ({
	version: x.version,
	up: () => {},
	down: () => {},
	mcVersions: x.mcVersions,
	mcReleases: x.mcReleases,
	...(moduleVersions.find(y => versionsEqual(y.version, x.version)) ?? null),
}));

/*
Each version:
  up
------>  -------
        [VERSION]
<------  -------
  down
*/

export const performVersionChange = async (conv: Conversion, pack: Pack, from: PackFormatVersion, to: PackFormatVersion) => {
	if (from === to) return;
	const fromV = versions.find(x => versionsEqual(x.version, from))!;
	const toV = versions.find(x => versionsEqual(x.version, to))!;
	const dir = to > from ? "up" : "down";
	const vs =
		dir === "up"
			? versions.slice(versions.indexOf(fromV) + 1, versions.indexOf(toV) + 1)
			: versions.slice(versions.indexOf(toV) + 1, versions.indexOf(fromV) + 1).reverse();
	for (const v of vs) {
		if (!v) continue;
		await v[dir](conv, pack);
	}
	pack.setFormatVersion(to);
};
