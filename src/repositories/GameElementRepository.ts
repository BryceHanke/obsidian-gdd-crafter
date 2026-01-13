import { App, TFile } from 'obsidian';

export interface GameElement {
	id: string;
	name: string;
	type: 'Mechanic' | 'Entity' | 'Level' | string;
	tags: string[];
	frontmatter: Record<string, any>;
	content: string;
}

export class GameElementRepository {
	app: App;

	constructor(app: App) {
		this.app = app;
	}

	async getById(id: string): Promise<GameElement | null> {
		// Assuming ID corresponds to file path or a frontmatter ID
		// For simplicity, let's treat path as ID for now
		const file = this.app.vault.getAbstractFileByPath(id);
		if (file instanceof TFile) {
			return this.parseFile(file);
		}
		return null;
	}

	async save(id: string, updates: Partial<GameElement>): Promise<void> {
		const file = this.app.vault.getAbstractFileByPath(id);
		if (file instanceof TFile) {
			await this.app.vault.process(file, (data) => {
				// We would need to handle frontmatter updates here
				// This is a simplified example
				return data; // Actual implementation would involve frontmatter manipulation logic
			});
		}
	}

	private async parseFile(file: TFile): Promise<GameElement> {
		const content = await this.app.vault.read(file);
		const cache = this.app.metadataCache.getFileCache(file);
		return {
			id: file.path,
			name: file.basename,
			type: cache?.frontmatter?.type || 'Unknown',
			tags: cache?.tags?.map(t => t.tag) || [],
			frontmatter: cache?.frontmatter || {},
			content: content
		};
	}
}
