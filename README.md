# BleachBuddy

A browser extension (Manifest V3, Chrome and Firefox) that hides videos and posts on adult sites when their title, tags, channel or performer match filter lists you choose, and can block whole sites that are built around something you filter.

## Features

- **Filter lists you pick yourself:** topics such as interracial/Black, Asian, trans, gay, femboy, step-family, anal, group sex, Latina/Latino, AI-generated and hentai. Each topic has keyword, studio, performer and site lists that you can switch on or off, down to single items.
- **Multilingual:** keywords in many languages and scripts, matched ignoring case and accents. Terms starting with `=` are case-sensitive.
- **Tag lookup:** many sites do not show tags on thumbnails, so the extension reads them from each video's page (throttled, cached for 30 days).
- **Whole-site blocking:** lists of type "sites" block entire websites, using domains or `*word*` patterns.
- **80 supported sites plus Reddit,** automatic thumbnail detection for layouts it has not seen, and an option to add more sites. On Reddit only NSFW posts are checked by default.
- **Your own lists,** import/export of settings, and a "Try it" tester.

## Install

**Chrome / Edge:** open `chrome://extensions`, enable Developer mode, choose "Load unpacked" and select this folder.

**Firefox (temporary):** open `about:debugging#/runtime/this-firefox`, choose "Load Temporary Add-on" and select `manifest.json`.

## Notes

- The lists are partial and partly written from memory; translations are best-effort and not reviewed by native speakers. Pull requests are welcome.
- The "Site blocked" page needs an optional permission to redirect requests. Without it the browser shows its own error page.
- Hand-written selectors exist for eight sites; everywhere else thumbnails are detected automatically, which may need tuning per site. The popup's "Copy debug info" button helps report problems.

## License

MIT
