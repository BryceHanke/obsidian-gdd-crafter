import type { GDDData } from '../types';

export const parseGDD = (markdown: string): GDDData => {
    const data: GDDData = {
        title: '',
        genre: '',
        audience: '',
        hook: '',
        theme: '',
        coreLoop: '',
        mechanics: '',
        story: '',
        visuals: ''
    };

    // Title
    const titleMatch = markdown.match(/^# (.+)$/m);
    if (titleMatch) {
        data.title = titleMatch[1].trim();
    }

    // Metadata
    const genreMatch = markdown.match(/^\*\*Genre:\*\* (.+)$/m);
    if (genreMatch) data.genre = genreMatch[1].trim();

    const audienceMatch = markdown.match(/^\*\*Audience:\*\* (.+)$/m);
    if (audienceMatch) data.audience = audienceMatch[1].trim();

    const taglineMatch = markdown.match(/^\*\*Tagline:\*\* (.+)$/m);
    if (taglineMatch) data.tagline = taglineMatch[1].trim();

    // Sections
    const getSection = (header: string): string => {
        const regex = new RegExp(`^## ${header}\\s+([\\s\\S]*?)(?=^## |$)`, 'm');
        const match = markdown.match(regex);
        return match ? match[1].trim() : '';
    };

    data.hook = getSection('Hook');
    data.theme = getSection('Theme');
    data.coreLoop = getSection('Core Loop');
    data.mechanics = getSection('Mechanics');
    data.story = getSection('Story');
    data.visuals = getSection('Visuals');

    return data;
};

export const updateTitle = (markdown: string, newTitle: string): string => {
    const regex = /^# .+$/m;
    if (regex.test(markdown)) {
        return markdown.replace(regex, `# ${newTitle}`);
    } else {
        return `# ${newTitle}\n\n${markdown}`;
    }
};

export const updateMetadata = (markdown: string, key: string, value: string): string => {
    const safeKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`^\\*\\*${safeKey}:\\*\\* .+$`, 'm');

    if (regex.test(markdown)) {
        return markdown.replace(regex, `**${key}:** ${value}`);
    } else {
        const titleMatch = markdown.match(/^# .+$/m);
        if (titleMatch) {
             const titleEndIndex = titleMatch.index! + titleMatch[0].length;
             return markdown.slice(0, titleEndIndex) + `\n**${key}:** ${value}` + markdown.slice(titleEndIndex);
        } else {
            return `**${key}:** ${value}\n${markdown}`;
        }
    }
};

export const updateSection = (markdown: string, header: string, newContent: string): string => {
    const safeHeader = header.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(^## ${safeHeader}\\s+)([\\s\\S]*?)(?=(^## |$))`, 'm');

    if (regex.test(markdown)) {
        // We replace the content part.
        // We want to keep the header.
        return markdown.replace(regex, (match, p1) => {
            return `${p1}${newContent}\n\n`;
        });
    } else {
        const prefix = markdown.trim().length > 0 ? '\n\n' : '';
        return `${markdown.trimEnd()}${prefix}## ${header}\n${newContent}\n`;
    }
};
