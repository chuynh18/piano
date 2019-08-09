"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
//# sourceMappingURL=Globals.js.map