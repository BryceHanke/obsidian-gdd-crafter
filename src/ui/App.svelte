<script lang="ts">
    import { LudosStore } from '../stores/store.svelte';
    import Checklist from './components/Checklist.svelte';
    import PropertiesEditor from './components/PropertiesEditor.svelte';
    import CanvasAction from './components/CanvasAction.svelte';

    interface Props {
        ludosStore: LudosStore;
    }

    let { ludosStore }: Props = $props();

    let activeFile = $derived(ludosStore.activeFile);
    let activeType = $derived(ludosStore.activeType);

    let activeTab = $state<'designer' | 'dev' | 'art'>('designer');

    function setTab(tab: 'designer' | 'dev' | 'art') {
        activeTab = tab;
    }
</script>

<div class="ludos-container">
    {#if activeFile}
        <div class="header">
            <h2>{activeFile.basename}</h2>
            <span class="type-badge">{activeType || 'Generic'}</span>
        </div>

        <div class="tabs">
            <button class:active={activeTab === 'designer'} onclick={() => setTab('designer')}>Designer</button>
            <button class:active={activeTab === 'dev'} onclick={() => setTab('dev')}>Dev</button>
            <button class:active={activeTab === 'art'} onclick={() => setTab('art')}>Art</button>
        </div>

        <div class="content">
            {#if activeTab === 'designer'}
                <PropertiesEditor {ludosStore} />
                <Checklist {ludosStore} />
                <CanvasAction {ludosStore} />
            {:else if activeTab === 'dev'}
                <div class="placeholder">
                    <p>Developer view (Technical specs, references)</p>
                     <PropertiesEditor {ludosStore} />
                </div>
            {:else if activeTab === 'art'}
                <div class="placeholder">
                    <p>Artist view (Asset references, mood board)</p>
                </div>
            {/if}
        </div>
    {:else}
        <div class="no-file">
            <p>Open a markdown file to start.</p>
        </div>
    {/if}
</div>

<style>
    .ludos-container {
        height: 100%;
        display: flex;
        flex-direction: column;
        background-color: var(--background-primary);
        color: var(--text-normal);
    }
    .header {
        padding: 1rem;
        border-bottom: 1px solid var(--background-modifier-border);
    }
    .header h2 {
        margin: 0;
        margin-bottom: 0.5rem;
    }
    .type-badge {
        background: var(--background-secondary);
        padding: 0.2rem 0.5rem;
        border-radius: 4px;
        font-size: 0.8rem;
    }
    .tabs {
        display: flex;
        border-bottom: 1px solid var(--background-modifier-border);
    }
    .tabs button {
        flex: 1;
        background: transparent;
        border: none;
        border-bottom: 2px solid transparent;
        padding: 0.5rem;
        cursor: pointer;
        color: var(--text-muted);
        border-radius: 0;
    }
    .tabs button:hover {
        background-color: var(--background-secondary);
    }
    .tabs button.active {
        border-bottom-color: var(--interactive-accent);
        color: var(--text-normal);
        font-weight: 600;
    }
    .content {
        flex: 1;
        overflow-y: auto;
    }
    .no-file, .placeholder {
        padding: 2rem;
        text-align: center;
        color: var(--text-muted);
    }
</style>
