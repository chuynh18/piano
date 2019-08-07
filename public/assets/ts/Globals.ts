"use strict";

export const DECAY = {
   decay: 0.8,
   halfPedal: 7,
   set(key: string, decay: number) {
      if (this.hasOwnProperty(key)) {
         this[key] = decay;
         return this[key];
      } else {
         throw new ReferenceError(`Cannot set value of nonexistent key ${key}.`);
      }
   },
   get: function(key: string) {
      if (this.hasOwnProperty(key)) {
         return this[key];
      } else {
         throw new ReferenceError(`Cannot get value of nonexistent key ${key}.`);
      }
   }
}

export const KEY_COUNT = 88;