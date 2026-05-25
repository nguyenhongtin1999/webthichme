import { NextResponse } from "next/server"

export async function GET() {
  try {
    const defaultRules = [
      {
        id: "1",
        name: "Chào mừng đến với Cửa Hàng Vô Tri",
        triggerEvent: "new_user_registration",
        template:
          "Xin chào {{userName}}! Chào mừng bạn đến với Cửa Hàng Vô Tri. Chúng tôi rất vui khi bạn gia nhập cộng đồng của chúng tôi. Hãy khám phá các sản phẩm tuyệt vời và tận hưởng trải nghiệm mua sắm!",
        icon: "gift",
        primaryColor: "#10b981",
        secondaryColor: "#ffffff",
        isEnabled: true,
      },
      {
        id: "2",
        name: "Hướng dẫn bắt đầu cho người dùng mới",
        triggerEvent: "new_user_registration",
        template:
          "Chào @{{username}}! Để bắt đầu, bạn có thể hoàn thiện hồ sơ cá nhân, khám phá danh mục sản phẩm và thêm sản phẩm yêu thích vào giỏ hàng. Nếu cần hỗ trợ, đừng ngần ngại liên hệ với chúng tôi!",
        icon: "zap",
        primaryColor: "#3b82f6",
        secondaryColor: "#ffffff",
        isEnabled: true,
      },
    ]

    return NextResponse.json(defaultRules)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch automated rules" }, { status: 500 })
  }
}
