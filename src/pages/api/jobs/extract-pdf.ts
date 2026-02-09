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

  // Extract markdown from PDF
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

  // Extract structured fields using LLM
  let fields = { title: '', department: '', location: '', type: '', summary: '' };
  try {
    const llmResult = await ai.run('@cf/meta/llama-3.3-70b-instruct-fp8-fast', {
      messages: [
        { role: 'system', content: EXTRACT_PROMPT },
        { role: 'user', content: markdown.slice(0, 6000) },
      ],
      max_tokens: 512,
    });
    const raw = llmResult?.response || '';
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      fields.title = String(parsed.title || '').trim();
      fields.department = DEPARTMENTS.includes(parsed.department) ? parsed.department : '';
      fields.location = String(parsed.location || '').trim();
      fields.type = JOB_TYPES.includes(parsed.type) ? parsed.type : '';
      fields.summary = String(parsed.summary || '').trim();
    }
  } catch (_) {
    // Fields extraction is best-effort; fields stay empty
  }

  return new Response(JSON.stringify({ ok: true, markdown, fields }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
