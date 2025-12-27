import type { VersionDown, VersionUp } from "../Pack";

export const version = 13;
export const up: VersionUp = (conv, pack) => {
	if (pack.exists("textures/misc/enchanted_item_glint")) {
		const scaled = pack.delete("textures/misc/enchanted_item_glint")!.content;
		pack.add("textures/misc/enchanted_glint_item", scaled);
		pack.add("textures/misc/enchanted_glint_entity", scaled);
		conv.info("Enchantment glint textures were split into two in 13.", {
			paths: ["textures/misc/enchanted_glint_item", "textures/misc/enchanted_glint_entity"],
		});
	}
	if (pack.exists("textures/gui/container/smithing")) {
		pack.rename("textures/gui/container/smithing", "textures/gui/container/legacy_smithing");
		conv.info("textures/gui/container/smithing was renamed to legacy_smithing in 13.", {
			path: "textures/gui/container/legacy_smithing",
		});
	}
};
export const down: VersionDown = (conv, pack) => {
	if (pack.exists("textures/misc/enchanted_glint_item")) {
		conv.warning("Before 13, enchantment glint was 64x64 and used the same image for both items and entities.", {
			path: "textures/misc/enchanted_glint_item",
		});
	}
	if (pack.exists("textures/misc/enchanted_glint_entity")) {
		conv.warning("Before 13, enchantment glint was 64x64 and used the same image for both items and entities.", {
			path: "textures/misc/enchanted_glint_item",
		});
	}
	if (pack.exists("textures/gui/container/smithing")) {
		pack.delete("textures/gui/container/smithing");
		conv.info("textures/gui/container/legacy_smithing was smithing before 13.");
	}
	if (pack.exists("textures/gui/container/legacy_smithing")) {
		pack.rename("textures/gui/container/legacy_smithing", "textures/gui/container/smithing");
		conv.info("textures/gui/container/legacy_smithing was smithing before 13.", {
			path: "textures/gui/container/smithing",
		});
	}
};
