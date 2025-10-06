# Animated Perlin Noise

A lightweight, zero-dependency JavaScript library for generating deterministic, animated Perlin noise grids. Perfect for creating smooth, organic wave effects, terrain generation, and procedural animations.

## Features

- **Deterministic** - Same seed always produces the same result
- **Animated** - Smoothly transition between noise states by rotating gradient vectors
- **Zero dependencies** - Pure JavaScript implementation
- **Configurable** - Control resolution, grid size, and animation speed
- **Versatile** - Ideal for 3D waves, terrain, textures, and visual effects

## Installation

```bash
npm i perlin-noise-animated
```

## Demo

Here's what continuous animation looks like (incrementing `inc_amount` by 0.05 each frame):

![Animated Perlin Noise Example](https://github.com/hughwp/perlin-noise-animated/blob/main/Untitleddesign-ezgif.com-optimize.gif)

## Quick Start

```javascript
import generateNoiseGrid from 'perlin-noise-animated';

let seed = 92;
let inc_amount = 0;
let gridWidth = 20;
let gridHeight = 20;
let subDiv = 15;
let smooth = true;

// Generate initial noise grid
const noiseGrid = generateNoiseGrid(seed, inc_amount, gridWidth, gridHeight, subDiv, smooth);

// Animate by incrementing inc_amount each frame
function animate() {
  inc_amount += 0.05;
  const animatedGrid = generateNoiseGrid(seed, inc_amount, gridWidth, gridHeight, subDiv, smooth);
  
  // Use animatedGrid for rendering your visualization
  renderVisualization(animatedGrid);
  
  requestAnimationFrame(animate);
}

animate();
```

## API Reference

### `generateNoiseGrid(seed, inc_amount, gridWidth, gridHeight, subDiv, smooth)`

Generates a 2D array of Perlin noise values.

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `seed` | `number` | Any integer. Determines the initial random gradient vectors. Same seed = same base pattern. |
| `inc_amount` | `number` | Rotation angle (in degrees) applied to gradient vectors. Increment this value to animate the noise. |
| `gridWidth` | `number` | Number of grid points horizontally. More points = more variation in the pattern. |
| `gridHeight` | `number` | Number of grid points vertically. More points = more variation in the pattern. |
| `subDiv` | `number` | Subdivisions between grid points. Higher values = smoother, higher resolution output. |
| `smooth` | `boolean` | Apply smoothstep function to interpolation (recommended: `true`). |

#### Returns

Returns a 2D array of noise values:
- Type: `number[][]`
- Dimensions: `(gridHeight * subDiv) × (gridWidth * subDiv)`
- Value range: Typically between -1 and 1 (may vary slightly)

## Usage Examples

### 3D Wave Effect

```javascript
import generateNoiseGrid from 'perlin-noise-animated';

let seed = 42;
let time = 0;

```

### Canvas Visualization

```javascript
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let angle = 0;

function draw() {
  const noise = generateNoiseGrid(100, angle, 15, 15, 20, true);
  
  for (let y = 0; y < noise.length; y++) {
    for (let x = 0; x < noise[y].length; x++) {
      const value = (noise[y][x] + 1) / 2; // Normalize to [0, 1]
      const color = Math.floor(value * 255);
      
      ctx.fillStyle = `rgb(${color}, ${color}, ${color})`;
      ctx.fillRect(x * 2, y * 2, 2, 2);
    }
  }
  
  angle += 0.05;
  requestAnimationFrame(draw);
}

draw();
```

## How It Works

This library implements Ken Perlin's Perlin noise algorithm with an animation twist:

1. **Deterministic gradients**: A seeded random number generator creates consistent gradient vectors at grid points
2. **Interpolation**: Values between grid points are smoothly interpolated using subdivisions
3. **Animation**: Gradient vectors are rotated by `inc_amount` degrees, creating smooth transitions when incremented over time
4. **Seamless looping**: By cycling `inc_amount` from 0° to 360°, you can create perfectly looping animations

## Performance Considerations

- **Grid size**: Larger `gridWidth` and `gridHeight` create more complex patterns but increase computation
- **Subdivisions**: Higher `subDiv` values create smoother output but significantly increase array size and processing time
- **Output size**: The returned array has dimensions `(gridHeight × subDiv) × (gridWidth × subDiv)`

**Example**: `gridWidth=20, gridHeight=20, subDiv=15` produces a `300×300` array (90,000 values)

## Tips

- Start with smaller grids (10-20) and subdivisions (5-10) for testing
- For smooth animation, increment `inc_amount` by small values (0.01-0.1)
- Use the same `seed` for consistent base patterns across sessions
- Enable `smooth` parameter for better visual quality in most cases

## Credits

- Algorithm created by **Ken Perlin** (1983)
- Implementation and animation extension by the library author
- [Original Perlin Noise paper](https://mrl.cs.nyu.edu/~perlin/paper445.pdf)

