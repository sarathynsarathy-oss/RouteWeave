import 'server-only'
import { existsSync, statSync } from 'node:fs'
import path from 'node:path'
import { loadEnvConfig } from '@next/env'
import { buildItineraryPrompt } from './itinerary-prompts'
import { normalizeItinerary } from './itinerary-engine'
import type { ItineraryDocument, ItineraryInput } from './itinerary-types'

export const OPENROUTER_MODEL = 'inclusionai/ling-3.0-flash-fin:free'

const backendEnvDirectory = path.resolve(process.cwd(), '..', 'backend')
const backendEnvFile = path.join(backendEnvDirectory, '.env')

if (existsSync(backendEnvFile) && statSync(backendEnvFile).isFile()) {
  loadEnvConfig(backendEnvDirectory, process.env.NODE_ENV === 'development', undefined, true)
}

function parseProviderJson(value: string) {
  const cleaned = value.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim()
  return JSON.parse(cleaned) as unknown
}

function sanitizeProviderDiagnostic(value: string, apiKey: string) {
  const redacted = apiKey ? value.split(apiKey).join('[REDACTED]') : value
  return redacted
    .replace(/\bBearer\s+[^\s"',}]+/gi, 'Bearer [REDACTED]')
    .replace(/\bsk-or-v1-[A-Za-z0-9_-]+\b/gi, '[REDACTED]')
    .slice(0, 2000)
}

async function generateWithGemini(input: ItineraryInput, apiKey: string): Promise<ItineraryDocument | null> {
  const model = process.env.GEMINI_MODEL || 'gemini-2.0-flash'
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: buildItineraryPrompt(input) }] }],
      generationConfig: { responseMimeType: 'application/json', temperature: 0.2 },
    }),
    signal: AbortSignal.timeout(12000),
  })
  if (!response.ok) throw new Error(`AI provider failed with ${response.status}`)
  const data = (await response.json()) as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> }
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text
  return text ? normalizeItinerary(parseProviderJson(text)) : null
}

async function generateWithOpenRouter(input: ItineraryInput, apiKey: string): Promise<ItineraryDocument | null> {
  const startedAt = Date.now()
  let httpStatus: number | null = null
  let responseStatusText: string | null = null
  let providerErrorBody: string | null = null
  let jsonParsingSucceeded = false
  let finishReason: string | null = null
  let contentLength = 0
  let reasoningPresent = false
  let completionTokens: number | null = null

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages: [{ role: 'user', content: buildItineraryPrompt(input) }],
        temperature: 0.2,
        max_tokens: 1400,
        reasoning: { enabled: false },
      }),
      signal: AbortSignal.timeout(30000),
    })
    httpStatus = response.status
    responseStatusText = response.statusText
    const responseBody = await response.text()
    if (!response.ok) {
      providerErrorBody = responseBody
      throw Object.assign(new Error(`OpenRouter returned HTTP ${response.status}`), { name: 'OpenRouterHttpError' })
    }

    const data = JSON.parse(responseBody) as {
      choices?: Array<{
        finish_reason?: string | null
        message?: { content?: string | null; reasoning?: string | null }
      }>
      usage?: { completion_tokens?: number }
    }
    const choice = data.choices?.[0]
    const text = typeof choice?.message?.content === 'string' ? choice.message.content : ''
    finishReason = choice?.finish_reason || null
    contentLength = text.length
    reasoningPresent = Boolean(choice?.message?.reasoning)
    completionTokens = typeof data.usage?.completion_tokens === 'number' ? data.usage.completion_tokens : null
    const parsedContent = text ? parseProviderJson(text) : null
    jsonParsingSucceeded = Boolean(text)
    const document = parsedContent ? normalizeItinerary(parsedContent) : null
    console.info(`OpenRouter itinerary result ${JSON.stringify({
      model: OPENROUTER_MODEL,
      httpStatus,
      latencyMs: Date.now() - startedAt,
      jsonParsingSucceeded,
      finishReason,
      contentLength,
      reasoningPresent,
      completionTokens,
      validItinerary: Boolean(document),
    })}`)
    return document
  } catch (error) {
    const errorType = error instanceof Error ? error.name : typeof error
    const errorMessage = error instanceof Error
      ? sanitizeProviderDiagnostic(error.message, apiKey)
      : sanitizeProviderDiagnostic(String(error), apiKey)
    console.error(`OpenRouter itinerary result ${JSON.stringify({
      model: OPENROUTER_MODEL,
      httpStatus,
      responseStatusText: responseStatusText ? sanitizeProviderDiagnostic(responseStatusText, apiKey) : null,
      latencyMs: Date.now() - startedAt,
      jsonParsingSucceeded,
      finishReason,
      contentLength,
      reasoningPresent,
      completionTokens,
      errorType,
      errorMessage,
      ...(providerErrorBody ? { responseBody: sanitizeProviderDiagnostic(providerErrorBody, apiKey) } : {}),
    })}`)
    throw error
  }
}

export async function generateWithConfiguredProvider(input: ItineraryInput): Promise<ItineraryDocument | null> {
  const provider = process.env.AI_PROVIDER
  if (provider === 'openrouter') {
    const apiKey = process.env.OPENROUTER_API_KEY
    return apiKey ? generateWithOpenRouter(input, apiKey) : null
  }
  if (provider === 'gemini') {
    const apiKey = process.env.GEMINI_API_KEY
    return apiKey ? generateWithGemini(input, apiKey) : null
  }
  return null
}