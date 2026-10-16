# BleachBuddy

A browser extension (Chrome and Firefox, Manifest V3) that hides videos on adult sites when their title, tags, channel or performer match filter lists you choose, and can block whole sites that are built around a topic you filter.

## Features

- **Pick your own filter lists.** Topics (Interracial/Black, Asian, Trans, Gay, Femboy, Step-family, Anal, Group sex, Latina/Latino, AI-generated, Hentai, BDSM & fetish, NTR & cuckold) each contain keyword, studio, performer and whole-site lists. Switch lists on or off, or exclude single entries.
- **Multilingual.** Keywords come in many languages and scripts. Matching ignores case and accents, handles whole words, and matches CJK/Thai terms as substrings.
- **Case-sensitive terms.** Start a term with `=` (for example `=AI`) to match it case-sensitively.
- **Tag lookup.** Sites whose thumbnails show no tags (such as XVideos) are handled by reading each video's page in the background, cached for 30 days.
- **Whole-site blocking.** Lists of kind "Whole sites" block entire domains (and subdomains) or any address containing `*word*`, using declarativeNetRequest. An optional permission enables a friendly "Site blocked" page; without it the browser shows its own error page.
- **Image-board sites.** On Rule34 and similar sites posts are matched by exact tag, and on Rule34.xxx, Gelbooru, TBIB, Xbooru, Hypnohub and Realbooru the tags of your enabled lists (such as `dark_skin`, `dark-skinned_male`, `interracial`) are added to the site's own blacklist cookie.
- **Your own lists**, import/export of settings, and a "Try it" tester.
- **See what was filtered.** The popup lists the hidden items with the term that matched, can outline them instead of hiding them, and shows a counter on the toolbar icon.
- **Pause per site.** One switch in the popup turns the filter off for the current site only.

Built-in support for about 90 adult sites (the full list is on the settings page), image boards and Reddit. Pages of other sites can be added there too.

## Install

**Chrome / Edge:** open `chrome://extensions`, enable Developer mode, choose "Load unpacked" and select this folder.

**Firefox:** open `about:debugging#/runtime/this-firefox`, choose "Load Temporary Add-on" and select `manifest.json`.

## Notes

- Whole-site blocking's "Site blocked" page needs the optional "all websites" permission, only to see which address a tab is opening and swap in the page. The extension reads and sends no page data. Firefox older than 128 cannot grant it and shows the browser's plain error page instead.
- The lists are partial and partly compiled from memory; translations are best-effort and not native-reviewed. Pull requests with corrections are welcome.

## Development

No build step. `npm test` runs the unit tests for the matcher and the site rules. `lists.js` holds the catalog, `shared.js` the matcher and site-rule logic, `content.js` the page filter, `background.js` the site-blocking rules, `options.*` the settings page.
