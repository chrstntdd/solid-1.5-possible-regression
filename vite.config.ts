import { defineConfig } from "vite"
import solid from "vite-plugin-solid"

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	let isSSG = mode === "ssg"

	return {
		plugins: [
			solid(
				isSSG
					? { ssr: true, solid: { hydratable: true, generate: "ssr" } }
					: undefined,
			),
		],
		build: { manifest: !isSSG },
		server: { port: 3000 },
	}
})
