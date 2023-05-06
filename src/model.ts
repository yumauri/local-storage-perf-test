import {
  createStore,
  createEvent,
  createEffect,
  sample,
  type Store,
} from "effector";
import { persist } from "effector-storage";
import { nil } from "effector-storage/nil";
import { persist as persistMemory } from "effector-storage/memory";
import { persist as persistLocal } from "effector-storage/local";

const NIL = /1|yes|true/i.test(import.meta.env.VITE_NIL);
const MEMORY = /1|yes|true/i.test(import.meta.env.VITE_MEMORY);
const LOCAL = /1|yes|true/i.test(import.meta.env.VITE_LOCAL);
const SYNC = LOCAL && !/0|no|false/i.test(import.meta.env.VITE_SYNC);
const TIMEOUT = (LOCAL && parseInt(import.meta.env.VITE_TIMEOUT)) || undefined;

console.log(
  "🧳 mode:",
  NIL ? "nil" : MEMORY ? "memory" : LOCAL ? "local" : "reference"
);
if (LOCAL) console.log("🔄 sync:", SYNC);
if (LOCAL) console.log("⏱ timeout:", TIMEOUT);

export type Dot = {
  x: number;
  y: number;
  r: number;
  dx: number;
  dy: number;
  color: string;
};

export const init = createEvent<{ w: number; h: number; r: number }>();
export const add = createEvent<{ w: number; h: number; r: number }>();
export const step = createEvent<number>();
export const dots: Store<Dot>[] = [];
export const count = createStore(100).on(add, (count) => count + 100);

count.watch((count) => {
  console.log("count: " + count);
});

const generate = createEffect<
  {
    w: number;
    h: number;
    r: number;
    count: number;
  },
  void
>(({ count, w, h, r }) => {
  for (let i = dots.length; i < count; i++) {
    const dot = newDot({ w, h, r });
    dots.push(dot);

    // use `nil` adapter
    if (NIL) {
      persist({
        store: dot,
        key: `dot-${i}`,
        adapter: nil({ keyArea: "nil" }),
      });
    }

    // use `memory` adapter
    else if (MEMORY) {
      persistMemory({ store: dot, key: `dot-${i}` });
    }

    // use `local` adapter
    else if (LOCAL) {
      persistLocal({
        store: dot,
        key: `dot-${i}`,
        sync: SYNC,
        timeout: TIMEOUT ? TIMEOUT + Math.random() * 30 - 15 : undefined,
      });
    }
  }
});

sample({
  clock: [init, add],
  source: count,
  fn: (count, payload) => ({ count, ...payload }),
  target: generate,
});

function newDot({ w, h, r }: { w: number; h: number; r: number }) {
  let speed = 5;
  let dx = Math.random() * 2 * speed - speed;
  let dy = Math.sqrt(speed * speed - dx * dx) * (Math.random() > 0.5 ? 1 : -1);

  const dot = createStore<Dot>({
    x: r + Math.random() * (w - r * 2),
    y: r + Math.random() * (h - r * 2),
    r,
    dx,
    dy,
    color: "#" + Math.floor(Math.random() * 16777215).toString(16),
  }).on(step, (dot, _now) => {
    let x = dot.x + dot.dx;
    let y = dot.y + dot.dy;
    let dx = dot.dx;
    let dy = dot.dy;
    if (x < r || x > w - r) {
      dx = -dx;
      x = x < r ? r : w - r;
    }
    if (y < r || y > h - r) {
      dy = -dy;
      y = y < r ? r : h - r;
    }
    return { ...dot, x, y, dx, dy };
  });

  return dot;
}
