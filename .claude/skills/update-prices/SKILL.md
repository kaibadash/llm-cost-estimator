---
name: update-prices
description: Update LLM model pricing CSV from official provider pricing pages
user_invocable: true
---

# LLM Model Pricing Update

Update `src/data/llm_models.csv` with the latest pricing information from each provider's official pricing page.

## CSV Format

```
provider,model,input_price,output_price,max_input_tokens,max_output_tokens,pricing_url
```

- `input_price` / `output_price`: USD per 1M tokens
- `max_input_tokens` / `max_output_tokens`: integer token counts (no commas, no `K`/`M` suffix). Use `-` when not applicable (e.g., image-generation models) or when the spec cannot be confirmed from official docs.
- `pricing_url`: The provider's official pricing page URL
- Use `-` for `output_price` when it does not apply (e.g., image generation models)

## Steps

### 1. Read the current CSV

Read `src/data/llm_models.csv` to understand the current list of providers and models.

### 2. Fetch pricing pages from each provider

Use WebFetch to retrieve the latest pricing information from the following URLs in parallel:

- **OpenAI**: https://platform.openai.com/docs/pricing
  - If the primary URL returns 403 (Cloudflare challenge), fall back to https://developers.openai.com/api/docs/pricing — it serves the same content and is fetchable.
  - Extract API prices (per 1M tokens) from the "Language models" section
  - Use standard API prices, not Batch API prices
  - Exclude models explicitly marked as deprecated/legacy
  - Include audio, realtime, search, computer-use, and image models
  - For multi-modality models (realtime, image), use the **text** input/output price for the CSV (audio/image pricing is tracked separately)

- **Anthropic**: https://www.anthropic.com/pricing
  - This URL now 301-redirects to https://claude.com/pricing, which does not include the API pricing table. Use the docs URL directly: https://platform.claude.com/docs/en/about-claude/pricing
  - Extract from the "Model pricing" table (Base Input Tokens column = input, Output Tokens column = output)
  - If prices are shown in MTok notation, they are already in per-1M-token units

- **Google**: https://ai.google.dev/pricing
  - Extract Gemini model prices (per 1M tokens)
  - Use Pay-as-you-go prices, not the free tier
  - Use the price for prompts up to 128K tokens when tiered pricing exists
  - For Live/multi-modal preview models with both text and audio rates, use the **text** rate

- **DeepSeek**: https://api-docs.deepseek.com/quick_start/pricing (preferred; https://platform.deepseek.com/pricing requires login)
  - Extract API prices (per 1M tokens)
  - Use standard prices, not cache hit prices
  - If a promotional discount is currently active, record the regular (post-discount) list price, not the promo price
  - Skip models the page marks as "will be deprecated" — list only the current/replacement model names

### 3. Fetch model specs (context window / max output tokens)

Pricing pages do not include token limits for OpenAI, Anthropic, or Google — fetch from each provider's model documentation. DeepSeek's pricing page already contains them.

- **OpenAI**: per-model pages under `https://developers.openai.com/api/docs/models/<model>` (e.g. `.../models/gpt-5.5`, `.../models/gpt-realtime-2`). Each page has "Context Window" and "Max Output Tokens". Image-generation models (`gpt-image-*`) do not publish these — use `-`.
- **Anthropic**: the comparison tables on `https://docs.claude.com/en/docs/about-claude/models/overview` (which redirects to `https://platform.claude.com/docs/en/about-claude/models/overview`). Read the "Context window" and "Max output" rows. Both the "Latest models comparison" and "Legacy models" tables are needed to cover all non-deprecated models.
- **Google**: per-model pages under `https://ai.google.dev/gemini-api/docs/models/<model-slug>` (e.g. `.../models/gemini-3.5-flash`, `.../models/gemini-2.5-pro`). Each page has "Input token limit" and "Output token limit". Note that slug conventions are inconsistent — some Preview variants and Live/Native-Audio models do not have individual pages; use `-` if not found.
- **DeepSeek**: already on the pricing page — "Max context length" → `max_input_tokens`, "MAXIMUM" output → `max_output_tokens`.

When a Preview variant lacks its own page, assume the same limits as the non-Preview variant of the same model family (and note this in the change report).

### 4. Update the CSV

Based on the fetched information, perform the following:

- **Add new models**: Add models that exist on the official page but are missing from the CSV. Group models by provider.
- **Update prices**: Update `input_price` / `output_price` for models whose prices have changed.
- **Update token limits**: Update `max_input_tokens` / `max_output_tokens` when the spec changes.
- **Remove deprecated or deleted models**: Remove rows for models that have been discontinued from the official page.
- Maintain the existing provider order (OpenAI → Anthropic → Google → DeepSeek).
- Order models within each provider according to the official page listing order.

### 5. Report changes

After the update is complete, report the following to the user:

- List of newly added models (include the token limits used and whether they were inferred from a sibling model)
- List of models with price changes (old price → new price)
- List of models with token-limit changes (old → new)
- List of removed models
- If no changes were made, report that as well

### Notes

- If WebFetch fails or the page structure has changed, report the issue for that provider and prompt the user for manual verification.
- Skip and report models with unclear pricing (e.g., per-request billing only, not per-token).
- Ensure the CSV ends with a single trailing newline.
