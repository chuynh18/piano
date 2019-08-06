"use strict";

import { DECAY } from "./Globals";
import { SoundSample, NoteNode } from "./interfaces/KeyboardSound";
import { NoteConfig } from "./interfaces/PianoShared";

/**
 * Exposes methods to play appropriate sound samples based on the pressed key.
 * Samples must be named in counting order (natural numbers starting from 1),
 * followed by a "." and the filename extension.
 * 
 * Constructor parameters
 * @param  {string} baseURL  URL to the directory containing the audio samples.
 * @param  {string} ext  Filename extension of the audio samples.
 * @param  {number} numFiles  Number of files to be loaded.  Files must be named numerically.
 * @param  {Function} callback  (optional) called upon successful decode of each audio sample
 */
export class KeyboardSound {
   private ctx: AudioContext = new AudioContext();
   private samples: SoundSample[] = [];

   constructor(baseURL: string, ext: string, numFiles: number, callback?: Function) {
      for (let i = 0; i < numFiles; i++) {
         this.preload(`${baseURL}/${i + 1}.${ext}`, i, callback);
      }
   }

   public getSamplesLength() {
      return this.samples.length;
   }

   /**
    * Preloads audio samples.  Called by the class constructor.
    * 
    * @param  {string} url  URL to the audio sample
    * @param  {number} index  the index of this.samples to save the audio sample.
    * @param  {Function} callback  optional callback to run upon successful preload.
    */
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
         // named function expression to make stack traces prettier!
         buffer => {
            // put the downloaded audio file into note.buffer
            note.buffer = buffer;

            // put the note object into this.samples
            // note.source and note.gain will be created as needed later
            this.samples[index] = note;

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

   /**
    * Starts playing an audio sample.
    * 
    * @param  {NoteConfig} cfg  NoteConfig object, contains note and volume info.
    * @returns  {number}  The number of samples being played for a given note.
    */
   public playSample(cfg: NoteConfig) {
      const noteNode: NoteNode = {
         source: null,
         gain: null
      };

      const note = this.samples[cfg.key - 1];

      // create and configure AudioBufferSourceNode
      noteNode.source = new AudioBufferSourceNode(this.ctx, {
         buffer: note.buffer
      });

      // create and configure GainNode
      noteNode.gain = new GainNode(this.ctx, {
         gain: cfg.volume | 1
      });

      // connect nodes to each other
      noteNode.source.connect(noteNode.gain);
      noteNode.gain.connect(this.ctx.destination);

      // partial pedal during playback
      if (typeof cfg.duration !== "undefined" && typeof cfg.decay !== "undefined") {
         noteNode.active = true;

         setTimeout(function() {
            noteNode.active = false;
            noteNode.gain!.gain.exponentialRampToValueAtTime(0.00001,
               this.ctx.currentTime + cfg.decay);
         }, cfg.duration);
      // full pedal during playback
      } else if (typeof cfg.duration !== "undefined") {
         noteNode.active = true;

         setTimeout(function() {
            noteNode.active = false;
         }, cfg.duration);
      } else if (typeof cfg.decay !== "undefined") {
         console.log("I guess this case does need to be addressed!");
      }

      // play
      noteNode.source.start(0);

      // add note reference to SoundSample.playing so we can stop it later
      note.playing.push(noteNode);

      // return number of playing samples for the note
      return note.playing.length;
   }

   /**
    * Stops playing an audio sample.  Returns the number of still playing samples
    * for the specified note.
    * 
    * @param  {NoteConfig} cfg  NoteConfig object, contains note and volume info.
    * @returns  {number}  The number of samples still being played for a given note.
    */
   public stopOldestSample(cfg: NoteConfig) {
      // check to ensure that sound samples are in fact being played
      if (this.samples[cfg.key - 1].playing.length > 0) {
         // shift out the oldest playing sample
         const noteNode = this.samples[cfg.key - 1].playing.shift();

         if (typeof noteNode !== "undefined") {

            try {
               // decay the sound first, then stop playing
               if (typeof cfg.decay === "number") {
                  noteNode.gain!.gain.exponentialRampToValueAtTime(0.00001,
                     this.ctx.currentTime + cfg.decay);
                  
                  noteNode.source!.stop(this.ctx.currentTime + cfg.decay);
               } else {
                  noteNode.gain!.gain.exponentialRampToValueAtTime(0.00001,
                     this.ctx.currentTime + DECAY.get());

                  noteNode.source!.stop(this.ctx.currentTime + DECAY.get());
               }
               
            } catch (err) {
               console.log(err);
            }
         } else {
            throw new TypeError("noteNode is unexpectedly undefined.");
         }

         // return new length of array holding the playing samples for the note
         return this.samples[cfg.key - 1].playing.length;
      }
   }
   
   /**
    * Stops all inactive playing samples (e.g. samples that are currently playing
    * that do not correspond to a note being actively pressed.)  If the force
    * flag is set to true, all samples are stopped.
    * 
    * @param  {boolean} force
    */
   public stopAllSamples(force: boolean): number[] {
      const activeNotes: number[] = [];

      for (let i = 0; i < this.samples.length; i++) {
         const playing = this.samples[i].playing;

         if (playing.length > 0) {
            if (force) {
               for (let i = 0; i < playing.length; i++) {
                  playing[i].gain!.gain.exponentialRampToValueAtTime(0.00001,
                     this.ctx.currentTime + DECAY.get());

                  playing[i].source!.stop(this.ctx.currentTime + DECAY.get());
               }

               playing.length = 0;
            } else {
               for (let i = 0; i < playing.length; i++) {
                  if (!playing[i].active) {
                     playing[i].gain!.gain.exponentialRampToValueAtTime(0.00001,
                        this.ctx.currentTime + DECAY.get());
   
                     playing[i].source!.stop(this.ctx.currentTime + DECAY.get());
                  } else {
                     if (activeNotes.indexOf(i + 1) !== -1) {
                        activeNotes.push(i + 1);
                     }
                  }

                  this.samples[i].playing = playing.filter(val => {
                     return val.active;
                  });
               }
            }
         }
      }

      console.log(activeNotes);
      return activeNotes;
   }
}