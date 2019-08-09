(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.DECAY = {
    decay: 0.8,
    halfPedal: 7,
    set: function (key, decay) {
        if (this.hasOwnProperty(key)) {
            this[key] = decay;
            return this[key];
        }
        else {
            throw new ReferenceError("Cannot set value of nonexistent key " + key + ".");
        }
    },
    get: function (key) {
        if (this.hasOwnProperty(key)) {
            return this[key];
        }
        else {
            throw new ReferenceError("Cannot get value of nonexistent key " + key + ".");
        }
    }
};
exports.KEY_COUNT = 88;

},{}],2:[function(require,module,exports){
"use strict";
exports.__esModule = true;
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

},{"./Globals":1,"./KeyboardSound":3,"./KeyboardView":4,"./interfaces/PianoShared":6}],3:[function(require,module,exports){
"use strict";
exports.__esModule = true;
/**
 * Exposes methods to play appropriate sound samples based on the pressed key.
 * Samples must be named in counting order (natural numbers starting from 1),
 * followed by a "." and the filename extension.
 *
 * Constructor parameters
 * @param  {string} baseURL  URL to the directory containing the audio samples.
 * @param  {string} ext  Filename extension of the audio samples.
 * @param  {number} numFiles  Number of files to be loaded.  Files must be named numerically.
 * @param  {Function} callback  (optional) called upon successful decode of each audio sample
 */
var KeyboardSound = /** @class */ (function () {
    function KeyboardSound(baseURL, ext, numFiles, callback) {
        this.ctx = new AudioContext();
        this.samples = [];
        for (var i = 0; i < numFiles; i++) {
            this.preload(baseURL + "/" + (i + 1) + "." + ext, i, callback);
        }
    }
    KeyboardSound.prototype.getSamplesLength = function () {
        return this.samples.length;
    };
    /**
     * Preloads audio samples.  Called by the class constructor.
     *
     * @param  {string} url  URL to the audio sample
     * @param  {number} index  the index of this.samples to save the audio sample.
     * @param  {Function} callback  optional callback to run upon successful preload.
     */
    KeyboardSound.prototype.preload = function (url, index, callback) {
        var _this = this;
        var req = new XMLHttpRequest;
        // fetch audio file and store as arraybuffer
        req.open("GET", url, true);
        req.responseType = 'arraybuffer';
        var note = {
            buffer: null,
            playing: []
        };
        req.onload = function () {
            _this.ctx.decodeAudioData(req.response, 
            // named function expression to make stack traces prettier!
            function (buffer) {
                // put the downloaded audio file into note.buffer
                note.buffer = buffer;
                // put the note object into this.samples
                // note.source and note.gain will be created as needed later
                _this.samples[index] = note;
                // if callback was provided, call it!
                if (typeof callback === "function") {
                    callback();
                }
            }, function loadSoundError(error) {
                console.log(error);
            });
        };
        // make the request
        req.send();
    };
    /**
     * Starts playing an audio sample.
     *
     * @param  {NoteConfig} cfg  NoteConfig object, contains note and volume info.
     * @returns  {number}  The number of samples being played for a given note.
     */
    KeyboardSound.prototype.playSample = function (cfg) {
        var noteNode = {
            source: null,
            gain: null
        };
        var note = this.samples[cfg.key - 1];
        // create and configure AudioBufferSourceNode
        noteNode.source = new AudioBufferSourceNode(this.ctx, {
            buffer: note.buffer
        });
        // create and configure GainNode
        noteNode.gain = new GainNode(this.ctx);
        noteNode.gain.gain.setValueAtTime(cfg.volume, this.ctx.currentTime);
        // connect nodes to each other
        noteNode.source.connect(noteNode.gain);
        noteNode.gain.connect(this.ctx.destination);
        // partial pedal during playback
        if (typeof cfg.duration !== "undefined" && typeof cfg.decay !== "undefined") {
            noteNode.active = true;
            setTimeout(function () {
                noteNode.active = false;
                noteNode.gain.gain.exponentialRampToValueAtTime(0.00001, this.ctx.currentTime + cfg.decay);
            }, cfg.duration);
            // full pedal during playback
        }
        else if (typeof cfg.duration !== "undefined") {
            noteNode.active = true;
            setTimeout(function () {
                noteNode.active = false;
            }, cfg.duration);
        }
        else if (typeof cfg.decay !== "undefined") {
            // decay provided, but no duration
        }
        // play
        noteNode.source.start(0);
        // add note reference to SoundSample.playing so we can stop it later
        note.playing.push(noteNode);
        // return number of playing samples for the note
        return note.playing.length;
    };
    /**
     * Stops playing an audio sample.  Returns the number of still playing samples
     * for the specified note.
     *
     * @param  {NoteConfig} cfg  NoteConfig object, contains note and volume info.
     * @returns  {number}  The number of samples still being played for a given note.
     */
    KeyboardSound.prototype.stopOldestSample = function (cfg) {
        // check to ensure that sound samples are in fact being played
        if (this.samples[cfg.key - 1].playing.length > 0) {
            // shift out the oldest playing sample
            var noteNode = this.samples[cfg.key - 1].playing.shift();
            if (typeof noteNode !== "undefined") {
                try {
                    // decay the sound first, then stop playing
                    if (typeof cfg.decay === "number") {
                        noteNode.gain.gain.exponentialRampToValueAtTime(0.00001, this.ctx.currentTime + cfg.decay);
                        noteNode.source.stop(this.ctx.currentTime + cfg.decay);
                    } // else {
                    //    noteNode.gain!.gain.exponentialRampToValueAtTime(0.00001,
                    //       this.ctx.currentTime + DECAY.get());
                    //    noteNode.source!.stop(this.ctx.currentTime + DECAY.get());
                    // }
                }
                catch (err) {
                    console.log(err);
                }
            }
            else {
                throw new TypeError("noteNode is unexpectedly undefined.");
            }
            // return new length of array holding the playing samples for the note
            return this.samples[cfg.key - 1].playing.length;
        }
    };
    /**
     * Stops all inactive playing samples (e.g. samples that are currently playing
     * that do not correspond to a note being actively pressed.)  If the force
     * flag is set to true, all samples are stopped.
     *
     * @param  {boolean} force
     */
    KeyboardSound.prototype.setNewDecayAllSamples = function (force, decay) {
        var activeNotes = [];
        for (var i = 0; i < this.samples.length; i++) {
            var playing = this.samples[i].playing;
            if (playing.length > 0) {
                if (force) {
                    for (var i_1 = 0; i_1 < playing.length; i_1++) {
                        playing[i_1].gain.gain.exponentialRampToValueAtTime(0.00001, this.ctx.currentTime + decay);
                        playing[i_1].source.stop(this.ctx.currentTime + decay);
                    }
                    playing.length = 0;
                }
                else {
                    for (var i_2 = 0; i_2 < playing.length; i_2++) {
                        if (!playing[i_2].active) {
                            playing[i_2].gain.gain.exponentialRampToValueAtTime(0.00001, this.ctx.currentTime + decay);
                            playing[i_2].source.stop(this.ctx.currentTime + decay);
                        }
                        else {
                            if (activeNotes.indexOf(i_2 + 1) !== -1) {
                                activeNotes.push(i_2 + 1);
                            }
                        }
                        this.samples[i_2].playing = playing.filter(function (val) {
                            return val.active;
                        });
                    }
                }
            }
        }
        console.log(activeNotes);
        return activeNotes;
    };
    return KeyboardSound;
}());
exports.KeyboardSound = KeyboardSound;

},{}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
"use strict";
exports.__esModule = true;
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
        this.volume = document.getElementById("volume");
        // attach event handlers
        this.attachEventHandlers();
    }
    /**
     * Attaches event handlers to each rect element of the SVG.
     *
     * Event handlers attached are contextmenu, mousedown, mouseup, and mouseout.
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
            // prevent right click context menu on keyboard
            key.addEventListener("contextmenu", function (event) {
                event.preventDefault();
            }, false);
            // key clicked event handler
            key.addEventListener("mousedown", function (event) {
                _this.activateKey(event, cfg);
            });
            // key released event handler (no more click)
            key.addEventListener("mouseup", function () {
                _this.deactivateKey(cfg);
            });
            // key released event handler (mouse out)
            key.addEventListener("mouseout", function () {
                _this.deactivateKey(cfg);
            });
        };
        // for each of the 88 keys on the piano...
        for (var i = 0; i < rects.length; i++) {
            _loop_1(i);
        }
        // global volume slider
        this.volume.addEventListener("input", function () {
            document.getElementById("volume-value").textContent = String(Math.floor(100 * Number(_this.volume.value)));
        });
        // damper pedal off
        document.getElementById("damper0").addEventListener("click", function () {
            _this.keyboard.setDamper(PianoShared_1.Damper.None);
            damperText.textContent = "Off";
        });
        // damper pedal half
        document.getElementById("damper1").addEventListener("click", function () {
            _this.keyboard.setDamper(PianoShared_1.Damper.Half);
            damperText.textContent = "Half";
        });
        // damper pedal on
        document.getElementById("damper2").addEventListener("click", function () {
            _this.keyboard.setDamper(PianoShared_1.Damper.Full);
            damperText.textContent = "On";
        });
    };
    /**
     * Activation of a key on the keyboard (in other words, play a note).
     *
     * @param  {MouseEvent} e - the MouseEvent (to identify left vs right-click)
     * @param  {NoteConfig} cfg - NoteConfig object
     */
    Player.prototype.activateKey = function (e, cfg) {
        if (this.mode === ProgramState.Interactive) {
            // set value of volume on NoteConfig object
            cfg.volume = Number(this.volume.value);
            if (e.button === 0) {
                this.keyboard.play(cfg);
            }
        }
        else if (this.mode === ProgramState.Edit) {
        }
    };
    /**
     * Stop playing a note.  Behavior differs based on pedal state.
     *
     * @param  {NoteConfig} cfg - Note configuration object.
     */
    Player.prototype.deactivateKey = function (cfg) {
        if (this.mode === ProgramState.Interactive) {
            // set value of volume on NoteConfig
            cfg.volume = Number(this.volume.value);
            // grab damper value
            var damperState = this.keyboard.getDamper();
            // set appropriate decay value on NoteConfig
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

},{"./Globals":1,"./Keyboard":2,"./interfaces/PianoShared":6}],6:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var Damper;
(function (Damper) {
    Damper[Damper["None"] = 0] = "None";
    Damper[Damper["Half"] = 1] = "Half";
    Damper[Damper["Full"] = 2] = "Full";
})(Damper = exports.Damper || (exports.Damper = {}));

},{}],7:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var Player_1 = require("./Player");
var player;
window.addEventListener("load", function () {
    player = new Player_1.Player("kb");
});

},{"./Player":5}]},{},[7]);
