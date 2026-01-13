import { Plugin, ItemView, WorkspaceLeaf } from 'obsidian';
import { LudosView, LUDOS_VIEW_TYPE } from './src/ui/LudosView';
import { LudosStore } from './src/stores/store.svelte';

export default class LudosPlugin extends Plugin {
	ludosStore: LudosStore;

	async onload() {
		// Initialize the store
		this.ludosStore = new LudosStore(this.app);

		// Register the custom view
		this.registerView(
			LUDOS_VIEW_TYPE,
			(leaf) => new LudosView(leaf, this.ludosStore)
		);

		// Add a ribbon icon to activate the view
		this.addRibbonIcon('gamepad-2', 'Open Ludos', () => {
			this.activateView();
		});

		// Add a command to activate the view
		this.addCommand({
			id: 'open-ludos-view',
			name: 'Open Ludos Dashboard',
			callback: () => {
				this.activateView();
			},
		});
	}

	async onunload() {
		this.app.workspace.detachLeavesOfType(LUDOS_VIEW_TYPE);
	}

	async activateView() {
		const { workspace } = this.app;

		let leaf: WorkspaceLeaf | null = null;
		const leaves = workspace.getLeavesOfType(LUDOS_VIEW_TYPE);

		if (leaves.length > 0) {
			// A leaf with our view already exists, use it
			leaf = leaves[0];
		} else {
			// Our view could not be found in the workspace, create a new leaf
			// in the right sidebar for default placement
			leaf = workspace.getRightLeaf(false);
			await leaf.setViewState({ type: LUDOS_VIEW_TYPE, active: true });
		}

		// "Reveal" the leaf in case it is in a collapsed sidebar
		workspace.revealLeaf(leaf);
	}
}
