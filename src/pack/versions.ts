import type { Conversion, Pack, VersionDown, VersionUp } from "./Pack";

interface Version {
	version: number;
	up: VersionUp;
	down: VersionDown;
}
const modules = import.meta.glob("./versions/*.ts", { eager: true });
export const versions = (
	Object.values(modules) as Version[]
).sort((a, b) => a.version - b.version);

export const performVersionChange = async (conv: Conversion, pack: Pack, from: number, to: number) => {
	if (from === to) return;
	const dir = to > from ? "up" : "down";
	const vs = versions.filter(x => (dir === "up" ? x.version > from && x.version <= to : x.version < from && x.version >= to));
	if (dir === "down") vs.reverse();
	for (const v of vs) {
		if (!v) continue;
		await v[dir](conv, pack);
	}
	pack.setFormatVersion(to);
};
