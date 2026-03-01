/**
 * Cloudflare Pages Function — /api/lookup
 *
 * Replaces the Express backend. Receives award data from the client,
 * sends it to the Anthropic API for analysis, and returns the result.
 *
 * The user's Anthropic API key arrives via the x-anthropic-key header
 * and is forwarded directly to Anthropic — never stored or logged.
 */

const fmt = (n) => {
  if (!n) return "$0";
  if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(0)}K`;
  return `$${n.toFixed(0)}`;
};

function aggregateByAgency(awards) {
  const map = {};
  for (const a of awards) {
    const agency = a["Awarding Agency"] || "Unknown Agency";
    const amount = a["Award Amount"] || 0;
    if (!map[agency]) map[agency] = { name: agency, total: 0, count: 0, samples: [] };
    map[agency].total += amount;
    map[agency].count += 1;
    if (map[agency].samples.length < 3 && a["Description"]) {
      map[agency].samples.push({
        desc: a["Description"].slice(0, 200),
        value: fmt(amount),
        id: a["Award ID"],
        start: a["Start Date"],
        end: a["End Date"],
      });
    }
  }
  return Object.values(map).sort((a, b) => b.total - a.total);
}

const ANALYSIS_SYSTEM = `You are a JSON-only API endpoint for a nonpartisan government transparency platform.
Respond with a single raw JSON object. No markdown, no code fences, no explanation. Pure JSON only.`;

function buildPrompt(company, agencies, totalVal, totalCount) {
  const topAgencies = agencies.slice(0, 15).map((a) => ({
    agency: a.name,
    totalObligated: fmt(a.total),
    contractCount: a.count,
    sampleContracts: a.samples,
  }));
  return `Analyze this federal contracting data for ${company} and return ONLY a JSON object.

SOURCE: USASpending.gov (live data)
Total awards on record: ${totalCount}
Total obligated value (top 100 awards): ${fmt(totalVal)}
Agency breakdown:
${JSON.stringify(topAgencies, null, 2)}

Classify each agency as: defense, intelligence, law_enforcement, homeland, or civilian.
Also draw on your training knowledge about documented ethical concerns for this company.

Return ONLY this JSON:
{
  "summary": "3-4 sentence factual nonpartisan overview. Do not address any audience segment directly.",
  "totalEstimate": "${fmt(totalVal)} across ${totalCount}+ contracts",
  "defenseExposure": "none | low | moderate | high | very high",
  "defenseNote": "One sentence on defense/military footprint.",
  "lawEnforcementExposure": "none | low | moderate | high | very high",
  "lawEnforcementNote": "One sentence on federal law enforcement partnerships.",
  "intelligenceExposure": "none | low | moderate | high | very high",
  "intelligenceNote": "One sentence on intelligence community partnerships.",
  "ethicalConcerns": [
    { "title": "Short concern title", "detail": "1-2 sentence factual description citing who raised it." }
  ],
  "agencies": [
    { "name": "Agency name", "category": "defense|civilian|intelligence|law_enforcement|homeland", "estimatedValue": "value", "nature": "1-2 sentence description." }
  ],
  "notableContracts": [
    { "description": "Contract description", "value": "Dollar amount", "agency": "Agency name" }
  ],
  "dataNote": "Data from USASpending.gov. Shows top 100 contracts by value. Federal contracts only."
}
Include all agencies. Up to 5 notable contracts. Up to 4 ethical concerns (empty array if none).`;
}

function jsonResponse(body, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "private, no-store",
      ...extraHeaders,
    },
  });
}

export async function onRequestPost(context) {
  const { request } = context;

  // Validate API key
  const apiKey = request.headers.get("x-anthropic-key");
  if (!apiKey || !apiKey.startsWith("sk-ant-")) {
    return jsonResponse(
      { error: "Missing or invalid Anthropic API key. Set one in the app settings." },
      401
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: "Invalid JSON body" }, 400);
  }

  const { company, awards, totalCount } = body;
  if (!company || typeof company !== "string" || company.length > 200) {
    return jsonResponse({ error: "Invalid or missing company name" }, 400);
  }
  // Sanitize: strip control chars, limit to alphanumeric + common punctuation
  const safeCompany = company.replace(/[^\w\s.,&()/'"-]/g, "").trim().slice(0, 100);
  if (!safeCompany) {
    return jsonResponse({ error: "Company name contains no valid characters" }, 400);
  }
  if (!Array.isArray(awards) || awards.length === 0) {
    return jsonResponse({ error: "Missing or empty awards data" }, 400);
  }
  if (awards.length > 200) {
    return jsonResponse({ error: "Awards array exceeds maximum size of 200" }, 400);
  }
  const safeTotalCount = Math.max(0, Math.floor(Number(totalCount) || awards.length));

  try {
    const agencies = aggregateByAgency(awards);
    const totalVal = awards.reduce((s, a) => s + (a["Award Amount"] || 0), 0);

    const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2000,
        system: ANALYSIS_SYSTEM,
        messages: [{ role: "user", content: buildPrompt(safeCompany, agencies, totalVal, safeTotalCount) }],
      }),
    });

    if (!anthropicRes.ok) {
      const errData = await anthropicRes.json().catch(() => ({}));
      const msg = errData?.error?.message || `Anthropic API error ${anthropicRes.status}`;
      return jsonResponse({ error: msg }, anthropicRes.status === 401 ? 401 : 502);
    }

    const message = await anthropicRes.json();
    let raw = message.content[0].text.trim();

    // Strip markdown fences if present
    const fence = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (fence) raw = fence[1].trim();
    const s = raw.indexOf("{");
    const e = raw.lastIndexOf("}");
    if (s !== -1 && e !== -1) raw = raw.slice(s, e + 1);

    const result = JSON.parse(raw);
    return jsonResponse(result);
  } catch (err) {
    return jsonResponse({ error: err.message || "Internal server error" }, 500);
  }
}

// Reject non-POST methods
export async function onRequestGet() {
  return jsonResponse({ error: "Method not allowed. Use POST." }, 405);
}
