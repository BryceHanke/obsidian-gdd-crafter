<script lang="ts">
    import { LudosStore } from '../../stores/store.svelte';

    interface Props {
        ludosStore: LudosStore;
    }

    let { ludosStore }: Props = $props();
</script>

<div class="canvas-action">
    <button onclick={() => ludosStore.generateCanvas()}>
        Generate Flowchart
    </button>
</div>

<style>
    .canvas-action {
        padding: 1rem;
        text-align: center;
        border-top: 1px solid var(--background-modifier-border);
    }
    button {
        background-color: var(--interactive-accent);
        color: var(--text-on-accent);
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 500;
    }
    button:hover {
        background-color: var(--interactive-accent-hover);
    }
</style>
