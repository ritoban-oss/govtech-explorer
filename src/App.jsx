import { useState } from "react";
console.log("[GovTech] App version: DEBUG-2026-03-01-v7");

// Top ~100 US tech companies ranked by approximate annual revenue (public filings, FY2024)
// `search` overrides the display name when querying USASpending recipient autocomplete.
// Use legal entity names or stripped-down terms that match federal contract records.
const COMPANIES = [
  { name: "Amazon / AWS", arr: "~$575B", search: ["Amazon Web Services", "Amazon.com"] },
  { name: "Apple", arr: "~$391B", search: ["Apple Inc", "Apple Computer"] },
  { name: "Alphabet (Google)", arr: "~$350B", search: ["Google"] },
  { name: "Microsoft", arr: "~$245B", search: ["Microsoft Corporation"] },
  { name: "Meta Platforms", arr: "~$134B", search: ["Meta Platforms", "Facebook"] },
  { name: "Verizon", arr: "~$134B", search: ["Verizon Communications", "Verizon Business"] },
  { name: "Nvidia", arr: "~$130B", search: ["Nvidia Corporation"] },
  { name: "AT&T", arr: "~$122B", search: ["AT&T Corp", "AT&T Inc"] },
  { name: "Dell Technologies", arr: "~$88B", search: ["Dell Technologies", "Dell Inc"] },
  { name: "Accenture", arr: "~$64B", search: ["Accenture Federal Services", "Accenture"] },
  { name: "IBM", arr: "~$62B", search: ["International Business Machines", "IBM"] },
  { name: "Cisco Systems", arr: "~$57B", search: ["Cisco Systems"] },
  { name: "Intel", arr: "~$54B", search: ["Intel Corporation"] },
  { name: "Oracle", arr: "~$53B", search: ["Oracle Corporation", "Oracle America"] },
  { name: "Broadcom", arr: "~$51B", search: ["Broadcom Corporation", "Broadcom Inc"] },
  { name: "Qualcomm", arr: "~$39B", search: ["Qualcomm Incorporated", "Qualcomm Inc"] },
  { name: "Salesforce", arr: "~$36B", search: ["Salesforce Inc", "Salesforce.com"] },
  { name: "SAP America", arr: "~$35B", search: ["SAP America", "SAP Public Services"] },
  { name: "Hewlett Packard Enterprise", arr: "~$28B", search: ["Hewlett Packard Enterprise"] },
  { name: "Applied Materials", arr: "~$27B", search: ["Applied Materials Inc"] },
  { name: "Micron Technology", arr: "~$25B", search: ["Micron Technology Inc"] },
  { name: "Adobe", arr: "~$21B", search: ["Adobe Inc", "Adobe Systems"] },
  { name: "L3Harris Technologies", arr: "~$21B", search: ["L3Harris", "Harris Corporation"] },
  { name: "Cognizant Technology Solutions", arr: "~$19B", search: ["Cognizant Technology Solutions", "Cognizant"] },
  { name: "Fiserv", arr: "~$19B", search: ["Fiserv Inc"] },
  { name: "Texas Instruments", arr: "~$17B", search: ["Texas Instruments Incorporated"] },
  { name: "Jacobs Solutions", arr: "~$16B", search: ["Jacobs Engineering", "Jacobs Solutions"] },
  { name: "Lam Research", arr: "~$15B", search: ["Lam Research Corporation"] },
  { name: "Leidos", arr: "~$15B", search: ["Leidos Inc", "Leidos Holdings"] },
  { name: "DXC Technology", arr: "~$14B", search: ["DXC Technology Company"] },
  { name: "Lumen Technologies", arr: "~$14B", search: ["Lumen Technologies", "CenturyLink"] },
  { name: "Western Digital", arr: "~$13B", search: ["Western Digital Corporation"] },
  { name: "Analog Devices", arr: "~$12B", search: ["Analog Devices Inc"] },
  { name: "OpenAI", arr: "~$12B", search: ["OpenAI", "OpenAI OpCo", "OpenAI Inc"] },
  { name: "KLA Corporation", arr: "~$10B", search: ["KLA"] },
  { name: "Booz Allen Hamilton", arr: "~$10B", search: ["Booz Allen Hamilton Inc"] },
  { name: "ServiceNow", arr: "~$9B", search: ["ServiceNow Inc"] },
  { name: "Motorola Solutions", arr: "~$9B", search: ["Motorola Solutions Inc"] },
  { name: "General Dynamics IT", arr: "~$8.4B", search: ["General Dynamics Information Technology", "GDIT"] },
  { name: "Palo Alto Networks", arr: "~$8B", search: ["Palo Alto Networks Inc"] },
  { name: "SAIC", arr: "~$7.4B", search: ["Science Applications International", "SAIC Inc"] },
  { name: "Peraton", arr: "~$7B", search: ["Peraton Inc"] },
  { name: "Workday", arr: "~$7B", search: ["Workday Inc"] },
  { name: "Seagate Technology", arr: "~$7B", search: ["Seagate"] },
  { name: "CACI International", arr: "~$6.7B", search: ["CACI"] },
  { name: "NetApp", arr: "~$6.2B", search: ["NetApp Inc"] },
  { name: "Gartner", arr: "~$6B", search: ["Gartner Inc"] },
  { name: "Parsons Corporation", arr: "~$6B", search: ["Parsons"] },
  { name: "Juniper Networks", arr: "~$5.6B", search: ["Juniper Networks Inc"] },
  { name: "Fortinet", arr: "~$5.3B", search: ["Fortinet Inc"] },
  { name: "Keysight Technologies", arr: "~$5B", search: ["Keysight"] },
  { name: "Zebra Technologies", arr: "~$5B", search: ["Zebra Technologies"] },
  { name: "Maximus Inc", arr: "~$4.9B", search: ["Maximus"] },
  { name: "Coherent Corp", arr: "~$4.7B", search: ["Coherent Corp", "II-VI Incorporated"] },
  { name: "Twilio", arr: "~$4.1B", search: ["Twilio Inc"] },
  { name: "CrowdStrike", arr: "~$3.9B", search: ["CrowdStrike Inc", "CrowdStrike Holdings"] },
  { name: "Akamai Technologies", arr: "~$3.8B", search: ["Akamai"] },
  { name: "CGI Federal", arr: "~$3.8B", search: ["CGI Federal", "CGI Technologies"] },
  { name: "Trimble Inc", arr: "~$3.7B", search: ["Trimble"] },
  { name: "Amentum", arr: "~$3.3B", search: ["Amentum Services"] },
  { name: "Entegris", arr: "~$3B", search: ["Entegris Inc"] },
  { name: "Pure Storage", arr: "~$3B", search: ["Pure Storage Inc"] },
  { name: "Palantir Technologies", arr: "~$2.9B", search: ["Palantir"] },
  { name: "F5 Inc", arr: "~$2.8B", search: ["F5 Networks", "F5 Inc"] },
  { name: "Datadog", arr: "~$2.7B", search: ["Datadog Inc"] },
  { name: "Teradyne", arr: "~$2.7B", search: ["Teradyne Inc"] },
  { name: "HubSpot", arr: "~$2.6B", search: ["HubSpot Inc"] },
  { name: "Benchmark Electronics", arr: "~$2.6B", search: ["Benchmark Electronics"] },
  { name: "Guidehouse", arr: "~$2.5B", search: ["Guidehouse"] },
  { name: "Check Point Software", arr: "~$2.4B", search: ["Check Point"] },
  { name: "Okta", arr: "~$2.4B", search: ["Okta Inc"] },
  { name: "Veeva Systems", arr: "~$2.4B", search: ["Veeva"] },
  { name: "Zscaler", arr: "~$2.2B", search: ["Zscaler Inc"] },
  { name: "Nutanix", arr: "~$2.1B", search: ["Nutanix Inc"] },
  { name: "Unisys", arr: "~$2.0B", search: ["Unisys Corporation"] },
  { name: "ICF International", arr: "~$2.0B", search: ["ICF International", "ICF Incorporated"] },
  { name: "Tyler Technologies", arr: "~$1.9B", search: ["Tyler Technologies"] },
  { name: "MongoDB", arr: "~$1.9B", search: ["MongoDB Inc", "MongoDB Federal"] },
  { name: "Teradata", arr: "~$1.8B", search: ["Teradata Corporation"] },
  { name: "Maxar Technologies", arr: "~$1.8B", search: ["Maxar Technologies", "DigitalGlobe"] },
  { name: "Lumentum Holdings", arr: "~$1.6B", search: ["Lumentum"] },
  { name: "EchoStar Corporation", arr: "~$1.6B", search: ["EchoStar"] },
  { name: "VeriSign", arr: "~$1.5B", search: ["VeriSign Inc"] },
  { name: "Dynatrace", arr: "~$1.4B", search: ["Dynatrace"] },
  { name: "Elastic NV", arr: "~$1.3B", search: ["Elastic NV", "Elasticsearch"] },
  { name: "Viavi Solutions", arr: "~$1.1B", search: ["Viavi"] },
  { name: "Synaptics", arr: "~$1.1B", search: ["Synaptics Incorporated"] },
  { name: "Ciena Corporation", arr: "~$1.0B", search: ["Ciena"] },
  { name: "Tenable Holdings", arr: "~$0.9B", search: ["Tenable"] },
  { name: "Rapid7", arr: "~$0.8B", search: ["Rapid7 Inc"] },
  { name: "SentinelOne", arr: "~$0.8B", search: ["SentinelOne Inc"] },
  { name: "Commvault Systems", arr: "~$0.8B", search: ["Commvault"] },
  { name: "Lattice Semiconductor", arr: "~$0.7B", search: ["Lattice Semiconductor"] },
  { name: "Telos Corporation", arr: "~$0.7B", search: ["Telos Corporation"] },
  { name: "Calix", arr: "~$0.6B", search: ["Calix Inc"] },
  { name: "Varonis Systems", arr: "~$0.6B", search: ["Varonis"] },
  { name: "Appian", arr: "~$0.6B", search: ["Appian Corporation"] },
  { name: "Qualys", arr: "~$0.5B", search: ["Qualys Inc"] },
  { name: "SailPoint Technologies", arr: "~$0.4B", search: ["SailPoint"] },
  { name: "Immersion Corporation", arr: "~$0.1B", search: ["Immersion Corporation"] },
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
    const res = await fetch("https://api.usaspending.gov/api/v2/autocomplete/recipient/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ search_text: term, limit: 20 }),
    });
    if (!res.ok) {
      console.warn(`[Resolver] API error ${res.status} for "${term}"`);
      continue;
    }
    const data = await res.json();
    const results = data?.results || [];
    console.log(`[Resolver] ${results.length} raw results for "${term}":`,
      results.map(r => `${r.recipient_name} (score:${scoreMatch(r, term)}, id:${r.recipient_id})`));
    if (results.length === 0) continue;

    const scored = results
      .map(r => ({ ...r, _score: scoreMatch(r, term) }))
      .filter(r => r._score > 0);

    console.log(`[Resolver] ${scored.length} passed scoring (>0)`);

    if (scored.length === 0) continue;

    // Sort by: score desc, then parent preference, then amount desc
    scored.sort((a, b) => {
      if (b._score !== a._score) return b._score - a._score;
      // Prefer results with a recipient_id
      const aHasId = a.recipient_id ? 1 : 0;
      const bHasId = b.recipient_id ? 1 : 0;
      if (bHasId !== aHasId) return bHasId - aHasId;
      const aParent = a.recipient_id?.endsWith("-P") ? 1 : 0;
      const bParent = b.recipient_id?.endsWith("-P") ? 1 : 0;
      if (bParent !== aParent) return bParent - aParent;
      return (b.amount || 0) - (a.amount || 0);
    });

    console.log(`[Resolver] Winner: "${scored[0].recipient_name}" score=${scored[0]._score} id=${scored[0].recipient_id}`);
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
      // Step 1: Resolve company name to a USASpending recipient entity via autocomplete
      const searchTerms = co.search || [co.name];
      setLoadingMsg("Resolving recipient entity on USASpending.gov…");
      const recipient = await resolveRecipient(searchTerms);
      setResolvedEntity(recipient);

      // Step 2: Fetch awards — use recipient_id if resolved, fall back to text search
      setLoadingMsg("Querying USASpending.gov…");
      const filters = {
        award_type_codes: ["A", "B", "C", "D"],
        time_period: [{ start_date: "2007-10-01", end_date: "2025-12-31" }],
      };

      if (recipient?.recipient_id) {
        filters.recipient_id = recipient.recipient_id;
      } else {
        // Fallback: use the first search term as text search
        filters.recipient_search_text = [searchTerms[0]];
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
                    ({resolvedEntity.recipient_id?.endsWith("-P") ? "Parent" : resolvedEntity.recipient_id?.endsWith("-C") ? "Child" : resolvedEntity.recipient_id ? "Standalone" : "Matched"} entity)
                  </span>
                </div>
              )}
              {!resolvedEntity && result && (
                <div style={{ marginBottom: 14, display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 11, color: "#94a3b8" }}>Matched via text search (entity not in autocomplete index)</span>
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
