"use strict";

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
   private samples: SoundSample[];

   constructor(baseURL: string, ext: string, numFiles: number, callback?: Function) {
      for (let i = 0; i < numFiles; i++) {
         this.preload(`${baseURL}/${i + 1}.${ext}`, i, callback);
      }
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

      const note = this.samples[cfg.key];

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
   public stopPlaying(cfg: NoteConfig) {
      // check to ensure that sound samples are in fact being played
      if (this.samples[cfg.key].playing.length > 0) {
         // shift out the oldest playing sample
         const noteNode = this.samples[cfg.key].playing.shift();

         if (typeof noteNode !== "undefined") {
            if (typeof cfg.decay !== "number") {
               throw new TypeError("decay must be a number.");
            }

            try {
               // decay the sound so that the piano sounds natural
               noteNode.gain!.gain.exponentialRampToValueAtTime(0.00001,
                  this.ctx.currentTime + cfg.decay);
               
               // stop playing
               noteNode.source!.stop(this.ctx.currentTime + cfg.decay);
            } catch (err) {
               console.log(err);
            }
         } else {
            throw new TypeError("noteNode is unexpectedly undefined.");
         }

         // return new length of array holding the playing samples for the note
         return this.samples[cfg.key].playing.length;
      } else {
         throw new ReferenceError(`Note index ${cfg.key} is currently not being played.`);
      }
   }
}