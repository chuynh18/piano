interface Song {
   tempo: number;
   loudness: number;
   beatsPerMeasure: number;
   defaultInstrument: Instrument;
   content: Beat[];
}

interface Beat {
   notes: Note[];
   tempo?: number;
   loudness?: number;
   brokenChord?: boolean;
}

interface ShortNote {
   note: string;
   duration: number;
   loudness?: number
   instrument?: Instrument
}

interface Note extends ShortNote {
   shortNotes?: ShortNote[]
}

enum Instrument {
   "REST",
   "TONE"
}