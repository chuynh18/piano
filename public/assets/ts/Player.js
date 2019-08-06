"use strict";
exports.__esModule = true;
var Keyboard_1 = require("./Keyboard");
var PianoShared_1 = require("./interfaces/PianoShared");
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
        var element = document.getElementById(svgId);
        this.svg = element.contentDocument;
        this.attachEventHandlers();
    }
    Player.prototype.attachEventHandlers = function () {
        var _this = this;
        var rects = this.svg.getElementsByTagName("rect");
        var _loop_1 = function (i) {
            var key = rects[i];
            var cfg = {
                key: Number(key.id),
                volume: 1,
                color: "red"
            };
            key.addEventListener("mousedown", function () {
                if (_this.mode === ProgramState.Interactive) {
                    _this.keyboard.play(cfg);
                }
                else if (_this.mode === ProgramState.Edit) {
                }
            });
            key.addEventListener("mouseup", function () {
                if (_this.mode === ProgramState.Interactive) {
                    var damperState = _this.keyboard.getDamper();
                    if (damperState === PianoShared_1.Damper.Half) {
                        cfg.decay = 5;
                    }
                    else if (damperState === PianoShared_1.Damper.Full) {
                        cfg.decay = 40;
                    }
                    _this.keyboard.stop(cfg);
                }
                else if (_this.mode === ProgramState.Edit) {
                }
            });
            key.addEventListener("mouseout", function () {
                if (_this.mode === ProgramState.Interactive) {
                    var damperState = _this.keyboard.getDamper();
                    if (damperState === PianoShared_1.Damper.Half) {
                        cfg.decay = 5;
                    }
                    else if (damperState === PianoShared_1.Damper.Full) {
                        cfg.decay = 40;
                    }
                    _this.keyboard.stop(cfg);
                }
                else if (_this.mode === ProgramState.Edit) {
                }
            });
        };
        for (var i = 0; i < rects.length; i++) {
            _loop_1(i);
        }
    };
    return Player;
}());
exports.Player = Player;
