import { lazy, Match, Suspense, Switch } from "solid-js"

const Generate = lazy(() => import("./generate"))

import * as styles from "./app.css"

function App(props: { url: string }) {
	return (
		<main>
			<Suspense>
				<Switch fallback={<Generate />}>
					<Match when={props.url === "/"}>
						<Generate />
					</Match>
				</Switch>
			</Suspense>
		</main>
	)
}

export { App }
