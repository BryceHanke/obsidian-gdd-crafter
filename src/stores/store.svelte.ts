import { App, TFile } from 'obsidian';
import { parseGDD, updateTitle, updateMetadata, updateSection } from '../utils/markdownParser';
import type { GDDData, LudosSettings } from '../types';

export class LudosStore {
    app: App;
    activeFile = $state<TFile | null>(null);
    gddData = $state<GDDData | null>(null);

    constructor(app: App, settings: LudosSettings) {
        this.app = app;

        // Listen for active leaf changes
        this.app.workspace.on('active-leaf-change', (leaf) => {
            if (leaf && leaf.view.getViewType() === 'markdown') {
                this.setActiveFile(this.app.workspace.getActiveFile());
            }
        });

        // Initial check
        this.setActiveFile(this.app.workspace.getActiveFile());

        // Listen for modifications
        this.app.vault.on('modify', async (file) => {
             if (this.activeFile && file.path === this.activeFile.path) {
                 await this.loadFile(this.activeFile);
             }
        });
    }

    async setActiveFile(file: TFile | null) {
        this.activeFile = file;
        if (file) {
            await this.loadFile(file);
        } else {
            this.gddData = null;
        }
    }

    async loadFile(file: TFile) {
        const content = await this.app.vault.read(file);
        this.gddData = parseGDD(content);
    }

    async updateGDDTitle(newTitle: string) {
        if (!this.activeFile) return;
        const content = await this.app.vault.read(this.activeFile);
        const newContent = updateTitle(content, newTitle);
        await this.app.vault.modify(this.activeFile, newContent);
    }

    async updateGDDMetadata(key: string, value: string) {
        if (!this.activeFile) return;
        const content = await this.app.vault.read(this.activeFile);
        const newContent = updateMetadata(content, key, value);
        await this.app.vault.modify(this.activeFile, newContent);
    }

    async updateGDDSection(header: string, newContent: string) {
        if (!this.activeFile) return;
        const content = await this.app.vault.read(this.activeFile);
        const newContentStr = updateSection(content, header, newContent);
        await this.app.vault.modify(this.activeFile, newContentStr);
    }
}
