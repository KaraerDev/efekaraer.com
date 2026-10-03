# Public site audit — 3 October 2026

Source: https://www.efekaraer.com/

The web reader could not retrieve the site, but a direct HTTPS GET succeeded. The complete HTML and stylesheet are saved in `docs/original/`. Browser inventory was empty and both Chrome and the in-app browser were unavailable, so this was an HTML/CSS/asset audit rather than a screenshot-driven audit of the original layout.

## Original personality and structure

- Title: **İYİ Mİ ÇOK MU FAÇA?**
- Brand: **Karaer Arsiv**, with **çok iyi site yaptim**.
- Single page with toggleable sidebar: Ana Sayfa, Rank, Fotoğraflar, Sosyal Medya.
- Handle: **SANSARSALVO55**. TFT GOD; “What a legend...”
- Hero: “SAMSUN ANLIK ADALET MAHALLESİNDE KAZA”; “TFT, SATRANÇ FIDE 3500 & KEL VE 5 SENEDİR OKUYOR”.
- Original description: Efe Karaer, age 22; once great at TFT and still great at TFT.
- Current-rank text: MASTER. No live rank data/API was present.
- Meters: Mepple Enjoyer 31%, Messi Sevgisi 100%, Siyahilik 0%, Zeitnot 99%.
- LinkedIn subtitle: “1500 takipçim var”.
- Email explicitly offered for advertising/collaboration.
- Footer: SANSARSALVO55 // EFEKARAER; what a legend.

The old visual design used a dark Runeterra/Zaun-like neon treatment, gradients, glitch lettering, sidebar, rounded glass panels, reveal effects, percentage bars, mosaic gallery and lightbox. The new version deliberately does not reuse that visual system.

## Exact public destinations

| Label | Original URL |
| --- | --- |
| OP.GG | `https://op.gg/lol/summoners/tr/SANSARSALVO55-DEL%C4%B0` |
| MetaTFT | `https://www.metatft.com/player/tr/SANSARSALVO55-DEL%C4%B0` |
| Spotify | `https://open.spotify.com/user/11145638018?si=6Cn7l12bRzivJ0KYelxjyQ` |
| LinkedIn | `https://www.linkedin.com/in/efekaraer` |
| Main node | `http://efekaraer.com` |
| Email | `mailto:efekaraer00@gmail.com` |

All profile/contact URLs are preserved exactly. The self-link is normalized to `/` so the preview does not accidentally send visitors to the old site. No other social profiles were discovered or guessed. Third-party profile contents were not used to invent biography or live statistics.

## Asset inventory and original captions

| ID | Original path | Caption | Local basename |
| --- | --- | --- | --- |
| 001 | image copy 16.png | Jahrein Karaer | karaer-16 |
| 002 | image copy 14.png | Can Sungur Karaer | karaer-14 |
| 003 | image copy 13.png | Kefen Karaer | karaer-13 |
| 004 | image copy 12.png | ÇETULLAH | karaer-12 |
| 005 | image copy 11.png | 3LOT3RR0IST | karaer-11 |
| 006 | image copy 10.png | 3LOT3RR0IST | karaer-10 |
| 007 | image copy 9.png | Çakma Mühendis Karaer | karaer-9 |
| 008 | image copy 8.png | Anafen Karaer | karaer-8 |
| 009 | image copy 7.png | Çakma Mühendis Karaer v2 | karaer-7 |
| 010 | image copy 4.png | Çeçen Karaer | karaer-4 |
| 011 | image copy 5.png | Mohikan Karaer | karaer-5 |
| 012 | image copy 18.png | Yakup TV Karaer | karaer-18 |
| 013 | image copy 20.png | Babaanne Karaer | karaer-20 |
| 014 | image copy 21.png | Akide Sugar Karaer | karaer-21 |
| 015 | image copy 15.png | Nevada Karaer | karaer-15 |
| 016 | image copy 17.png | İtici Karaer | karaer-17 |
| 017 | image copy 6.png | hmm nt happen | karaer-6 |

The two 1920×1080 backgrounds, `efek.com.jpg` and `efek.com2.jpg`, were also downloaded. Gallery images were visually inspected together in a contact sheet; the second background was inspected separately. The helmet portrait is the new cover image. The originals are retained verbatim; production receives only optimized WebP derivatives.

## Editorial decisions

- Retain the original captions exactly, including duplicates and unusual spellings. Preserve “Mepple Enjoyer” rather than guessing a correction.
- Rewrite misleading original alt descriptions after looking at the actual assets; many described unrelated scenes.
- The initial first-person direction was superseded by the user's persona clarification: detached, terse, assured wording with minimal first-person framing. Never mention the developer or claim this is their portfolio. See memory-bank/voiceAndCopy.md.
- Treat MASTER as an archived self-report, with an explicit current-profile link. Do not fabricate LP, placements, match histories, or recent performance.
- Keep FIDE 3500 explicitly labeled as a joke, not a factual chess rating. The final enrichment pass removes public predecessor-site framing; provenance stays internal.
- Omit the age, study duration and follower count from the new public copy because their dates are unknown. They remain documented here.
- Omit the “Siyahilik” racial-percentage meter from the redesigned stats section; preserve its existence in this source audit. The other three original values remain unchanged.
- Keep the Samsun accident-like headline in provenance only; it is not republished as a current event.
- New exhibit notes, labels, approval seal and match statements are obviously absurd editorial copy. They make no substantive personal claims.
- No dates or chronology are invented for photos. Categories are editorial groupings, not asserted identities of the people pictured.

## Supplied enrichment

The final user request supplied authentic “çok iyi site yaptım.” (restored exactly), coffee, Sade, gaming and other lore. Implemented content and intentional omissions are documented in memory-bank/lore.md. A real MegaBonk screenshot was present at docs/original/images/megabonk-237.jpg, inspected, and added as expandable historical #237 evidence. This brings the retained image originals to 20. The first background is an opt-in footer incident; the second is preserved as source only. No original caption, photo ID or outbound profile/contact URL changed.

## Next content pass

Ask Efe for the stories behind a few key photos and his preferred flagship portrait. Add sourced dates/context where useful; turn real inside jokes into short optional exhibit footnotes. Additional lore can extend the content data or become a new static route without introducing a CMS.
