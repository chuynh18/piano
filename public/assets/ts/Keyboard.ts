"use strict";

import { KEY_COUNT } from "./Globals";
import { NoteConfig, Damper } from "./interfaces/PianoShared";
import { KeyboardSound } from "./KeyboardSound";
import { KeyboardView } from "./KeyboardView";

export class Keyboard {
   private damper: Damper = Damper.None;
   private sound = new KeyboardSound("assets/audio", "webm", KEY_COUNT, () => {
      console.log(this.sound.getSamplesLength());
   });
   private view = new KeyboardView("kb");

   public play(cfg: NoteConfig) {
      this.view.setColor(cfg);
      this.sound.playSample(cfg);
   }

   public stop(cfg: NoteConfig) {
      this.view.resetColor(cfg.key);
      this.sound.stopOldestSample(cfg);
   }

   public stopVisuals(cfg: NoteConfig) {
      this.view.resetColor(cfg.key);
   }

   public stopAll(force: boolean) {
      const stillPlaying = this.sound.stopAllSamples(force);

      for (let i = 0; i < KEY_COUNT; i++) {
         if (stillPlaying.indexOf(i) === -1) {
            this.view.resetColor(i + 1);
         }
      }
   }

   public setDamper(state: Damper) {
      if (this.damper >= state) {
         this.stopAll(false);
      }

      this.damper = state;
   }

   public getDamper(): Damper {
      return this.damper;
   }
}