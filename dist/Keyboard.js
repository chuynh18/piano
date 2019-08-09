"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Globals_1 = require("./Globals");
var PianoShared_1 = require("./interfaces/PianoShared");
var KeyboardSound_1 = require("./KeyboardSound");
var KeyboardView_1 = require("./KeyboardView");
var Keyboard = /** @class */ (function () {
    function Keyboard() {
        var _this = this;
        this.damper = PianoShared_1.Damper.None;
        this.sound = new KeyboardSound_1.KeyboardSound("assets/audio", "webm", Globals_1.KEY_COUNT, function () {
            console.log(_this.sound.getSamplesLength());
        });
        this.view = new KeyboardView_1.KeyboardView("kb");
    }
    Keyboard.prototype.play = function (cfg) {
        this.view.setColor(cfg);
        this.sound.playSample(cfg);
    };
    Keyboard.prototype.stop = function (cfg) {
        this.view.resetColor(cfg.key);
        this.sound.stopOldestSample(cfg);
    };
    Keyboard.prototype.stopVisuals = function (cfg) {
        this.view.resetColor(cfg.key);
    };
    Keyboard.prototype.stopAll = function (force) {
        var stillPlaying = this.sound.setNewDecayAllSamples(force, Globals_1.DECAY.get("decay"));
        for (var i = 0; i < Globals_1.KEY_COUNT; i++) {
            if (stillPlaying.indexOf(i) === -1) {
                this.view.resetColor(i + 1);
            }
        }
    };
    Keyboard.prototype.setDamper = function (state) {
        if (this.damper >= state) {
            console.log("Stopping all non-active notes");
            this.stopAll(false);
        }
        this.damper = state;
    };
    Keyboard.prototype.getDamper = function () {
        return this.damper;
    };
    return Keyboard;
}());
exports.Keyboard = Keyboard;
//# sourceMappingURL=Keyboard.js.map