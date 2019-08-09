/**
 * Song object.  Contains all data necessary to play back a piece of music.
 * @interface
 * @property  {string} title:  Title of the piece of music.
 * @property  {string} composer:  The composer's name.
 * @property  {Section[]} sections:  The sections that comprise the piece of music.
 * @property  {number[]} playback:  The indices of the sections to play back.
 * That is, if the song consists of sections 0 and 1, and each section is to be
 * repeated once, playback should be the array [0, 0, 1, 1].
 */
export interface Song {
   title: string;
   composer: string;
   sections: Section[];
   playback: number[];
}

/**
 * One section of a song.  Use sections to encapsulate distinct movements of a
 * piece or parts that will be repeated.
 */
export interface Section {
   name: string;
   tracks: Track[];
}

/**
 * One track of a section.  Used to denote the notes played by one hand.
 */
export interface Track {
   tempo: number;
   color: string;
   measures: Measure[];
}

/**
 * One measure.  Measures can have different tempos and number of beats to
 * capture syncopation or polyrhythms.
 */
export interface Measure {

}

/**
 * One distinct beat in a measure.  A beat is used to capture all the notes that
 * will be played at a point in time.
 */
export interface Beat {

}

/**
 * One note and all its associated data (volume and ornamentation).
 */
export interface Note {

}