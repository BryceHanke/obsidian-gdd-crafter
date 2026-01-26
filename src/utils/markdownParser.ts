import type { GDDData } from '../types';

export const SECTION_HEADERS = {
    coreLoop: 'Core Loop',
    mechanics: 'Mechanics',
    story: 'Story & Plot',
    characters: 'Characters',
    visualStyle: 'Visual Style',
    audioStyle: 'Audio Style'
};

export function parseGDD(content: string, frontmatter: any): GDDData {
    return {
        title: frontmatter.title || '',
        genre: frontmatter.genre || '',
        tagline: frontmatter.tagline || '',
        targetAudience: frontmatter.targetAudience || '',

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
        // $1 is prefix newline, $2 is header line, replace $3 (content)
        // We need to be careful with capturing groups.
        // Group 1: (^|\n)
        // Group 2: (## Header \n)
        // Group 3: (Content)
        return content.replace(regex, `$1$2${sectionContent}`);
    } else {
        // Append if not found
        // Ensure there's a newline before appending
        const prefix = content.endsWith('\n') ? '' : '\n';
        // If content is completely empty, we might not need prefix, but normally content has at least frontmatter end.
        const headerPrefix = content.trim().length === 0 ? '' : '\n';
        return `${content}${prefix}${headerPrefix}## ${header}\n${sectionContent}`;
    }
}

export function generateGDDTemplate(): string {
    return `---
type: gdd
title: New Game Project
genre: Undefined
tagline: A generic game description
targetAudience: Everyone
---

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
