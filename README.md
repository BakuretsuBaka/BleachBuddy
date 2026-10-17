<p align="center"><img src="icons/icon-128.png" width="96" alt="BleachBuddy icon"></p>

<h1 align="center">BleachBuddy</h1>

A browser extension (Chrome and Firefox, Manifest V3) that hides videos on adult sites when their title, tags, channel or performer match filter lists you choose, and can block whole sites that are built around a topic you filter.

## Features

- **Pick your own filter lists.** Topics (Interracial/Black, Asian, Trans, Gay, Femboy, Step-family, Group sex, Latina/Latino, AI-generated, Hentai, BDSM & fetish incl. Anal and NTR & cuckold) each contain keyword, studio, performer and whole-site lists. Switch lists on or off, or exclude single entries.
- **Multilingual.** Keywords come in many languages and scripts. Matching ignores case and accents, handles whole words, and matches CJK/Thai terms as substrings.
- **Case-sensitive terms.** Start a term with `=` (for example `=AI`) to match it case-sensitively.
- **Tag lookup.** Sites whose thumbnails show no tags (such as XVideos) are handled by reading each video's page in the background, cached for 30 days.
- **Whole-site blocking.** Lists of kind "Whole sites" block entire domains (and subdomains) or any address containing `*word*`, using declarativeNetRequest. An optional permission enables a friendly "Site blocked" page; without it the browser shows its own error page.
- **Image-board sites.** On Rule34 and similar sites posts are matched by exact tag, and on Rule34.xxx, Gelbooru, TBIB, Xbooru, Hypnohub and Realbooru the tags of your enabled lists (such as `dark_skin`, `dark-skinned_male`, `interracial`) are added to the site's own blacklist cookie.
- **Your own lists**, import/export of settings, and a "Try it" tester.
- **See what was filtered.** The popup lists the hidden items with the term that matched, can outline them instead of hiding them, and shows a counter on the toolbar icon.
- **Pause per site.** One switch in the popup turns the filter off for the current site only.

Built-in support for about 200 adult sites (the full list is on the settings page), image boards, Reddit and the adult boards of 4chan (/s/, /hc/, /hm/, /h/, /e/, /u/, /d/, /y/, /t/, /hr/, /gif/, /aco/), where posts with an image or video are checked by file name and post text. Pages of other sites can be added there too.

## Install

### Firefox

Install it from Firefox Add-ons: [BleachBuddy on addons.mozilla.org](https://addons.mozilla.org/en-US/firefox/addon/bleachbuddy/). Click "Add to Firefox". It updates itself.

### Chrome, Edge, Brave and other Chromium browsers

BleachBuddy is not in the Chrome Web Store, so you install it by hand from the [latest release](https://github.com/BakuretsuBaka/BleachBuddy/releases/latest):

1. Download `BleachBuddy-<version>-chromium.zip` from the release page (under "Assets").
2. Unzip it into a folder you will keep, for example `Documents/BleachBuddy`. The browser reads the extension from that folder every time it starts, so do not delete it afterwards.
3. Open `chrome://extensions` (in Edge `edge://extensions`, in Brave `brave://extensions`) and switch on "Developer mode" in the top right.
4. Click "Load unpacked" and select the unzipped folder, the one that contains `manifest.json`.

The extension does not update itself this way. To update, download the new zip from the [releases page](https://github.com/BakuretsuBaka/BleachBuddy/releases), unzip it over the old folder and click the reload button on the extension's card in `chrome://extensions`.

### Firefox without Add-ons (optional)

The release also has a `BleachBuddy-<version>-firefox.zip`. In Firefox, open `about:debugging#/runtime/this-firefox`, click "Load Temporary Add-on" and select that zip. Temporary add-ons are removed when Firefox closes, so the Add-ons page above is the better way.

### From source

Clone this repository and load the folder directly ("Load unpacked" in Chromium browsers, or `manifest.json` as a temporary add-on in Firefox), or build the packages yourself with `python3 tools/build.py`.

## Notes

- Whole-site blocking's "Site blocked" page needs the optional "all websites" permission, only to see which address a tab is opening and swap in the page. The extension reads and sends no page data. Firefox older than 128 cannot grant it and shows the browser's plain error page instead.
- The lists are partial and partly compiled from memory; translations are best-effort and not native-reviewed. Pull requests with corrections are welcome.

## Development

No build step. `npm test` runs the unit tests for the matcher and the site rules. `lists.js` holds the catalog, `shared.js` the matcher and site-rule logic, `content.js` the page filter, `background.js` the site-blocking rules, `options.*` the settings page.

## License

GPL-3.0-only, see [LICENSE](LICENSE).
