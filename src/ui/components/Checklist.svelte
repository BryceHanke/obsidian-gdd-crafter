<script lang="ts">
	import { LudosStore } from '../../stores/store.svelte';

	interface Props {
		ludosStore: LudosStore;
	}

	let { ludosStore }: Props = $props();

	let checklist = $state<Record<string, Record<string, boolean>>>({});

	// Load checklist from frontmatter
	$effect(() => {
		if (ludosStore.activeFile) {
			const cache = ludosStore.app.metadataCache.getFileCache(ludosStore.activeFile);
			if (cache && cache.frontmatter && cache.frontmatter.qa_checklist) {
				checklist = cache.frontmatter.qa_checklist;
			} else {
				// Default structure if missing
				checklist = {
					physics: { has_collision: false, blocking: false },
					audio: { open_sfx: false, close_sfx: false },
					ai: { blocks_sight: false, pathfinding_obstacle: false }
				};
			}
		}
	});

	async function updateChecklist() {
		if (ludosStore.activeFile) {
			await ludosStore.app.vault.process(ludosStore.activeFile, (data) => {
				// This is a naive implementation. In reality, we need to safely parse and update frontmatter.
				// For now, we assume standard frontmatter format and just ensure the key exists or update it.
				// A proper implementation would use a YAML parser/dumper to preserve content.

				// Using Obsidian's processFrontmatter if available or regex replacement
				// Since processFrontmatter isn't directly exposed on vault.process callback easily without proper helper:
				// We will simulate it by telling the store to handle it, or doing a simple replace for this prototype.

				// IMPORTANT: In a real plugin, use app.fileManager.processFrontmatter(file, ...)
				return data;
			});

			// Better approach: Use fileManager.processFrontmatter
			await ludosStore.app.fileManager.processFrontmatter(ludosStore.activeFile, (frontmatter) => {
				frontmatter.qa_checklist = checklist;
			});
		}
	}

	function toggleItem(category: string, item: string) {
		if (checklist[category]) {
			checklist[category][item] = !checklist[category][item];
			updateChecklist();
		}
	}
</script>

<div class="checklist">
	{#each Object.entries(checklist) as [category, items]}
		<div class="category">
			<h4>{category}</h4>
			{#each Object.entries(items) as [item, value]}
				<label class="checklist-item">
					<input type="checkbox" checked={value} onchange={() => toggleItem(category, item)} />
					<span>{item.replace(/_/g, ' ')}</span>
				</label>
			{/each}
		</div>
	{/each}
</div>

<style>
	.category {
		margin-bottom: 10px;
	}
	.checklist-item {
		display: flex;
		align-items: center;
		margin-bottom: 4px;
		cursor: pointer;
	}
	.checklist-item span {
		margin-left: 8px;
	}
</style>
