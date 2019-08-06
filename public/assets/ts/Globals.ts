"use strict";

export const DECAY = {
   value: 0.8,
   set: function(decay: number): number {
      this.value = decay;
      return this.value;
   },
   get: function(): number {
      return this.value;
   }
}

export const KEY_COUNT = 88;