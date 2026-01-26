<script lang="ts">
	import { LudosStore } from '../../../stores/store.svelte';

	interface Props {
		ludosStore: LudosStore;
	}

	let { ludosStore }: Props = $props();
	let gddData = $derived(ludosStore.gddData);

	function update(key: string, value: string) {
		ludosStore.updateFrontmatterField(key, value);
	}
</script>

{#if gddData}
	<div class="section">
		<div class="form-group">
			<label for="title">Game Title</label>
			<input type="text" id="title" value={gddData.title} onchange={(e) => update('title', e.currentTarget.value)} />
		</div>
		<div class="form-group">
			<label for="genre">Genre</label>
			<input type="text" id="genre" value={gddData.genre} onchange={(e) => update('genre', e.currentTarget.value)} />
		</div>
		<div class="form-group">
			<label for="tagline">Tagline</label>
			<input type="text" id="tagline" value={gddData.tagline} onchange={(e) => update('tagline', e.currentTarget.value)} />
		</div>
		<div class="form-group">
			<label for="targetAudience">Target Audience</label>
			<input type="text" id="targetAudience" value={gddData.targetAudience} onchange={(e) => update('targetAudience', e.currentTarget.value)} />
		</div>
	</div>
{/if}

<style>
	.section { padding: 10px; }
	.form-group { margin-bottom: 15px; }
	label { display: block; margin-bottom: 5px; font-weight: bold; }
	input { width: 100%; }
</style>
