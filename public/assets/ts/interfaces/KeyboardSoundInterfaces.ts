
export interface SoundSample {
   buffer: AudioBuffer | null;
   playing: PlayingSample[];
}

interface PlayingSample {
   source: AudioBufferSourceNode;
   gain: GainNode;
}

export interface NoteConfig {
   key: number;
   volume: number;
   
}