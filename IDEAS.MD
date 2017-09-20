# Ideas

* Save/Load. 

* Options Page
  * syntax themes here - [Styles](https://github.com/isagalaev/highlight.js/tree/master/src/styles)
  * Link Shortening.
  * Save frequency.
  * Fixed popup Size.
  * Themes.
  * Set language (others wouldn't highlight properly unless the prefix before the backticks overrides).
  * Shortcut keys (Can probably control them through code. Haven't checked.)
  * Live update of tab on or off.
  * Local / Sync save option. (All local currently)

* Text input commands.
* Different contexts (for multiple tabs).
* Could look into pulling the popup out into a half window and pretend its docked.
* Add title attribute to links in markdown if possible so output would reference long links in meantime while options are made.

### Issues?
1. The save of everything is happening roughly 60 times a second atm. That might cause problems eventually so could be rethought (Although makes the live update nice and easy)

1. API key should be moved out of main files

### Misc
 
1. Further styling of new tabs page possibly. Barebones atm
2. I looked into making it scroll with your position in the popup text box. Doesn't seem like something that is anything close to easy - Especially as they would be of different lengths