import { App, TFile } from 'obsidian';
import type { GDDData } from '../types';
import { parseGDD, updateGDDSection, SECTION_HEADERS, generateGDDTemplate } from '../utils/markdownParser';

export class LudosStore {
	app: App;
	_activeFile = $state<TFile | null>(null);
	_gddData = $state<GDDData | null>(null);

	// Check if the current file is recognized as a GDD
	isGDD = $derived(this._gddData !== null);

	get activeFile() {
		return this._activeFile;
	}

	get gddData() {
		return this._gddData;
	}

	constructor(app: App) {
		this.app = app;

		// Listen for active leaf changes
		this.app.workspace.on('active-leaf-change', (leaf) => {
			if (leaf && leaf.view.getViewType() === 'markdown') {
				this.setActiveFile(this.app.workspace.getActiveFile());
			} else {
				this.setActiveFile(null);
			}
		});

		// Initial check
		this.setActiveFile(this.app.workspace.getActiveFile());

		// Listen for file changes (both content and metadata)
		// This ensures that if the file is edited outside the plugin (e.g. in the editor), the plugin view updates.
		this.app.vault.on('modify', (file) => {
			 if (this._activeFile && file.path === this._activeFile.path) {
				 // We re-load the GDD data.
				 // Note: This might cause UI glitches if typing continuously and autosaving triggers this.
				 // Ideal components will handle their own state and only commit on blur/debounce.
				 this.loadGDD(this._activeFile);
			 }
		});
	}

	async setActiveFile(file: TFile | null) {
		this._activeFile = file;
		if (file) {
			await this.loadGDD(file);
		} else {
			this._gddData = null;
		}
	}

	async loadGDD(file: TFile) {
		const cache = this.app.metadataCache.getFileCache(file);

		// We rely on 'type: gdd' in frontmatter to identify GDD files.
		const frontmatter = cache?.frontmatter;
		if (frontmatter?.type === 'gdd') {
			const content = await this.app.vault.read(file);
			this._gddData = parseGDD(content, frontmatter);
		} else {
			this._gddData = null;
		}
	}

	async initializeGDD() {
		if (!this._activeFile) return;

		const template = generateGDDTemplate();
		await this.app.vault.modify(this._activeFile, template);
	}

	async updateFrontmatterField(key: string, value: any) {
		if (!this._activeFile) return;

		// update local state optimistically?
		// Actually, processFrontMatter triggers a file modify, which triggers loadGDD.
		// So we just need to ensure the write happens.
		await this.app.fileManager.processFrontMatter(this._activeFile, (frontmatter) => {
			frontmatter[key] = value;
		});
	}

	async updateBodySection(headerKey: keyof typeof SECTION_HEADERS, newContent: string) {
		if (!this._activeFile) return;

		const header = SECTION_HEADERS[headerKey];
		const content = await this.app.vault.read(this._activeFile);
		const newFileContent = updateGDDSection(content, header, newContent);

		if (newFileContent !== content) {
			await this.app.vault.modify(this._activeFile, newFileContent);
		}
	}
}
