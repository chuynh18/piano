"use strict";
exports.__esModule = true;
var KeyboardView = /** @class */ (function () {
    function KeyboardView(svgId) {
        var element = document.getElementById(svgId);
        this.svg = element.contentDocument;
    }
    /**
     * Sets the specified key to the desired color.  If a duration is provided,
     * the key will be reset to its original color at the end of the duration.
     *
     * @param  {NoteConfig} cfg
     */
    KeyboardView.prototype.setColor = function (cfg) {
        var key = this.svg.getElementById(String(cfg.key));
        key.style.fill = cfg.color;
        if (typeof cfg.duration !== "undefined") {
            setTimeout(function () {
                this.resetColor(cfg.key);
            }, cfg.duration);
        }
    };
    /**
     * Resets the specified key to its original color (either black or white).
     *
     * @param  {number} keyNum
     */
    KeyboardView.prototype.resetColor = function (keyNum) {
        var key = this.svg.getElementById(String(keyNum));
        key.style.fill = key.dataset.fill;
    };
    return KeyboardView;
}());
exports.KeyboardView = KeyboardView;
