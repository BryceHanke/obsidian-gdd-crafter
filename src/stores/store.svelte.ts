import { App, TFile } from 'obsidian';
import { GameElementRepository } from '../data/GameElementRepository';
import { SchemaService } from '../services/SchemaService';
import { CanvasGenerator } from '../services/CanvasGenerator';
import type { GameElement, LudosSettings, ChecklistItemDefinition } from '../types';

export class LudosStore {
    app: App;
    repo: GameElementRepository;
    schemaService!: SchemaService;
    canvasGenerator!: CanvasGenerator;

    activeFile = $state<TFile | null>(null);
    activeElement = $state<GameElement | null>(null);

    // Derived state
    activeType = $derived(this.activeElement?.type || '');
    verbSchema = $derived(this.schemaService?.getVerbSchema(this.activeType));
    checklistItems = $derived(this.schemaService?.getChecklistItems(this.activeType) || []);

    // Checklist state from frontmatter
    qaChecklist = $derived(this.activeElement?.frontmatter?.qa_checklist || {});

    constructor(app: App, settings: LudosSettings) {
        this.app = app;
        this.repo = new GameElementRepository(app);
        this.schemaService = new SchemaService(settings);
        this.canvasGenerator = new CanvasGenerator(app, this.repo);

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

        // Listen for modifications
        this.app.vault.on('modify', async (file) => {
             if (this.activeFile && file.path === this.activeFile.path) {
                 await this.refreshActiveElement();
             }
        });
    }

    async setActiveFile(file: TFile | null) {
        this.activeFile = file;
        await this.refreshActiveElement();
    }

    async refreshActiveElement() {
        if (this.activeFile) {
            this.activeElement = await this.repo.getById(this.activeFile.path);
        } else {
            this.activeElement = null;
        }
    }

    async updateFrontmatter(updates: Record<string, any>) {
        if (this.activeFile) {
            await this.repo.updateFrontmatter(this.activeFile.path, updates);
        }
    }

    async updateChecklist(itemId: string, category: string, checked: boolean) {
        if (!this.activeElement) return;

        // clone deep
        const currentChecklist = JSON.parse(JSON.stringify(this.qaChecklist));

        if (!currentChecklist[category]) {
            currentChecklist[category] = {};
        }
        currentChecklist[category][itemId] = checked;

        await this.updateFrontmatter({ qa_checklist: currentChecklist });
    }

    async generateCanvas() {
        if (!this.activeFile) return;
        const json = await this.canvasGenerator.generateLoopCanvas(this.activeFile);

        // Save to file
        const canvasPath = this.activeFile.path.replace(/\.md$/, '.canvas');
        let file = this.app.vault.getAbstractFileByPath(canvasPath);

        if (file instanceof TFile) {
            await this.app.vault.modify(file, json);
        } else {
            await this.app.vault.create(canvasPath, json);
        }
    }
}
