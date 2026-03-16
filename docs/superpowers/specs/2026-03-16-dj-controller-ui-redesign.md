# DJ Controller UI Redesign Specification
**Date:** March 16, 2026
**Project:** DropZone DJ Mixing App
**Status:** Approved for Implementation

## Overview

Transform the DropZone web UI from basic horizontal sliders to a professional DJ controller interface inspired by Pioneer DDJ hardware. The redesign uses stylized 3D hardware aesthetics with rotary knobs, vertical faders, realistic jog wheels, and LED-style performance pads.

## Design Requirements

### Visual Fidelity
- **Style:** Stylized hardware with clean 3D look (not photorealistic)
- **Depth:** Subtle shadows, gradients, and depth cues
- **Aesthetic:** Recognizable as DJ hardware without heavy textures

### Layout Approach
- **Adaptation:** Match reference control types but adapt to current 3-column grid (Deck A | Mixer | Deck B)
- **Controls:** Rotary knobs for EQ/effects, vertical faders for volume/crossfader, large jog wheels, 8 performance pads per deck

### Responsive Design
- **Desktop (>1024px):** Full hardware interface optimized for large screens
- **Tablet/Mobile (<1024px):** Simplified view with message: "Desktop browser recommended for full DJ controller experience"

## Architecture

### Component Refactoring Strategy

**Phase 1: Fix Component Composition**
- Refactor [Deck.tsx](../../web/src/components/Deck/Deck.tsx):
  - Remove inline jog wheel (lines 62-69) and import/use [JogWheel.tsx](../../web/src/components/Deck/JogWheel.tsx)
  - Remove inline waveform placeholder (lines 57-60) and import/use [Waveform.tsx](../../web/src/components/Deck/Waveform.tsx)
  - Expand performance pads from 4 to 8 (4×2 grid)
- Refactor [Mixer.tsx](../../web/src/components/Mixer/Mixer.tsx):
  - Remove inline EQ knobs (lines 36-78, 86-128) and import/use [ChannelStrip.tsx](../../web/src/components/Mixer/ChannelStrip.tsx) × 2 (Deck A/B)
    - Note: Current Mixer.tsx doesn't have per-channel volume faders, but ChannelStrip.tsx needs to include one (added in Phase 2)
  - Remove inline crossfader (lines 133-153) and import/use [Crossfader.tsx](../../web/src/components/Mixer/Crossfader.tsx)
    - Note: Crossfader remains horizontal (not vertical), just styled with hardware aesthetics
  - Remove inline effects buttons (lines 175-187) and import/use [EffectsRack.tsx](../../web/src/components/Mixer/EffectsRack.tsx)
- All duplicate inline implementations must be removed

**Phase 2: Create Shared Hardware Components**
```
web/src/components/shared/
├── RotaryKnob.tsx       # Reusable rotary knob with mouse tracking
├── VerticalFader.tsx    # Reusable vertical slider
└── PerformancePad.tsx   # Reusable LED-style button
```

**Phase 3: Apply Hardware Styling**
- Enhance existing dedicated components with 3D hardware aesthetics
- Use shared hardware components where appropriate

### Final Component Hierarchy
```
DJController.tsx (3-column layout container)
├── Deck.tsx
│   ├── JogWheel.tsx (enhanced 240px with 3D styling)
│   ├── PerformancePads (8-pad grid, 4x2)
│   ├── Waveform.tsx
│   └── Transport buttons (Play/Cue/Sync)
├── Mixer.tsx
│   ├── ChannelStrip.tsx × 2 (Deck A/B)
│   │   ├── RotaryKnob × 3 (High/Mid/Low EQ)
│   │   └── VerticalFader (channel volume)
│   ├── Crossfader.tsx (horizontal track, vertical aesthetic)
│   ├── VerticalFader (master volume)
│   └── EffectsRack.tsx
│       └── RotaryKnob × 4 (Reverb/Delay/Filter/Echo)
```

## Component Specifications

### RotaryKnob Component
**File:** `web/src/components/shared/RotaryKnob.tsx`

**Props:**
```typescript
interface RotaryKnobProps {
  value: number;           // Current value
  min: number;             // Minimum value
  max: number;             // Maximum value
  onChange: (value: number) => void;
  label: string;           // Display label
  color?: 'cyan' | 'orange' | 'purple';  // Brand color (default: 'purple')
  unit?: string;           // Display unit (dB, %, etc.)
  defaultValue?: number;   // Initial value if value is undefined
}
```

**Note on Color Prop:** Use literal color values (e.g., `color="cyan"`) rather than dynamic Tailwind classes to ensure JIT compilation works. Component will map color string to full Tailwind class names internally.

**Behavior:**
- Click + drag circular motion to rotate
- Calculate angle from mouse position relative to center
- Map angle (0-270°) to value range (min-max)
- Display current value below knob

**Visual Design:**
- Size: 60px diameter
- Base circle: `bg-gradient-to-br from-gray-700 to-gray-900`
- Border: `border-2 border-gray-600`
- Shadow: `shadow-lg shadow-black/50`
- Indicator line: white 2px line from center to edge at current angle
- Center cap: 20px circle `bg-gradient-to-b from-gray-600 to-gray-800`
- Label: `text-xs text-gray-300` above knob
- Value: `text-xs text-{color}-400` below knob

### VerticalFader Component
**File:** `web/src/components/shared/VerticalFader.tsx`

**Props:**
```typescript
interface VerticalFaderProps {
  value: number;           // 0-1 range
  onChange: (value: number) => void;
  label: string;
  color?: 'cyan' | 'orange' | 'purple';  // Brand color (default: 'purple')
  height?: number;         // Pixel height (default 120px)
}
```

**Implementation Approach (Recommended):**
Use custom div with mouse Y-tracking for precise control and consistent styling across browsers.

**Alternative:** CSS-rotated `<input type="range">` with `transform: rotate(-90deg)` works but has browser-specific styling issues (Chrome, Firefox, Safari handle range inputs differently). Custom div approach is more maintainable.

**Visual Design:**
- Track: 8px wide, `height` tall
- Track background: `bg-gradient-to-b from-black to-gray-900 shadow-inner`
- Track border: `border border-gray-600 rounded-full`
- Fill: Gradient from bottom showing level (`bg-gradient-to-t from-{color}-500 to-{color}-300`)
- Handle: 24px rounded cap at current position
  - `bg-gradient-to-b from-gray-600 to-gray-800`
  - `shadow-lg shadow-black/50`
  - `border-2 border-gray-500`

### PerformancePad Component
**File:** `web/src/components/shared/PerformancePad.tsx`

**Props:**
```typescript
interface PerformancePadProps {
  label: string | number;  // Pad label (1-8)
  active: boolean;         // Active state (hot cue loaded)
  onClick: () => void;
  color: 'cyan' | 'orange';  // Deck color
  index: number;           // Pad index (0-7) for state management
}
```

**State Management:**
Performance pad active states will be added to Redux `decksSlice.ts`:
```typescript
// Add to DeckState interface (web/src/store/decksSlice.ts)
hotCues: boolean[];  // Array of 8 booleans for pad active states

// Update initialDeckState
const initialDeckState: DeckState = {
  // ... existing fields
  hotCues: Array(8).fill(false),  // NEW: Initialize 8 pads to inactive
};

// Add action
toggleHotCue: (state, action: PayloadAction<{ deck: 'A' | 'B', index: number }>) => {
  const deckState = action.payload.deck === 'A' ? state.deckA : state.deckB;
  deckState.hotCues[action.payload.index] = !deckState.hotCues[action.payload.index];
}
```

**Visual Design - Inactive:**
- Background: `bg-gray-800`
- Border: `border border-gray-700`
- Text: `text-gray-500`
- Size: Square button, responsive to grid

**Visual Design - Active:**
- Background: `bg-{color}-600`
- Border: `border-2 border-{color}-400`
- Text: `text-white font-bold`
- Shadow: LED glow effect (implementation note: map color prop to shadow class)
  - cyan: `shadow-[0_0_15px_rgba(6,182,212,0.6)]`
  - orange: `shadow-[0_0_15px_rgba(249,115,22,0.6)]`
- Transform: `scale-95` on press

**Color Mapping Logic (Required):**
```tsx
const getShadowClass = (color: 'cyan' | 'orange') => {
  return color === 'cyan'
    ? 'shadow-[0_0_15px_rgba(6,182,212,0.6)]'
    : 'shadow-[0_0_15px_rgba(249,115,22,0.6)]';
};
```

**Hover State:**
- Background: `bg-gray-700` (inactive) or `bg-{color}-500` (active)
- Cursor: pointer

### JogWheel Enhancement
**File:** `web/src/components/Deck/JogWheel.tsx` (existing - enhance)

**Current Implementation:**
- Already has rotation and scratch logic
- Currently 160px placeholder

**Enhancements Needed:**
- Increase size to 240px diameter
- Add concentric ring structure:
  - Outer rim (20px width): Touch ring for pitch bend
  - Middle ring (40px width): Platter edge with tick marks
  - Center platter (140px diameter): Scratch surface
- Metallic gradients: `bg-gradient-to-br from-gray-700 via-gray-600 to-gray-800`
- Rotation indicator: White 4px mark at 12 o'clock, rotates with wheel
- Center label: Deck letter (A/B) in center
- Shadows: `shadow-2xl shadow-black/70` for depth
- Border: `border-4 border-gray-600`

**Interaction Zones:**
Two distinct touch zones detected via mouse/touch position relative to center:

1. **Outer Ring (radius > 100px from center):**
   - Action: Temporary pitch bend (±8%)
   - Behavior: Only active during touch/drag, returns to 0% on release
   - Implementation: Calculate distance from center, if > 100px, trigger pitch bend based on rotation speed

2. **Center Platter (radius ≤ 100px from center):**
   - Action: Scratch with inertia
   - Behavior: Drag to scratch, release continues with momentum decay
   - Implementation: Track rotation angle, calculate velocity, apply decay factor

**Zone Detection:**
```typescript
// Jog wheel radius = 120px (240px diameter ÷ 2)
// Center platter radius = 70px (140px diameter ÷ 2)
const distanceFromCenter = Math.sqrt(
  Math.pow(mouseX - centerX, 2) + Math.pow(mouseY - centerY, 2)
);
const isCenterPlatter = distanceFromCenter <= 70;  // Center scratch area
const isOuterRing = distanceFromCenter > 70 && distanceFromCenter <= 120;  // Pitch bend ring
```

## Layout Specifications

### Deck Layout (Adapted from Reference)
```
+----------------------------+
| DECK A                  ● |  ← Header with play indicator
|----------------------------|
| Track Name                 |
| Artist                     |
| 128 BPM | Cm               |  ← Track info (3 lines)
|----------------------------|
| [═══════════WAVEFORM═════] |  ← Waveform (existing component)
|----------------------------|
|                            |
|      [Jog Wheel 240px]     |  ← Large centered jog wheel
|                            |
|----------------------------|
| [Pad] [Pad] [Pad] [Pad]    |
| [Pad] [Pad] [Pad] [Pad]    |  ← 8 performance pads (4×2)
|----------------------------|
| [▶ PLAY] [CUE] [SYNC]      |  ← Transport controls
+----------------------------+
```

### Mixer Layout (Adapted from Reference)
```
+----------------------------+
|          MIXER             |
|----------------------------|
| DECK A      |    DECK B    |
|-------------|--------------|
|   [Knob]    |    [Knob]    |  ← HIGH EQ
|    HIGH     |     HIGH     |
|   [Knob]    |    [Knob]    |  ← MID EQ
|     MID     |      MID     |
|   [Knob]    |    [Knob]    |  ← LOW EQ
|     LOW     |      LOW     |
|             |              |
|   [Fader]   |   [Fader]    |  ← Channel volume (120px tall)
|      ║      |       ║      |
|      ║      |       ║      |
|----------------------------|
| A [═══╬═══] B              |  ← Crossfader (horizontal)
|----------------------------|
|        [Fader]             |  ← Master volume (120px tall)
|           ║                |
|           ║                |
|----------------------------|
|           FX               |
| [Knob] [Knob]              |  ← Effects knobs
| REVERB  DELAY              |
| [Knob] [Knob]              |
| FILTER  ECHO               |
+----------------------------+
```

### DJController Layout (3-Column Grid)
```
+----------------------------------------------------------+
| Mode: MIX                                                |
+----------------------------------------------------------+
|                                                          |
|  +--------------+  +--------------+  +--------------+    |
|  |   DECK A     |  |    MIXER     |  |   DECK B     |    |
|  |              |  |              |  |              |    |
|  | (See Deck    |  | (See Mixer   |  | (See Deck    |    |
|  |  layout)     |  |  layout)     |  |  layout)     |    |
|  |              |  |              |  |              |    |
|  +--------------+  +--------------+  +--------------+    |
|                                                          |
+----------------------------------------------------------+
| DropZone - Professional DJ Mixing                       |
+----------------------------------------------------------+
```

## Styling System

### Color Palette

**Hardware Surfaces:**
- Panel background: `bg-gradient-to-b from-gray-800 via-gray-900 to-black`
- Control surfaces: `bg-gradient-to-br from-gray-700 to-gray-900`
- Metallic accents: `from-gray-600 via-gray-700 to-gray-800`
- Borders: `border-gray-600`
- Recessed areas: `bg-black shadow-inner`

**Brand Colors (unchanged):**
- Deck A: `cyan-400`, `cyan-500`, `cyan-300`
- Deck B: `orange-400`, `orange-500`, `orange-300`
- Mixer: `purple-400`, `purple-500`, `purple-300`

**Text:**
- Labels: `text-gray-300` with optional `text-shadow: 0 1px 2px rgba(0,0,0,0.5)` for embossed effect
- Values: `text-{color}-400` (cyan/orange/purple depending on context)
- Headings: `text-{color}-400 font-bold uppercase tracking-wider`

### Depth & Shadow System

**Raised Elements (buttons, knobs, handles):**
```css
shadow-lg shadow-black/50
border border-gray-600
bg-gradient-to-b from-gray-600 to-gray-800
```

**Recessed Elements (tracks, wells):**
```css
shadow-inner
bg-gradient-to-b from-black to-gray-900
border border-gray-700
```

**LED Glow Effects:**
```css
/* Cyan glow */
shadow-[0_0_15px_rgba(6,182,212,0.6)]

/* Orange glow */
shadow-[0_0_15px_rgba(249,115,22,0.6)]

/* Purple glow */
shadow-[0_0_15px_rgba(168,85,247,0.6)]
```

**Deep Hardware Shadow (jog wheels, large elements):**
```css
shadow-2xl shadow-black/70
```

## Responsive Behavior

### Desktop (>1024px)
- Full 3-column layout (Deck A | Mixer | Deck B)
- All hardware controls at full size
- Jog wheels: 240px diameter
- Vertical faders: 120px tall
- Rotary knobs: 60px diameter

### Tablet (768px - 1024px)
**Layout:** 2-column stacked
```
Row 1: [Deck A] [Deck B]
Row 2: [Mixer (full width)]
```

**Tailwind Implementation:**
```tsx
<div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-6">
  <div className="md:col-span-1 lg:order-1">{/* Deck A */}</div>
  <div className="md:col-span-2 lg:col-span-1 lg:order-2">{/* Mixer - center column on desktop, full width on tablet */}</div>
  <div className="md:col-span-1 lg:order-3">{/* Deck B */}</div>
</div>
```

**Reduced Control Sizes (Tailwind Responsive Classes):**
- Jog wheels: `w-60 h-60 md:w-45 md:h-45 lg:w-60 lg:h-60` (240px → 180px on tablet)
- Vertical faders: `h-30 md:h-25 lg:h-30` (120px → 100px on tablet)
- Rotary knobs: `w-15 h-15 md:w-12.5 md:h-12.5 lg:w-15 lg:h-15` (60px → 50px on tablet)
- Performance pads: Maintain 4×2 grid, use responsive padding/gap classes

### Mobile (<768px)
**Component:** Create `web/src/components/MobileFallback/MobileFallback.tsx`

**Display:**
- Centered card with desktop recommendation message
- Basic playback controls only (play/pause per deck, master volume)
- Link to desktop version with QR code (future enhancement)

**Conditional Rendering in DJController.tsx:**
```tsx
import { useState, useEffect } from 'react';

const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

useEffect(() => {
  const handleResize = () => setIsMobile(window.innerWidth < 768);
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);

return isMobile ? (
  <MobileFallback />
) : (
  <div className="grid grid-cols-1 lg:grid-cols-3 ...">
    {/* Full DJ controller */}
  </div>
);
```

**MobileFallback Controls:**
- Deck A: Play/Pause button (reads `state.decks.deckA.isPlaying`, dispatches `togglePlayPause('A')`)
- Deck B: Play/Pause button (reads `state.decks.deckB.isPlaying`, dispatches `togglePlayPause('B')`)
- Master Volume: Horizontal slider (reads `state.mixer.masterVolume`, dispatches `setMasterVolume(value)`)
- Message: "🎧 Desktop Browser Recommended - For the full DJ controller experience, please open DropZone on a desktop or laptop."

**Redux Integration Example:**
```tsx
import { useSelector, useDispatch } from 'react-redux';
import { togglePlayPause } from '../../store/decksSlice';
import { setMasterVolume } from '../../store/mixerSlice';
import type { RootState } from '../../store';

const MobileFallback: React.FC = () => {
  const dispatch = useDispatch();
  const deckAPlaying = useSelector((state: RootState) => state.decks.deckA.isPlaying);
  const deckBPlaying = useSelector((state: RootState) => state.decks.deckB.isPlaying);
  const masterVolume = useSelector((state: RootState) => state.mixer.masterVolume);
  // ... component implementation
};
```

## Implementation Details

### Mouse Tracking for Rotary Knobs

**Algorithm:**
1. On mousedown:
   - Start tracking (`isDragging = true`)
   - Record initial mouse position
   - Add document-level mousemove and mouseup listeners

2. On mousemove (if isDragging):
   - Calculate raw angle: `atan2(mouseY - centerY, mouseX - centerX)` (radians, -π to π)
   - Convert to degrees: `degrees = (angle * 180 / Math.PI + 360) % 360`
   - Offset to start at 12 o'clock (top): `adjustedAngle = (degrees + 90) % 360`
   - Map 135° (bottom-left) to 45° (bottom-right) as 0-270° usable range
     - If adjustedAngle between 135° and 360°: `usableAngle = adjustedAngle - 135`
     - If adjustedAngle between 0° and 45°: `usableAngle = adjustedAngle + 225`
     - Else: clamp to nearest edge (0° or 270°)
   - Map to value: `value = min + (usableAngle / 270) * (max - min)`
   - Call onChange with clamped value

3. On mouseup OR mouseleave (from document):
   - Stop tracking (`isDragging = false`)
   - Remove document-level listeners
   - Persist final value

4. Component cleanup (useEffect return):
   - Remove document-level listeners if component unmounts while dragging

**Angle Convention:**
- 0° (12 o'clock / top) = minimum value
- 270° (clockwise rotation to 9 o'clock) = maximum value
- 90° gap at bottom (between 4:30 and 7:30) is inactive zone

**Edge Cases:**
- Clamp values to min/max range before calling onChange
- Prevent NaN from division by zero (check `max !== min`)
- Mouse leaves browser window during drag: Document-level mouseup listener catches this
- Touch events: Use same algorithm with touchmove/touchend events
- Memory leak prevention: Cleanup listeners in useEffect return function

### State Management

**Existing Redux State (no changes):**
- `store/decksSlice.ts`: Deck A/B state (track, isPlaying, cuePoint, etc.)
- `store/mixerSlice.ts`: EQ, volume, crossfader, effects
- `store/uiSlice.ts`: UI mode

**Component State (local):**
- RotaryKnob: `isDragging`, `dragStartAngle`
- VerticalFader: `isDragging`
- JogWheel: `isSpinning`, `rotationVelocity`, `lastTouchTime`

### Browser Compatibility

**Required Features:**
- CSS transforms (rotate)
- CSS gradients
- Box shadows
- Mouse events (mousedown, mousemove, mouseup)

**Fallback:**
- All modern browsers support these features
- No fallback needed (desktop-only, modern browser assumed)

### Performance Considerations

**Optimization Strategies:**
- Use `transform: rotate()` instead of re-rendering SVG (GPU accelerated)
- Throttle mouse move events to 60fps max
- Use `will-change: transform` for animated elements
- Memoize components that don't change often (track info, labels)

**Performance Targets:**
- Jog wheel rotation: 60fps smooth
- Knob dragging: No visual lag
- Pad button press: Instant feedback (<50ms)

## Testing Strategy

### Visual Regression Testing
- Take screenshots of current UI
- Take screenshots after redesign
- Compare layouts, colors, spacing

### Interaction Testing
**Rotary Knobs:**
- Drag in circle → value changes smoothly
- Release → value persists
- Edge values (min/max) → clamps correctly

**Vertical Faders:**
- Drag up/down → value changes
- Click on track → jumps to position
- Mouse leave during drag → continues tracking or stops gracefully

**Jog Wheels:**
- Center drag → scratches track
- Outer ring touch → pitch bend
- Spin gesture → continues with momentum

**Performance Pads:**
- Click → toggles active state
- Active → LED glow visible
- Multiple pads → independent states

### Redux Integration Testing
- Control changes → Redux state updates
- Redux state changes → UI reflects updates
- Multiple controls → no state conflicts

### Responsive Testing
- Desktop (1920×1080): Full layout
- Laptop (1440×900): Full layout, scaled down
- Tablet (1024×768): Stacked layout
- Mobile (375×667): "Desktop recommended" message

### Browser Compatibility Testing
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Error Handling

### Mouse Tracking Errors
- Division by zero in angle calculation → clamp to safe value
- Mouse leaves window during drag → stop tracking on mouseup
- Touch events on desktop → fall back to mouse events

### Value Validation
- All control values clamped to min/max range
- NaN or undefined values → reset to default (0 or center position)
- Redux dispatch failures → log error, maintain local state

### Rendering Errors
- Component mount failures → show fallback UI
- Missing props → use default values
- CSS not loaded → basic functional controls (no styling)

## Deployment Strategy

**Environment:** Render Cloud (auto-deploy from GitHub main branch)

**Workflow:**
1. Develop changes locally in `/Users/I870089/dropzone/web/src/components/`
2. Test build: `npm run build` (optional, catch errors early)
3. Commit: `git add . && git commit -m "description"`
4. Deploy: `git push origin main`
5. Render auto-deploys in ~2 minutes
6. Test on production: https://dropzone-dashboard.onrender.com

**Rollback Plan:**
- If critical UI bugs: `git revert <commit-hash> && git push`
- Render auto-deploys the revert

## Success Criteria

### Visual Quality
- [ ] Rotary knobs look like DJ hardware (circular, 3D depth)
- [ ] Vertical faders have proper track and handle styling
- [ ] Jog wheels are large (240px), metallic, with rotation indicator
- [ ] Performance pads have LED glow effect when active
- [ ] Overall aesthetic matches "stylized DJ hardware"

### Functionality
- [ ] All controls respond smoothly to mouse input
- [ ] Redux state updates correctly from UI interactions
- [ ] UI reflects Redux state changes
- [ ] No performance issues (60fps for animations)
- [ ] Jog wheel zone detection works (outer ring vs center platter)
- [ ] Performance pads toggle active state (8 per deck)
- [ ] EQ knobs use correct range (-12 to +12 dB) with unit label
- [ ] Responsive layout works: Desktop (3-col) → Tablet (2-col stacked) → Mobile (fallback)

### Code Quality
- [ ] No duplicate inline implementations (use dedicated components)
- [ ] Shared components (RotaryKnob, VerticalFader, PerformancePad) are reusable
- [ ] Component props are typed with TypeScript interfaces (see TypeScript Types section)
- [ ] Code follows existing project patterns
- [ ] Tailwind color classes use literal values (not dynamic interpolation)

### User Experience
- [ ] Desktop users see professional DJ controller interface
- [ ] Mobile users see helpful MobileFallback component with basic controls
- [ ] All controls are intuitive (no learning curve for DJ hardware users)
- [ ] Visual feedback on all interactions (hover, active states)

## TypeScript Types

**Existing Types (reference only, do not modify):**
- `RootState` - Redux store type from `store/index.ts`
- `DeckState` - Deck state interface from `store/decksSlice.ts`
- `MixerState` - Mixer state interface from `store/mixerSlice.ts`

**New Types to Add:**

```typescript
// In store/decksSlice.ts
interface DeckState {
  // ... existing fields
  hotCues: boolean[];  // NEW: 8 hot cue active states
}

// In components/shared/RotaryKnob.tsx
interface RotaryKnobProps {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  label: string;
  color?: 'cyan' | 'orange' | 'purple';
  unit?: string;
  defaultValue?: number;
}

// In components/shared/VerticalFader.tsx
interface VerticalFaderProps {
  value: number;
  onChange: (value: number) => void;
  label: string;
  color?: 'cyan' | 'orange' | 'purple';
  height?: number;
}

// In components/shared/PerformancePad.tsx
interface PerformancePadProps {
  label: string | number;
  active: boolean;
  onClick: () => void;
  color: 'cyan' | 'orange';
  index: number;
}

// In components/MobileFallback/MobileFallback.tsx
interface MobileFallbackProps {
  // No props needed - reads from Redux
}
```

## References

- Current UI files: `/Users/I870089/dropzone/web/src/components/`
- Redux state: `/Users/I870089/dropzone/web/src/store/`
- Deployment: `https://dropzone-dashboard.onrender.com`
- Design inspiration: Pioneer DDJ DJ controller (reference image provided)

## Timeline Estimate

**Phase 1 (Refactoring):** 1-2 hours
- Update Deck.tsx and Mixer.tsx to use dedicated components

**Phase 2 (Shared Components):** 2-3 hours
- Create RotaryKnob, VerticalFader, PerformancePad components

**Phase 3 (Styling):** 3-4 hours
- Apply hardware aesthetics to all components
- Enhance JogWheel with 3D styling

**Phase 4 (Testing & Polish):** 1-2 hours
- Test interactions, fix bugs, responsive behavior

**Total:** 7-11 hours development time

**Render Deploy:** ~2 minutes per commit

---

*This specification serves as the source of truth for the DJ Controller UI redesign. All implementation work should follow this design.*
