import { NextResponse } from 'next/server';
import OpenAI from 'openai';

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

type ScopeResponse = {
  reply: string;
  budgetRange: string;
  recommendedPackage?: string;
  nextSteps?: string[];
  missingInfo?: string[];
};

const serviceCatalog = `Available services and typical starting budgets:
- Single-Page Website ($1,000): Focused landing page with custom design, responsive layout, basic SEO, and contact/signup form.
- Multi-Page Website ($2,500): Full site with pages like Home, About, Services, Contact; scalable navigation and layout.
- Multi-Page Website with Database ($4,500): Dynamic content backed by a database for blogs, directories, or internal tools.
- Custom Web Application ($7,500+): Full-stack application with auth, dashboards, APIs, integrations, and scalable architecture.
- AI Integrations (+$1,500): Chat assistants, content generation, recommendations, or decision support features.
- Automation & Workflow Integrations (+$1,000): Background jobs, system integrations, and trigger-based workflows.`;

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: 'OpenAI API key is not configured.' },
      { status: 500 },
    );
  }

  let body: { messages?: ChatMessage[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body.' },
      { status: 400 },
    );
  }

  if (!body.messages || !Array.isArray(body.messages)) {
    return NextResponse.json(
      { error: 'Messages array is required.' },
      { status: 400 },
    );
  }

  const openai = new OpenAI({ apiKey });

  try {
    const response = await openai.responses.create({
      model: 'gpt-4.1-mini',
      input: [
        {
          role: 'system',
          content: `You are a scoping assistant for Dane Willacker (Danejw), a full-stack builder focused on web apps, AI integrations, and automations. Keep replies concise, friendly, and action-oriented. Always share a budget range and the nearest service tier. Ask for missing details if needed. ${serviceCatalog}`,
        },
        ...body.messages.map((message) => ({
          role: message.role,
          content: message.content,
        })),
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'ScopeResponse',
          schema: {
            type: 'object',
            additionalProperties: false,
            properties: {
              reply: { type: 'string', description: 'The assistant\'s conversational reply.' },
              budgetRange: { type: 'string', description: 'Estimated budget range for the scope.' },
              recommendedPackage: { type: 'string', description: 'Nearest fit from the service catalog.' },
              nextSteps: {
                type: 'array',
                items: { type: 'string' },
                description: 'Next steps the visitor can take to move forward.',
              },
              missingInfo: {
                type: 'array',
                items: { type: 'string' },
                description: 'Questions to clarify remaining scope gaps.',
              },
            },
            required: ['reply', 'budgetRange'],
          },
        },
      },
    });

    const outputText = response.output_text;
    let parsed: ScopeResponse | null = null;

    if (outputText) {
      try {
        parsed = JSON.parse(outputText) as ScopeResponse;
      } catch (error) {
        console.warn('Failed to parse response JSON', error);
      }
    }

    if (!parsed) {
      return NextResponse.json({
        message: response.output_text ?? 'Let\'s talk through your project details to pin down a scope and budget.',
      });
    }

    return NextResponse.json({
      message: parsed.reply,
      budgetRange: parsed.budgetRange,
      recommendedPackage: parsed.recommendedPackage,
      nextSteps: parsed.nextSteps ?? [],
      missingInfo: parsed.missingInfo ?? [],
    });
  } catch (error) {
    console.error('Failed to contact OpenAI', error);
    return NextResponse.json(
      { error: 'Something went wrong while generating the scope response.' },
      { status: 500 },
    );
  }
}
