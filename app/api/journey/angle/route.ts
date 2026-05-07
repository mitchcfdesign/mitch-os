import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { requireSameOrigin } from '@/lib/route-auth'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: Request) {
  const unauthorized = requireSameOrigin(req)
  if (unauthorized) return unauthorized

  const { title, content, log_type } = await req.json()
  if (!title || !content) return NextResponse.json({ error: 'title and content required' }, { status: 400 })

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 512,
    messages: [{
      role: 'user',
      content: `You are helping Mitch Hayes — a framing foreman turned developer/entrepreneur — turn real-life moments into YouTube content.

Entry type: ${log_type}
Title: ${title}
Content: ${content}

Give 3 punchy YouTube video angles for this. Each angle should have:
- A title (specific, not clickbait — the kind of title Karpathy or levels.io would use)
- One sentence on why this resonates with an audience

Format as a numbered list. Be direct. No fluff.`,
    }],
  })

  const text = response.content[0].type === 'text' ? response.content[0].text : ''
  return NextResponse.json({ angles: text })
}
