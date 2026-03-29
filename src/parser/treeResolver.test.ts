import { describe, it, expect } from 'vitest'
import { resolveTree } from './treeResolver.js'
import type { RawNode } from '../types/index.js'

const CONV_ID = 'conv-1'

function makeNode(
  id: string,
  parent: string | null,
  children: string[],
  opts: {
    role?: 'user' | 'assistant' | 'system' | 'tool'
    content?: string | null
    create_time?: number | null
    attachments?: Array<{ name: string; mime_type: string }>
    nullMessage?: boolean
  } = {},
): RawNode {
  if (opts.nullMessage) {
    return { id, message: null, parent, children }
  }
  return {
    id,
    message: {
      id,
      author: { role: opts.role ?? 'user' },
      create_time: opts.create_time !== undefined ? opts.create_time : 1000,
      content:
        opts.content !== undefined
          ? opts.content === null
            ? { content_type: 'text', parts: [] }
            : { content_type: 'text', parts: [opts.content] }
          : { content_type: 'text', parts: ['hello'] },
      metadata: opts.attachments ? { attachments: opts.attachments } : {},
    },
    parent,
    children,
  }
}

describe('resolveTree', () => {
  it('returns empty result for empty mapping', () => {
    const result = resolveTree({}, CONV_ID)
    expect(result.messages).toHaveLength(0)
    expect(result.branchCount).toBe(0)
  })

  it('handles single-message conversation', () => {
    const mapping: Record<string, RawNode> = {
      n1: makeNode('n1', null, [], { role: 'user', content: 'Hello' }),
    }
    const result = resolveTree(mapping, CONV_ID)
    expect(result.messages).toHaveLength(1)
    expect(result.messages[0].content).toBe('Hello')
    expect(result.messages[0].role).toBe('user')
    expect(result.branchCount).toBe(0)
  })

  it('resolves a linear chain', () => {
    const mapping: Record<string, RawNode> = {
      n1: makeNode('n1', null, ['n2'], { role: 'user', content: 'Question' }),
      n2: makeNode('n2', 'n1', ['n3'], { role: 'assistant', content: 'Answer' }),
      n3: makeNode('n3', 'n2', [], { role: 'user', content: 'Follow up' }),
    }
    const result = resolveTree(mapping, CONV_ID)
    expect(result.messages).toHaveLength(3)
    expect(result.messages.map((m) => m.content)).toEqual(['Question', 'Answer', 'Follow up'])
    expect(result.branchCount).toBe(0)
  })

  it('follows last child at branching node (canonical path)', () => {
    // n1 has 2 children: n2 (old branch) and n3 (last/canonical branch)
    const mapping: Record<string, RawNode> = {
      n1: makeNode('n1', null, ['n2', 'n3'], { role: 'user', content: 'Original' }),
      n2: makeNode('n2', 'n1', [], { role: 'assistant', content: 'Old answer' }),
      n3: makeNode('n3', 'n1', [], { role: 'assistant', content: 'New answer' }),
    }
    const result = resolveTree(mapping, CONV_ID)
    expect(result.messages).toHaveLength(2)
    expect(result.messages[1].content).toBe('New answer')
    expect(result.branchCount).toBe(1)
  })

  it('handles deep branching (branch 5 levels deep)', () => {
    const mapping: Record<string, RawNode> = {
      n1: makeNode('n1', null, ['n2'], { role: 'user', content: 'Q1' }),
      n2: makeNode('n2', 'n1', ['n3'], { role: 'assistant', content: 'A1' }),
      n3: makeNode('n3', 'n2', ['n4'], { role: 'user', content: 'Q2' }),
      n4: makeNode('n4', 'n3', ['n5'], { role: 'assistant', content: 'A2' }),
      n5: makeNode('n5', 'n4', ['n6a', 'n6b'], { role: 'user', content: 'Q3 edited' }),
      n6a: makeNode('n6a', 'n5', [], { role: 'assistant', content: 'Old A3' }),
      n6b: makeNode('n6b', 'n5', [], { role: 'assistant', content: 'New A3' }),
    }
    const result = resolveTree(mapping, CONV_ID)
    expect(result.messages).toHaveLength(6)
    expect(result.messages[5].content).toBe('New A3')
    expect(result.branchCount).toBe(1)
  })

  it('skips null message nodes and does not count them', () => {
    const mapping: Record<string, RawNode> = {
      n1: makeNode('n1', null, ['n2'], { nullMessage: true }),
      n2: makeNode('n2', 'n1', ['n3'], { role: 'user', content: 'Hello' }),
      n3: makeNode('n3', 'n2', [], { role: 'assistant', content: 'Hi' }),
    }
    const result = resolveTree(mapping, CONV_ID)
    expect(result.messages).toHaveLength(2)
    expect(result.messages[0].content).toBe('Hello')
  })

  it('flags empty content parts as null content but preserves the message', () => {
    const mapping: Record<string, RawNode> = {
      n1: makeNode('n1', null, ['n2'], { role: 'user', content: null }),
      n2: makeNode('n2', 'n1', [], { role: 'assistant', content: 'Answer' }),
    }
    const result = resolveTree(mapping, CONV_ID)
    expect(result.messages).toHaveLength(2)
    expect(result.messages[0].content).toBeNull()
    expect(result.messages[0].is_null_content).toBe(true)
    expect(result.warnings.some((w) => w.includes('null/empty content'))).toBe(true)
  })

  it('handles null create_time by using parent timestamp + 1', () => {
    const mapping: Record<string, RawNode> = {
      n1: makeNode('n1', null, ['n2'], { role: 'user', content: 'Q', create_time: 5000 }),
      n2: makeNode('n2', 'n1', [], { role: 'assistant', content: 'A', create_time: null }),
    }
    const result = resolveTree(mapping, CONV_ID)
    expect(result.messages[1].created_at).toBe(5001)
    expect(result.warnings.some((w) => w.includes('null create_time'))).toBe(true)
  })

  it('detects attachment metadata', () => {
    const mapping: Record<string, RawNode> = {
      n1: makeNode('n1', null, [], {
        role: 'user',
        content: 'See attachment',
        attachments: [{ name: 'report.pdf', mime_type: 'application/pdf' }],
      }),
    }
    const result = resolveTree(mapping, CONV_ID)
    expect(result.messages[0].has_attachment).toBe(true)
    expect(result.messages[0].attachment_name).toBe('report.pdf')
    expect(result.messages[0].attachment_type).toBe('application/pdf')
  })

  it('sets conversation_id on all messages', () => {
    const mapping: Record<string, RawNode> = {
      n1: makeNode('n1', null, ['n2'], { role: 'user', content: 'Q' }),
      n2: makeNode('n2', 'n1', [], { role: 'assistant', content: 'A' }),
    }
    const result = resolveTree(mapping, CONV_ID)
    result.messages.forEach((m) => expect(m.conversation_id).toBe(CONV_ID))
  })
})
