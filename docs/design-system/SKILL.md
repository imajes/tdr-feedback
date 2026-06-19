---
name: tdr-feedback-design
description: Use this skill to generate well-branded interfaces and assets for TDR Community Feedback (The Division: Resurgence community-feedback site), either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the `readme.md` file within this skill, and explore the other available files (`tokens/`, `components/`, `ui_kits/`, `guidelines/`, `assets/`).

This is a dark-mode, "field ops debrief" system: near-black `#0d1117` base, desaturated amber accent, cold-blue secondary, and a reserved muted-teal/red-orange/slate sentiment palette. Montserrat headings, Source Sans 3 body, JetBrains Mono for data. Tone is structured and data-forward — never playful, no emoji.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. Link `styles.css` for tokens, load `_ds_bundle.js` and read components via `const { Button, AskCard, QuoteBlock, ... } = window.TDRCommunityFeedbackDesignSystem_42173e`. For icons use Lucide (outline). For working production code, copy assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.
