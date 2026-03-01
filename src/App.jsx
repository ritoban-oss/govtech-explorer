import { useState } from "react";
console.log("[GovTech] App version: DEBUG-2026-03-02-v15");

// Top ~100 US tech companies ranked by approximate annual revenue (public filings, FY2024)
// `rid` = hardcoded USASpending recipient_id for precise contract lookups.
// `search` = fallback text search terms if rid is missing.
const COMPANIES = [
  { name: "Amazon / AWS", arr: "~$575B", rid: "645df5f2-66e3-8d2b-a612-3bff6ed3da30-P", search: ["Amazon Web Services", "Amazon.com"] },
  { name: "Apple", arr: "~$391B", rid: "09c94e6e-003f-7a9a-a6a9-2305eb5b6025-P", search: ["Apple Inc"] },
  { name: "Alphabet (Google)", arr: "~$350B", rid: "fa80ed82-5b68-ffce-2167-5a87592ebb7f-P", search: ["Google"] },
  { name: "Microsoft", arr: "~$245B", rid: "dd77b7c3-663e-cb91-229f-5766a50e9b7f-P", search: ["Microsoft Corporation"] },
  { name: "Meta Platforms", arr: "~$134B", rid: "c8264ddc-49e7-60b8-628c-7aa40ebc2af9-R", search: ["Meta Platforms"] },
  { name: "Verizon", arr: "~$134B", rid: "59d19049-fa5f-87b6-a1ee-85f46d8a61de-P", search: ["Verizon Communications"] },
  { name: "Nvidia", arr: "~$130B", rid: "f7ee130b-0779-082b-bd4b-7d43f9ac1d0a-P", search: ["NVIDIA CORP"] },
  { name: "AT&T", arr: "~$122B", rid: "53927ae0-321e-4c80-2dc9-430ca5135e33-P", search: ["AT&T Inc"] },
  { name: "Dell Technologies", arr: "~$88B", rid: "f96a8de9-a2b2-cc9d-cc9f-ec5976fb4c3b-P", search: ["Dell"] },
  { name: "Accenture", arr: "~$64B", rid: "5a09432b-bc58-9a12-4959-9081815c5e91-P", search: ["Accenture Federal Services"] },
  { name: "IBM", arr: "~$62B", rid: "cae13eb7-b259-520c-9ae0-a46eb3ea2acd-P", search: ["International Business Machines"] },
  { name: "Cisco Systems", arr: "~$57B", rid: "f1e4ed58-f006-1f6f-b3ba-64a95aab33ca-P", search: ["Cisco Systems"] },
  { name: "Intel", arr: "~$54B", rid: "5957c0e2-8dae-2187-9dad-baf26e760236-P", search: ["Intel Corporation"] },
  { name: "Oracle", arr: "~$53B", rid: "356513a4-7506-f7a6-46cb-afad7507daf6-P", search: ["Oracle"] },
  { name: "Broadcom", arr: "~$51B", rid: "68d1dc5b-a501-bf35-2cdc-e5847e145ada-P", search: ["Broadcom"] },
  { name: "Qualcomm", arr: "~$39B", rid: "6455f4c0-f252-0c9f-2581-160a43f739bc-P", search: ["Qualcomm"] },
  { name: "Salesforce", arr: "~$36B", rid: "5d9727da-7694-b040-6aec-7e36b7896e93-P", search: ["Salesforce"] },
  { name: "SAP America", arr: "~$35B", rid: "86bbfe74-1339-d31b-17cb-68687f73ba31-P", search: ["SAP America"] },
  { name: "Hewlett Packard Enterprise", arr: "~$28B", rid: "9720c6ab-3ebf-96f8-2d5b-ef39d3048442-P", search: ["Hewlett Packard Enterprise"] },
  { name: "Applied Materials", arr: "~$27B", rid: "a1d0a912-439b-259c-92d3-be20eb83cb99-P", search: ["Applied Materials"] },
  { name: "Micron Technology", arr: "~$25B", rid: "d01b061c-fc85-d9af-84be-603f1b92bbd0-P", search: ["Micron Technology"] },
  { name: "Adobe", arr: "~$21B", rid: "c0539a21-fc5e-54ff-f392-03191db82ebe-P", search: ["Adobe"] },
  { name: "L3Harris Technologies", arr: "~$21B", rid: "12b896e2-1ad1-3536-da90-51b17b1b316b-P", search: ["L3Harris"] },
  { name: "Cognizant Technology Solutions", arr: "~$19B", rid: "694c1e19-257d-7895-4e16-e01b29d1cfa5-P", search: ["Cognizant"] },
  { name: "Fiserv", arr: "~$19B", rid: "614608be-5210-6745-f040-464b48d69302-P", search: ["Fiserv"] },
  { name: "Texas Instruments", arr: "~$17B", rid: "6600776e-c688-4704-9e57-3d4a41c0feed-P", search: ["Texas Instruments"] },
  { name: "Jacobs Solutions", arr: "~$16B", rid: "be555dcf-9195-a54a-e0a9-3592392d69d7-P", search: ["Jacobs Engineering"] },
  { name: "Lam Research", arr: "~$15B", rid: "7e769228-5d92-fceb-c738-0346f53456c3-P", search: ["Lam Research"] },
  { name: "Leidos", arr: "~$15B", rid: "3b1c9c58-1f9e-8125-7105-02f4ff2c5b8b-P", search: ["Leidos"] },
  { name: "DXC Technology", arr: "~$14B", rid: "e0e8e5a5-edb8-8157-58dc-a4ef6e0ca64b-P", search: ["DXC Technology"] },
  { name: "Lumen Technologies", arr: "~$14B", rid: "fa818510-c3a4-3452-834e-b2344aeddfa4-P", search: ["CenturyLink"] },
  { name: "Western Digital", arr: "~$13B", rid: "0b15311b-9b72-15ad-143d-376e7a6d02af-P", search: ["Western Digital"] },
  { name: "Analog Devices", arr: "~$12B", rid: "37631a05-5adf-3f23-32f7-f2453a8efb42-P", search: ["Analog Devices"] },
  { name: "KLA Corporation", arr: "~$10B", rid: "c9332296-ebc7-77ba-a48c-073954512459-P", search: ["KLA Corporation"] },
  { name: "Booz Allen Hamilton", arr: "~$10B", rid: "ed02855e-60d7-2540-e3d7-18fba1dd1316-P", search: ["Booz Allen Hamilton"] },
  { name: "ServiceNow", arr: "~$9B", rid: "f35c9c9a-89ed-d462-289b-743fc763f45e-P", search: ["ServiceNow"] },
  { name: "Motorola Solutions", arr: "~$9B", rid: "0ec2982e-1af5-7c07-1267-43ca6833f333-P", search: ["Motorola Solutions"] },
  { name: "General Dynamics IT", arr: "~$8.4B", rid: "455555be-773d-eab1-1e6b-7b94400b757e-C", search: ["General Dynamics Information Technology"] },
  { name: "Palo Alto Networks", arr: "~$8B", rid: "ada1386a-835f-9d6e-c4cc-4023751b2a5e-P", search: ["Palo Alto Networks"] },
  { name: "SAIC", arr: "~$7.4B", rid: "20af0683-f17d-1f8f-38ee-2f11bd124559-P", search: ["Science Applications International"] },
  { name: "Peraton", arr: "~$7B", rid: "129fccb1-783c-9fd1-7b6d-6ddea65ace79-P", search: ["Peraton"] },
  { name: "Workday", arr: "~$7B", rid: "8e761fa1-1d7d-36ff-7c42-dac07b9895c5-P", search: ["Workday"] },
  { name: "Seagate Technology", arr: "~$7B", rid: "f3936195-3d25-bd73-cf3a-52c85c31f2f5-P", search: ["Seagate Technology"] },
  { name: "CACI International", arr: "~$6.7B", rid: "5eb76328-ceeb-571b-5efe-569794c9c9b8-P", search: ["CACI"] },
  { name: "NetApp", arr: "~$6.2B", rid: "e5c96d12-148b-ba79-09a8-620d0e47b98c-P", search: ["NetApp"] },
  { name: "Gartner", arr: "~$6B", rid: "ebe6041c-c99b-fb52-193d-1d9ad18e645e-P", search: ["Gartner"] },
  { name: "Parsons Corporation", arr: "~$6B", rid: "ac2c100c-050a-9cb9-0e54-596894cdcf7e-P", search: ["Parsons"] },
  { name: "Juniper Networks", arr: "~$5.6B", rid: "5ab5fece-ab82-c7db-7497-f7842dc2bc00-P", search: ["Juniper Networks"] },
  { name: "Fortinet", arr: "~$5.3B", rid: "040f0bfc-8b63-705d-3a3a-41b2e2780b2e-P", search: ["Fortinet"] },
  { name: "Keysight Technologies", arr: "~$5B", rid: "2dc7960d-44d4-abd2-2f00-56223804ce98-P", search: ["Keysight"] },
  { name: "Zebra Technologies", arr: "~$5B", rid: "00f89823-6ca3-3678-a48d-c81b759fe553-P", search: ["Zebra Technologies"] },
  { name: "Maximus Inc", arr: "~$4.9B", rid: "f87b435f-0b05-95c9-7c0e-e60df7cdff50-P", search: ["Maximus"] },
  { name: "Coherent Corp", arr: "~$4.7B", rid: "e860d910-ea50-bba9-e417-7dfd12cf95e3-P", search: ["Coherent"] },
  { name: "Twilio", arr: "~$4.1B", rid: "053dbdd8-4559-4d19-68e0-1eeef06359eb-P", search: ["Twilio"] },
  { name: "CrowdStrike", arr: "~$3.9B", rid: "eade2e8e-f336-fba3-702d-a5d3cdce6a56-P", search: ["CrowdStrike"] },
  { name: "Akamai Technologies", arr: "~$3.8B", rid: "072cc1de-9dba-2aca-a1d6-3ae25ae6b86e-P", search: ["Akamai"] },
  { name: "CGI Federal", arr: "~$3.8B", rid: "ab4186df-8221-f318-14a5-16c7f754df6c-P", search: ["CGI Federal"] },
  { name: "Splunk", arr: "~$3.7B", rid: "2f018a99-f0c4-6fca-9910-98a7d021cec4-P", search: ["Splunk"] },
  { name: "Trimble Inc", arr: "~$3.7B", rid: "53a752c0-d23e-8913-201e-928647fc802f-P", search: ["Trimble"] },
  { name: "Amentum", arr: "~$3.3B", rid: "fe5366b4-84c8-12ff-126f-f123de29819c-P", search: ["Amentum"] },
  { name: "Entegris", arr: "~$3B", rid: "a5f136c8-992b-c6ad-dbb8-5847aa7a3c76-P", search: ["Entegris"] },
  { name: "Pure Storage", arr: "~$3B", rid: "d07ad5e4-ac41-8af5-1b13-f309603856e7-P", search: ["Pure Storage"] },
  { name: "Palantir Technologies", arr: "~$2.9B", rid: "1ea8a9a4-3726-3491-9040-66950bb67606-P", search: ["Palantir"] },
  { name: "F5 Inc", arr: "~$2.8B", rid: "3f1f36a9-86fe-7a17-e9bc-a992ff315eae-P", search: ["F5 Networks"] },
  { name: "Datadog", arr: "~$2.7B", rid: "c3448cf9-873b-80bb-9e86-86ebc45270e3-P", search: ["Datadog"] },
  { name: "Teradyne", arr: "~$2.7B", rid: "a63656d7-7cc5-96d8-6bda-f41e6025b3b2-P", search: ["Teradyne"] },
  { name: "HubSpot", arr: "~$2.6B", rid: "2ea06780-0573-5601-9f4e-440660d2f6ef-P", search: ["HubSpot"] },
  { name: "Benchmark Electronics", arr: "~$2.6B", rid: "0e032bfe-c1a5-9fdd-d950-f844b366ef8c-P", search: ["Benchmark Electronics"] },
  { name: "Veritas Technologies", arr: "~$2.5B", rid: "1bb56ae7-9166-0c35-98cc-c267efd1109f-C", search: ["Veritas Technologies"] },
  { name: "ManTech International", arr: "~$2.5B", rid: "4c1f7ae7-7f7d-43c4-d9b7-e5fb262d6c93-P", search: ["ManTech"] },
  { name: "Guidehouse", arr: "~$2.5B", rid: "a0cb5664-8703-c7dc-a188-4a96f90a16c9-P", search: ["Guidehouse"] },
  { name: "Databricks", arr: "~$2.4B", rid: "a8a0c935-4150-5281-b882-6f73579c60f0-P", search: ["Databricks Federal"] },
  { name: "Check Point Software", arr: "~$2.4B", rid: "c191ce9c-7f64-3a2e-d40c-7de39078b042-P", search: ["Check Point"] },
  { name: "Okta", arr: "~$2.4B", rid: "79b9cae8-9622-1f33-a163-2cedd10ce9ea-P", search: ["Okta"] },
  { name: "Zscaler", arr: "~$2.2B", rid: "beb035bb-0b71-89d8-0279-267364050c26-P", search: ["Zscaler"] },
  { name: "Nutanix", arr: "~$2.1B", rid: "df3d1ac4-8281-f82f-2dac-d1de9fcd1438-P", search: ["Nutanix"] },
  { name: "Unisys", arr: "~$2.0B", rid: "ed674200-4d13-7795-796b-f587e49d54d7-P", search: ["Unisys"] },
  { name: "ICF International", arr: "~$2.0B", rid: "79743cd6-35d6-7eea-4c3e-dd1fa00bd82a-P", search: ["ICF"] },
  { name: "MongoDB", arr: "~$1.9B", rid: "ed738cfe-0cc9-9efe-e04c-8bfbba231bb9-P", search: ["MongoDB"] },
  { name: "Tyler Technologies", arr: "~$1.9B", rid: "a5388620-bb71-a6c2-30a2-e8a265ae6464-P", search: ["Tyler Technologies"] },
  { name: "Teradata", arr: "~$1.8B", rid: "2e4cd5c7-e376-cfbf-03c1-b37edd88228e-P", search: ["Teradata"] },
  { name: "Maxar Technologies", arr: "~$1.8B", rid: "129ee2de-3209-2f7b-2b02-aeb398036af1-P", search: ["Maxar Technologies"] },
  { name: "Cloudflare", arr: "~$1.7B", rid: "7d1eac33-f87a-7f1c-3029-054d8e5684b5-P", search: ["Cloudflare"] },
  { name: "Lumentum Holdings", arr: "~$1.6B", rid: "19965ad5-2891-8657-5a25-6f36cab32efe-P", search: ["Lumentum"] },
  { name: "EchoStar Corporation", arr: "~$1.6B", rid: "e71617af-5ccc-5e9c-cade-f6a8d243bd53-P", search: ["EchoStar"] },
  { name: "VeriSign", arr: "~$1.5B", rid: "d09ebcbd-4a72-0361-bb16-4f455420a30e-P", search: ["VeriSign"] },
  { name: "Dynatrace", arr: "~$1.4B", rid: "40f9ca92-8136-3de7-7b47-76b0a4dd922c-P", search: ["Dynatrace"] },
  { name: "Elastic NV", arr: "~$1.3B", rid: "68e4d568-16a7-479f-2ab2-bfd5de23cd73-R", search: ["Elastic NV"] },
  { name: "Viavi Solutions", arr: "~$1.1B", rid: "18fbd3ec-f704-aae9-7674-112acd5480c0-P", search: ["Viavi"] },
  { name: "Ciena Corporation", arr: "~$1.0B", rid: "2dcb726c-2286-7326-c4ae-dee3e15e4241-P", search: ["Ciena"] },
  { name: "Tenable Holdings", arr: "~$0.9B", rid: "136ad44c-6364-c8c0-47ab-88fb8295c391-P", search: ["Tenable"] },
  { name: "Rapid7", arr: "~$0.8B", rid: "07fe59ef-df87-1494-741f-8571e1da45ff-P", search: ["Rapid7"] },
  { name: "Commvault Systems", arr: "~$0.8B", rid: "b47c084c-acfe-1f98-8a3a-f6d0d1c9bb77-P", search: ["Commvault"] },
  { name: "Telos Corporation", arr: "~$0.7B", rid: "4cc248e8-f64a-f442-4b15-888273e4933a-P", search: ["Telos Corporation"] },
  { name: "Calix", arr: "~$0.6B", rid: "3c94013f-e570-6db4-7b43-8ca47c22bc1b-P", search: ["Calix"] },
  { name: "Varonis Systems", arr: "~$0.6B", rid: "461eb80f-61c7-978b-286d-410be6619eed-P", search: ["Varonis"] },
  { name: "Appian", arr: "~$0.6B", rid: "e148caf1-df7c-70d2-d78b-2f4501a197b5-P", search: ["Appian Corporation"] },
  { name: "Qualys", arr: "~$0.5B", rid: "8d49c89f-a0b0-a46c-8073-03ee791808a7-P", search: ["Qualys"] },
  { name: "SailPoint Technologies", arr: "~$0.4B", rid: "b55dfcef-c6e6-1f02-cbdf-8d5364fa1572-P", search: ["SailPoint"] },
  { name: "Immersion Corporation", arr: "~$0.1B", rid: "d8690489-d06e-3d24-919b-596622da39b3-P", search: ["Immersion Corporation"] },
];

const EXPOSURE_META = {
  none:        { color: "#22c55e", bg: "#14532d", border: "#166534" },
  low:         { color: "#84cc16", bg: "#1a2e05", border: "#3f6212" },
  moderate:    { color: "#facc15", bg: "#422006", border: "#854d0e" },
  high:        { color: "#f97316", bg: "#431407", border: "#9a3412" },
  "very high": { color: "#ef4444", bg: "#450a0a", border: "#991b1b" },
};

const CAT_META = {
  defense:         { color: "#f87171", bg: "#7f1d1d", label: "🛡 Defense" },
  intelligence:    { color: "#a78bfa", bg: "#3b1f5c", label: "🔍 Intelligence" },
  law_enforcement: { color: "#fb923c", bg: "#431407", label: "⚖️ Law Enforcement" },
  homeland:        { color: "#fbbf24", bg: "#451a03", label: "🦅 Homeland" },
  civilian:        { color: "#60a5fa", bg: "#1e3a5f", label: "🏛 Civilian" },
};

const SENSITIVE_CATS = ["defense", "intelligence", "law_enforcement", "homeland"];

const ExposureBadge = ({ level, label }) => {
  if (!level) return null;
  const m = EXPOSURE_META[level] || EXPOSURE_META.none;
  return (
    <div style={{ background: m.bg, border: `1px solid ${m.border}`, borderRadius: 8, padding: "10px 14px", minWidth: 0 }}>
      <div style={{ fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 2, whiteSpace: "nowrap" }}>{label}</div>
      <div style={{ fontSize: 15, fontWeight: 700, color: m.color, textTransform: "capitalize", wordBreak: "break-word" }}>{level}</div>
    </div>
  );
};

/**
 * Score how well a USASpending autocomplete result matches the intended search term.
 * Higher = better match. Returns -1 for clearly unrelated results.
 */
function scoreMatch(result, searchTerm) {
  const name = (result.recipient_name || "").toUpperCase().replace(/[.,\-]/g, " ").replace(/\s+/g, " ").trim();
  const term = searchTerm.toUpperCase().replace(/[.,\-]/g, " ").replace(/\s+/g, " ").trim();

  // Exact match (ignoring case/punctuation)
  if (name === term) return 100;

  // Name starts with the search term: "APPLE INC" starts with "APPLE"
  if (name.startsWith(term + " ") || name.startsWith(term)) return 80;

  // Search term starts with the name (partial company name in results)
  if (term.startsWith(name + " ") || term.startsWith(name)) return 70;

  // First two words match: catches "MICROSOFT CORPORATION LLC" for "Microsoft Corporation"
  const nameWords = name.split(" ");
  const termWords = term.split(" ");
  if (termWords.length >= 2 && nameWords.length >= 2 &&
      nameWords[0] === termWords[0] && nameWords[1] === termWords[1] &&
      termWords[0].length >= 3) return 60;

  // Single first word match — only if search term is a single word
  if (termWords.length === 1 && nameWords[0] === termWords[0] && termWords[0].length >= 4) return 55;

  // Name contains the full search term as a substring
  if (name.includes(term)) return 50;

  // Search term contained in name but not at start — weaker signal
  if (name.includes(termWords[0]) && termWords[0].length >= 4) return 30;

  // No meaningful match — penalise
  return -1;
}

/**
 * Resolve a company to a USASpending recipient entity via the autocomplete API.
 * Tries each search term in order. For each term's results, scores them by name
 * similarity, prefers parent-level entities (-P suffix) for subsidiary rollup,
 * and uses award amount as a tiebreaker (larger = more likely to be the right entity).
 *
 * Returns { recipient_id, recipient_name, uei, ... } or null if nothing matched.
 */
async function resolveRecipient(searchTerms) {
  for (const term of searchTerms) {
    console.log(`[Resolver] Searching for: "${term}"`);

    // Use the recipient search endpoint — returns proper IDs with -P/-C/-R suffixes
    const res = await fetch("https://api.usaspending.gov/api/v2/recipient/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ keyword: term, limit: 50, order: "desc", sort: "amount" }),
    });
    if (!res.ok) {
      console.warn(`[Resolver] API error ${res.status} for "${term}"`);
      continue;
    }
    const data = await res.json();
    const results = (data?.results || []).map(r => ({
      // Normalize field names to match what the rest of the app expects
      recipient_name: r.name,
      recipient_id: r.id,
      uei: r.uei,
      amount: r.amount,
      recipient_level: r.recipient_level,
    }));
    console.log(`[Resolver] ${results.length} raw results for "${term}":`,
      results.map(r => `${r.recipient_name} (score:${scoreMatch(r, term)}, id:${r.recipient_id}, level:${r.recipient_level})`));
    if (results.length === 0) continue;

    const scored = results
      .map(r => ({ ...r, _score: scoreMatch(r, term) }))
      .filter(r => r._score > 0);

    console.log(`[Resolver] ${scored.length} passed scoring (>0)`);

    if (scored.length === 0) continue;

    // Sort: score desc → parent (-P) over child (-C) → largest amount
    scored.sort((a, b) => {
      if (b._score !== a._score) return b._score - a._score;
      const aParent = a.recipient_id?.endsWith("-P") ? 1 : 0;
      const bParent = b.recipient_id?.endsWith("-P") ? 1 : 0;
      if (bParent !== aParent) return bParent - aParent;
      return (b.amount || 0) - (a.amount || 0);
    });

    console.log(`[Resolver] Winner: "${scored[0].recipient_name}" score=${scored[0]._score} id=${scored[0].recipient_id} level=${scored[0].recipient_level}`);
    return scored[0];
  }
  console.warn(`[Resolver] FAILED - no match for:`, searchTerms);
  return null;
}

export default function App() {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("anthropic_key") || "");
  const [keyInput, setKeyInput] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("");
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [expandedAgency, setExpandedAgency] = useState(null);
  const [resolvedEntity, setResolvedEntity] = useState(null);

  const filtered = COMPANIES.filter(c => c.name.toLowerCase().includes(query.toLowerCase()));
  const API_BASE = "";

  const saveKey = () => {
    localStorage.setItem("anthropic_key", keyInput);
    setApiKey(keyInput);
    setShowSettings(false);
  };

  const loadCompany = async co => {
    if (loading) return;
    if (!apiKey) { setShowSettings(true); return; }
    setSelected(co);
    setResult(null);
    setError("");
    setActiveFilter("all");
    setExpandedAgency(null);
    setResolvedEntity(null);
    setLoading(true);
    try {
      // Step 1: Get recipient_id — use hardcoded rid if available, otherwise resolve dynamically
      const searchTerms = co.search || [co.name];
      let recipient;

      if (co.rid) {
        // Hardcoded recipient_id — skip the resolver entirely
        recipient = { recipient_id: co.rid, recipient_name: co.name };
        console.log(`[Awards] Using hardcoded rid: ${co.rid}`);
      } else {
        setLoadingMsg("Resolving recipient entity on USASpending.gov…");
        recipient = await resolveRecipient(searchTerms);
        console.log(`[Awards] Resolved dynamically:`, recipient?.recipient_id || "FAILED");
      }
      setResolvedEntity(recipient);

      // Step 2: Fetch awards
      setLoadingMsg("Querying USASpending.gov…");
      const filters = {
        award_type_codes: ["A", "B", "C", "D"],
        time_period: [{ start_date: "2007-10-01", end_date: "2025-12-31" }],
      };

      if (recipient?.recipient_id) {
        filters.recipient_id = recipient.recipient_id;
        console.log(`[Awards] Filtering by recipient_id: ${recipient.recipient_id}`);
      } else {
        // Fallback: text search if no entity was resolved
        filters.recipient_search_text = [searchTerms[0]];
        console.log(`[Awards] Fallback: recipient_search_text: "${searchTerms[0]}"`);
      }

      const spendingRes = await fetch("https://api.usaspending.gov/api/v2/search/spending_by_award/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filters,
          fields: [
            "Award ID",
            "Recipient Name",
            "Awarding Agency",
            "Awarding Sub Agency",
            "Award Amount",
            "Award Type",
            "Description",
            "Start Date",
            "End Date",
          ],
          sort: "Award Amount",
          order: "desc",
          limit: 100,
          page: 1,
        }),
      });
      if (!spendingRes.ok) {
        const errText = await spendingRes.text();
        throw new Error(`USASpending error ${spendingRes.status}: ${errText.slice(0, 200)}`);
      }
      const spendingData = await spendingRes.json();
      const awards = spendingData.results || [];
      const totalCount = spendingData.page_metadata?.total || awards.length;

      if (awards.length === 0) {
        throw new Error(`No federal contracts found for "${co.name}" on USASpending.gov. This company may not have significant federal contracting activity.`);
      }

      // Step 3: send award data to local server for Claude analysis
      setLoadingMsg("Analyzing with Claude AI…");
      const res = await fetch(`${API_BASE}/api/lookup`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-anthropic-key": apiKey },
        body: JSON.stringify({ company: co.name, awards, totalCount }),
      });
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (e) {
      setError(e.message || "Unknown error");
    }
    setLoadingMsg("");
    setLoading(false);
  };

  const agencies = result?.agencies || [];
  const displayedAgencies = activeFilter === "all"
    ? agencies
    : agencies.filter(a => a.category === activeFilter || (activeFilter === "sensitive" && SENSITIVE_CATS.includes(a.category)));
  const sensCount = agencies.filter(a => SENSITIVE_CATS.includes(a.category)).length;
  const filterTabs = [
    { key: "all", label: `All (${agencies.length})` },
    { key: "sensitive", label: `⚠️ Sensitive (${sensCount})` },
    { key: "defense", label: "🛡 Defense" },
    { key: "intelligence", label: "🔍 Intel" },
    { key: "law_enforcement", label: "⚖️ Law Enforcement" },
    { key: "civilian", label: "🏛 Civilian" },
  ].filter(t => t.key === "all" || t.key === "sensitive" || agencies.some(a => a.category === t.key));

  return (
    <div style={{ fontFamily: "Inter, system-ui, sans-serif", minHeight: "100vh", background: "#0f172a", color: "#e2e8f0", display: "flex", flexDirection: "column" }}>

      {/* Settings Modal */}
      {showSettings && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 12, padding: 28, width: "100%", maxWidth: 420 }}>
            <h2 style={{ margin: "0 0 6px", fontSize: 16, color: "#f1f5f9" }}>Anthropic API Key</h2>
            <p style={{ margin: "0 0 16px", fontSize: 12, color: "#64748b", lineHeight: 1.6 }}>
              Your key is stored locally in your browser and sent directly to your local backend. It is never transmitted to any external server other than Anthropic's API.
            </p>
            <input
              type="password"
              placeholder="sk-ant-..."
              defaultValue={apiKey}
              onChange={e => setKeyInput(e.target.value)}
              style={{ width: "100%", padding: "9px 12px", borderRadius: 7, border: "1px solid #475569", background: "#0f172a", color: "#e2e8f0", fontSize: 13, boxSizing: "border-box", outline: "none", marginBottom: 12 }}
            />
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button onClick={() => setShowSettings(false)} style={{ padding: "7px 16px", borderRadius: 7, border: "1px solid #334155", background: "transparent", color: "#94a3b8", cursor: "pointer", fontSize: 13 }}>Cancel</button>
              <button onClick={saveKey} style={{ padding: "7px 16px", borderRadius: 7, border: "none", background: "#1d4ed8", color: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>Save Key</button>
            </div>
            <p style={{ margin: "14px 0 0", fontSize: 11, color: "#475569" }}>
              Get a key at <a href="https://console.anthropic.com" target="_blank" rel="noreferrer" style={{ color: "#60a5fa" }}>console.anthropic.com</a>
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ background: "#1e293b", borderBottom: "1px solid #334155", padding: "14px 20px", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 22 }}>🏛️</span>
          <div style={{ minWidth: 0, flex: 1 }}>
            <h1 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#f1f5f9" }}>GovTech Contracts and Partnership Explorer</h1>
            <p style={{ margin: 0, fontSize: 11, color: "#64748b", wordBreak: "break-word" }}>AI-powered live search tool that aggregates publicly available data on government partnerships for major tech companies.</p>
          </div>
          <button onClick={() => { setKeyInput(apiKey); setShowSettings(true); }}
            style={{ flexShrink: 0, background: apiKey ? "#14532d" : "#7f1d1d", border: `1px solid ${apiKey ? "#166534" : "#991b1b"}`, borderRadius: 8, padding: "6px 12px", color: apiKey ? "#4ade80" : "#f87171", cursor: "pointer", fontSize: 11, whiteSpace: "nowrap" }}>
            {apiKey ? "✓ API Key Set" : "⚠ Set API Key"}
          </button>
        </div>
      </div>

      <div style={{ display: "flex", flex: 1, overflow: "hidden", minHeight: 0 }}>

        {/* Sidebar */}
        <div style={{ width: 220, flexShrink: 0, background: "#1e293b", borderRight: "1px solid #334155", display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ padding: 10 }}>
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="🔍 Search companies…"
              style={{ width: "100%", padding: "7px 10px", borderRadius: 6, border: "1px solid #334155", background: "#0f172a", color: "#e2e8f0", fontSize: 12, boxSizing: "border-box", outline: "none" }} />
          </div>
          <div style={{ overflowY: "auto", flex: 1 }}>
            {filtered.map(c => (
              <button key={c.name} onClick={() => loadCompany(c)}
                style={{ width: "100%", textAlign: "left", padding: "8px 12px", background: selected?.name === c.name ? "#1e40af" : "transparent", border: "none", borderBottom: "1px solid #1a2744", color: selected?.name === c.name ? "#fff" : "#cbd5e1", cursor: "pointer", fontSize: 12, display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 6 }}>
                <span style={{ flex: 1, wordBreak: "break-word", lineHeight: 1.4 }}>
                  <span style={{ color: "#334155", marginRight: 4, fontSize: 10 }}>#{COMPANIES.indexOf(c) + 1}</span>{c.name}
                </span>
                <span style={{ fontSize: 10, color: selected?.name === c.name ? "#93c5fd" : "#475569", whiteSpace: "nowrap", paddingTop: 1 }}>{c.arr}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Panel */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", minWidth: 0 }}>

          {!selected && !loading && (
            <div style={{ textAlign: "center", marginTop: 80, color: "#475569" }}>
              <div style={{ fontSize: 48, marginBottom: 14 }}>🔍</div>
              <h2 style={{ color: "#64748b", margin: 0, fontWeight: 500, fontSize: 16 }}>Select a company to research</h2>
              <p style={{ fontSize: 12, color: "#334155", marginTop: 8 }}>Resolves entities via UEI on USASpending.gov, then analyzed by Claude AI</p>
            </div>
          )}

          {loading && (
            <div style={{ textAlign: "center", marginTop: 80 }}>
              <div style={{ fontSize: 34, marginBottom: 12 }}>🔎</div>
              <p style={{ fontSize: 14, color: "#94a3b8" }}>Looking up <strong>{selected?.name}</strong>…</p>
              <p style={{ fontSize: 13, color: "#60a5fa", marginTop: 8, fontWeight: 500 }}>{loadingMsg}</p>
              <div style={{ marginTop: 12, display: "flex", justifyContent: "center", gap: 8 }}>
                {["1. Resolve Entity", "2. Fetch Awards", "3. Analyze with Claude"].map((s, i) => {
                  const done =
                    (i === 0 && !loadingMsg.includes("Resolving")) ||
                    (i === 1 && loadingMsg.includes("Analyzing"));
                  const active =
                    (i === 0 && loadingMsg.includes("Resolving")) ||
                    (i === 1 && loadingMsg.includes("Querying")) ||
                    (i === 2 && loadingMsg.includes("Analyzing"));
                  return (
                    <span key={s} style={{ fontSize: 11, padding: "4px 10px", borderRadius: 12, border: "1px solid #334155",
                      background: done ? "#14532d" : active ? "#1e3a8a" : "transparent",
                      color: done ? "#4ade80" : active ? "#93c5fd" : "#475569" }}>
                      {done ? "✓ " : ""}{s}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {error && (
            <div style={{ background: "#7f1d1d", border: "1px solid #991b1b", borderRadius: 8, padding: 14, color: "#fca5a5", wordBreak: "break-word" }}>
              <strong>Error:</strong> {error}
            </div>
          )}

          {!loading && result && selected && (
            <>
              <h2 style={{ margin: "0 0 4px", fontSize: 20, color: "#f1f5f9", wordBreak: "break-word" }}>{selected.name}</h2>

              {/* Resolved entity badge */}
              {resolvedEntity && (
                <div style={{ marginBottom: 14, display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 11, color: "#64748b" }}>Matched entity:</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#38bdf8", background: "#0c4a6e", padding: "2px 8px", borderRadius: 4 }}>
                    {resolvedEntity.recipient_name || "Unknown"}
                  </span>
                  {resolvedEntity.uei && (
                    <span style={{ fontSize: 10, color: "#475569", fontFamily: "monospace" }}>
                      UEI: {resolvedEntity.uei}
                    </span>
                  )}
                  <span style={{ fontSize: 10, color: "#475569" }}>
                    ({resolvedEntity.recipient_level === "P" ? "Parent" : resolvedEntity.recipient_level === "C" ? "Child" : resolvedEntity.recipient_id ? "Standalone" : "Matched"} entity)
                  </span>
                </div>
              )}
              {!resolvedEntity && result && (
                <div style={{ marginBottom: 14, display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 11, color: "#94a3b8" }}>Entity not found in recipient index</span>
                </div>
              )}

              {/* Stat badges */}
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
                <div style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8, padding: "10px 14px", minWidth: 0 }}>
                  <div style={{ fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 2 }}>Est. Revenue</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#e2e8f0" }}>{selected.arr}</div>
                </div>
                <div style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8, padding: "10px 14px", minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 2 }}>Federal Contracts</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#34d399", wordBreak: "break-word" }}>{result.totalEstimate}</div>
                </div>
                <ExposureBadge level={result.defenseExposure} label="🛡 Defense" />
                <ExposureBadge level={result.lawEnforcementExposure} label="⚖️ Law Enforcement" />
                <ExposureBadge level={result.intelligenceExposure} label="🔍 Intelligence" />
              </div>

              {/* Analysis panel */}
              <div style={{ background: "#0f2744", border: "1px solid #1d4ed8", borderRadius: 8, padding: 16, marginBottom: 14 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#60a5fa", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.08em" }}>✦ Partnership Analysis</div>
                <p style={{ fontSize: 13, color: "#cbd5e1", margin: "0 0 10px", lineHeight: 1.7, wordBreak: "break-word" }}>{result.summary}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, borderTop: "1px solid #1e3a8a", paddingTop: 10 }}>
                  {result.defenseNote && <p style={{ fontSize: 12, color: "#f87171", margin: 0, wordBreak: "break-word", lineHeight: 1.5 }}>🛡 {result.defenseNote}</p>}
                  {result.lawEnforcementNote && <p style={{ fontSize: 12, color: "#fb923c", margin: 0, wordBreak: "break-word", lineHeight: 1.5 }}>⚖️ {result.lawEnforcementNote}</p>}
                  {result.intelligenceNote && <p style={{ fontSize: 12, color: "#a78bfa", margin: 0, wordBreak: "break-word", lineHeight: 1.5 }}>🔍 {result.intelligenceNote}</p>}
                </div>
              </div>

              {/* Ethical concerns */}
              {result.ethicalConcerns?.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <h3 style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.07em", color: "#f59e0b", margin: "0 0 8px" }}>⚠️ Documented Ethical Concerns</h3>
                  <div style={{ display: "grid", gap: 8 }}>
                    {result.ethicalConcerns.map((c, i) => (
                      <div key={i} style={{ background: "#1c1407", border: "1px solid #78350f", borderRadius: 8, padding: "10px 14px" }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: "#fbbf24", marginBottom: 4, wordBreak: "break-word" }}>{c.title}</div>
                        <p style={{ fontSize: 12, color: "#d97706", margin: 0, lineHeight: 1.6, wordBreak: "break-word" }}>{c.detail}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notable contracts */}
              {result.notableContracts?.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <h3 style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.07em", color: "#64748b", margin: "0 0 8px" }}>Notable Contracts</h3>
                  <div style={{ display: "grid", gap: 8, gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}>
                    {result.notableContracts.map((c, i) => (
                      <div key={i} style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8, padding: "10px 12px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                          <span style={{ fontSize: 11, color: "#94a3b8", fontStyle: "italic", wordBreak: "break-word", flex: 1 }}>{c.agency}</span>
                          {c.value && <span style={{ fontSize: 12, fontWeight: 700, color: "#34d399", whiteSpace: "nowrap" }}>{c.value}</span>}
                        </div>
                        <p style={{ fontSize: 12, color: "#cbd5e1", margin: 0, lineHeight: 1.5, wordBreak: "break-word" }}>{c.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Agency filter tabs */}
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10, alignItems: "center" }}>
                <span style={{ fontSize: 11, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em", marginRight: 4 }}>Agencies</span>
                {filterTabs.map(t => (
                  <button key={t.key} onClick={() => { setActiveFilter(t.key); setExpandedAgency(null); }}
                    style={{ padding: "4px 12px", borderRadius: 20, border: `1px solid ${activeFilter === t.key ? "#1d4ed8" : "#334155"}`, fontSize: 11, cursor: "pointer", background: activeFilter === t.key ? "#1d4ed8" : "transparent", color: activeFilter === t.key ? "#fff" : "#94a3b8", whiteSpace: "nowrap" }}>
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Agency cards */}
              <div style={{ display: "grid", gap: 8 }}>
                {displayedAgencies.length === 0
                  ? <p style={{ color: "#475569", fontSize: 13 }}>No agencies found for this filter.</p>
                  : displayedAgencies.map((ag, i) => {
                    const cm = CAT_META[ag.category] || CAT_META.civilian;
                    const isOpen = expandedAgency === i;
                    return (
                      <div key={i} style={{ background: "#1e293b", border: `1px solid ${SENSITIVE_CATS.includes(ag.category) ? "#7f1d1d" : "#334155"}`, borderRadius: 8, overflow: "hidden" }}>
                        <button onClick={() => setExpandedAgency(isOpen ? null : i)}
                          style={{ width: "100%", textAlign: "left", padding: "11px 14px", background: "transparent", border: "none", cursor: "pointer", color: "#e2e8f0", display: "flex", alignItems: "flex-start", gap: 8 }}>
                          <span style={{ fontSize: 11, color: "#475569", minWidth: 22, paddingTop: 1 }}>#{i + 1}</span>
                          <span style={{ flex: 1, fontSize: 13, fontWeight: 500, wordBreak: "break-word", lineHeight: 1.4 }}>{ag.name}</span>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0, flexWrap: "wrap", justifyContent: "flex-end" }}>
                            <span style={{ fontSize: 10, background: cm.bg, color: cm.color, padding: "2px 7px", borderRadius: 4, whiteSpace: "nowrap" }}>{cm.label}</span>
                            {ag.estimatedValue && <span style={{ fontSize: 12, fontWeight: 700, color: "#34d399", whiteSpace: "nowrap" }}>{ag.estimatedValue}</span>}
                            <span style={{ color: "#475569", fontSize: 11 }}>{isOpen ? "▲" : "▼"}</span>
                          </div>
                        </button>
                        {isOpen && (
                          <div style={{ borderTop: "1px solid #334155", padding: "10px 14px" }}>
                            <p style={{ fontSize: 13, color: "#94a3b8", margin: 0, lineHeight: 1.65, wordBreak: "break-word" }}>{ag.nature}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>

              {result.dataNote && (
                <p style={{ fontSize: 11, color: "#334155", marginTop: 20, textAlign: "center", lineHeight: 1.6, wordBreak: "break-word" }}>ℹ️ {result.dataNote}</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
