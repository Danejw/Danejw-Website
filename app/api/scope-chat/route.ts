import { NextResponse } from 'next/server';
import OpenAI from 'openai';

type MessageContent = 
  | string 
  | Array<{ type: 'input_text'; text: string } | { type: 'input_image'; image_url: string }>;

type ChatMessage = {
  role: 'user' | 'assistant';
  content: MessageContent;
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
    const systemPrompt = `You are a scoping assistant for Dane Willacker (Danejw), a full-stack builder focused on web apps, AI integrations, and automations. Keep replies concise, friendly, and action-oriented. Always share a budget range and the nearest service tier. Ask for missing details if needed.

When users provide images (screenshots, mockups, wireframes, designs, or other visual materials), carefully analyze them to understand:
- The design style, layout, and functionality shown
- Technical requirements implied by the visuals
- Complexity and scope of features visible
- Any UI/UX patterns or components that need to be built
- Integration points or third-party services visible

Use the visual information to provide more accurate scope estimates and recommendations.

${serviceCatalog}`;

    // Check if any messages contain images to determine the model
    const hasImages = body.messages.some((message) => 
      Array.isArray(message.content) && 
      message.content.some((item) => item.type === 'input_image')
    );

    if (hasImages) {
      const imageCount = body.messages.reduce((count, message) => {
        if (Array.isArray(message.content)) {
          return count + message.content.filter((item) => item.type === 'input_image').length;
        }
        return count;
      }, 0);
      console.log(`Processing request with ${imageCount} image(s) using gpt-4o model`);
    }

    const response = await openai.responses.create({
      model: hasImages ? 'gpt-4o' : 'gpt-4o-mini',
      input: [
        {
          role: 'system',
          content: systemPrompt,
        },
        ...body.messages.map((message) => {
          // Handle both string content and array content (with images)
          if (typeof message.content === 'string') {
            return {
              role: message.role,
              content: message.content,
            };
          } else if (Array.isArray(message.content)) {
            // Map to Responses API format for multimodal content
            const mappedContent = message.content.map((item) => {
              if (item.type === 'input_text') {
                return { type: 'input_text' as const, text: item.text };
              } else if (item.type === 'input_image') {
                // Validate image_url format (should be data URI)
                const imageUrl = item.image_url;
                if (!imageUrl || (!imageUrl.startsWith('data:image/') && !imageUrl.startsWith('http'))) {
                  console.warn('Invalid image_url format:', imageUrl?.substring(0, 50));
                  // Skip invalid images
                  return null;
                }
                return { type: 'input_image' as const, image_url: imageUrl };
              }
              return null;
            }).filter((item): item is { type: 'input_text'; text: string } | { type: 'input_image'; image_url: string } => item !== null);

            // If content array is empty after filtering, use empty string
            if (mappedContent.length === 0) {
              return {
                role: message.role,
                content: '',
              };
            }

            // If only one item and it's text, return as string for efficiency
            if (mappedContent.length === 1 && mappedContent[0].type === 'input_text') {
              return {
                role: message.role,
                content: mappedContent[0].text,
              };
            }

            return {
              role: message.role,
              content: mappedContent as any, // Type assertion needed for Responses API multimodal content
            };
          } else {
            return {
              role: message.role,
              content: '',
            };
          }
        }),
      ],
      text: {
        format: {
          type: 'json_schema',
          name: 'ScopeResponse',
          strict: false,
          schema: {
            type: 'object',
            properties: {
              reply: {
                type: 'string',
                description: 'The conversational reply to the user',
              },
              budgetRange: {
                type: 'string',
                description: 'Estimated budget range for the scope',
              },
              recommendedPackage: {
                type: 'string',
                description: 'Nearest fit from the service catalog',
              },
              nextSteps: {
                type: 'array',
                items: { type: 'string' },
                description: 'Next steps the visitor can take to move forward',
              },
              missingInfo: {
                type: 'array',
                items: { type: 'string' },
                description: 'Questions to clarify remaining scope gaps',
              },
            },
            required: ['reply', 'budgetRange'],
            additionalProperties: false,
          },
        },
      },
    });

    // Structured outputs guarantee valid JSON, so parse directly
    let parsed: ScopeResponse;
    try {
      const outputText = response.output_text;
      if (!outputText) {
        throw new Error('No output text received from API');
      }
      parsed = JSON.parse(outputText) as ScopeResponse;

      // Validate required fields
      if (!parsed.reply || !parsed.budgetRange) {
        throw new Error('Missing required fields in response');
      }
    } catch (error) {
      console.error('Failed to parse structured output', error, 'Raw output:', response.output_text);
      return NextResponse.json(
        {
          error: 'Failed to parse structured response from AI.',
          message: response.output_text ?? 'Let\'s talk through your project details to pin down a scope and budget.',
        },
        { status: 500 },
      );
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
