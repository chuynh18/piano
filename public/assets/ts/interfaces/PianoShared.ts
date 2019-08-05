/**
 * Note configuration object.  Determines note to be played and volume of note.
 * @interface
 * @property  {number} key:  For a standard piano, use values from 0 to 87.
 * @property  {number} volume:  Use values ranging from 0 to 1.
 * @property  {number} decay:  Amount of time in seconds that the note should take to decay.
 */
export interface NoteConfig {
   key: number;
   volume: number;
   decay?: number;
}