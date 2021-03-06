## Version 2

### Visible changes to the product

* **Make the shot title editable**.  To edit the title simply click on it from the shot page (See [#573](https://github.com/mozilla-services/pageshot/issues/573) [cc10632](https://github.com/mozilla-services/pageshot/commit/cc10632))
* **Site-specific improvements to autoselection**. New heuristics select one Facebook comment or post, and one tweet.  (See [#1797](https://github.com/mozilla-services/pageshot/issues/1797) [#1796](https://github.com/mozilla-services/pageshot/issues/1796) [8fe813f](https://github.com/mozilla-services/pageshot/commit/8fe813f))
* **Append .png to all image URLs** (See [#1782](https://github.com/mozilla-services/pageshot/issues/1782) [d7ebfbc](https://github.com/mozilla-services/pageshot/commit/d7ebfbc))
* **Make a public metrics page available**.  It will be in `/metrics` (will be published to https://pageshot.net/metrics).  (See  [#1825](https://github.com/mozilla-services/pageshot/issues/1825) [#1854](https://github.com/mozilla-services/pageshot/issues/1854) [89a8d9c](https://github.com/mozilla-services/pageshot/commit/89a8d9c))
* **Scroll selection when your mouse is close to the edge of the window**. Fixes [#193](https://github.com/mozilla-services/pageshot/issues/193) [28bcd17](https://github.com/mozilla-services/pageshot/commit/28bcd17)

### Bugs fixed

* Avoid exception on pages that have multiple `og:title` properties; both
  store only the first, and handle stored pages that may have multiple titles
  stored. Fixes [#1887](https://github.com/mozilla-services/pageshot/issues/1887) [9375962](https://github.com/mozilla-services/pageshot/commit/9375962)
* Ensure suggested filenames for downloaded files stay under 255 bytes. Fixes [#1820](https://github.com/mozilla-services/pageshot/issues/1820) [f1dba6b](https://github.com/mozilla-services/pageshot/commit/f1dba6b)
* Handle null cookies results when checking for an
  authentication cookie [dda178f](https://github.com/mozilla-services/pageshot/commit/dda178f)

### Minor changes

* change email share graphic. Fixes [#1650](https://github.com/mozilla-services/pageshot/issues/1650) [34f1ca8](https://github.com/mozilla-services/pageshot/commit/34f1ca8)
* redirect /favicon.ico to
  /static/img/pageshot-icon-32.png. Fixes [#1840](https://github.com/mozilla-services/pageshot/issues/1840) [34056c0](https://github.com/mozilla-services/pageshot/commit/34056c0)
* (v2.4) restore the share notification message. Fixes [#1918](https://github.com/mozilla-services/pageshot/issues/1918) [fdda2ec](https://github.com/mozilla-services/pageshot/commit/fdda2ec)
* (v2.4) revert to 'page' when the title isn't found. Fixes [#1836](https://github.com/mozilla-services/pageshot/issues/1836) [295e5b6](https://github.com/mozilla-services/pageshot/commit/295e5b6)
* (v2.4) add specific images for no search results and no
  shots at all. Fixes [#1770](https://github.com/mozilla-services/pageshot/issues/1770) [4e04411](https://github.com/mozilla-services/pageshot/commit/4e04411)
* (v2.4) Update some metrics queries: - Do not filter out shots that
  seem expired from the shot total count - Simplify some aliases in queries
  (not using aliasing in FROM) - Add a total retention table [efab5e1](https://github.com/mozilla-services/pageshot/commit/efab5e1)

### Internal refactoring.

* Hardcode the sentry public DSN so we receive error reports before successful login.  It will still be
  overwritten on login (including erasing it), but until that happens it will
  fall back to the production DSN. Fixes [#1883](https://github.com/mozilla-services/pageshot/issues/1883) [1f76fcc](https://github.com/mozilla-services/pageshot/commit/1f76fcc)
* Direct abuse reports to a dedicated email address. Fixes [#1855](https://github.com/mozilla-services/pageshot/issues/1855) [a69d756](https://github.com/mozilla-services/pageshot/commit/a69d756)
* Don't overload the `upload` GA event action as both success and failure states (see [Metrics](https://github.com/mozilla-services/pageshot/blob/master/docs/METRICS.md) for more info). Fixes [#1759](https://github.com/mozilla-services/pageshot/issues/1759) [375cbff](https://github.com/mozilla-services/pageshot/commit/375cbff)
* Combine `configure-raven.js` with the `raven.js`
  client, into `/install-raven.js`. Load raven via require() instead of a direct
  link.  Remove the now-unneeded `static/vendor/` directory, and Makefile rules
  related to it. Fixes [#1801](https://github.com/mozilla-services/pageshot/issues/1801) [6841236](https://github.com/mozilla-services/pageshot/commit/6841236)
* Combine `parent-helper.js` and
  `set-content-hosting-origin.js`. Make the scripts inclusion dependent on there
  being a full page/iframe. Fixes [#1802](https://github.com/mozilla-services/pageshot/issues/1802) [6db660d](https://github.com/mozilla-services/pageshot/commit/6db660d)
* Move `errorResponse()`, `simpleResponse()`, and `jsResponse()`
  to a new module. Move raven into its own module as well. Fixes [#1839](https://github.com/mozilla-services/pageshot/issues/1839) [6a06eb2](https://github.com/mozilla-services/pageshot/commit/6a06eb2)
* First pass at some [deployment documentation](https://github.com/mozilla-services/pageshot/blob/master/docs/deployment.md). Fixes [#1871](https://github.com/mozilla-services/pageshot/issues/1871) [e4b00c0](https://github.com/mozilla-services/pageshot/commit/e4b00c0)
* Increase default period of time to check for
  deleted shots from 1 minute to 1 hour. Fixes [#1865](https://github.com/mozilla-services/pageshot/issues/1865) [7589d5e](https://github.com/mozilla-services/pageshot/commit/7589d5e)
* Add GA logging for any shots that are deleted
  after the expiration time. Fixes [#1692](https://github.com/mozilla-services/pageshot/issues/1692) [dcb380b](https://github.com/mozilla-services/pageshot/commit/dcb380b)
* Move the share panel and button entirely into its
  own component fix share panel alignment when extension
  notification banner is in place. Fixes [#1714](https://github.com/mozilla-services/pageshot/issues/1714) Fixes [#1565](https://github.com/mozilla-services/pageshot/issues/1565) [ab468fd](https://github.com/mozilla-services/pageshot/commit/ab468fd)
* (v2.4) check before trying to call window.sendToChild,
  which is safely missing on most pages. Fixes [#1910](https://github.com/mozilla-services/pageshot/issues/1910) [5333ae7](https://github.com/mozilla-services/pageshot/commit/5333ae7)

## Version 1

### Visible changes to the product

* For each release we'll be adding one to the next version (i.e., the version after this will be Version 2)
* There is a "Save Full Page" and "Save visible" option for saving either the full length of the page, or the entire visible portion of the page.
* The add-on now automatically copies the shot URL to the clipboard.
* The autoselection when you click will now be previewed with a white box as you hover.
  * Also improvements to the autoselection algorithm, avoiding very small selections.
* Some URLs were being rejected: those with ports, `view-source` URLs, and URLs in some situations where the content was cached.
* Search on My Shots is now done as you type.
* Improvements to the selection itself:
  * You can drag the selection
  * You can invert the selection when resizing
  * You can drag out a new selection over the old selection
* In some error conditions Page Shot would become unresponsive on a tab.
* Page Shot authentication could be lost (for instance with a cookie destroying add-on).  We now attempt to re-login if we detect the cookies are gone.

### Detailed product/UI changes

* Stop auto-opening Share panel. Fixes [#1794](https://github.com/mozilla-services/pageshot/issues/1794) [d4964a7](https://github.com/mozilla-services/pageshot/commit/d4964a7)
* add mozilla logo [b68d28e](https://github.com/mozilla-services/pageshot/commit/b68d28e)
* error when hovering over elements like <html> that
  have no bounding rectangle Also avoid autoselections that are terribly small,
  even if there's no better fallback add metrics for the distance
  the selection moves or resizes. Fixes [#1784](https://github.com/mozilla-services/pageshot/issues/1784) Fixes [#1781](https://github.com/mozilla-services/pageshot/issues/1781) [8171dfb](https://github.com/mozilla-services/pageshot/commit/8171dfb)
* we can't actually support pages that use frames,
  but at least this detects it and gives an error. Fixes [#1748](https://github.com/mozilla-services/pageshot/issues/1748) [9aa7929](https://github.com/mozilla-services/pageshot/commit/9aa7929)
* when the autoselect is small try to add the next
  sibling (or uncle) element. Fixes [#1774](https://github.com/mozilla-services/pageshot/issues/1774) [a3b8604](https://github.com/mozilla-services/pageshot/commit/a3b8604)
* don't let a clip image go over 100% of the size of
  the page. Fixes [#1730](https://github.com/mozilla-services/pageshot/issues/1730) [aeb4d51](https://github.com/mozilla-services/pageshot/commit/aeb4d51)
* use URIFixup to clean URLs.  This cleans only the
  URL attached to the shot itself. Fixes [#1764](https://github.com/mozilla-services/pageshot/issues/1764) [b600a91](https://github.com/mozilla-services/pageshot/commit/b600a91)
* Add a share icon. Fixes [#1651](https://github.com/mozilla-services/pageshot/issues/1651) [2cd37a5](https://github.com/mozilla-services/pageshot/commit/2cd37a5)
* Show the instructional text on a dark background
  to prevent readability issues. Fixes [#1631](https://github.com/mozilla-services/pageshot/issues/1631) [8b5ded7](https://github.com/mozilla-services/pageshot/commit/8b5ded7)
* trigger a search when someone changes the search
  form. Fixes [#1458](https://github.com/mozilla-services/pageshot/issues/1458) [12a98ed](https://github.com/mozilla-services/pageshot/commit/12a98ed)
* use a minimum size on the click autodetect indicate the region that would be selected on hover Add a new class to
  suppress pointer events but not hide the interface. Fixes [#1745](https://github.com/mozilla-services/pageshot/issues/1745) Fixes [#1633](https://github.com/mozilla-services/pageshot/issues/1633) [d42b0a8](https://github.com/mozilla-services/pageshot/commit/d42b0a8)
* rename #share-button to #toggle-share.  Remove
  some styles that appeared to be for the share button, but didn't apply to
  anything. Fixes [#1659](https://github.com/mozilla-services/pageshot/issues/1659) [19863ea](https://github.com/mozilla-services/pageshot/commit/19863ea)
* when resizing selection across a corner or side,
  invert the selection. Fixes [#1630](https://github.com/mozilla-services/pageshot/issues/1630) [ae47ad9](https://github.com/mozilla-services/pageshot/commit/ae47ad9)
* don't allow resize to go past the edge of the
  screen. Fixes [#1732](https://github.com/mozilla-services/pageshot/issues/1732) [25ce7f4](https://github.com/mozilla-services/pageshot/commit/25ce7f4)
* put in a max height/width on full page (5000px)
  Fix the calculation of the page height and width by also using scrollHeight
  and scrollWidth. Fixes [#1740](https://github.com/mozilla-services/pageshot/issues/1740) [01e1e5f](https://github.com/mozilla-services/pageshot/commit/01e1e5f)
* dragging in the background when there's already a
  selection will now create a new selection. Fixes [#1138](https://github.com/mozilla-services/pageshot/issues/1138) [45de849](https://github.com/mozilla-services/pageshot/commit/45de849)
* allow moving the selection around. Fixes [#1628](https://github.com/mozilla-services/pageshot/issues/1628) [5faddf5](https://github.com/mozilla-services/pageshot/commit/5faddf5)
* Cleanup Shooter and the worker when the worker gets detached for some unknown reason; may avoid some problems where Page Shot hangs after an error [7793134](https://github.com/mozilla-services/pageshot/commit/7793134)
* copy link on save, and put up a popup to notify
  the user about the copy action. Fixes [#1734](https://github.com/mozilla-services/pageshot/issues/1734) [accfe28](https://github.com/mozilla-services/pageshot/commit/accfe28)
* allow view-source URLs. Fixes [#1720](https://github.com/mozilla-services/pageshot/issues/1720) [29efea9](https://github.com/mozilla-services/pageshot/commit/29efea9)
* Escape will close share panel. Fixes [#1691](https://github.com/mozilla-services/pageshot/issues/1691) [64b51cd](https://github.com/mozilla-services/pageshot/commit/64b51cd)
* fix bug that kept shooting from deactivating
  immediately (previously deactivated after 500ms delay). Fixes [#1597](https://github.com/mozilla-services/pageshot/issues/1597) [681134f](https://github.com/mozilla-services/pageshot/commit/681134f)
* Start on [#1613](https://github.com/mozilla-services/pageshot/issues/1613), add buttons to take a visible capture and
  full page (full length) screen capture Still requires UX review [40088fe](https://github.com/mozilla-services/pageshot/commit/40088fe)
* Allow ports in URLs [75644a1](https://github.com/mozilla-services/pageshot/commit/75644a1)
* check for the user auth cookie when checking if
  the browser is logged in. Fixes [#1704](https://github.com/mozilla-services/pageshot/issues/1704) [9b192cf](https://github.com/mozilla-services/pageshot/commit/9b192cf)
* Don't remove our authentication cookies on an upgrade or
  downgrade of the add-on, only on uninstall/disable [cf091c5](https://github.com/mozilla-services/pageshot/commit/cf091c5)

### Detailed server/backend changes

* Minimize all the bundle files using Uglify [1447cc2](https://github.com/mozilla-services/pageshot/commit/1447cc2)
* Set Cache-Control headers for both the static files and
  dynamically generated JS files [2a754b5](https://github.com/mozilla-services/pageshot/commit/2a754b5)
* Change inclusions of server-generated scripts to use
  staticLink [b068b1b](https://github.com/mozilla-services/pageshot/commit/b068b1b)
* Change staticLink to not add /static to the beginning of
  paths [452a110](https://github.com/mozilla-services/pageshot/commit/452a110)
* Automatically bundle core.js with all browserify bundles, and
  remove the specific core.js-related rules and script tags [7da4f72](https://github.com/mozilla-services/pageshot/commit/7da4f72)
* add styled 404 page. Does not change 404s for
  routes which are APIs, i.e., not seen by humans. Fixes [#1548](https://github.com/mozilla-services/pageshot/issues/1548) [3ba6f26](https://github.com/mozilla-services/pageshot/commit/3ba6f26)
* Get rid of unused controller on legal pages [0565da7](https://github.com/mozilla-services/pageshot/commit/0565da7)
* Use template literals [d82dc4d](https://github.com/mozilla-services/pageshot/commit/d82dc4d)
* put Raven activation into reactrender pages. Fixes [#1072](https://github.com/mozilla-services/pageshot/issues/1072) [895ca67](https://github.com/mozilla-services/pageshot/commit/895ca67)
* remove 'Leave page shot' link from pages when the
  user is not authenticated. Fixes [#1578](https://github.com/mozilla-services/pageshot/issues/1578) [62e68ed](https://github.com/mozilla-services/pageshot/commit/62e68ed)
* Update all deps to latest. Fixes [#1703](https://github.com/mozilla-services/pageshot/issues/1703) [6a1b6cd](https://github.com/mozilla-services/pageshot/commit/6a1b6cd)
* Put something in the logs when someone tries to upload a shot
  with an odd clip URL, or an empty URL [be6f736](https://github.com/mozilla-services/pageshot/commit/be6f736)
* add /contribute.json. Fixes [#1625](https://github.com/mozilla-services/pageshot/issues/1625) [8e422a5](https://github.com/mozilla-services/pageshot/commit/8e422a5)
* Switch from input.type=text to input.type=search [45c8824](https://github.com/mozilla-services/pageshot/commit/45c8824)
* Set maxlength on shot search input field [58abc98](https://github.com/mozilla-services/pageshot/commit/58abc98)

### Detailed metrics changes

* Fix regex that was supposed to select https and http, but was
  only selecting https [bc38cae](https://github.com/mozilla-services/pageshot/commit/bc38cae)
* add cancel events for tab close, navigate, and
  reload. Fixes [#1761](https://github.com/mozilla-services/pageshot/issues/1761) [6af5637](https://github.com/mozilla-services/pageshot/commit/6af5637)
* change custom dimensions from cd0 to cd2. Fixes [#1778](https://github.com/mozilla-services/pageshot/issues/1778) [ff4f83a](https://github.com/mozilla-services/pageshot/commit/ff4f83a)
* add refer(r)er information to direct image views
  send a view/direct-view event on those image views. Fixes [#1747](https://github.com/mozilla-services/pageshot/issues/1747) Fixes [#1777](https://github.com/mozilla-services/pageshot/issues/1777) [1cd58a5](https://github.com/mozilla-services/pageshot/commit/1cd58a5)
* send a message through the add-on when sendEvent
  is missing. Fix an error in how the add-ons are being loaded, which could
  keep them from being sent with the Sentry message. Fixes [#1736](https://github.com/mozilla-services/pageshot/issues/1736) [6c6f142](https://github.com/mozilla-services/pageshot/commit/6c6f142)
* add scheme information (as label) to the
  start-shot-non-http event. Fixes [#1695](https://github.com/mozilla-services/pageshot/issues/1695) [974ce79](https://github.com/mozilla-services/pageshot/commit/974ce79)
* add GA sendEvent for right-clicks/context menu on
  My Shots. Fixes [#1727](https://github.com/mozilla-services/pageshot/issues/1727) [5e20487](https://github.com/mozilla-services/pageshot/commit/5e20487)
* include the add-on version with all GA events. Fixes [#1722](https://github.com/mozilla-services/pageshot/issues/1722) [7ac5b22](https://github.com/mozilla-services/pageshot/commit/7ac5b22)
* Switch GA to use clientId instead of userId [5fe3e47](https://github.com/mozilla-services/pageshot/commit/5fe3e47)
* Fix event action names that kept a / accidentally [8c4ea36](https://github.com/mozilla-services/pageshot/commit/8c4ea36)
* add ua (user-agent) to GA events. Fixes [#1724](https://github.com/mozilla-services/pageshot/issues/1724) [ee265f0](https://github.com/mozilla-services/pageshot/commit/ee265f0)
* add a browser-send-event module that ensures that
  sendEvent is defined even if ga-activation.js fails. Fixes [#1666](https://github.com/mozilla-services/pageshot/issues/1666) [561ea05](https://github.com/mozilla-services/pageshot/commit/561ea05)
* Add $DEBUG_GOOGLE_ANALYTICS setting/config [a34983b](https://github.com/mozilla-services/pageshot/commit/a34983b)
* Add noAnalytics property to suppress GA on a page. remove GA from the creating page. Fixes [#1708](https://github.com/mozilla-services/pageshot/issues/1708) [00a3661](https://github.com/mozilla-services/pageshot/commit/00a3661)
* Hash the remote userId/cid just like we hash it for GA events
  on the server. [dc10023](https://github.com/mozilla-services/pageshot/commit/dc10023)
* Fix typo in set-expiration/navbar event [105d442](https://github.com/mozilla-services/pageshot/commit/105d442)

## 0.1

* Initial releases
* Everything that was implemented!
