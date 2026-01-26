import type { GDDData } from '../types';

export const SECTION_HEADERS = {
    coreLoop: 'Core Loop',
    mechanics: 'Mechanics',
    story: 'Story & Plot',
    characters: 'Characters',
    visualStyle: 'Visual Style',
    audioStyle: 'Audio Style'
};

const METADATA_REGEX = /^```json:ludos\n([\s\S]*?)\n```/m;

export function parseGDD(content: string, frontmatter: any): GDDData {
    // Attempt to parse from code block
    let metadata: any = {};
    const match = content.match(METADATA_REGEX);

    if (match) {
        try {
            metadata = JSON.parse(match[1]);
        } catch (e) {
            console.error('Failed to parse GDD metadata', e);
        }
    } else {
        // Fallback to frontmatter if available
        if (frontmatter) {
             metadata = frontmatter;
        }
    }

    return {
        title: metadata.title || '',
        genre: metadata.genre || '',
        tagline: metadata.tagline || '',
        targetAudience: metadata.targetAudience || '',

        coreLoop: extractSection(content, SECTION_HEADERS.coreLoop),
        mechanics: extractSection(content, SECTION_HEADERS.mechanics),
        story: extractSection(content, SECTION_HEADERS.story),
        characters: extractSection(content, SECTION_HEADERS.characters),
        visualStyle: extractSection(content, SECTION_HEADERS.visualStyle),
        audioStyle: extractSection(content, SECTION_HEADERS.audioStyle)
    };
}

function extractSection(content: string, header: string): string {
    const regex = new RegExp(`(^|\\n)##\\s+${escapeRegExp(header)}\\s*\\n([\\s\\S]*?)(?=\\n##\\s|$)`, 'i');
    const match = content.match(regex);
    return match ? match[2].trim() : '';
}

export function updateGDDSection(content: string, header: string, newContent: string): string {
    const regex = new RegExp(`(^|\\n)(##\\s+${escapeRegExp(header)}\\s*\\n)([\\s\\S]*?)(?=\\n##\\s|$)`, 'i');
    const sectionContent = `${newContent.trim()}\n`;

    if (regex.test(content)) {
        return content.replace(regex, `$1$2${sectionContent}`);
    } else {
        const prefix = content.endsWith('\n') ? '' : '\n';
        const headerPrefix = content.trim().length === 0 ? '' : '\n';
        return `${content}${prefix}${headerPrefix}## ${header}\n${sectionContent}`;
    }
}

export function updateGDDMetadata(content: string, key: string, value: any, existingData?: any): string {
    const match = content.match(METADATA_REGEX);
    let metadata: any = {};
    let newBlock = '';

    if (match) {
        try {
            metadata = JSON.parse(match[1]);
        } catch (e) {
            console.error('Failed to parse existing GDD metadata during update', e);
        }
        metadata[key] = value;
        newBlock = `\`\`\`json:ludos\n${JSON.stringify(metadata, null, 2)}\n\`\`\``;
        return content.replace(METADATA_REGEX, newBlock);
    } else {
        // If block doesn't exist, create it at the top
        if (existingData) {
            metadata = { ...existingData };
        } else {
            metadata = { type: 'gdd' };
        }

        if (!metadata.type) metadata.type = 'gdd';

        metadata[key] = value;
        newBlock = `\`\`\`json:ludos\n${JSON.stringify(metadata, null, 2)}\n\`\`\`\n`;
        return newBlock + content;
    }
}

export function generateGDDTemplate(): string {
    const metadata = {
        type: 'gdd',
        title: 'New Game Project',
        genre: 'Undefined',
        tagline: 'A generic game description',
        targetAudience: 'Everyone'
    };

    const jsonBlock = `\`\`\`json:ludos\n${JSON.stringify(metadata, null, 2)}\n\`\`\``;

    return `${jsonBlock}

# Game Design Document

## ${SECTION_HEADERS.coreLoop}
Describe the core gameplay loop here.

## ${SECTION_HEADERS.mechanics}
- Mechanic 1
- Mechanic 2

## ${SECTION_HEADERS.story}
The story synopsis.

## ${SECTION_HEADERS.characters}
- Character A
- Character B

## ${SECTION_HEADERS.visualStyle}
Description of the art style.

## ${SECTION_HEADERS.audioStyle}
Description of the soundscape.
`;
}

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
