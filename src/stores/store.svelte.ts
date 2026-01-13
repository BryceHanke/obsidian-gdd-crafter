import { App, TFile } from 'obsidian';

export class LudosStore {
	app: App;
	activeFile = $state<TFile | null>(null);
	activeFileType = $state<string | null>(null);

	constructor(app: App) {
		this.app = app;

		// Listen for active leaf changes
		this.app.workspace.on('active-leaf-change', (leaf) => {
			if (leaf && leaf.view.getViewType() === 'markdown') {
				this.activeFile = this.app.workspace.getActiveFile();
			} else {
				this.activeFile = null;
			}
		});

		// Initial check
		this.activeFile = this.app.workspace.getActiveFile();

		// Effect to derive active file type from frontmatter
		$effect(() => {
			if (this.activeFile) {
				const cache = this.app.metadataCache.getFileCache(this.activeFile);
				if (cache && cache.frontmatter) {
					this.activeFileType = cache.frontmatter.type || null;
				} else {
					this.activeFileType = null;
				}
			} else {
				this.activeFileType = null;
			}
		});

		// Listen for metadata changes to update type if frontmatter changes
		this.app.metadataCache.on('changed', (file) => {
			if (this.activeFile && file.path === this.activeFile.path) {
				const cache = this.app.metadataCache.getFileCache(file);
				if (cache && cache.frontmatter) {
					this.activeFileType = cache.frontmatter.type || null;
				} else {
					this.activeFileType = null;
				}
			}
		});
	}
}
