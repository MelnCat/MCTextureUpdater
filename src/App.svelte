<script lang="ts">
	import { unzipSync, zip, zipSync } from "fflate";
	import { ZipPack } from "./pack/ZipPack";
	import type { Conversion } from "./pack/Pack";
	import { performVersionChange, versions } from "./pack/versions";

	let files = $state<FileList>();
	let folder = $state<FileList>();
	let target = $state<number>(versions.findLastIndex(x => x.mcReleases));
	let showSnapshots = $state<boolean>(false);

	const start = async () => {
		let data = (
			files?.length
				? Object.entries(unzipSync(new Uint8Array(await files[0].arrayBuffer())))
				: await Promise.all([...folder!].map(async x => [x.webkitRelativePath, new Uint8Array(await x.arrayBuffer())] as const))
		).filter(x => x[1].length);
		const name = files?.length
			? files[0].name.replace(/\.zip$/, "")
			: data.find(x => x[0].split("/").includes("pack.mcmeta"))![0].split("/")[0];
		const packMcMeta = data.find(x => x[0].split("/").includes("pack.mcmeta"));
		if (!packMcMeta) {
			const assetsDir = data.find(x => x[0].split("/").includes("assets"));
			if (assetsDir) {
				const assetIndex = assetsDir[0].split("/").indexOf("assets");
				if (assetIndex > 0) data = data.map(x => [x[0].split("/").slice(assetIndex).join("/"), x[1]]);
			}
		} else {
			const packIndex = packMcMeta[0].split("/").indexOf("pack.mcmeta");
			if (packIndex > 0) data = data.map(x => [x[0].split("/").slice(packIndex).join("/"), x[1]]);
		}
		const zipPack = await ZipPack.fromZip(Object.fromEntries(data as [string, Uint8Array<ArrayBuffer>][]));

		let vanilla: ZipPack | null = null;
		const conversion: Conversion = {
			info(info, opts) {
				console.info(info, opts);
			},
			warning(info, opts) {
				console.warn(info, opts);
			},
			urgent(info, opts) {
				console.error(info, opts);
			},
			pack: zipPack,
			async loadVanilla() {
				const mc = await (
					await fetch("https://piston-data.mojang.com/v1/objects/4509ee9b65f226be61142d37bf05f8d28b03417b/client.jar")
				).arrayBuffer();
				const zipped = unzipSync(new Uint8Array(mc)) as Record<string, Uint8Array<ArrayBuffer>>;
				vanilla = await ZipPack.fromZip(
					Object.fromEntries(Object.entries(zipped).filter(x => x[0].startsWith("assets/") && x[1].length))
				);
			},
			vanillaFile(path) {
				if (!vanilla) throw new Error(`vanillaFile used before loadVanilla()`);
				const file = vanilla.image(path);
				if (!file) throw new Error(`No vanilla file at ${path}`);
				return file;
			},
		};

		const targetVersion = versions[target];
		await performVersionChange(conversion, zipPack, zipPack.getFormatVersion(), targetVersion.version);

		const blob = new Blob([zipSync(await zipPack.toZip()) as Uint8Array<ArrayBuffer>], { type: "application/zip" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = `${name}-v${typeof targetVersion.version === "number" ? targetVersion.version : targetVersion.version.join(".")}.zip`;
		link.click();
		URL.revokeObjectURL(url);
	};
</script>

<main>
	<h1>Minecraft Resource Pack Converter</h1>
	<div>
		<label for="pack">Choose your resource pack:</label>
		<input accept="application/zip" bind:files name="pack" type="file" />
	</div>
	<div>
		<label for="pack">Or a folder:</label>
		<input bind:files={folder} name="pack" type="file" webkitdirectory />
	</div>
	<div>
		<label for="showSnapshots">Show snapshots</label>
		<input bind:checked={showSnapshots} name="showSnapshots" type="checkbox" />
	</div>
	<div>
		<label for="target">Target version</label>
		<select name="target" bind:value={target}>
			{#each versions as v, i}
				{#if showSnapshots || v.mcReleases}
					<option value={i} selected={v === versions.at(-1)}
						>{typeof v.version === "number" ? v.version : v.version.join(".")} ({showSnapshots
							? v.mcVersions
							: (v.mcReleases ?? v.mcVersions)})</option
					>
				{/if}
			{/each}
		</select>
	</div>
	<button onclick={start} disabled={(!files || files.length === 0) && (!folder || folder.length === 0)}>Convert</button>
</main>

<style>
</style>
