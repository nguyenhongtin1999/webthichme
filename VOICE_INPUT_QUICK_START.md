# Voice Input Feature - Quick Start Guide 🎤

## 🚀 Get Started in 30 Seconds

### For End Users:
1. **Find** the plus (+) button in the mobile navbar (bottom center)
2. **Hold** the button for ~0.5 seconds
3. **Wait** for the voice modal to appear
4. **Click** "Bắt đầu" (Start) button
5. **Speak** clearly into your device's microphone
6. **Watch** your words appear in real-time with waveform animation
7. **Click** "Dừng" (Stop) when done

That's it! ✨

---

## 🔧 For Developers

### What's New?
- ✅ Long-press detection on Plus button (500ms)
- ✅ Voice input modal with waveform animation
- ✅ Real-time speech transcription
- ✅ Dark mode support
- ✅ Vietnamese language support
- ✅ Fully customizable

### Files You Need to Know About:

| File | Purpose |
|------|---------|
| `hooks/use-voice-input.ts` | Speech recognition logic |
| `components/voice-input-modal.tsx` | Main UI component |
| `styles/voice-input.css` | Animations & styling |
| `components/mobile-navbar.tsx` | Integration point |

### Quick Integration Checklist:

- [x] Import VoiceInputModal
- [x] Add state variables
- [x] Implement long-press handlers
- [x] Attach event listeners
- [x] Add transcript callback

✅ **Already integrated in mobile-navbar.tsx!**

---

## 💡 Customize the Feature

### Change Long Press Duration:
```typescript
// In mobile-navbar.tsx, change this value (in milliseconds):
}, 500) // ← Change this number
```
- `300` = Very fast
- `500` = Default (half second)
- `1000` = One full second

### Change Language:
```typescript
// In use-voice-input.ts, change this line:
recognitionRef.current.lang = 'vi-VN' // ← Change language code
// Examples: 'en-US', 'fr-FR', 'es-ES', 'de-DE', 'zh-CN'
```

### Handle the Transcribed Text:
```typescript
// In mobile-navbar.tsx, modify this function:
const handleVoiceTranscript = (text: string) => {
  // Your custom logic here!
  console.log('User said:', text)
  
  // Example: Search
  // router.push(`/search?q=${text}`)
  
  // Example: Execute commands
  // if (text.includes('home')) router.push('/')
}
```

---

## 🎨 Customize the Look

### Change Colors:
Edit `/styles/voice-input.css`:
```css
/* Waveform color */
background: linear-gradient(180deg, #8b5cf6 0%, #c4b5fd 100%);
     /* ↑ Change these color codes */
```

### Change Animation Speed:
In `/styles/voice-input.css`:
```css
animation: waveform 0.6s ease-in-out; /* ← Change 0.6s */
/* 0.3s = Fast, 0.6s = Medium, 1s = Slow */
```

### Change Button Size:
In `/components/voice-input-modal.tsx`:
```jsx
<div className="w-24 h-24 rounded-full"> {/* ← Change w-24 h-24 */}
  <Mic className="w-10 h-10 text-white" /> {/* ← Change w-10 h-10 */}
</div>
```

---

## 📱 Browser & Device Support

### ✅ Works On:
- Chrome 25+ (Desktop & Mobile)
- Firefox 29+
- Safari 14.1+ (iOS 15+)
- Edge 79+
- Opera 27+

### ⚠️ Requirements:
- HTTPS connection (or localhost)
- Microphone permission
- Modern JavaScript support

### 🚫 Won't Work:
- HTTP (non-secure) - use HTTPS
- No microphone access - grant permission
- Old browsers - update browser
- No internet - needs connection

---

## 🎯 Common Tasks

### Search Using Voice:
```typescript
const handleVoiceTranscript = (text: string) => {
  const query = text.trim()
  if (query.length > 0) {
    router.push(`/search?q=${encodeURIComponent(query)}`)
  }
}
```

### Navigate Using Voice Commands:
```typescript
const handleVoiceTranscript = (text: string) => {
  const commands: { [key: string]: string } = {
    'home': '/',
    'trang chủ': '/',
    'profile': '/profile',
    'hồ sơ': '/profile',
    'trending': '/xu-huong',
    'xu hướng': '/xu-huong',
  }
  
  const lowerText = text.toLowerCase()
  for (const [cmd, path] of Object.entries(commands)) {
    if (lowerText.includes(cmd)) {
      router.push(path)
      return
    }
  }
}
```

### Log Voice Input:
```typescript
const handleVoiceTranscript = (text: string) => {
  console.log('[v0] User voice input:', text)
  console.log('[v0] Input length:', text.length)
  console.log('[v0] Input time:', new Date().toLocaleTimeString())
}
```

### Send to API:
```typescript
const handleVoiceTranscript = async (text: string) => {
  try {
    const response = await fetch('/api/voice-commands', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transcript: text })
    })
    const result = await response.json()
    console.log('API Response:', result)
  } catch (error) {
    console.error('API Error:', error)
  }
}
```

---

## 🐛 Troubleshooting

### "Modal doesn't appear"
- ✓ Check long press duration is correct
- ✓ Hold for full 500ms
- ✓ Check browser console for errors
- ✓ Try refreshing page

### "Microphone won't work"
- ✓ Grant microphone permission
- ✓ Check microphone in device settings
- ✓ Try different browser
- ✓ Ensure HTTPS connection

### "Waveform animation is choppy"
- ✓ Close other browser tabs
- ✓ Check device CPU usage
- ✓ Update browser
- ✓ Try different browser

### "Text not transcribing"
- ✓ Speak louder and clearer
- ✓ Reduce background noise
- ✓ Check language matches speech
- ✓ Verify internet connection

---

## 📚 Learn More

- **Full Documentation**: `/VOICE_INPUT_FEATURE.md`
- **Implementation Details**: `/VOICE_FEATURE_IMPLEMENTATION.md`
- **Code Reference**: See component files directly

---

## 🎓 Understanding the Technology

### Web Speech API
The feature uses the native browser Web Speech API:
- Recognizes speech from microphone
- Converts audio to text in real-time
- Supports 100+ languages
- Works offline on some browsers

### Waveform Animation
12 bars animate synchronized with audio:
- Height varies 8px to 40px
- Gradient from violet to purple
- 0.6s smooth animation loop
- Creates visual audio feedback

---

## ✨ Features at a Glance

| Feature | Details |
|---------|---------|
| **Activation** | Long-press Plus button (500ms) |
| **Language** | Vietnamese (vi-VN) - Customizable |
| **Transcription** | Real-time with visual feedback |
| **Animation** | 12-bar waveform visualization |
| **Dark Mode** | Full support included |
| **Mobile** | Optimized for touch devices |
| **Accessibility** | ARIA labels, keyboard shortcuts |
| **Security** | HTTPS required, no data storage |

---

## 🚀 Pro Tips

1. **Speak naturally** - Don't be robotic
2. **Clear microphone** - Remove obstacles
3. **Quiet environment** - Less background noise
4. **Normal pace** - Not too fast, not too slow
5. **Complete phrases** - Full sentences work better
6. **Device permission** - Grant microphone access once

---

## 🎯 Next Steps

1. **Test it** - Try the feature yourself
2. **Customize** - Change colors, timing, language
3. **Integrate** - Add custom voice handlers
4. **Deploy** - Push to production
5. **Monitor** - Check user analytics
6. **Enhance** - Add more voice commands

---

## 📞 Support

- **Issues?** Check browser console for errors
- **Questions?** Review the documentation files
- **Bugs?** Report with browser & device info
- **Ideas?** Check enhancement ideas in main docs

---

## 🎉 You're All Set!

Your voice input feature is ready to use. Start by:
1. Opening your app
2. Finding the plus button
3. Long-pressing for half a second
4. Enjoying the voice recognition! 🎤

---

**Made with ❤️ for better user experience**

Last Updated: April 2026 | Status: ✅ Production Ready
