/**
 * Persona 3 Reload clip library (Document 7), cut from the supplied recording
 * into 12 scene clips. The title/logo card was deliberately left out.
 *
 * Over-use prevention: each page draws from its own pool, and the client
 * (src/client/personal.js) always plays the least-shown clip next. Play
 * counts are kept in localStorage, so every clip gets roughly equal screen
 * time across a visit and no page repeats the clip you just saw.
 */
export const CLIP_BASE = '/media/p3r/';

export const CLIPS = {
  city:     { label: 'City walk' },
  skyline:  { label: 'Skyline' },
  streets:  { label: 'Streets' },
  gate:     { label: 'School gate' },
  highway:  { label: 'Highway' },
  lounge:   { label: 'Dorm lounge' },
  shrine:   { label: 'Shrine' },
  rooftop:  { label: 'Rooftop' },
  command:  { label: 'Command room' },
  moon:     { label: 'Full moon' },
  crimson:  { label: 'Crimson' },
  stance:   { label: 'Stance' },
};

/** Page pools. Every clip appears in at least two pools, and none in more than three. */
export const POOLS = {
  menu:     ['city', 'skyline', 'stance', 'moon', 'highway'],
  about:    ['rooftop', 'lounge', 'city', 'streets'],
  resume:   ['gate', 'command', 'skyline', 'crimson'],
  projects: ['shrine', 'crimson', 'moon', 'command'],
  socials:  ['lounge', 'highway', 'gate', 'rooftop', 'streets', 'shrine', 'stance'],
};
