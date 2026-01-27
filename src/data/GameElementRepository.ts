import { App, TFile, TFolder } from 'obsidian';
import type { GameElement } from '../types';

export class GameElementRepository {
    app: App;

    constructor(app: App) {
        this.app = app;
    }

    async getById(id: string): Promise<GameElement | null> {
        const file = this.app.vault.getAbstractFileByPath(id);
        if (file instanceof TFile) {
            return this.fileToElement(file);
        }
        return null;
    }

    async getByType(type: string): Promise<GameElement[]> {
        const files = this.app.vault.getMarkdownFiles();
        const elements: GameElement[] = [];

        for (const file of files) {
            const cache = this.app.metadataCache.getFileCache(file);
            if (cache?.frontmatter?.type === type || cache?.frontmatter?.type?.startsWith(type)) {
                const element = await this.fileToElement(file);
                if (element) elements.push(element);
            }
        }
        return elements;
    }

    async save(element: GameElement): Promise<void> {
        const file = this.app.vault.getAbstractFileByPath(element.id);
        if (file instanceof TFile) {
             await this.app.vault.process(file, (content) => {
                 // We only update frontmatter via specific methods usually,
                 // but here we assume the element might have updated content.
                 // Ideally we separate content update from metadata update.
                 // For now, let's assume we are updating the file content if provided.
                 return element.content;
             });
        }
    }

    async updateFrontmatter(id: string, updates: Record<string, any>): Promise<void> {
        const file = this.app.vault.getAbstractFileByPath(id);
        if (file instanceof TFile) {
            await this.app.fileManager.processFrontMatter(file, (frontmatter) => {
                for (const [key, value] of Object.entries(updates)) {
                    frontmatter[key] = value;
                }
            });
        }
    }

    private async fileToElement(file: TFile): Promise<GameElement | null> {
        const cache = this.app.metadataCache.getFileCache(file);
        if (!cache) return null;

        const content = await this.app.vault.read(file);

        return {
            id: file.path,
            name: file.basename,
            type: cache.frontmatter?.type || 'Generic',
            tags: cache.tags?.map(t => t.tag) || [],
            frontmatter: cache.frontmatter || {},
            content: content
        };
    }

    // Placeholder for Asset Shadowing
    async scanExternalAssets(path: string): Promise<void> {
        if (!path) return;

        try {
            // Check if we are in a node environment where 'fs' is available
            const fs = require('fs');
            const pathModule = require('path');

            if (!fs.existsSync(path)) return;

            // Ensure Assets folder exists
            if (!this.app.vault.getAbstractFileByPath('Assets')) {
                await this.app.vault.createFolder('Assets');
            }

            const files = fs.readdirSync(path);
            for (const fileName of files) {
                const fullPath = pathModule.join(path, fileName);
                const stat = fs.statSync(fullPath);

                if (stat.isFile()) {
                    const shadowPath = `Assets/${fileName}.md`;
                    const existing = this.app.vault.getAbstractFileByPath(shadowPath);

                    if (!existing) {
                        const content = `---
type: Asset
original_path: ${fullPath}
size: ${stat.size}
last_modified: ${stat.mtime.toISOString()}
---\n# ${fileName}\n\nExternal Asset Shadow Note`;
                        await this.app.vault.create(shadowPath, content);
                    }
                }
            }
        } catch (e) {
            console.error("Failed to scan external assets:", e);
        }
    }
}
