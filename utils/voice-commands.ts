// Voice command mapping for Vietnamese language
export interface VoiceCommand {
  keywords: string[]
  route: string
  label: string
}

export const VOICE_COMMANDS: VoiceCommand[] = [
  {
    keywords: ["trang chủ", "trang chu", "home", "trang"],
    route: "/trangchu",
    label: "Trang Chủ",
  },
  {
    keywords: ["xu hướng", "xu huong", "trend", "trending", "hot"],
    route: "/xu-huong",
    label: "Xu Hướng",
  },
  {
    keywords: ["đổi thưởng", "doi thuong", "reward", "gifts", "quà"],
    route: "/doithuong",
    label: "Đổi Thưởng",
  },
  {
    keywords: ["giải trí", "giai tri", "entertainment", "game", "fun"],
    route: "/giaitrisangtao",
    label: "Giải Trí",
  },
  {
    keywords: ["nhạc", "music", "bài hát", "bai hat", "ca hát"],
    route: "/music",
    label: "Nhạc",
  },
  {
    keywords: ["login", "đăng nhập", "dang nhap", "user"],
    route: "/login",
    label: "Đăng Nhập",
  },
  {
    keywords: ["hồ sơ", "ho so", "profile", "tài khoản", "tai khoan"],
    route: "/profile",
    label: "Hồ Sơ",
  },
  {
    keywords: ["giỏ hàng", "gio hang", "cart", "shopping", "mua sắm"],
    route: "/cart",
    label: "Giỏ Hàng",
  },
]

/**
 * Match voice transcript against voice commands
 * @param transcript - The voice transcript from user
 * @returns The matched route or null if no match found
 */
export function matchVoiceCommand(transcript: string): {
  route: string
  label: string
} | null {
  if (!transcript || transcript.trim().length === 0) {
    return null
  }

  const normalizedTranscript = transcript
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ")

  // Find the best match by checking if any keyword is contained in the transcript
  for (const command of VOICE_COMMANDS) {
    for (const keyword of command.keywords) {
      const normalizedKeyword = keyword.toLowerCase().trim()
      // Check if keyword is a complete match or substring match
      if (
        normalizedTranscript === normalizedKeyword ||
        normalizedTranscript.includes(normalizedKeyword)
      ) {
        return {
          route: command.route,
          label: command.label,
        }
      }
    }
  }

  return null
}
