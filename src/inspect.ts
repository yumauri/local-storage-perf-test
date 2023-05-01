import { inspect, inspectGraph } from "effector/inspect";

export let declarations = 0;

inspectGraph({
  fn: () => {
    declarations++;
  },
});

export let computations = 0;

let count = false;

export const start = () => {
  computations = 0;
  count = true;
};

export const stop = () => {
  if (count) console.log("computations count:", computations);
  count = false;
};

inspect({
  fn: () => {
    if (count) {
      computations++;
    }
  },
});
