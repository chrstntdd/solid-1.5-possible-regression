import { createSignal } from "solid-js"

import { RadioGroup } from "./radio-group"

const WORD_COUNT_OPTS = [
	{ value: 6 },
	{ value: 7 },
	{ value: 8 },
	{ value: 9 },
	{ value: 10 },
]

const FORM_ID = "gen-form"

function Generate() {
	let { ctx, onCountChange } = useGenerate()

	return (
		<section>
			<form id={FORM_ID}>
				<fieldset onChange={onCountChange}>
					<legend>Count</legend>
					<RadioGroup
						value={ctx.phraseCount()}
						name={"PHRASE_COUNT_KEY"}
						opts={WORD_COUNT_OPTS}
					/>
				</fieldset>
			</form>
		</section>
	)
}

const enum Msg {
	ChangeCount,
}

function useGenerate() {
	let [phraseCount, setPhraseCount] = createSignal(8)
	let [separators] = createSignal<Array<string>>([])
	let [phrases] = createSignal<Array<string>>([])

	function handleEvent(kind: Msg, ogEvent: Event) {
		switch (kind) {
			case Msg.ChangeCount: {
				setPhraseCount(+(ogEvent.target as HTMLInputElement).value)
				break
			}
		}
	}

	return {
		ctx: {
			phraseCount,
			separators,
			phrases,
		},
		onCountChange(e: Event) {
			handleEvent(Msg.ChangeCount, e)
		},
	}
}

export default Generate
