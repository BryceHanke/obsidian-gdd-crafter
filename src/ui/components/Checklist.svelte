<script lang="ts">
    import { LudosStore } from '../../stores/store.svelte';

    interface Props {
        ludosStore: LudosStore;
    }

    let { ludosStore }: Props = $props();

    let items = $derived(ludosStore.checklistItems);
    let qaState = $derived(ludosStore.qaChecklist);

    // Group by category
    let groupedItems = $derived.by(() => {
        const groups: Record<string, any[]> = {};
        for (const item of items) {
            if (!groups[item.category]) groups[item.category] = [];
            groups[item.category].push(item);
        }
        return groups;
    });
</script>

<div class="ludos-checklist">
    <h3>Design Checklist</h3>
    {#if items.length === 0}
        <p class="empty-text">No checklist items defined for this type.</p>
    {:else}
        {#each Object.entries(groupedItems) as [category, group]}
            <div class="category">
                <h4>{category.toUpperCase()}</h4>
                {#each group as item}
                    <div class="checklist-item">
                        <label>
                            <input
                                type="checkbox"
                                checked={qaState[category]?.[item.id] || false}
                                onchange={(e) => ludosStore.updateChecklist(item.id, category, e.currentTarget.checked)}
                            />
                            <span class="label-text">{item.label}</span>
                        </label>
                        {#if item.description}
                            <p class="description">{item.description}</p>
                        {/if}
                    </div>
                {/each}
            </div>
        {/each}
    {/if}
</div>

<style>
    .ludos-checklist {
        padding: 1rem;
        border-top: 1px solid var(--background-modifier-border);
    }
    .category h4 {
        margin-bottom: 0.5rem;
        color: var(--text-muted);
        font-size: 0.8rem;
    }
    .checklist-item {
        margin-bottom: 0.5rem;
    }
    .label-text {
        margin-left: 0.5rem;
    }
    .description {
        font-size: 0.8rem;
        color: var(--text-muted);
        margin-left: 1.5rem;
        margin-top: 0.1rem;
    }
    .empty-text {
        color: var(--text-muted);
        font-style: italic;
    }
</style>
