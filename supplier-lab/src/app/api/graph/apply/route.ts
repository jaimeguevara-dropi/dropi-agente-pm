import { NextRequest, NextResponse } from "next/server";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { validateGraphUpdate, type GraphData } from "@/lib/graph-validator";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const proposed: Partial<GraphData> = body.proposed ?? body;

    const graphPath = join(process.cwd(), "src/data/supplier-success-graph.json");
    const rawCurrent = readFileSync(graphPath, "utf-8");
    const current: GraphData = JSON.parse(rawCurrent);

    // Validate first — reject if errors exist
    const report = validateGraphUpdate(current, proposed);
    if (!report.valid) {
      return NextResponse.json({ error: "Validation failed", report }, { status: 400 });
    }

    // Merge: append proposed nodes/edges (no overwriting)
    const proposedNodes = proposed.nodes ?? [];
    const proposedEdges = proposed.edges ?? [];

    // Assign sequential IDs to edges that don't have one
    const maxEdgeId = current.edges.reduce((max, e) => {
      if (e.id) {
        const num = parseInt(e.id.replace(/\D/g, ""), 10);
        return isNaN(num) ? max : Math.max(max, num);
      }
      return max;
    }, 0);

    let nextEdgeId = maxEdgeId + 1;
    const edgesWithIds = proposedEdges.map((e) => ({
      ...e,
      id: e.id ?? `e${nextEdgeId++}`,
    }));

    const updated: GraphData = {
      nodes: [...current.nodes, ...proposedNodes],
      edges: [...current.edges, ...edgesWithIds],
    };

    writeFileSync(graphPath, JSON.stringify(updated, null, 2), "utf-8");

    return NextResponse.json({ success: true, graph: updated }, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
