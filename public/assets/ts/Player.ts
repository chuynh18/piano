"use strict";

import { Keyboard } from "./Keyboard";
import { NoteConfig, Damper } from "./interfaces/PianoShared";
import { DECAY } from "./Globals";

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
      const damperText = document.getElementById("damper-state")!;

      for (let i = 0; i < rects.length; i++) {
         const key = rects[i];
         const cfg: NoteConfig = {
            key: Number(key.id),
            volume: 1,
            color: "red"
         }

         key.addEventListener("mousedown", () => {
            this.activateKey(cfg);
         });

         key.addEventListener("mouseup", () => {
            this.deactivateKey(cfg);
         });

         key.addEventListener("mouseout", () => {
            this.deactivateKey(cfg);
         });
      }

      document.getElementById("damper0")!.addEventListener("click", () => {
         this.keyboard.setDamper(Damper.None);
         damperText.textContent = "Off";
      });

      document.getElementById("damper1")!.addEventListener("click", () => {
         this.keyboard.setDamper(Damper.Half);
         damperText.textContent = "Half";
      });

      document.getElementById("damper2")!.addEventListener("click", () => {
         this.keyboard.setDamper(Damper.Full);
         damperText.textContent = "On";
      });
   }

   private activateKey(cfg: NoteConfig) {
      if (this.mode === ProgramState.Interactive) {
         this.keyboard.play(cfg);
      } else if (this.mode === ProgramState.Edit) {

      }
   }

   private deactivateKey(cfg: NoteConfig) {
      if (this.mode === ProgramState.Interactive) {
         const damperState = this.keyboard.getDamper();

         if (damperState === Damper.None) {
            cfg.decay = DECAY.get("decay");
            this.keyboard.stop(cfg);
         } else if (damperState === Damper.Half) {
            cfg.decay = DECAY.get("halfPedal");
            this.keyboard.stop(cfg);
         } else if (damperState === Damper.Full) {
            cfg.decay = undefined;
            this.keyboard.stopVisuals(cfg);
         }
      } else if (this.mode === ProgramState.Edit) {
         
      }
   }

}