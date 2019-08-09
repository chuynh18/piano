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
   private volume: HTMLInputElement;

   constructor(svgId: string) {
      // get SVG document and save reference into this.svg
      const element = document.getElementById(svgId) as HTMLObjectElement;
      this.svg = element.contentDocument!;
      this.volume = document.getElementById("volume") as HTMLInputElement;

      // attach event handlers
      this.attachEventHandlers();
   }

   /**
    * Attaches event handlers to each rect element of the SVG.
    * 
    * Event handlers attached are contextmenu, mousedown, mouseup, and mouseout.
    */
   private attachEventHandlers() {
      // grab rect elements inside SVG (rects is an HTMLCollection)
      const rects = this.svg.getElementsByTagName("rect");
      const damperText = document.getElementById("damper-state")!;

      // for each of the 88 keys on the piano...
      for (let i = 0; i < rects.length; i++) {
         const key = rects[i];
         const cfg: NoteConfig = {
            key: Number(key.id),
            volume: 1,
            color: "red"
         }

         // prevent right click context menu on keyboard
         key.addEventListener("contextmenu", event => {
            event.preventDefault();
         }, false);

         // key clicked event handler
         key.addEventListener("mousedown", event => {
            this.activateKey(event, cfg);
         });

         // key released event handler (no more click)
         key.addEventListener("mouseup", () => {
            this.deactivateKey(cfg);
         });

         // key released event handler (mouse out)
         key.addEventListener("mouseout", () => {
            this.deactivateKey(cfg);
         });
      }

      // global volume slider
      this.volume.addEventListener("input", () => {
         document.getElementById("volume-value")!.textContent = String(Math.floor(100 * Number(this.volume.value)));
      });

      // damper pedal off
      document.getElementById("damper0")!.addEventListener("click", () => {
         this.keyboard.setDamper(Damper.None);
         damperText.textContent = "Off";
      });

      // damper pedal half
      document.getElementById("damper1")!.addEventListener("click", () => {
         this.keyboard.setDamper(Damper.Half);
         damperText.textContent = "Half";
      });

      // damper pedal on
      document.getElementById("damper2")!.addEventListener("click", () => {
         this.keyboard.setDamper(Damper.Full);
         damperText.textContent = "On";
      });
   }
   
   /**
    * Activation of a key on the keyboard (in other words, play a note).
    * 
    * @param  {MouseEvent} e - the MouseEvent (to identify left vs right-click)
    * @param  {NoteConfig} cfg - NoteConfig object
    */
   private activateKey(e: MouseEvent, cfg: NoteConfig) {
      if (this.mode === ProgramState.Interactive) {
         // set value of volume on NoteConfig object
         cfg.volume = Number(this.volume.value);

         if (e.button === 0) {
            this.keyboard.play(cfg);
         }
      } else if (this.mode === ProgramState.Edit) {

      }
   }

   /**
    * Stop playing a note.  Behavior differs based on pedal state.
    * 
    * @param  {NoteConfig} cfg - Note configuration object.
    */
   private deactivateKey(cfg: NoteConfig) {
      if (this.mode === ProgramState.Interactive) {
         // set value of volume on NoteConfig
         cfg.volume = Number(this.volume.value);

         // grab damper value
         const damperState = this.keyboard.getDamper();

         // set appropriate decay value on NoteConfig
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