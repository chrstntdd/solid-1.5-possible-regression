import { writeFileSync } from "node:fs"
import { resolve } from "node:path"

import { build as viteBuild } from "vite"

import type { OutputAsset } from "rollup"

main()

async function main() {
	let MOUNT_POINT = "<!--ssr-outlet-->"
	let HYDRATION_SCRIPT = "<!-- HYDRATION_SCRIPT -->"

	let [clientOutput] = await Promise.all([
		viteBuild({ resolve: { conditions: ["solid"] } }),
		viteBuild({
			mode: "ssg",
			resolve: {
				conditions: ["solid", "node"],
			},
			publicDir: false,
			build: {
				ssr: true,
				outDir: resolve("dist-ssg"),
				rollupOptions: {
					output: {
						format: "esm",
					},
					external: ["solid-js", "solid-js/web"],
					input: resolve("src", "main-ssg.tsx"),
				},
			},
		}),
	])

	/* Ensure we can run as a module with plain js extensions */
	writeFileSync(
		resolve("dist-ssg", "package.json"),
		JSON.stringify({ type: "module" }),
	)

	let template = // @ts-expect-error
	(clientOutput.output.find((m) => m.fileName === "index.html") as OutputAsset)
		.source as string

	let ssgEntryPath = resolve("dist-ssg", "main-ssg.js")

	let render = (await import(ssgEntryPath)).render

	let pages = [
		{
			path: "/",
			destination: "index.html",
		},
		{
			path: "/about",
			destination: "about.html",
		},
	]

	for (let { path, destination } of pages) {
		let { html: appAsHTML, hydrationScript } = await render(path)

		let doc = template
			.replace(MOUNT_POINT, appAsHTML)
			.replace(HYDRATION_SCRIPT, hydrationScript)

		writeFileSync(resolve("dist", destination), doc)
	}

	console.log("🥳 Done pre-rendering & optimizing 🚀")
	process.exit(0)
}
