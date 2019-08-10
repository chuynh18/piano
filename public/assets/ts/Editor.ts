"use strict";

import { Song, Section, Track, Measure, Beat } from "./interfaces/Editor";
import { NoteConfig } from "./interfaces/PianoShared";

export class Editor {
   private songs: Song[] = [];
   private activeSong: number;

   public createSong(title: string, composer: string) {
      const song: Song = {
         title: title,
         composer: composer,
         sections: [],
         playback: []
      };

      this.songs.push(song);
      this.activeSong = this.songs.length - 1;
   }

   public selectSong(songIndex: number) {
      if (this.songs.length > songIndex && songIndex >= 0) {
         this.activeSong = songIndex;
      } else {
         throw new ReferenceError(`songIndex ${songIndex} out of bounds, must be less than ${this.songs.length} and greater than 0.`);
      }
   }

   public getSongList(): string[] {
      return this.songs.map((song: Song) => {
         return song.title;
      });
   }

   public loadSong = function(songIndex: number): Song {
      if (this.songs.length > songIndex && songIndex >= 0) {
         return this.songs[songIndex];
      } else {
         throw new ReferenceError(`songIndex ${songIndex} out of bounds, must be less than ${this.songs.length} and greater than 0.`);
      }
   }

   public createSectionAndTracks(name: string, rightTempo: number, leftTempo: number) {
      if (typeof this.activeSong === "number") {
         const section: Section = {
            name: name,
            tracks: [
               {
                  tempo: rightTempo,
                  color: "red",
                  measures: []
               },
               {
                  tempo: leftTempo,
                  color: "blue",
                  measures: []
               }
            ]
         };

         this.songs[this.activeSong].sections.push(section);
      } else {
         throw new TypeError(`Unexpected value of activeSong: ${this.activeSong}`);
      }
   }
}