import { App, TFile } from 'obsidian';
import type { GDDData } from '../types';
import { parseGDD, updateGDDSection, updateGDDMetadata, SECTION_HEADERS, generateGDDTemplate } from '../utils/markdownParser';

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
		this.app.vault.on('modify', (file) => {
			 if (this._activeFile && file.path === this._activeFile.path) {
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
        // Read content to check for GDD marker
        const content = await this.app.vault.read(file);

        // Check for code block marker OR frontmatter (legacy)
        const hasCodeBlock = content.includes('```json:ludos');
        const cache = this.app.metadataCache.getFileCache(file);
        const hasFrontmatter = cache?.frontmatter?.type === 'gdd';

        if (hasCodeBlock || hasFrontmatter) {
			this._gddData = parseGDD(content, cache?.frontmatter);
		} else {
			this._gddData = null;
		}
	}

	async initializeGDD() {
		if (!this._activeFile) return;

		const template = generateGDDTemplate();
		await this.app.vault.modify(this._activeFile, template);
	}

	async updateMetadataField(key: string, value: any) {
		if (!this._activeFile) return;

        const content = await this.app.vault.read(this._activeFile);

        // Pass current gddData as baseline for migration
        const currentData = this._gddData ? {
            title: this._gddData.title,
            genre: this._gddData.genre,
            tagline: this._gddData.tagline,
            targetAudience: this._gddData.targetAudience
        } : undefined;

        const newContent = updateGDDMetadata(content, key, value, currentData);

        if (newContent !== content) {
            await this.app.vault.modify(this._activeFile, newContent);
        }
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
