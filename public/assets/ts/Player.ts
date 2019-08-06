"use strict";

import { Keyboard } from "./Keyboard";
import { NoteConfig, Damper } from "./interfaces/PianoShared";

enum ProgramState {
   Interactive,
   Edit,
   Playback
}

export class Player {
   private mode: ProgramState = ProgramState.Interactive;
   private keyboard = new Keyboard();
   private svg: Document;

   constructor(svgId: string) {
      const element = document.getElementById(svgId) as HTMLObjectElement;
      this.svg = element.contentDocument!;

      this.attachEventHandlers();
   }

   private attachEventHandlers() {
      const rects = this.svg.getElementsByTagName("rect");

      for (let i = 0; i < rects.length; i++) {
         const key = rects[i];
         const cfg: NoteConfig = {
            key: Number(key.id),
            volume: 1,
            color: "red"
         }

         key.addEventListener("mousedown", () => {
            if (this.mode === ProgramState.Interactive) {
               this.keyboard.play(cfg);
            } else if (this.mode === ProgramState.Edit) {

            }
         });

         key.addEventListener("mouseup", () => {
            if (this.mode === ProgramState.Interactive) {
               const damperState = this.keyboard.getDamper();

               if (damperState === Damper.Half) {
                  cfg.decay = 5;
               } else if (damperState === Damper.Full) {
                  cfg.decay = 40;
               }

               this.keyboard.stop(cfg);
            } else if (this.mode === ProgramState.Edit) {
               
            }
         });

         key.addEventListener("mouseout", () => {
            if (this.mode === ProgramState.Interactive) {
               const damperState = this.keyboard.getDamper();

               if (damperState === Damper.Half) {
                  cfg.decay = 5;
               } else if (damperState === Damper.Full) {
                  cfg.decay = 40;
               }

               this.keyboard.stop(cfg);
            } else if (this.mode === ProgramState.Edit) {
               
            }
         });
      }
   }
}