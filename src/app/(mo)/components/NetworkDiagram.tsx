"use client";

import React, { useRef, useEffect } from "react";
import ForceGraph2D from "react-force-graph-2d";

type Device = {
  id: string;
  ip: string;
  type: string;
  traffic: string;
};

type NetworkDiagramProps = {
  devices: Device[];
  links: { source: string; target: string }[];
};

export default function NetworkDiagram({ devices, links }: NetworkDiagramProps) {
  const fgRef = useRef<any>();

  // Customize node appearance
  const nodePaint = (node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const label = node.id;
    const fontSize = 12 / globalScale;
    ctx.font = `${fontSize}px Sans-Serif`;
    ctx.fillStyle = node.color || "steelblue";
    ctx.beginPath();
    ctx.arc(node.x, node.y, 6, 0, 2 * Math.PI, false);
    ctx.fill();
    ctx.fillStyle = "#000";
    ctx.fillText(label, node.x + 8, node.y + 4);
  };

  return (
    <ForceGraph2D
      ref={fgRef}
      graphData={{ nodes: devices, links }}
      nodeLabel={(node: Device) => `IP: ${node.ip}\nType: ${node.type}\nTraffic: ${node.traffic}`}
      nodeAutoColorBy="type"
      nodeCanvasObject={nodePaint}
      linkDirectionalArrowLength={4}
      linkDirectionalArrowRelPos={1}
      width={800}
      height={600}
    />
  );
}
