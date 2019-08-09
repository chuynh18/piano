"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Keyboard_1 = require("./Keyboard");
var PianoShared_1 = require("./interfaces/PianoShared");
var Globals_1 = require("./Globals");
var ProgramState;
(function (ProgramState) {
    ProgramState[ProgramState["Interactive"] = 0] = "Interactive";
    ProgramState[ProgramState["Edit"] = 1] = "Edit";
    ProgramState[ProgramState["Playback"] = 2] = "Playback";
})(ProgramState || (ProgramState = {}));
var Player = /** @class */ (function () {
    function Player(svgId) {
        this.mode = ProgramState.Interactive;
        this.keyboard = new Keyboard_1.Keyboard();
        // get SVG document and save reference into this.svg
        var element = document.getElementById(svgId);
        this.svg = element.contentDocument;
        // attach event handlers
        this.attachEventHandlers();
    }
    /**
     * Attaches event handlers to each rect element of the SVG.
     *
     * Event handlers attached are mousedown, mouseup, and mouseout.
     */
    Player.prototype.attachEventHandlers = function () {
        var _this = this;
        // grab rect elements inside SVG (rects is an HTMLCollection)
        var rects = this.svg.getElementsByTagName("rect");
        var damperText = document.getElementById("damper-state");
        var _loop_1 = function (i) {
            var key = rects[i];
            var cfg = {
                key: Number(key.id),
                volume: 1,
                color: "red"
            };
            key.addEventListener("oncontext", function (event) {
                event.preventDefault();
                return false;
            });
            key.addEventListener("mousedown", function (event) {
                _this.activateKey(event, cfg);
            });
            key.addEventListener("mouseup", function () {
                _this.deactivateKey(cfg);
            });
            key.addEventListener("mouseout", function () {
                _this.deactivateKey(cfg);
            });
        };
        for (var i = 0; i < rects.length; i++) {
            _loop_1(i);
        }
        document.getElementById("damper0").addEventListener("click", function () {
            _this.keyboard.setDamper(PianoShared_1.Damper.None);
            damperText.textContent = "Off";
        });
        document.getElementById("damper1").addEventListener("click", function () {
            _this.keyboard.setDamper(PianoShared_1.Damper.Half);
            damperText.textContent = "Half";
        });
        document.getElementById("damper2").addEventListener("click", function () {
            _this.keyboard.setDamper(PianoShared_1.Damper.Full);
            damperText.textContent = "On";
        });
    };
    Player.prototype.activateKey = function (e, cfg) {
        console.log('npm build test');
        if (this.mode === ProgramState.Interactive) {
            if (e.button === 0) {
                this.keyboard.play(cfg);
            }
        }
        else if (this.mode === ProgramState.Edit) {
        }
    };
    Player.prototype.deactivateKey = function (cfg) {
        if (this.mode === ProgramState.Interactive) {
            var damperState = this.keyboard.getDamper();
            if (damperState === PianoShared_1.Damper.None) {
                cfg.decay = Globals_1.DECAY.get("decay");
                this.keyboard.stop(cfg);
            }
            else if (damperState === PianoShared_1.Damper.Half) {
                cfg.decay = Globals_1.DECAY.get("halfPedal");
                this.keyboard.stop(cfg);
            }
            else if (damperState === PianoShared_1.Damper.Full) {
                cfg.decay = undefined;
                this.keyboard.stopVisuals(cfg);
            }
        }
        else if (this.mode === ProgramState.Edit) {
        }
    };
    return Player;
}());
exports.Player = Player;
//# sourceMappingURL=Player.js.map