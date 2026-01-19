# Feedback-aggregator_cloudflare-assignment
Cloudflare PM Intern Take-Home Assignment


A lightweight product feedback triage tool built on the Cloudflare Developer Platform.

This project was created as part of a Product Manager Intern take-home assignment and focuses on turning noisy, unstructured feedback into decision-ready product signals.

---

## Live Demo
👉 https://<your-worker>.<account>.workers.dev

---

## What This Is
A prototype that ingests user feedback (support tickets, GitHub issues, community posts), uses AI to extract structured signals, and surfaces high-leverage insights for product decision-making.

The goal is not perfect classification, but faster prioritization.

---

## Key Decision Signals
The dashboard emphasizes four signals that help teams move from *reading feedback* to *making decisions*:

1. **Delta (48h Volatility)**  
   Sudden changes in feedback volume highlight regressions or bad deployments.

2. **Sentiment-Weighted Impact**  
   Prioritizes high-volume, deeply negative feedback over neutral chatter.

3. **High-Value User Segment Signal**  
   Separates Enterprise / Pro user feedback from free-tier noise.

4. **Actionability Score**  
   Identifies feedback that is concrete and ready for engineering action.

---

## Architecture Overview

- **Cloudflare Workers**  
  Hosts the full application (UI + API).

- **Workers AI**  
  Extracts structured signals from free-text feedback:
  theme, severity, sentiment, segment, actionability score, and summary.

- **D1 (SQLite)**  
  Stores raw feedback alongside AI outputs for aggregation, debugging, and reproducibility.

All AI outputs are directional and intended for triage, not automated decisions.

---



```bash
npm install -g wrangler
wrangler dev
