<script lang="ts">
	import { LudosStore } from '../../../stores/store.svelte';

	interface Props {
		ludosStore: LudosStore;
	}

	let { ludosStore }: Props = $props();
	let gddData = $derived(ludosStore.gddData);

	function update(section: 'story' | 'characters', value: string) {
		ludosStore.updateBodySection(section, value);
	}
</script>

{#if gddData}
	<div class="section">
		<div class="form-group">
			<label for="story">Story & Plot</label>
			<textarea id="story" rows="8" value={gddData.story} onchange={(e) => update('story', e.currentTarget.value)}></textarea>
		</div>
		<div class="form-group">
			<label for="characters">Characters</label>
			<textarea id="characters" rows="8" value={gddData.characters} onchange={(e) => update('characters', e.currentTarget.value)}></textarea>
		</div>
	</div>
{/if}
<style>
	.section { padding: 10px; }
	.form-group { margin-bottom: 15px; }
	label { display: block; margin-bottom: 5px; font-weight: bold; }
	textarea { width: 100%; resize: vertical; }
</style>
