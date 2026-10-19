// The hero's four modes — one person, four ways of working. Each swaps the
// avatar pose (public/avatars/<pose>.webp), the site colour, the verb in the
// headline and one line of copy. Quotes are the originals from the old hero.

export type Mode = {
  id: "design" | "build" | "human" | "hack";
  label: string;
  verb: string;
  pose: string;
  quote: string;
  line: string; // trusted static copy; may contain <strong>
};

export const MODES: Mode[] = [
  {
    id: "design",
    label: "Designer",
    verb: "design",
    pose: "thinking",
    quote: "“okay… but why?”",
    line: "I sketch before I ship — interfaces, systems, and the small details that make software <strong>feel right</strong>.",
  },
  {
    id: "build",
    label: "Builder",
    verb: "build",
    pose: "building",
    quote: "“one more deploy.”",
    line: "Production AI agents at <strong>UBS</strong> (via TCS), and full-stack products on the side — used by <strong>15+ engineering teams</strong>.",
  },
  {
    id: "human",
    label: "Human",
    verb: "write about",
    pose: "notes",
    quote: "“wait. that’s interesting.”",
    line: "Chai, notebooks, and writing down what I learn — so the <strong>next person</strong> doesn’t have to learn it the hard way.",
  },
  {
    id: "hack",
    label: "Debugger",
    verb: "debug",
    pose: "details",
    quote: "“found the race condition.”",
    line: "I wrote an <strong>operating system</strong> in C and assembly to see how the machine really works. I still read the stack trace first.",
  },
];

export const MODE_MS = 4800;
