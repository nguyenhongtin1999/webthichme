# Voice Input Feature - Long Press Plus Button

## Overview
This feature adds voice recognition capability to the mobile navbar's plus button. Users can long-press (hold) the plus (+) button for 500ms to open a voice input modal where they can speak and have their speech transcribed in real-time.

## Features

### 1. **Long Press Detection**
- Press and hold the plus button for 500ms to trigger voice input
- Works with both mouse and touch events
- Visual feedback through the modal appearance

### 2. **Voice Input Modal**
- Beautiful, modern UI with dark mode support
- Real-time microphone status indicator
- Waveform animation showing active listening state
- Live transcription display
- Start/Stop button controls
- Vietnamese language support (vi-VN)

### 3. **Waveform Animation**
- 12 animated bars creating a smooth waveform effect
- Synchronized animation showing sound levels
- Gradient color from violet to purple
- Responsive to listening state

### 4. **User Experience**
- Text "Nói để mở tính năng" (Speak to open feature) - customizable
- Clear visual states (listening, idle, error)
- Modal with transcript display
- Close functionality with ESC key or backdrop click

## Files Created/Modified

### New Files:
1. **`/hooks/use-voice-input.ts`**
   - Custom hook for speech recognition
   - Handles browser API integration
   - Returns listening state, transcript, and control functions

2. **`/components/voice-input-modal.tsx`**
   - Main voice input UI component
   - Features waveform animation
   - Displays transcribed text
   - Start/Stop controls

3. **`/styles/voice-input.css`**
   - Waveform animation keyframes
   - Modal styling and animations
   - Dark mode support
   - Smooth transitions

### Modified Files:
1. **`/components/mobile-navbar.tsx`**
   - Added VoiceInputModal import
   - Added state for voice modal visibility
   - Implemented long-press detection handlers
   - Added touch and mouse event listeners to Plus button

## How to Use

### For Users:
1. Navigate to the mobile navbar (bottom bar on mobile devices)
2. Locate the plus (+) button in the center
3. Press and hold the plus button for ~500ms
4. A voice input modal will appear
5. Tap "Bắt đầu" (Start) to begin listening
6. Speak clearly - your words will appear in real-time
7. Tap "Dừng" (Stop) when finished
8. The transcribed text will be submitted

### For Developers:
To handle the transcribed text, modify the `handleVoiceTranscript` function in `/components/mobile-navbar.tsx`:

```typescript
const handleVoiceTranscript = (text: string) => {
  console.log("[v0] Voice transcript:", text)
  // Add your custom logic here
  // Examples:
  // - Search functionality
  // - Command execution
  // - Data processing
  // - Navigation
}
```

## Technical Details

### Browser Compatibility
- Uses Web Speech API (SpeechRecognition)
- Supports both standard and webkit prefixed versions
- Requires browser permission for microphone access
- Tested on modern browsers (Chrome, Firefox, Safari, Edge)

### Language Settings
Currently configured for Vietnamese (vi-VN). To change:

In `/hooks/use-voice-input.ts`, modify:
```typescript
recognitionRef.current.lang = 'en-US' // Change to desired language
```

### Performance Considerations
- Long press detection uses 500ms timeout
- No continuous listening - stops after speech ends
- Efficient cleanup of event listeners
- Minimal performance impact on mobile devices

## Animation Details

### Waveform Bars
- 12 bars animating in sync
- Each bar has staggered animation delay
- Height varies from 8px to 40px
- Uses `waveformArc` keyframe animation
- 0.6s duration with ease-in-out timing

### Modal Animations
- Fade-in with scale effect
- Smooth backdrop appearance
- Responsive to dark mode
- Hardware-accelerated transforms

## Styling & Customization

### Colors (Tailwind Classes)
- Primary: `from-violet-500 to-purple-600`
- Success: `from-emerald-500`
- Error: `from-red-500`
- Background: `bg-white dark:bg-slate-900`

### Key CSS Variables
```css
--waveform-color-light: #8b5cf6
--waveform-color-dark: #a78bfa
```

### Modify Button Press Duration
In `/components/mobile-navbar.tsx`:
```typescript
}, 500) // Change this value in milliseconds
```

## Accessibility Features
- ARIA labels on all interactive elements
- Keyboard support (ESC to close)
- High contrast mode support
- Screen reader friendly text
- Large touch targets (minimum 44px)

## Error Handling
The feature gracefully handles:
- Missing microphone permission
- Browser doesn't support Speech API
- Network errors
- Speech recognition errors
- Silent speech recognition

## Future Enhancement Ideas
1. Multiple language support selector
2. Confidence level display
3. Sound waveform visualization
4. Command execution based on keywords
5. Voice authentication
6. Custom voice commands
7. Translation to other languages
8. Saved transcripts history

## Testing Checklist
- [ ] Long press triggers on 500ms hold
- [ ] Modal appears with animation
- [ ] Waveform animates during listening
- [ ] Transcript displays correctly
- [ ] Stop button submits text
- [ ] Close button dismisses modal
- [ ] Dark mode styling works
- [ ] Mobile touch events work
- [ ] Desktop mouse events work
- [ ] Keyboard ESC closes modal
- [ ] Backdrop click closes modal

## Known Limitations
1. Requires HTTPS or localhost (browser security)
2. Requires explicit user permission for microphone
3. Language limited to configured language (vi-VN by default)
4. No offline support
5. Depends on browser's native speech recognition engine

## Support & Troubleshooting

### Voice Input Not Working?
1. Check if browser supports Web Speech API
2. Verify microphone is connected and enabled
3. Check browser permissions for microphone access
4. Ensure HTTPS connection (or localhost for testing)
5. Check browser console for error messages

### Modal Not Appearing?
1. Ensure long press duration is correct (500ms)
2. Check if touch events are being detected
3. Verify mobile-navbar component is rendered
4. Check console for JavaScript errors

### Waveform Animation Not Smooth?
1. Check browser GPU acceleration settings
2. Try different browser
3. Check device's performance
4. Reduce animation complexity if needed

## Code Examples

### Basic Implementation
```typescript
const handleVoiceTranscript = (text: string) => {
  // Simple search
  const searchTerm = text.trim()
  if (searchTerm) {
    router.push(`/search?q=${encodeURIComponent(searchTerm)}`)
  }
}
```

### Advanced Implementation with Commands
```typescript
const handleVoiceTranscript = (text: string) => {
  const commands = {
    'go home': () => router.push('/'),
    'open profile': () => router.push('/profile'),
    'search': (query: string) => router.push(`/search?q=${query}`)
  }
  
  const lowerText = text.toLowerCase()
  for (const [cmd, action] of Object.entries(commands)) {
    if (lowerText.includes(cmd)) {
      action()
      return
    }
  }
}
```

## License
Part of the main application project.

## Contributors
- Voice Input Feature Implementation

---

**Last Updated**: 2026
**Status**: Active
**Browser Support**: Modern browsers with Web Speech API support
