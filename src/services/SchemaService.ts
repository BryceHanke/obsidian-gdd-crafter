import type { LudosSettings, VerbSchema, ChecklistItemDefinition } from '../types';

export class SchemaService {
    settings: LudosSettings;

    constructor(settings: LudosSettings) {
        this.settings = settings;
    }

    getVerbSchema(type: string): VerbSchema | undefined {
        if (!type) return undefined;
        // Simple matching: check if type starts with the schema verb (case insensitive or exact?)
        // Assuming strict for now or prefix match.
        return this.settings.verbSchemas.find(s =>
            type.toLowerCase().includes(s.verb.toLowerCase())
        );
    }

    getChecklistItems(type: string): ChecklistItemDefinition[] {
        if (!type) return [];
        const schema = this.settings.checklistSchemas.find(s =>
            type.toLowerCase().includes(s.targetType.toLowerCase())
        );
        return schema ? schema.items : [];
    }
}
