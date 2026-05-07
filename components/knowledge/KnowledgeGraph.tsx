'use client'

import { useEffect, useRef, useCallback } from 'react'
import dynamic from 'next/dynamic'

const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), { ssr: false })

interface KBEntry {
  id: string
  title: string
  node_type: string
  parent_node_id: string | null
}

interface GraphNode {
  id: string
  label: string
  type: string
  val: number
}

interface GraphLink {
  source: string
  target: string
}

const TYPE_COLORS: Record<string, string> = {
  note: '#a1a1aa',
  insight: '#fbbf24',
  resource: '#60a5fa',
  decision: '#34d399',
}

function buildGraph(entries: KBEntry[]) {
  const nodes: GraphNode[] = entries.map(e => ({
    id: e.id,
    label: e.title,
    type: e.node_type,
    val: 4,
  }))

  const links: GraphLink[] = entries
    .filter(e => e.parent_node_id && entries.some(n => n.id === e.parent_node_id))
    .map(e => ({ source: e.id, target: e.parent_node_id! }))

  return { nodes, links }
}

export default function KnowledgeGraph({ entries, onNodeClick }: {
  entries: KBEntry[]
  onNodeClick: (id: string) => void
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const graphData = buildGraph(entries)

  const nodeCanvasObject = useCallback((node: GraphNode & { x?: number; y?: number }, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const label = node.label
    const fontSize = Math.max(8, 11 / globalScale)
    const r = 5
    const color = TYPE_COLORS[node.type] ?? '#a1a1aa'

    ctx.beginPath()
    ctx.arc(node.x ?? 0, node.y ?? 0, r, 0, 2 * Math.PI)
    ctx.fillStyle = color
    ctx.fill()
    ctx.strokeStyle = 'rgba(255,255,255,0.1)'
    ctx.lineWidth = 0.5
    ctx.stroke()

    if (globalScale > 0.8) {
      ctx.font = `${fontSize}px monospace`
      ctx.fillStyle = 'rgba(228,228,231,0.85)'
      ctx.textAlign = 'center'
      ctx.fillText(label.length > 22 ? label.slice(0, 22) + '…' : label, node.x ?? 0, (node.y ?? 0) + r + fontSize + 1)
    }
  }, [])

  return (
    <div ref={containerRef} className="w-full h-full bg-zinc-950">
      {typeof window !== 'undefined' && (
        <ForceGraph2D
          graphData={graphData}
          nodeId="id"
          nodeCanvasObject={nodeCanvasObject as never}
          nodeCanvasObjectMode={() => 'replace'}
          linkColor={() => 'rgba(113,113,122,0.3)'}
          linkWidth={1}
          backgroundColor="#09090b"
          onNodeClick={(node: GraphNode) => onNodeClick(node.id)}
          cooldownTicks={80}
          nodePointerAreaPaint={(node: GraphNode & { x?: number; y?: number }, color, ctx) => {
            ctx.fillStyle = color
            ctx.beginPath()
            ctx.arc(node.x ?? 0, node.y ?? 0, 8, 0, 2 * Math.PI)
            ctx.fill()
          }}
        />
      )}
    </div>
  )
}
