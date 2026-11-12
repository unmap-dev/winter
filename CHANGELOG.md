# @unmap/app-winter

## 0.0.11

### Patch Changes

- @unmap/sdk@0.31.0
- @unmap/maps@0.31.0
- @unmap/deck@0.31.0

## 0.0.10

### Patch Changes

- Updated dependencies [8e01899]
  - @unmap/maps@0.30.0
  - @unmap/sdk@0.30.0
  - @unmap/deck@0.30.0

## 0.0.9

### Patch Changes

- Updated dependencies [e90aac5]
- Updated dependencies [c8c5df8]
  - @unmap/sdk@0.29.0
  - @unmap/maps@0.29.0
  - @unmap/deck@0.29.0

## 0.0.8

### Patch Changes

- @unmap/maps@0.28.0
- @unmap/sdk@0.28.0
- @unmap/deck@0.28.0

## 0.0.7

### Patch Changes

- Updated dependencies [ad2f498]
  - @unmap/sdk@0.27.0
  - @unmap/maps@0.27.0
  - @unmap/deck@0.27.0

## 0.0.6

### Patch Changes

- Updated dependencies [0f8a382]
  - @unmap/sdk@0.26.0
  - @unmap/maps@0.26.0
  - @unmap/deck@0.26.0

## 0.0.5

### Patch Changes

- 8bbc931: Turning on 3D lifts no longer rebuilds the map in an endless loop. The ski-resort-explorer block
  handed the map a new options object on every render, and the map is rebuilt whenever that object
  changes; `skiMapOptions` now returns the same object for the same `lifts3d`, in both the React and
  Vue lanes.

## 0.0.4

### Patch Changes

- @unmap/sdk@0.25.1
- @unmap/maps@0.25.1
- @unmap/deck@0.25.1

## 0.0.3

### Patch Changes

- @unmap/sdk@0.25.0
- @unmap/maps@0.25.0
- @unmap/deck@0.25.0

## 0.0.2

### Patch Changes

- Updated dependencies [bd414cc]
- Updated dependencies [122faf6]
  - @unmap/deck@0.24.0
  - @unmap/sdk@0.24.0
  - @unmap/maps@0.24.0

## 0.0.1

- First release: every ski area in Canada on the winter style in 3D, search, province and
  activity filters, area pages, 3D lift cables, shareable links, English and French.
