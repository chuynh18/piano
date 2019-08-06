"use strict";

export const DECAY = {
   value: 0.8,
   halfPedal: 7,
   setDecay: function(decay: number): number {
      this.value = decay;
      return this.value;
   },
   setHalfPedal: function(decay: number) : number {
      this.halfPedal = decay;
      return this.halfPedal;
   },
   get: function(): number {
      return this.value;
   },
   gethalfPedal: function(): number {
      return this.halfPedal;
   }
}

export const KEY_COUNT = 88;