import ELK from 'elkjs';
import { App, TFile } from 'obsidian';
import type { GameElementRepository } from '../data/GameElementRepository';

export class CanvasGenerator {
    app: App;
    repo: GameElementRepository;
    elk: any; // Type as any to avoid import issues if type definitions mismatch, but ideally ELK

    constructor(app: App, repo: GameElementRepository) {
        this.app = app;
        this.repo = repo;
        this.elk = new ELK();
    }

    async generateLoopCanvas(rootFile: TFile): Promise<string> {
        // 1. Build Graph
        // This is a simplified implementation. Real one would crawl links.
        // For now, let's find immediate forward links.

        const nodes: any[] = [];
        const edges: any[] = [];
        const visited = new Set<string>();

        // Add root
        nodes.push({ id: rootFile.path, width: 400, height: 100, label: rootFile.basename });
        visited.add(rootFile.path);

        // Find outlinks
        const cache = this.app.metadataCache.getFileCache(rootFile);
        if (cache?.links) {
            for (const link of cache.links) {
                const linkedFile = this.app.metadataCache.getFirstLinkpathDest(link.link, rootFile.path);
                if (linkedFile && !visited.has(linkedFile.path)) {
                    nodes.push({ id: linkedFile.path, width: 400, height: 100, label: linkedFile.basename });
                    edges.push({ id: `${rootFile.path}-${linkedFile.path}`, sources: [rootFile.path], targets: [linkedFile.path] });
                    visited.add(linkedFile.path);
                } else if (linkedFile && visited.has(linkedFile.path)) {
                    // Backlink or already added
                     edges.push({ id: `${rootFile.path}-${linkedFile.path}`, sources: [rootFile.path], targets: [linkedFile.path] });
                }
            }
        }

        // 2. Layout with ELK
        const graph = {
            id: "root",
            layoutOptions: {
                'elk.algorithm': 'layered',
                'elk.direction': 'RIGHT'
            },
            children: nodes,
            edges: edges
        };

        try {
            const layoutedGraph = await this.elk.layout(graph);

            // 3. Convert to JSON Canvas
            const canvasNodes = layoutedGraph.children?.map((node: any) => ({
                id: node.id,
                x: node.x,
                y: node.y,
                width: node.width,
                height: node.height,
                type: 'file',
                file: node.id
            })) || [];

            const canvasEdges = layoutedGraph.edges?.map((edge: any) => ({
                id: edge.id,
                fromNode: edge.sources[0],
                fromSide: 'right',
                toNode: edge.targets[0],
                toSide: 'left'
            })) || [];

            return JSON.stringify({
                nodes: canvasNodes,
                edges: canvasEdges
            }, null, 2);
        } catch (e) {
            console.error("ELK Layout Error:", e);
            throw e;
        }
    }
}
