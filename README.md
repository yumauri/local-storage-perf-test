# `localStorage` performance impact test

This is a simple test page created to see how much of an impact `localStorage` has on the performance.

It uses [`effector`](https://github.com/effector/effector) and [`effector-storage`](https://github.com/yumauri/effector-storage).<br>
Related issue [#4](https://github.com/yumauri/effector-storage/issues/4)

## Test methodics

There is a canvas element on the page. Initially it is filled with 100 moving circles. Each circle's state is stored in a separate `effector` store. On each animation frame each circle moves in a random direction.

You can click on the canvas to add more circles. Each click adds 100 more circles.

Using "Rendering" tab in Chrome DevTools you can enable "Frame Rendering Stats" to see frame rate.

## Screenshots

| 50 circles                         | 2000 circles                       |
| ---------------------------------- | ---------------------------------- |
| <img src="./screenshots/fps1.png"> | <img src="./screenshots/fps2.png"> |

## Launching

Run page without using `localStorage`:

```
pnpm dev
```

Run page with using `persist` in memory (each circle's store state is persisted synchronously in memory):

```
pnpm dev-memory
```

Run page with using `localStorage` (each circle's store state is persisted synchronously to the `localStorage`):

```
pnpm dev-local
```

You can also run page without syncronization (`persist` will not add listeners to `'storage'` event), but I didn't saw any difference in performance with or without syncronization, so I didn't include it in the table below:

```
pnpm dev-local-nosync
```

## Results

On my MacBook Pro (13-inch, 2020)

- 2,3 GHz Quad-Core Intel Core i7
- 32 GB 3733 MHz LPDDR4X
- Intel Iris Plus Graphics 1536 MB

I got the following results (`↗` highest `↘` lowest, round to integer):

| circles | no `persist`  | `persist` in memory | `persist` in `localStorage` |
| ------- | ------------- | ------------------- | --------------------------- |
| 100     | `↗` 60 `↘` 59 | `↗` 60 `↘` 59       | `↗` 60 `↘` 59               |
| 200     | `↗` 60 `↘` 59 | `↗` 60 `↘` 59       | `↗` 58 `↘` 45               |
| 300     | `↗` 60 `↘` 59 | `↗` 60 `↘` 59       | `↗` 48 `↘` 43               |
| 400     | `↗` 60 `↘` 59 | `↗` 60 `↘` 59       | `↗` 39 `↘` 36               |
| 500     | `↗` 60 `↘` 59 | `↗` 60 `↘` 57       | `↗` 33 `↘` 30               |
| 600     | `↗` 60 `↘` 59 | `↗` 53 `↘` 50       | `↗` 30 `↘` 27               |
| 700     | `↗` 60 `↘` 59 | `↗` 49 `↘` 47       | `↗` 26 `↘` 22               |
| 800     | `↗` 60 `↘` 59 | `↗` 45 `↘` 43       | `↗` 23 `↘` 21               |
| 900     | `↗` 60 `↘` 57 | `↗` 42 `↘` 37       | `↗` 21 `↘` 19               |
| 1000    | `↗` 55 `↘` 50 | `↗` 39 `↘` 37       | `↗` 20 `↘` 18               |
| 1100    | `↗` 52 `↘` 48 | `↗` 36 `↘` 34       | `↗` 18 `↘` 16               |
| 1200    | `↗` 50 `↘` 45 | `↗` 34 `↘` 33       | `↗` 15 `↘` 13               |
| 1300    | `↗` 48 `↘` 44 | `↗` 32 `↘` 30       | `↗` 15 `↘` 13               |
| 1400    | `↗` 46 `↘` 42 | `↗` 31 `↘` 30       | `↗` 15 `↘` 13               |
| 1500    | `↗` 45 `↘` 40 | `↗` 29 `↘` 28       | `↗` 14 `↘` 13               |
| 1600    | `↗` 43 `↘` 40 | `↗` 27 `↘` 26       | `↗` 13 `↘` 13               |
| 1700    | `↗` 40 `↘` 38 | `↗` 26 `↘` 25       | `↗` 13 `↘` 12               |
| 1800    | `↗` 39 `↘` 36 | `↗` 25 `↘` 24       | `↗` 12 `↘` 12               |
| 1900    | `↗` 37 `↘` 33 | `↗` 24 `↘` 23       | `↗` 12 `↘` 12               |
| 2000    | `↗` 37 `↘` 32 | `↗` 22 `↘` 21       | `↗` 11 `↘` 10               |
