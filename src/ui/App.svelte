<script lang="ts">
    import { LudosStore } from '../stores/store.svelte';
    import GDDEditor from './components/GDDEditor.svelte';

    interface Props {
        ludosStore: LudosStore;
    }

    let { ludosStore }: Props = $props();
</script>

<div class="app-container">
    <GDDEditor {ludosStore} />
</div>

<style>
    .app-container {
        height: 100%;
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }
</style>
