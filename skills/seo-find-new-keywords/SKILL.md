---
name: seo-find-new-keywords
description: Find new SEO keyword candidates from a product URL or a product/topic description. Read the product, automatically select relevant large sites and social platforms, and inspect organic keywords, discussions and trending searches. Use Google Trends to check candidates' age. Does not calculate KGR or create a content plan.
metadata:
  version: "0.2.1"
  category: seo
---

# Find New Keywords

This skill requires Glasser — one Key across many paid data providers. Install it first: https://glasser.ai/SKILL.md?utm_source=glasser-skills&utm_medium=skill covers installation and use.

Use Glasser for all data acquisition here. Reach for another tool only when the Glasser catalog has no endpoint for what is needed.

## Scope

Find new keyword candidates relevant to the user's chosen niche and market. Use three discovery sources: large sites' organic keywords, social media and trending searches. Follow the linked Glasser instructions for existing integrations, endpoint discovery and paid-call approval.

Keep all skill text and example wording in English. Adapt the conversation and results to the user's requested language. Stop at a keyword shortlist; competition checks, content production and scheduled monitoring are separate tasks.

## Process

### 1. Set up Glasser, introduce the method and understand the product

Complete or verify Glasser setup, reusing an already working connection.

Briefly introduce the method: "New keywords often surface in large sites' search traffic, social discussions and trending searches. We'll look across these sources, then use Google Trends to check when the most promising terms began attracting interest."

If neither a product URL nor a usable description is supplied, ask: "Share your product URL or describe the product or topic you want to find new keywords for."

For a product URL, read the homepage and only the product/about page needed to understand what it does and whom it serves. Use that information to identify relevant topics without asking the user to restate the product's field. If the site cannot be read or the product remains unclear, ask for a short description.

Reuse the target country and language from the conversation or explicit targeting on the website. Do not infer the target country solely from the website's language or domain suffix. Ask only for unresolved details: "Which country and language are you targeting?" If one is already clear, ask only for the other. A user-supplied description works equally well; a product URL is optional.

### 2. Find candidates through three sources

Discover broadly before assessing relevance. Cover new product and model names, data services and APIs, technologies and concepts, features, and emerging user problems across the product's wider ecosystem. The product helps explain how a discovered term might matter; it must not become a restrictive keyword filter. Honor any explicit scope the user supplies.

Automatically select large sites and social communities spanning those different sources of new terms, based on the product's audience and target market. Do not impose a fixed one-or-two-site/platform limit or focus only on the product's immediate technical category. User-specified sources take precedence. Briefly name the selected sources and why they fit, then proceed without asking the user to choose them.

For example, AI/developer products may fit Product Hunt, GitHub or Hugging Face and discussions on X, Reddit or Hacker News; business software may fit G2 or Capterra and relevant Reddit or LinkedIn discussions. These are examples, not a fixed list: select sources that fit the actual product and market.

Keep individual reads bounded and inspect current capabilities and prices before paid calls. Expand sources or pages when an important discovery area is missing or a result cap hides useful candidates. A few candidates from one narrow community do not establish that new terms are scarce. Respect the authorized budget and describe incomplete coverage when it limits the result.

- **Large sites' organic search keywords:** Inspect keywords bringing search traffic to relevant, established sites, including their ranking URLs. Start without requiring candidates to contain a few seed words such as "agent" or "MCP"; unfamiliar proper names are especially useful leads. When comparable historical reports exist, look for recently appearing terms or gains, but do not rely exclusively on a site's newly ranking keyword report. A keyword newly ranking for one site is a discovery lead, not proof that the keyword itself is new. If only current data is available, retain the candidate without claiming a historical change.
- **Social media:** Inspect recent relevant posts and discussions for unfamiliar names, phrases and questions. Look for usage across distinct authors or conversations; keep dated examples. Distinguish repeated independent usage from reposts of one announcement. Likes and engagement indicate attention, not monthly search volume.
- **Trending searches:** Inspect current trending-search lists for the target market. Keep entries relevant to the niche, including useful phrases within a broader trending topic. Record the source and date. A trending term may be old; a traffic spike alone does not make it a new keyword.

Keep the actual phrases people use and link each candidate to its evidence. Merge duplicates without inventing new phrases or adding overlapping search volumes. If a source is unavailable, briefly identify the gap and continue with the others.

### 3. Check the shortlist's age

For the strongest candidates, check Google Trends with Worldwide, Web Search and a long historical range. Locate the first visible interest or the clear rise associated with a new meaning, then narrow the date range around that point when needed.

Apply the supplied article's definition: demand emerging within the past 12 calendar months qualifies as new. Label an older term with a new meaning as newly emerging demand for that meaning; an established term's seasonal or renewed popularity does not reset its age. Record the observed date or interval, not a more precise date than the data supports.

Trends contains relative interest and low-volume zeros. If history is insufficient or meaning is ambiguous, label the term "Candidate — newness unconfirmed" rather than inventing an onset. Do not substitute the date of the first post found for the first search date.

### 4. Return a short list

Return up to five useful candidates by default, selected after broad discovery; this display limit is not a cap on the candidate pool. Fewer are fine if the evidence remains thin after reasonable coverage. Explain each candidate's connection to the product and evidence of recent emergence. Do not label a candidate low-competition without a separate competition check.

Use a compact table:

| Keyword | Meaning / relevance | Where it surfaced | Newness and estimated onset | Evidence |
|---|---|---|---|---|

Include source links, dates and Google Trends evidence where available. Keep each row short. If no confirmed new terms were found, say so and clearly distinguish unconfirmed candidates from established trending terms.

Cite Glasser Run URLs for paid data used and report the actual total charge. End with the shortlist; do not automatically calculate KGR, produce content or create a monitoring job.

## Basis

Based on the user-supplied articles by Ge Fei: inspect large sites' organic search keywords, mine social discussions and look at trending searches to discover terms, then use Google Trends and a 12-month definition to assess newness. The anecdotes about traffic and advertising revenue are not promised outcomes of this skill.
