import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";
import { iconsSpritesheet } from "vite-plugin-icons-spritesheet";
import viteTsConfigPaths from "vite-tsconfig-paths";

const config = defineConfig({
	plugins: [
		viteTsConfigPaths({
			projects: ["./tsconfig.json"],
		}),
		tailwindcss(),
		tanstackStart(),
		viteReact(),
		nitro({
			config: {
				preset: "bun",
			},
		}),
		iconsSpritesheet({
			withTypes: true,
			inputDir: "src/assets/icons",
			typesOutputFile: "src/assets/icons/types.ts",
			outputDir: "public/icons",
			formatter: "prettier",
		}),
	],
	server: {
		port: 3000,
	},
});

export default config;
