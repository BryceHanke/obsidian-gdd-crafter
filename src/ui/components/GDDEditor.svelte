<script lang="ts">
    import { LudosStore } from '../../stores/store.svelte';
    import Concept from './sections/Concept.svelte';

    interface Props {
        ludosStore: LudosStore;
    }

    let { ludosStore }: Props = $props();

    let activeTab = $state<'concept' | 'design' | 'narrative' | 'aesthetics'>('concept');

    function setTab(tab: typeof activeTab) {
        activeTab = tab;
    }
</script>

<div class="gdd-editor">
    <div class="sidebar">
        <button class="nav-item" class:active={activeTab === 'concept'} onclick={() => setTab('concept')}>
            <span class="icon">💡</span>
            <span class="label">Concept</span>
        </button>
        <button class="nav-item" class:active={activeTab === 'design'} onclick={() => setTab('design')}>
            <span class="icon">📐</span>
            <span class="label">Design</span>
        </button>
        <button class="nav-item" class:active={activeTab === 'narrative'} onclick={() => setTab('narrative')}>
            <span class="icon">📜</span>
            <span class="label">Narrative</span>
        </button>
        <button class="nav-item" class:active={activeTab === 'aesthetics'} onclick={() => setTab('aesthetics')}>
            <span class="icon">🎨</span>
            <span class="label">Aesthetics</span>
        </button>
    </div>
    <div class="editor-canvas">
        {#if activeTab === 'concept'}
            <Concept {ludosStore} />
        {:else}
            <div class="placeholder">
                <h3>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h3>
                <p>This section is under construction.</p>
            </div>
        {/if}
    </div>
</div>

<style>
    .gdd-editor {
        display: grid;
        grid-template-columns: 200px 1fr;
        height: 100%;
        background-color: var(--background-primary);
        color: var(--text-normal);
        overflow: hidden;
    }

    .sidebar {
        background-color: var(--background-secondary);
        border-right: 1px solid var(--background-modifier-border);
        display: flex;
        flex-direction: column;
        padding: 1rem 0;
    }

    .nav-item {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.75rem 1.5rem;
        cursor: pointer;
        transition: background-color 0.2s;
        color: var(--text-muted);
        background: transparent;
        border: none;
        width: 100%;
        text-align: left;
        border-radius: 0;
    }

    .nav-item:hover {
        background-color: var(--background-modifier-hover);
        color: var(--text-normal);
    }

    .nav-item.active {
        background-color: var(--background-active);
        color: var(--text-accent);
        border-left: 3px solid var(--text-accent);
        padding-left: calc(1.5rem - 3px);
    }

    .nav-item .icon {
        font-size: 1.2rem;
    }

    .nav-item .label {
        font-weight: 500;
    }

    .editor-canvas {
        padding: 0;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
    }

    .placeholder {
        padding: 2rem;
        text-align: center;
        color: var(--text-muted);
    }
</style>
