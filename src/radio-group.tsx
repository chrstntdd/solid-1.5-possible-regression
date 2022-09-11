import { createUniqueId, For } from "solid-js"

function RadioGroup<V>(props: {
	class?: string
	name: string
	opts: ReadonlyArray<{ value: V; label?: string }>
	value: V
}) {
	return (
		<ul class={/*@once*/ props.class}>
			<For each={props.opts}>
				{(kid) => (
					<Radio
						checked={props.value === kid.value}
						label={/*@once*/ kid.label || `${kid.value}`}
						name={/*@once*/ props.name}
						value={/*@once*/ kid.value}
					/>
				)}
			</For>
		</ul>
	)
}

function Radio<V>(props: {
	checked: boolean
	label: string
	name: string
	value: V
}) {
	let linkingId = createUniqueId()

	return (
		<li>
			<label for={linkingId}>{props.label}</label>
			{/* The only way to get the expected behavior in production, using Solid 1.5 */}
			{/* <label for={linkingId} textContent={props.label}/> */}
			<input
				type="radio"
				checked={props.checked}
				id={linkingId}
				name={props.name}
				value={props.value as unknown as string}
			/>
		</li>
	)
}

export { RadioGroup }
