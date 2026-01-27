import { App, PluginSettingTab, Setting, Plugin } from 'obsidian';
import type { LudosSettings } from './types';

export const DEFAULT_SETTINGS: LudosSettings = {
    assetPath: '',
    verbSchemas: [
        {
            verb: 'Mechanic',
            properties: [
                { name: 'cooldown', type: 'number', default: 0 },
                { name: 'interruptible', type: 'boolean', default: false }
            ]
        }
    ],
    checklistSchemas: [
        {
            targetType: 'mechanic/interaction',
            items: [
                { id: 'collision', category: 'physics', label: 'Has Collision?' },
                { id: 'blocking', category: 'physics', label: 'Is Blocking?' },
                { id: 'open_sfx', category: 'audio', label: 'Has Open SFX?' },
                { id: 'close_sfx', category: 'audio', label: 'Has Close SFX?' },
                { id: 'blocks_sight', category: 'ai', label: 'Blocks Sight?' }
            ]
        }
    ]
};

export class LudosSettingTab extends PluginSettingTab {
    plugin: any; // Using any to avoid circular dependency with main.ts types if checking strict types, but effectively LudosPlugin

    constructor(app: App, plugin: any) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;

        containerEl.empty();

        containerEl.createEl('h2', { text: 'Ludos Settings' });

        new Setting(containerEl)
            .setName('Asset Library Path')
            .setDesc('Path to external assets (e.g. Unity project Assets folder)')
            .addText(text => text
                .setPlaceholder('/path/to/assets')
                .setValue(this.plugin.settings.assetPath)
                .onChange(async (value) => {
                    this.plugin.settings.assetPath = value;
                    await this.plugin.saveSettings();
                }));

        // Schemas editing could be complex, for now we just show a message or a simple JSON editor if needed.
        // For this MVP/Refactor, we stick to defaults or manually edited settings file unless specified.
        containerEl.createEl('p', { text: 'Verb and Checklist schemas are currently configured via the data.json file directly for advanced users.' });
    }
}
