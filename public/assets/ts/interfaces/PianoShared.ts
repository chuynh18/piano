/**
 * Note configuration object.  Determines note to be played and volume of note.
 * @interface
 * @property  {number} key:  For a standard piano, use values from 1 to 88.
 * @property  {number} volume:  Use values ranging from 0 to 1, with 1 being loudest.
 * @property  {stirng} color:  The color to render an active key.
 * @property  {number} decay:  (optional) Amount of time in seconds that the note
 * should take to decay AFTER the note is no longer being played.  If no decay
 * is provided, the decay from Globals is used.
 * @property  {number} duration:  (optional) The duration of the note in seconds.
 * This corresponds to the type of the note (e.g. quarter, half, whole note).
 */
export interface NoteConfig {
   key: number;
   volume: number;
   color: string;
   decay?: number;
   duration?: number;
}

export enum Damper {
   None,
   Half,
   Full
}