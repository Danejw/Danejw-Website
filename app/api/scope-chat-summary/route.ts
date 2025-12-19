import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Simple HTML escape function to prevent XSS
function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string | Array<{ type: 'input_text'; text: string } | { type: 'input_image'; image_url: string }>;
};

type Estimate = {
  budgetRange?: string;
  recommendedPackage?: string;
  nextSteps?: string[];
  missingInfo?: string[];
};

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  // const resendApiKey = process.env.RESEND_API_KEY; // Email service commented out

  if (!apiKey) {
    return NextResponse.json(
      { error: 'OpenAI API key is not configured.' },
      { status: 500 },
    );
  }

  // Email service commented out
  // if (!resendApiKey) {
  //   return NextResponse.json(
  //     { error: 'Email service not configured.' },
  //     { status: 500 },
  //   );
  // }

  let body: { messages?: ChatMessage[]; estimate?: Estimate; userEmail?: string; contactInfo?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body.' },
      { status: 400 },
    );
  }

  if (!body.messages || !Array.isArray(body.messages) || body.messages.length === 0) {
    return NextResponse.json(
      { error: 'Messages array is required and cannot be empty.' },
      { status: 400 },
    );
  }

  const openai = new OpenAI({ apiKey });

  try {
    // Create a summary of the conversation
    const conversationText = body.messages
      .map((msg) => {
        if (typeof msg.content === 'string') {
          return `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`;
        } else if (Array.isArray(msg.content)) {
          const textParts = msg.content
            .filter((item) => item.type === 'input_text')
            .map((item) => item.text);
          const imageCount = msg.content.filter((item) => item.type === 'input_image').length;
          const imageNote = imageCount > 0 ? ` [${imageCount} image(s) attached]` : '';
          return `${msg.role === 'user' ? 'User' : 'Assistant'}: ${textParts.join(' ')}${imageNote}`;
        }
        return '';
      })
      .join('\n\n');

    const summaryPrompt = `You are creating a quick-to-read overview of a scope chat conversation. Your goal is to create a concise summary that immediately tells someone what the client wants and expects.

Create a brief overview (2-4 paragraphs) that answers:
- **What does the client want to build/automate?** (The core project goal)
- **What are their key expectations?** (Features, functionality, outcomes they're seeking)
- **What context matters?** (Audience, timeline, constraints, or important details)
- **What was discussed?** (Key decisions, clarifications, or important points from the conversation)

Write this as a quick overview that someone can read in 30 seconds to understand the entire conversation. Be direct, clear, and focus on actionable information.`;

    const summaryResponse = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: summaryPrompt,
        },
        {
          role: 'user',
          content: `Create a quick overview (2-4 paragraphs) that summarizes what the client wants to build, their expectations, important context, and key discussion points. Make it easy to read and understand the entire conversation quickly:\n\n${conversationText}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 800,
    });

    const rawSummary = summaryResponse.choices[0]?.message?.content || 'No summary available.';
    
    // Log the raw summary for debugging
    console.log('='.repeat(80));
    console.log('🤖 AI-GENERATED OVERVIEW (RAW):');
    console.log('='.repeat(80));
    console.log(rawSummary);
    console.log('='.repeat(80));
    
    // Ensure we have a valid summary
    const summary = (rawSummary && rawSummary.trim().length > 0 && rawSummary !== 'No summary available.') 
      ? rawSummary 
      : 'A scope chat conversation was conducted. Please review the full conversation and estimate details below.';
    
    if (rawSummary !== summary) {
      console.warn('⚠️ Warning: Using fallback summary - AI generation may have failed');
    }

    // Extract key information from the conversation
    // Priority 1: Use explicitly provided email
    // Priority 2: Extract from conversation
    let userEmail: string | null = null;
    
    if (body.userEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.userEmail)) {
      userEmail = body.userEmail;
    } else {
      // Fallback to extraction from conversation
      const lastUserMessage = body.messages
        .filter((msg) => msg.role === 'user')
        .slice(-1)[0];
      
      if (typeof lastUserMessage?.content === 'string') {
        userEmail = lastUserMessage.content.match(/[\w\.-]+@[\w\.-]+\.\w+/)?.[0] || null;
      } else if (Array.isArray(lastUserMessage?.content)) {
        // Check all text items in the message
        for (const item of lastUserMessage.content) {
          if (item.type === 'input_text') {
            const match = item.text.match(/[\w\.-]+@[\w\.-]+\.\w+/);
            if (match) {
              userEmail = match[0];
              break;
            }
          }
        }
      }
    }

    // Use estimate data from request body
    const estimate = body.estimate || {};
    const budgetRange = estimate.budgetRange;
    const recommendedPackage = estimate.recommendedPackage;
    const nextSteps = estimate.nextSteps || [];
    const missingInfo = estimate.missingInfo || [];

    // Get contact info from request body (if provided)
    const userContactInfo: string | null = body.contactInfo || null;

    // Sanitize content for email
    const sanitizedSummary = escapeHtml(summary);
    const sanitizedConversation = escapeHtml(conversationText);
    const sanitizedBudget = budgetRange ? escapeHtml(budgetRange) : null;
    const sanitizedPackage = recommendedPackage ? escapeHtml(recommendedPackage) : null;
    const sanitizedEmail = userEmail ? escapeHtml(userEmail) : null;
    const sanitizedContactInfo = userContactInfo ? escapeHtml(userContactInfo) : null;

    // Build email content - includes summary/overview in both HTML and text versions
    // The summary is prominently displayed at the top of the email
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; background: #f5f5f5;">
        <div style="background: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h2 style="color: #06b6d4; border-bottom: 2px solid #06b6d4; padding-bottom: 10px; margin-bottom: 20px;">
            Scope Chat Summary
          </h2>
          
          <div style="margin-top: 20px; background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); padding: 20px; border-radius: 8px; border-left: 4px solid #06b6d4;">
            <h3 style="color: #0c4a6e; margin: 0 0 12px 0; font-size: 16px; font-weight: 600;">Quick Overview</h3>
            <div style="color: #1e293b; line-height: 1.7; font-size: 14px;">
              ${sanitizedSummary.replace(/\n/g, '<br>')}
            </div>
          </div>
          
          ${sanitizedBudget || sanitizedPackage ? `
          <div style="margin-top: 25px; display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
            ${sanitizedBudget ? `
            <div style="background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%); color: white; padding: 20px; border-radius: 8px;">
              <h3 style="margin: 0 0 10px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; opacity: 0.9;">Budget Estimate</h3>
              <p style="margin: 0; font-size: 24px; font-weight: bold;">${sanitizedBudget}</p>
            </div>
            ` : ''}
            ${sanitizedPackage ? `
            <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 20px; border-radius: 8px;">
              <h3 style="margin: 0 0 10px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; opacity: 0.9;">Recommended Tier</h3>
              <p style="margin: 0; font-size: 20px; font-weight: bold;">${sanitizedPackage}</p>
            </div>
            ` : ''}
          </div>
          ` : ''}

          ${nextSteps.length > 0 ? `
          <div style="margin-top: 25px;">
            <h3 style="color: #333; margin-bottom: 10px;">Next Steps</h3>
            <ul style="background: #f0fdf4; padding: 15px; border-radius: 5px; border-left: 4px solid #10b981; margin: 0; padding-left: 30px;">
              ${nextSteps.map((step) => `<li style="margin-bottom: 8px; line-height: 1.5;">${escapeHtml(step)}</li>`).join('')}
            </ul>
          </div>
          ` : ''}

          ${missingInfo.length > 0 ? `
          <div style="margin-top: 25px;">
            <h3 style="color: #333; margin-bottom: 10px;">Missing Information / Follow-up Questions</h3>
            <ul style="background: #fef3c7; padding: 15px; border-radius: 5px; border-left: 4px solid #f59e0b; margin: 0; padding-left: 30px;">
              ${missingInfo.map((info) => `<li style="margin-bottom: 8px; line-height: 1.5;">${escapeHtml(info)}</li>`).join('')}
            </ul>
          </div>
          ` : ''}

          ${sanitizedEmail ? `
          <div style="margin-top: 25px; padding: 15px; background: #eff6ff; border-radius: 5px; border-left: 4px solid #3b82f6;">
            <p style="margin: 0;"><strong>Client Email:</strong> <a href="mailto:${sanitizedEmail}" style="color: #06b6d4; text-decoration: none;">${sanitizedEmail}</a></p>
          </div>
          ` : ''}

          ${sanitizedContactInfo ? `
          <div style="margin-top: 15px; padding: 15px; background: #eff6ff; border-radius: 5px; border-left: 4px solid #3b82f6;">
            <p style="margin: 0;"><strong>Contact Information:</strong> ${sanitizedContactInfo}</p>
          </div>
          ` : ''}

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <h3 style="color: #333; margin-bottom: 10px;">Full Conversation</h3>
            <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; max-height: 400px; overflow-y: auto; font-family: monospace; font-size: 12px; line-height: 1.5;">
              ${sanitizedConversation.split('\n\n').map((msg, idx) => 
                `<div style="margin-bottom: 10px; padding: 8px; background: ${idx % 2 === 0 ? '#fff' : '#f0f0f0'}; border-radius: 4px;">${escapeHtml(msg).replace(/\n/g, '<br>')}</div>`
              ).join('')}
            </div>
          </div>

          <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 12px;">
            <p>This summary was generated from a scope chat conversation.</p>
          </div>
        </div>
      </div>
    `;

    const emailText = `
Scope Chat Summary

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
QUICK OVERVIEW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${summary}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
KEY METRICS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${budgetRange ? `Budget Estimate: ${budgetRange}\n` : ''}
${recommendedPackage ? `Recommended Tier: ${recommendedPackage}\n` : ''}
${userEmail ? `Client Email: ${userEmail}\n` : ''}
${userContactInfo ? `Contact Information: ${userContactInfo}\n` : ''}

${nextSteps.length > 0 ? `\nNext Steps:\n${nextSteps.map((step, idx) => `${idx + 1}. ${step}`).join('\n')}\n` : ''}

${missingInfo.length > 0 ? `\nMissing Information / Follow-up Questions:\n${missingInfo.map((info, idx) => `${idx + 1}. ${info}`).join('\n')}\n` : ''}

Full Conversation:
${conversationText}
    `;

    // Verify summary is included in email payload
    const summaryInHtml = emailHtml.includes(sanitizedSummary);
    const summaryInText = emailText.includes(summary);
    
    console.log('='.repeat(80));
    console.log('📋 QUICK OVERVIEW - CONVERSATION SUMMARY:');
    console.log('='.repeat(80));
    console.log(summary);
    console.log('='.repeat(80));
    console.log('✅ Verification - Summary included in email HTML payload:', summaryInHtml);
    console.log('✅ Verification - Summary included in email Text payload:', summaryInText);
    if (!summaryInHtml || !summaryInText) {
      console.error('❌ ERROR: Summary is missing from email payload!');
    }
    console.log('='.repeat(80));
    console.log('📧 EMAIL SUMMARY - ESTIMATE INFORMATION:');
    console.log('='.repeat(80));
    if (budgetRange) console.log('💰 Budget Estimate:', budgetRange);
    if (recommendedPackage) console.log('📦 Recommended Tier:', recommendedPackage);
    if (nextSteps.length > 0) console.log('✅ Next Steps:', nextSteps);
    if (missingInfo.length > 0) console.log('❓ Missing Info:', missingInfo);
    if (userEmail) console.log('📮 Client Email:', userEmail);
    console.log('='.repeat(80));
    console.log('EMAIL SUMMARY - HTML CONTENT:');
    console.log('='.repeat(80));
    console.log(emailHtml);
    console.log('='.repeat(80));
    console.log('EMAIL SUMMARY - TEXT CONTENT:');
    console.log('='.repeat(80));
    console.log(emailText);
    console.log('='.repeat(80));
    console.log('EMAIL METADATA:');
    console.log({
      from: 'Scope Chat <onboarding@resend.dev>',
      to: ['yourindie101@gmail.com'],
      replyTo: userEmail || undefined,
      subject: 'New Scope Chat Summary',
    });
    console.log('='.repeat(80));

    return NextResponse.json({
      success: true,
      message: 'Email summary generated and logged to console',
      overview: summary,
      estimate: {
        budgetRange,
        recommendedPackage,
        nextSteps,
        missingInfo,
      },
      emailContent: {
        html: emailHtml,
        text: emailText,
        subject: 'New Scope Chat Summary',
        to: 'yourindie101@gmail.com',
        replyTo: userEmail || undefined,
      },
    });
  } catch (error) {
    console.error('Error generating summary or sending email:', error);
    return NextResponse.json(
      { error: 'Failed to generate summary or send email.' },
      { status: 500 },
    );
  }
}

