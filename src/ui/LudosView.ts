import { ItemView, WorkspaceLeaf } from 'obsidian';
import { LudosStore } from '../stores/store.svelte';
import { mount, unmount } from 'svelte';
import App from './App.svelte';

export const LUDOS_VIEW_TYPE = 'ludos-view';

export class LudosView extends ItemView {
	ludosStore: LudosStore;
	component: any;

	constructor(leaf: WorkspaceLeaf, ludosStore: LudosStore) {
		super(leaf);
		this.ludosStore = ludosStore;
	}

	getViewType() {
		return LUDOS_VIEW_TYPE;
	}

	getDisplayText() {
		return 'Ludos Game Design';
	}

	getIcon() {
		return 'gamepad-2';
	}

	async onOpen() {
		const container = this.containerEl.children[1];
		container.empty();

		this.component = mount(App, {
			target: container,
			props: {
				ludosStore: this.ludosStore,
			},
		});
	}

	async onClose() {
		if (this.component) {
			unmount(this.component);
		}
	}
}
