import type { APIRoute } from 'astro';

export const prerender = false;

const MAX_SIZE = 20 * 1024 * 1024; // 20 MB

const DEPARTMENTS = ['Engineering', 'Product', 'Operations', 'Sales & Partnerships', 'People & Finance'];
const JOB_TYPES = ['Full-time', 'Part-time', 'Contract'];

const EXTRACT_PROMPT = `You are a structured data extractor. Given a job description, extract the following fields as JSON. Return ONLY valid JSON, no extra text.

{
  "title": "job title (short, e.g. 'Senior Software Engineer')",
  "department": "one of: ${DEPARTMENTS.join(', ')}",
  "location": "job location (e.g. 'Remote', 'New York, NY')",
  "type": "one of: ${JOB_TYPES.join(', ')}",
  "summary": "1-2 sentence summary of the role for a card listing"
}

If a field cannot be determined, use an empty string. For department, pick the closest match.`;

/** Try Anthropic via AI Gateway, fall back to Workers AI */
async function extractFields(
  ai: any,
  markdown: string,
  accountId?: string,
  gatewayId?: string,
  anthropicKey?: string,
): Promise<{ title: string; department: string; location: string; type: string; summary: string }> {
  const empty = { title: '', department: '', location: '', type: '', summary: '' };
  const content = markdown.slice(0, 6000);

  // Try Anthropic via AI Gateway if configured
  if (accountId && gatewayId && anthropicKey) {
    try {
      const url = `https://gateway.ai.cloudflare.com/v1/${accountId}/${gatewayId}/anthropic/v1/messages`;
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': anthropicKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 512,
          system: EXTRACT_PROMPT,
          messages: [{ role: 'user', content }],
        }),
      });
      if (res.ok) {
        const data = await res.json() as any;
        const text = data?.content?.[0]?.text || '';
        return parseFields(text);
      }
    } catch (_) {
      // Fall through to Workers AI
    }
  }

  // Fallback: Workers AI
  try {
    const result = await ai.run('@cf/meta/llama-3.3-70b-instruct-fp8-fast', {
      messages: [
        { role: 'system', content: EXTRACT_PROMPT },
        { role: 'user', content },
      ],
      max_tokens: 512,
    });
    return parseFields(result?.response || '');
  } catch (_) {
    return empty;
  }
}

function parseFields(raw: string) {
  const empty = { title: '', department: '', location: '', type: '', summary: '' };
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) return empty;
  try {
    const parsed = JSON.parse(jsonMatch[0]);
    return {
      title: String(parsed.title || '').trim(),
      department: DEPARTMENTS.includes(parsed.department) ? parsed.department : '',
      location: String(parsed.location || '').trim(),
      type: JOB_TYPES.includes(parsed.type) ? parsed.type : '',
      summary: String(parsed.summary || '').trim(),
    };
  } catch (_) {
    return empty;
  }
}

export const POST: APIRoute = async ({ locals, request }) => {
  const runtime = (locals as any).runtime;
  const ai = runtime?.env?.AI;

  if (!ai) {
    return new Response(JSON.stringify({ error: 'AI binding not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const formData = await request.formData();
  const file = formData.get('file');
  if (!file || !(file instanceof File)) {
    return new Response(JSON.stringify({ error: 'No file provided' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (file.type !== 'application/pdf') {
    return new Response(JSON.stringify({ error: `Invalid file type: ${file.type}. Only PDF files are accepted.` }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (file.size > MAX_SIZE) {
    return new Response(JSON.stringify({ error: 'File exceeds 20 MB limit' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const arrayBuffer = await file.arrayBuffer();

  // Extract markdown from PDF (Workers AI only)
  let markdown = '';
  try {
    const result = await ai.toMarkdown([{
      name: file.name,
      blob: new Blob([arrayBuffer], { type: 'application/pdf' }),
    }]);
    markdown = result?.[0]?.data || '';
  } catch (err: any) {
    return new Response(JSON.stringify({ error: `PDF extraction failed: ${err.message}` }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!markdown) {
    return new Response(JSON.stringify({ error: 'No text could be extracted from this PDF' }), {
      status: 422,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Extract structured fields (AI Gateway → Workers AI fallback)
  const env = runtime?.env || {};
  const fields = await extractFields(
    ai,
    markdown,
    env.CF_ACCOUNT_ID,
    env.AI_GATEWAY_ID,
    env.ANTHROPIC_API_KEY,
  );

  return new Response(JSON.stringify({ ok: true, markdown, fields }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
