<script lang="ts">
    import { LudosStore } from '../../stores/store.svelte';

    interface Props {
        ludosStore: LudosStore;
    }

    let { ludosStore }: Props = $props();

    let schema = $derived(ludosStore.verbSchema);
    let frontmatter = $derived(ludosStore.activeElement?.frontmatter || {});
</script>

<div class="ludos-properties">
    <h3>Properties</h3>
    {#if !schema}
        <p class="empty-text">No schema defined for this type.</p>
    {:else}
        <div class="form-grid">
            {#each schema.properties as prop}
                <div class="form-item">
                    <label for={prop.name}>{prop.name}</label>

                    {#if prop.type === 'boolean'}
                         <div class="toggle-wrapper">
                            <input
                                type="checkbox"
                                id={prop.name}
                                class="toggle"
                                checked={frontmatter[prop.name] ?? prop.default}
                                onchange={(e) => ludosStore.updateFrontmatter({ [prop.name]: e.currentTarget.checked })}
                            />
                        </div>
                    {:else if prop.type === 'number'}
                        <input
                            type="number"
                            id={prop.name}
                            value={frontmatter[prop.name] ?? prop.default}
                            oninput={(e) => ludosStore.updateFrontmatter({ [prop.name]: Number(e.currentTarget.value) })}
                        />
                    {:else if prop.type === 'dropdown'}
                        <select
                            id={prop.name}
                            value={frontmatter[prop.name] ?? prop.default}
                            onchange={(e) => ludosStore.updateFrontmatter({ [prop.name]: e.currentTarget.value })}
                        >
                            {#each prop.options || [] as option}
                                <option value={option}>{option}</option>
                            {/each}
                        </select>
                    {:else}
                        <input
                            type="text"
                            id={prop.name}
                            value={frontmatter[prop.name] ?? prop.default}
                            oninput={(e) => ludosStore.updateFrontmatter({ [prop.name]: e.currentTarget.value })}
                        />
                    {/if}
                </div>
            {/each}
        </div>
    {/if}
</div>

<style>
    .ludos-properties {
        padding: 1rem;
    }
    .form-item {
        margin-bottom: 1rem;
    }
    label {
        display: block;
        margin-bottom: 0.25rem;
        font-weight: 600;
        font-size: 0.9em;
        color: var(--text-muted);
    }
    input[type="text"], input[type="number"], select {
        width: 100%;
        padding: 0.5rem;
        background: var(--background-modifier-form-field);
        border: 1px solid var(--background-modifier-border);
        border-radius: 4px;
        color: var(--text-normal);
    }
    .empty-text {
        color: var(--text-muted);
        font-style: italic;
    }
</style>
