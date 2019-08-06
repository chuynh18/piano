"use strict";

import { NoteConfig } from "./interfaces/PianoShared";

export class KeyboardView {
   private svg: Document;

   constructor(svgId: string) {
      const element = document.getElementById(svgId) as HTMLObjectElement;
      this.svg = element.contentDocument!;
   }

   /**
    * Sets the specified key to the desired color.  If a duration is provided,
    * the key will be reset to its original color at the end of the duration.
    * 
    * @param  {NoteConfig} cfg
    */
   public setColor(cfg: NoteConfig) {
      const key = this.svg.getElementById(String(cfg.key))!;

      key.style.fill = cfg.color;

      if (typeof cfg.duration !== "undefined") {
         setTimeout(function() {
            this.resetColor(cfg.key);
         }, cfg.duration);
      }
   }
   
   /**
    * Resets the specified key to its original color (either black or white).
    * 
    * @param  {number} keyNum
    */
   public resetColor(keyNum: number) {
      const key = this.svg.getElementById(String(keyNum))!;

      key.style.fill = key.dataset.fill!;
   }
}