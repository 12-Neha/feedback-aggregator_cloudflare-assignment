// Feedback Signal Aggregator
// Cloudflare PM Intern Take-Home Assignment
const MOCK = [
    {
      source: "support",
      title: "Docs unclear for Workers AI",
      body: "Couldn't find a JSON-only classification example. Had to stitch multiple docs pages.",
      segment: "Pro",
      arr: 1200,
    },
    {
      source: "github",
      title: "Pricing confusion",
      body: "Hard to map plan tiers to D1 + Workers AI usage. Pricing page feels not task-oriented.",
      segment: "Free",
      arr: 0,
    },
    {
      source: "community",
      title: "Latency spikes",
      body: "Occasional high latency at the edge in certain regions. Hard to diagnose platform vs my code.",
      segment: "Enterprise",
      arr: 85000,
    },
    {
      source: "support",
      title: "Binding mismatch errors",
      body: "Local dev worked, deployed failed. Error didn't clearly say DB binding name mismatch.",
      segment: "Enterprise",
      arr: 120000,
    },
    {
      source: "github",
      title: "Onboarding friction",
      body: "Not obvious whether bindings belong in dashboard vs wrangler config. Took trial and error.",
      segment: "Pro",
      arr: 6000,
    },
    {
      source: "community",
      title: "Rate limit / quota unclear",
      body: "Unclear what limits apply to Workers AI and how to monitor usage.",
      segment: "Free",
      arr: 0,
    },
  ];
  
  function json(data, status = 200) {
    return new Response(JSON.stringify(data, null, 2), {
      status,
      headers: { "Content-Type": "application/json" },
    });
  }
  
  function htmlPage() {
    // Dense “decision dashboard” layout (no external libs).
    return `
  <!doctype html>
  <html>
    <head>
      <meta charset="utf-8" />
      <title>Feedback Signal Aggregator</title>
      <style>
        :root{
          --bg:#f6f7f9;
          --card:#ffffff;
          --text:#111827;
          --muted:#6b7280;
          --border:#e5e7eb;
          --shadow:0 1px 2px rgba(16,24,40,.06), 0 8px 24px rgba(16,24,40,.04);
          --radius:14px;
        }
        html,body{height:100%;}
        body{
          margin:0;
          font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
          background:var(--bg);
          color:var(--text);
          line-height:1.45;
        }
        .wrap{max-width:1100px;margin:28px auto;padding:0 16px;}
        .header{
          display:flex;justify-content:space-between;align-items:flex-end;gap:16px;margin-bottom:14px;
        }
        h1{margin:0;font-size:22px;font-weight:650;letter-spacing:-.2px;}
        .sub{margin-top:4px;color:var(--muted);font-size:13px;}
        .actions{display:flex;align-items:center;gap:10px;flex-wrap:wrap;}
        button{
          border:1px solid var(--border);
          background:#fff;
          padding:8px 12px;
          border-radius:10px;
          font-weight:600;
          font-size:13px;
          cursor:pointer;
          box-shadow:0 1px 0 rgba(16,24,40,.02);
        }
        button:hover{background:#fafafa;}
        .chip{
          display:inline-flex;align-items:center;gap:8px;
          padding:6px 10px;border-radius:999px;
          border:1px solid var(--border);
          background:#fff;font-size:12px;color:var(--muted);
        }
        .grid4{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin:14px 0 18px;}
        .card{
          background:var(--card);
          border:1px solid var(--border);
          border-radius:var(--radius);
          box-shadow:var(--shadow);
          padding:12px;
          min-height:92px;
        }
        .card h3{margin:0 0 8px 0;font-size:12px;color:var(--muted);font-weight:700;letter-spacing:.02em;text-transform:uppercase;}
        .kpi{font-size:20px;font-weight:750;letter-spacing:-.3px;margin:0;}
        .small{color:var(--muted);font-size:12px;margin-top:6px;}
        .list{display:flex;flex-direction:column;gap:6px;}
        .row2{display:grid;grid-template-columns: 300px 1fr; gap:12px;}
        .panel{
          background:var(--card);
          border:1px solid var(--border);
          border-radius:var(--radius);
          box-shadow:var(--shadow);
          padding:12px;
          min-height:280px;
        }
        .panel h2{margin:0 0 10px 0;font-size:13px;font-weight:750;}
        .themeBtn{
          width:100%;
          text-align:left;
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:8px;
          padding:10px;
          border-radius:12px;
          border:1px solid var(--border);
          background:#fff;
          cursor:pointer;
          font-size:13px;
        }
        .themeBtn:hover{background:#fafafa;}
        .pill{
          font-size:11px;
          padding:2px 8px;
          border-radius:999px;
          border:1px solid var(--border);
          color:var(--muted);
          background:#fff;
          white-space:nowrap;
        }
        .deltaUp{color:#b42318;border-color:#fecaca;background:#fff1f2;}
        .deltaDown{color:#027a48;border-color:#bbf7d0;background:#f0fdf4;}
        .badge{
          display:inline-flex;align-items:center;
          font-size:11px;font-weight:700;
          padding:2px 8px;border-radius:999px;border:1px solid var(--border);
        }
        .sev-low{background:#f0fdf4;border-color:#bbf7d0;color:#027a48;}
        .sev-med{background:#fffbeb;border-color:#fde68a;color:#b45309;}
        .sev-high{background:#fff1f2;border-color:#fecaca;color:#b42318;}
        .src{background:#eff6ff;border-color:#bfdbfe;color:#1d4ed8;font-weight:700;}
        .item{
          border:1px solid var(--border);
          border-radius:14px;
          padding:12px;
          background:#fff;
          margin-bottom:10px;
        }
        .itemTop{display:flex;gap:8px;align-items:center;flex-wrap:wrap;}
        .title{font-weight:750;}
        .muted{color:var(--muted);font-size:12px;}
        .mono{font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;}
        @media (max-width: 980px){
          .grid4{grid-template-columns:repeat(2,1fr);}
          .row2{grid-template-columns: 1fr;}
        }
      </style>
    </head>
    <body>
      <div class="wrap">
        <div class="header">
          <div>
            <h1>Feedback Signal Aggregator</h1>
            <div class="sub">Turn noisy feedback into actionable signals (theme • severity • sentiment • segment • actionability). AI outputs are directional, not ground truth.</div>
          </div>
          <div class="actions">
            <button id="reset">Reset</button>
            <button id="seed">Seed mock feedback</button>
            <span id="status" class="chip">ready</span>
          </div>
        </div>
  
        <!-- Decision Dashboard -->
        <div class="grid4">
          <div class="card">
            <h3>Delta (48h volatility)</h3>
            <div id="deltaKpi" class="kpi">—</div>
            <div id="deltaDetail" class="small">—</div>
          </div>
          <div class="card">
            <h3>Sentiment-weighted impact</h3>
            <div id="impactKpi" class="kpi">—</div>
            <div id="impactDetail" class="small">—</div>
          </div>
          <div class="card">
            <h3>High-value segment signal</h3>
            <div id="segmentKpi" class="kpi">—</div>
            <div id="segmentDetail" class="small">—</div>
          </div>
          <div class="card">
            <h3>High-confidence fixes</h3>
            <div id="actionKpi" class="kpi">—</div>
            <div id="actionDetail" class="small">—</div>
          </div>
        </div>
  
        <div class="row2">
          <div class="panel">
            <h2>Themes</h2>
            <div id="themes" class="list"></div>
            <div class="muted" style="margin-top:10px;">
              Tip: big red deltas suggest regressions (deployments/bugs) vs steady feature requests.
            </div>
          </div>
          <div class="panel">
            <h2>Items</h2>
            <div id="items" class="muted">Select a theme to view representative items.</div>
          </div>
        </div>
      </div>
  
      <script>
        function esc(s) {
          return String(s ?? '')
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;')
            .replaceAll("'", '&#39;');
        }
  
        function sevClass(sev){
          const s = String(sev||'').toLowerCase();
          if(s==='high') return 'sev-high';
          if(s==='medium') return 'sev-med';
          if(s==='low') return 'sev-low';
          return '';
        }
  
        function fmtPct(x){
          if(x === null || x === undefined) return '—';
          return (Math.round(x * 10) / 10) + '%';
        }
  
        function deltaPill(deltaPct){
          if(deltaPct === null || deltaPct === undefined) return '<span class="pill">—</span>';
          const val = Math.round(deltaPct * 10) / 10;
          if(val >= 0){
            return '<span class="pill deltaUp">▲ ' + esc(val) + '%</span>';
          }
          return '<span class="pill deltaDown">▼ ' + esc(Math.abs(val)) + '%</span>';
        }
  
        async function refreshOverview(){
          const res = await fetch('/api/overview');
          const data = await res.json();
  
          // 1) Delta: biggest share jump last48h vs prev48h
          const d = data.delta_top;
          document.getElementById('deltaKpi').textContent = d ? d.theme : '—';
          document.getElementById('deltaDetail').innerHTML = d
            ? ('Share change: ' + deltaPill(d.delta_share_pct) + ' (last 48h vs prior 48h)')
            : '—';
  
          // 2) Sentiment-weighted impact: top friction theme by impact
          const i = data.impact_top;
          document.getElementById('impactKpi').textContent = i ? i.theme : '—';
          document.getElementById('impactDetail').textContent = i
            ? ('Impact score: ' + (Math.round(i.impact_score*10)/10) + ' (volume × negativity)')
            : '—';
  
          // 3) Segment: enterprise/pro top theme
          const s = data.segment_top;
          document.getElementById('segmentKpi').textContent = s ? s.theme : '—';
          document.getElementById('segmentDetail').textContent = s
            ? ('Top theme among high-value users (Enterprise/Pro). Count: ' + s.count)
            : '—';
  
          // 4) Actionability: number of high-confidence fixes
          document.getElementById('actionKpi').textContent = data.actionable_count ?? '—';
          document.getElementById('actionDetail').textContent = 'Items with actionability ≥ 0.7';
  
          // Themes list with delta pill
          const themesEl = document.getElementById('themes');
          const themes = data.themes || [];
          if(!themes.length){
            themesEl.innerHTML = '<div class="muted">No data yet. Click “Seed mock feedback”.</div>';
            return;
          }
          themesEl.innerHTML = themes.map(t => (
            '<button class="themeBtn" onclick="loadItems(\\'' + encodeURIComponent(t.theme) + '\\')">' +
              '<div style="display:flex;gap:8px;align-items:center;min-width:0;">' +
                '<div style="font-weight:750;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + esc(t.theme) + '</div>' +
                '<span class="pill">' + esc(t.count) + '</span>' +
                '<span class="pill">' + esc(t.pct) + '%</span>' +
              '</div>' +
              '<div>' + deltaPill(t.delta_share_pct) + '</div>' +
            '</button>'
          )).join('');
        }
  
        async function refreshThemesFallback(){
          // fallback if /api/overview fails
          const res = await fetch('/api/themes');
          const themes = await res.json();
          const el = document.getElementById('themes');
          el.innerHTML = (themes || []).map(t => (
            '<button class="themeBtn" onclick="loadItems(\\'' + encodeURIComponent(t.theme) + '\\')">' +
              '<div style="display:flex;gap:8px;align-items:center;min-width:0;">' +
                '<div style="font-weight:750;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + esc(t.theme) + '</div>' +
                '<span class="pill">' + esc(t.count) + '</span>' +
                ((t.pct !== undefined && t.pct !== null) ? ('<span class="pill">' + esc(t.pct) + '%</span>') : '') +
              '</div>' +
              '<div><span class="pill">—</span></div>' +
            '</button>'
          )).join('');
        }
  
        async function loadItems(themeEnc){
          const theme = decodeURIComponent(themeEnc);
          const res = await fetch('/api/items?theme=' + encodeURIComponent(theme));
          const items = await res.json();
          const el = document.getElementById('items');
          if(!items.length){
            el.innerHTML = '<div class="muted">No items for this theme yet.</div>';
            return;
          }
          el.innerHTML = items.map(i => (
            '<div class="item">' +
              '<div class="itemTop">' +
                '<span class="badge src">' + esc(i.source || 'unknown') + '</span>' +
                '<span class="title">' + esc(i.title || '-') + '</span>' +
                '<span class="badge ' + sevClass(i.severity) + '">' + esc(i.severity || '-') + '</span>' +
                '<span class="pill">sentiment: ' + esc(i.sentiment || '-') + '</span>' +
                '<span class="pill">segment: ' + esc(i.segment || '-') + '</span>' +
                '<span class="pill">act: ' + esc((Math.round((i.actionability_score||0)*100))) + '</span>' +
              '</div>' +
              '<div class="muted" style="margin-top:8px;">' + esc(i.body || '') + '</div>' +
              '<div class="muted" style="margin-top:8px;"><b>Summary:</b> ' + esc(i.summary || '-') + '</div>' +
            '</div>'
          )).join('');
        }
  
        document.getElementById('reset').onclick = async () => {
          const status = document.getElementById('status');
          status.textContent = 'resetting...';
          await fetch('/api/reset', { method: 'POST' });
          status.textContent = 'ready';
          document.getElementById('items').textContent = 'Select a theme to view representative items.';
          await refreshOverview().catch(refreshThemesFallback);
        };
  
        document.getElementById('seed').onclick = async () => {
          const status = document.getElementById('status');
          status.textContent = 'seeding...';
          const res = await fetch('/api/seed', { method: 'POST' });
          const out = await res.json();
          status.textContent = 'seeded ' + esc(out.inserted);
          await refreshOverview().catch(refreshThemesFallback);
        };
  
        // init
        refreshOverview().catch(refreshThemesFallback);
        window.loadItems = loadItems;
      </script>
    </body>
  </html>
    `;
  }
  
  async function analyzeFeedback(env, item) {
    const allowedThemes = ["DX", "Pricing", "Latency", "Docs", "Reliability", "Security", "Other"];
    const allowedSeverity = ["Low", "Medium", "High"];
    const allowedSentiment = ["Positive", "Neutral", "Negative"];
  
    const prompt = `
  Return STRICT JSON only with this exact schema:
  {
    "theme": one of ${JSON.stringify(allowedThemes)},
    "severity": one of ${JSON.stringify(allowedSeverity)},
    "sentiment": one of ${JSON.stringify(allowedSentiment)},
    "actionability_score": number between 0 and 1,
    "summary": string (max 180 chars)
  }
  
  Guidelines:
  - Avoid "Other" unless none clearly fit; pick the closest theme.
  - Sentiment: Negative if user is complaining about breakage/regression; Neutral if suggestion/question; Positive if praise.
  - Actionability score:
    - 0.8–1.0 if specific repro steps or concrete failure ("crashes when I click X")
    - 0.4–0.7 if clear problem but vague details ("app is slow")
    - 0.0–0.3 if generic sentiment or preference
  
  Feedback:
  SOURCE: ${item.source}
  SEGMENT: ${item.segment} (ARR ${item.arr})
  TITLE: ${item.title}
  BODY: ${item.body}
  `.trim();
  
    try {
      const result = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
        messages: [
          { role: "system", content: "You output strict JSON only. No markdown, no extra text." },
          { role: "user", content: prompt },
        ],
      });
  
      const rawText =
        (typeof result === "string" ? result : null) ||
        result?.response ||
        result?.result ||
        result?.output ||
        JSON.stringify(result);
  
      const match = rawText.match(/\{[\s\S]*\}/);
      const jsonText = match ? match[0] : rawText;
  
      const parsed = JSON.parse(jsonText);
  
      const theme = allowedThemes.includes(parsed.theme) ? parsed.theme : "Other";
      const severity = allowedSeverity.includes(parsed.severity) ? parsed.severity : "Medium";
      const sentiment = allowedSentiment.includes(parsed.sentiment) ? parsed.sentiment : "Neutral";
  
      let score = Number(parsed.actionability_score);
      if (Number.isNaN(score)) score = 0.5;
      score = Math.max(0, Math.min(1, score));
  
      const summary =
        typeof parsed.summary === "string" ? parsed.summary.slice(0, 180) : "(no summary)";
  
      return { theme, severity, sentiment, actionability_score: score, summary, raw_ai: rawText };
    } catch (e) {
      console.log("AI classification failed:", e);
      return {
        theme: "Other",
        severity: "Medium",
        sentiment: "Neutral",
        actionability_score: 0.4,
        summary: "(AI fallback) Unable to classify.",
        raw_ai: String(e),
      };
    }
  }
  
  export default {
    async fetch(request, env) {
      const url = new URL(request.url);
  
      // Home UI
      if (request.method === "GET" && url.pathname === "/") {
        return new Response(htmlPage(), { headers: { "Content-Type": "text/html" } });
      }
  
      // Reset
      if (request.method === "POST" && url.pathname === "/api/reset") {
        await env.feedback_db.prepare(`DELETE FROM feedback_items`).run();
        return json({ ok: true });
      }
  
      // Seed mock feedback (spread timestamps so "delta" has meaning)
      if (request.method === "POST" && url.pathname === "/api/seed") {
        let inserted = 0;
  
        for (let idx = 0; idx < MOCK.length; idx++) {
          const item = MOCK[idx];
          const id = crypto.randomUUID();
  
          // Spread created_at across last 6 days so delta/volatility can show up
          const daysAgo = (idx % 6);
          const created_at = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString();
  
          const analysis = await analyzeFeedback(env, item);
  
          await env.feedback_db.prepare(
            `INSERT INTO feedback_items
              (id, source, title, body, created_at, theme, severity, summary, raw_ai, sentiment, segment, arr, actionability_score)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
          )
            .bind(
              id,
              item.source,
              item.title,
              item.body,
              created_at,
              analysis.theme,
              analysis.severity,
              analysis.summary,
              analysis.raw_ai,
              analysis.sentiment,
              item.segment,
              item.arr,
              analysis.actionability_score
            )
            .run();
  
          inserted++;
        }
  
        return json({ inserted });
      }
  
      // Existing themes endpoint (kept)
      if (request.method === "GET" && url.pathname === "/api/themes") {
        const { results } = await env.feedback_db.prepare(
          `SELECT theme, count,
                  ROUND((count * 100.0) / (SELECT COUNT(*) FROM feedback_items), 1) AS pct
           FROM (
             SELECT COALESCE(theme, 'Other') AS theme, COUNT(*) AS count
             FROM feedback_items
             GROUP BY COALESCE(theme, 'Other')
           )
           ORDER BY count DESC;`
        ).all();
  
        return json(results || []);
      }
  
      // NEW: overview metrics for the 4 decision signals
      if (request.method === "GET" && url.pathname === "/api/overview") {
        // Themes + delta share (last48h share minus prev48h share)
        const { results: themes } = await env.feedback_db.prepare(
          `
          WITH
            last48 AS (
              SELECT COALESCE(theme,'Other') AS theme, COUNT(*) AS c
              FROM feedback_items
              WHERE created_at >= datetime('now','-2 day')
              GROUP BY COALESCE(theme,'Other')
            ),
            prev48 AS (
              SELECT COALESCE(theme,'Other') AS theme, COUNT(*) AS c
              FROM feedback_items
              WHERE created_at < datetime('now','-2 day') AND created_at >= datetime('now','-4 day')
              GROUP BY COALESCE(theme,'Other')
            ),
            totals AS (
              SELECT
                (SELECT COUNT(*) FROM feedback_items) AS all_total,
                (SELECT COUNT(*) FROM feedback_items WHERE created_at >= datetime('now','-2 day')) AS last_total,
                (SELECT COUNT(*) FROM feedback_items WHERE created_at < datetime('now','-2 day') AND created_at >= datetime('now','-4 day')) AS prev_total
            ),
            overall AS (
              SELECT COALESCE(theme,'Other') AS theme, COUNT(*) AS count
              FROM feedback_items
              GROUP BY COALESCE(theme,'Other')
            )
          SELECT
            o.theme AS theme,
            o.count AS count,
            ROUND(o.count * 100.0 / (SELECT all_total FROM totals), 1) AS pct,
            ROUND(
              (
                COALESCE((SELECT c FROM last48 WHERE last48.theme = o.theme),0) * 100.0 / MAX((SELECT last_total FROM totals),1)
                -
                COALESCE((SELECT c FROM prev48 WHERE prev48.theme = o.theme),0) * 100.0 / MAX((SELECT prev_total FROM totals),1)
              )
            , 1) AS delta_share_pct
          FROM overall o
          ORDER BY o.count DESC;
          `
        ).all();
  
        // Sentiment-weighted impact (volume × negativity)
        // weight: Negative=2, Neutral=1, Positive=0.5
        const { results: impact } = await env.feedback_db.prepare(
          `
          SELECT COALESCE(theme,'Other') AS theme,
                 SUM(CASE sentiment
                       WHEN 'Negative' THEN 2.0
                       WHEN 'Neutral' THEN 1.0
                       WHEN 'Positive' THEN 0.5
                       ELSE 1.0 END) AS impact_score,
                 COUNT(*) AS count
          FROM feedback_items
          GROUP BY COALESCE(theme,'Other')
          ORDER BY impact_score DESC
          LIMIT 5;
          `
        ).all();
  
        // Segment: focus on high-value (Enterprise/Pro)
        const { results: segment } = await env.feedback_db.prepare(
          `
          SELECT COALESCE(theme,'Other') AS theme, COUNT(*) AS count
          FROM feedback_items
          WHERE segment IN ('Enterprise','Pro')
          GROUP BY COALESCE(theme,'Other')
          ORDER BY count DESC
          LIMIT 5;
          `
        ).all();
  
        // Actionability: high-confidence fixes
        const { results: actionable } = await env.feedback_db.prepare(
          `
          SELECT id, source, title, summary, theme, severity, sentiment, segment, arr, actionability_score
          FROM feedback_items
          WHERE actionability_score >= 0.7
          ORDER BY actionability_score DESC
          LIMIT 5;
          `
        ).all();
  
        const delta_top = (themes || [])
          .slice()
          .sort((a,b) => (b.delta_share_pct ?? 0) - (a.delta_share_pct ?? 0))[0] || null;
  
        const impact_top = (impact || [])[0] || null;
        const segment_top = (segment || [])[0] || null;
  
        return json({
          themes: themes || [],
          delta_top,
          impact_top,
          segment_top,
          actionable_count: (actionable || []).length,
          actionable: actionable || [],
        });
      }
  
      // Items by theme
      if (request.method === "GET" && url.pathname === "/api/items") {
        const theme = url.searchParams.get("theme") || "Other";
  
        const { results } = await env.feedback_db.prepare(
          `SELECT id, source, title, body, created_at, theme, severity, summary,
                  sentiment, segment, arr, actionability_score
           FROM feedback_items
           WHERE COALESCE(theme, 'Other') = ?
           ORDER BY created_at DESC
           LIMIT 50`
        )
          .bind(theme)
          .all();
  
        return json(results || []);
      }
  
      return new Response("Not found", { status: 404 });
    },
  };
  
