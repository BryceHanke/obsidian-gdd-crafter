<script lang="ts">
    import { LudosStore } from '../../../stores/store.svelte';

    interface Props {
        ludosStore: LudosStore;
    }

    let { ludosStore }: Props = $props();

    let gddData = $derived(ludosStore.gddData);

    function updateMetadata(key: string, value: string) {
        ludosStore.updateGDDMetadata(key, value);
    }

    function updateSection(header: string, value: string) {
        ludosStore.updateGDDSection(header, value);
    }
</script>

<div class="concept-section">
    {#if gddData}
        <div class="form-group">
            <label for="genre">Genre</label>
            <input
                id="genre"
                type="text"
                value={gddData.genre}
                onblur={(e) => updateMetadata('Genre', e.currentTarget.value)}
            />
        </div>

        <div class="form-group">
            <label for="audience">Target Audience</label>
            <input
                id="audience"
                type="text"
                value={gddData.audience}
                onblur={(e) => updateMetadata('Audience', e.currentTarget.value)}
            />
        </div>

        <div class="form-group">
            <label for="tagline">Tagline</label>
            <input
                id="tagline"
                type="text"
                value={gddData.tagline || ''}
                onblur={(e) => updateMetadata('Tagline', e.currentTarget.value)}
            />
        </div>

        <div class="form-group">
            <label for="hook">USP / Hook</label>
            <textarea
                id="hook"
                value={gddData.hook}
                onblur={(e) => updateSection('Hook', e.currentTarget.value)}
                rows="4"
            ></textarea>
        </div>

        <div class="form-group">
            <label for="theme">Theme</label>
            <textarea
                id="theme"
                value={gddData.theme}
                onblur={(e) => updateSection('Theme', e.currentTarget.value)}
                rows="4"
            ></textarea>
        </div>
    {:else}
        <div class="empty-state">
            <p>No Game Design Document detected. Please ensure the file is active.</p>
        </div>
    {/if}
</div>

<style>
    .concept-section {
        padding: 1rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
    .form-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }
    label {
        font-weight: 600;
        color: var(--text-accent);
        font-size: 0.9em;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }
    input, textarea {
        background: var(--background-primary);
        border: 1px solid var(--background-modifier-border);
        color: var(--text-normal);
        padding: 0.5rem;
        border-radius: 4px;
        width: 100%;
        font-family: var(--font-text);
    }
    input:focus, textarea:focus {
        border-color: var(--interactive-accent);
        outline: none;
        box-shadow: 0 0 0 2px var(--background-modifier-border-focus);
    }
    .empty-state {
        text-align: center;
        color: var(--text-muted);
        margin-top: 2rem;
    }
</style>
