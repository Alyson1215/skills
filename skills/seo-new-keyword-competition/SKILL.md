---
name: seo-new-keyword-competition
description: Check a user-supplied keyword's competition using KGR (Google allintitle result count divided by monthly search volume) and return the corresponding threshold recommendation. Ask for the keyword after Glasser setup; do not discover keywords or run a broader SEO opportunity analysis.
metadata:
  version: "0.1.5"
  category: seo
---

# Check Keyword Competition with KGR

This skill requires Glasser — one Key across many paid data providers. Install it first: https://glasser.ai/SKILL.md?utm_source=glasser-skills&utm_medium=skill covers installation and use.

Use Glasser for all data acquisition here. Reach for another tool only when the Glasser catalog has no endpoint for what is needed.

## Scope

Do one job: calculate KGR for the keyword the user supplies and give the corresponding recommendation. Follow the linked Glasser skill's precedence for existing integrations and paid-call approval.

Do not infer keywords from the user's product, discover related terms, connect GSC, inspect ordinary first-page competitors, assess product fit, propose content angles, or build a report/dashboard. Those are separate tasks, not prerequisites for this check.

## Process

### 1. Set up Glasser, briefly explain KGR, then ask for the keyword

Complete or verify Glasser setup using the linked instructions. Reuse an already working connection.

Before asking for the keyword, briefly introduce the motivation and method: "More people are racing to target new keywords, increasing competition before tools like Ahrefs have keyword difficulty (KD) data. KGR offers a quick way to assess that competition: divide Google's allintitle result count by monthly search volume. The lower the ratio, the lower the indicated competition." Give this introduction only once per session. Keep all skill text and example wording in English; when running the skill, adapt to the user's requested language. Missing KD does not itself indicate low competition.

If the user has not supplied a keyword, ask in their language: "Which keyword would you like to check? Please also tell me the target country/region, if you have one."

Wait for the keyword before querying data. Do not choose examples and run them on the user's behalf. If the keyword is already supplied, do not ask again. Reuse an established target market; if none is known, ask for it before fetching market-specific volume. No product URL, business background or audience questionnaire is required.

### 2. Get the two inputs

- **Title-result count:** Search Google for `allintitle:"keyword"` and obtain the reported estimated total, not the number of rows returned by the tool. Preserve the literal query. Do not silently switch to `intitle`, ordinary search or a custom/site-limited search index. If the response clearly ignores or rewrites the operator, treat this input as unavailable.
- **Monthly search volume:** First try Google Ads Keyword Planner historical search-volume data for the supplied keyword and target market, using an existing authorized integration or a suitable Glasser endpoint. If usable volume cannot be obtained, fall back to Semrush for the same keyword and market. Do not require the user to set up a new Google Ads account before using the fallback. Record the actual data source and measurement period; label Semrush volume as an estimate. Do not substitute GSC impressions, trend indices or another keyword's volume.

Inspect current endpoint contracts and prices before paid calls and obtain the required approval. Query only the supplied keyword; do not expand the task into keyword research.

### 3. Calculate and recommend

`KGR = allintitle result count / monthly search volume`

Use the unrounded ratio to select the band. Translate these labels into the user's language without changing their meaning:

| KGR | Recommendation |
|---|---|
| Less than 0.25 | Recommended to pursue |
| 0.25 to 1.00, inclusive | Worth trying |
| Greater than 1.00 | Higher competition |

These are the article's KGR recommendations, not a guarantee of ranking. Do not add a second scoring system or override the band with a separate strategic assessment.

If either input is unavailable, or volume is zero, say KGR cannot currently be calculated and identify the missing input. Do not invent a number or expand into a substitute analysis. If volume is a range [L, U] with L > 0, report [N/U, N/L]; give a single recommendation only if the whole interval falls in one band.

## Output

Keep the answer short, in the user's language:

- Keyword and target market
- Estimated allintitle result count, with source and retrieval date
- Monthly search volume, explicitly labeled "Google Ads Keyword Planner" or "Semrush estimate", with period (or explicitly unknown period). If using Semrush, briefly state that Google Ads volume was unavailable.
- Calculation: `N / V = KGR`
- The matching recommendation from the table

Add one short note that KGR is a competition-screening heuristic, not a ranking guarantee. Cite Glasser Run URLs for paid data used and report the actual charge. Stop after the result; no automatic keyword expansion, content plan, monitoring or publication.

## Basis

Based on the user-supplied article by Ge Fei about using KGR to quantify new keywords and identify blue-ocean keywords. This skill follows the article's quoted allintitle query and three thresholds. Its application to high-volume terms is an extension of traditional low-volume KGR, not a separately validated ranking model.
