import { NextResponse } from 'next/server'
import OpenAI from 'openai'

// System prompt for the AI, providing guidelines on how to respond to users
const systemPrompt = "You are a helpful support assistant for Headstarter."

export async function POST(req) {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  const data = await req.json()

  // Create a chat completion request to the OpenAI API
  const completion = await openai.chat.completions.create({
    messages: [{ role: 'system', content: systemPrompt }, ...data],
    model: 'gpt-3.5-turbo', // You can use 'gpt-4' if you have access
    stream: true,
  })

  // Create a ReadableStream to handle the streaming response
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder()
      try {
        for await (const chunk of completion) {
          const content = chunk.choices[0]?.delta?.content
          if (content) {
            const text = encoder.encode(content)
            controller.enqueue(text)
          }
        }
      } catch (err) {
        controller.error(err)
      } finally {
        controller.close()
      }
    },
  })

  return new NextResponse(stream)
}