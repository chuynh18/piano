/**
 * Contains decoded audio sample and a queue of notes that are currently being played.
 * @interface
 * @property  {AudioBuffer | null} buffer:  Decoded audio data
 * @property  {NoteNode[]} playing:  Queue of notes that are currently being played.
 */
export interface SoundSample {
   buffer: AudioBuffer | null;
   playing: NoteNode[];
}

/**
 * The source and gain nodes of a note that is currently being played.
 * @interface
 * @property  {AudioBufferSourceNode | null} source
 * @property  {GainNode | null} gain?
 */
export interface NoteNode {
   source: AudioBufferSourceNode | null;
   gain: GainNode | null;
}