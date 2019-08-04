"use strict";

import { SoundSample, NoteConfig } from "./interfaces/KeyboardSoundInterfaces";

export class KeyboardSound {
   private samples: SoundSample[];
   private ctx: AudioContext = new AudioContext();

   constructor(baseURL: string, numFiles: number, callback?: Function) {
      for (let i = 0; i < numFiles; i++) {
         this.preload(`${baseURL}/${i + 1}.ogg`, i, callback);
      }
   }

   private preload(url: string, index: number, callback?: Function) {
      const req = new XMLHttpRequest;

      // fetch audio file and store as arraybuffer
      req.open("GET", url, true);
      req.responseType = 'arraybuffer';

      const note: SoundSample = {
         buffer: null,
         playing: []
      };

      req.onload = () => {
         this.ctx.decodeAudioData(req.response,
         function loadSoundSample(buffer) {
            // put the downloaded audio file into note.buffer
            note.buffer = buffer;

            // put the note object into this.samples
            // note.source and note.gain will be created as needed later
            this.note[index] = note;

            // if callback was provided, call it!
            if (typeof callback === "function") {
               callback();
            }
         },
         function loadSoundError(error) {
            console.log(error);
         });
      }

      // make the request
      req.send();
   }

   public playSample(cfg: NoteConfig) {

   }
}