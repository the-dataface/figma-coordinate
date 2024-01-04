<script lang="ts">
	import { cubicOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';
	import { pluralize } from 'journalize';
	import { DownloadIcon, CompassIcon } from 'svelte-feather-icons';
	import Message, { postMessage } from '$ui/lib/components/Message.svelte';
	import FigmaIcon from './lib/components/figma-icons/FigmaIcon.svelte';

	let query = 'COORDINATE';

	let results: Results | undefined = undefined;
</script>

<!-- example message. hook into the Message component to capture events + data -->
<Message
	on:coordinated={(e) => {
		results = e.detail.results;
	}}
/>

<svelte:head>
	<title>Coordinate</title>
</svelte:head>

<div class="w-full h-full flex flex-row flex-wrap">
	<main
		id="main"
		class="w-full min-w-[320px] flex flex-col gap-8 flex-nowrap p-4 h-full overflow-y-auto pt-12"
	>
		<header
			class="flex flex-col gap-2 items-center justify-center max-w-sm mx-auto text-center"
		>
			<CompassIcon class="stroke-figma-color-text-brand" />
			<h1 class="text-figma-color-text font-bold text-4xl">Coordinate</h1>
			<p class="text-figma-color-text font-normal text-base">
				Export node locations to JSON. Find nodes by prefixing their name with
				the value below.
			</p>
		</header>

		<section class="w-full flex flex-row flex-wrap gap-2 justify-center">
			<label
				class="h-full relative flex flex-row gap-2 items-center w-fit bg-figma-color-bg border rounded-sm {query
					? 'border-figma-border-component focus-within:border-figma-color-border-selected'
					: 'border-figma-color-bg-danger'}"
			>
				<span class="absolute left-2.5 top-0.5 pointer-events-none">
					<FigmaIcon name="search" class="max-w-[16px]" size="lg" isLabelIcon />
				</span>
				<input
					class="pl-9 placeholder-opacity-90 h-full bg-figma-color-bg text-figma-color-text font-normal focus:ring-0 focus:outline-none min-h-[44px] min-w-[44px]"
					type="text"
					dir="auto"
					spellcheck="false"
					on:focus={(e) => e.target.select()}
					bind:value={query}
				/>
			</label>

			<button
				class="bg-figma-color-bg-brand text-figma-color-text border rounded-sm border-figma-color px-2 py-2 uppercase tracking-widest grid place-content-center hover:bg-figma-color-bg-brand-hover focus:bg-figma-color-bg-brand-hover active:bg-figma-color-bg-brand-pressed disabled:bg-figma-color-bg disabled:border-figma-color-bg-danger disabled:cursor-not-allowed font-bold min-h-[44px] min-w-[44px]"
				disabled={!query}
				on:click={() => {
					results = undefined;
					postMessage({ type: 'query', query });
				}}
			>
				<span>Go</span>
			</button>
		</section>

		{#if results !== undefined}
			<section
				id="results"
				class="flex-1 flex flex-col gap-0.5"
				in:fly={{ y: 300, easing: cubicOut }}
			>
				<p class="text-sm text-figma-color-text-secondary pl-1">
					{results.count} node{pluralize(results.nodes.length, 's', '')} found on
					{Object.keys(results.nodes).length} page{pluralize(
						Object.keys(results.nodes).length,
						's',
						''
					)}
				</p>

				<div class="rounded-md border border-figma-border p-4 relative">
					{#if results && results.count > 0}
						<div class="absolute top-2 right-2.5 flex flex-row gap-2">
							<a
								class="ml-auto bg-figma-color-bg-inverse text-figma-color-text-oninverse border border-figma-color-border rounded-md p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-base group"
								href={`data:text/json;charset=utf-8,${encodeURIComponent(
									JSON.stringify(results.nodes, null, 2)
								)}`}
								download="figma-coordinates.json"
							>
								<DownloadIcon
									class="stroke-figma-color-text-oninverse"
									strokeWidth={2}
									size="18"
								/>
								<span
									class="w-0 pl-0 overflow-hidden transition-all ease-out group-hover:pl-2 group-focus:pl-2 group-hover:w-[82px] group-focus:w-[82px]"
									>Download</span
								>
							</a>
						</div>
					{/if}

					<pre>{JSON.stringify(results.nodes, null, 2)}</pre>
				</div>
			</section>
		{/if}
	</main>
</div>

<style>
</style>
