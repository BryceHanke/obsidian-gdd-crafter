export interface GameElement {
    id: string; // The file path or a unique ID
    name: string;
    type: string; // e.g., 'Mechanic', 'Entity', 'Level'
    tags: string[];
    frontmatter: Record<string, any>;
    content: string;
}

export interface VerbSchema {
    verb: string;
    properties: SchemaProperty[];
}

export interface SchemaProperty {
    name: string;
    type: 'text' | 'number' | 'boolean' | 'dropdown';
    options?: string[]; // for dropdown
    default?: any;
}

export interface ChecklistSchema {
    targetType: string; // e.g., 'mechanic/interaction'
    items: ChecklistItemDefinition[];
}

export interface ChecklistItemDefinition {
    id: string;
    category: string; // e.g., 'physics', 'audio'
    label: string;
    description?: string;
}

export interface ChecklistState {
    [category: string]: {
        [itemId: string]: boolean;
    };
}

export interface LudosSettings {
    assetPath: string;
    verbSchemas: VerbSchema[];
    checklistSchemas: ChecklistSchema[];
}

export interface GDDData {
    title: string;
    genre: string;
    audience: string;
    hook: string;
    theme: string;
    coreLoop: string;
    mechanics: string;
    story: string;
    visuals: string;
    tagline?: string;
}
