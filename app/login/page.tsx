"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Check } from "lucide-react"
import Image from "next/image"

interface User {
  id: number
  username: string
  name: string
  email: string
  password: string
  avatar: string | null
  firstLogin: boolean
  phone: string
  address: string
  birthdate: string
  profileCompleted: boolean
  isAdmin?: boolean
  favorites: any[]
  favoriteApps: any[]
  favoriteArticles: any[]
  favoriteVideos: any[]
  favoriteSongs: any[] // Add separate favoriteSongs field for music favorites
  cart: any[]
  orders: any[]
}

interface ValidationResult {
  valid: boolean
  message: string
}

export default function LoginPage() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const [usernameValidation, setUsernameValidation] = useState<{
    isChecking: boolean
    isValid: boolean
    message: string
    showMessage: boolean
  }>({ isChecking: false, isValid: false, message: "", showMessage: false })

  const [emailValidation, setEmailValidation] = useState<{
    isValid: boolean
    message: string
    showMessage: boolean
    borderColor: string
  }>({ isValid: false, message: "", showMessage: false, borderColor: "" })

  const [passwordValidation, setPasswordValidation] = useState<{
    isValid: boolean
    message: string
    showMessage: boolean
    borderColor: string
  }>({ isValid: false, message: "", showMessage: false, borderColor: "" })

  const [confirmPasswordValidation, setConfirmPasswordValidation] = useState<{
    isValid: boolean
    message: string
    showMessage: boolean
    borderColor: string
  }>({ isValid: false, message: "", showMessage: false, borderColor: "" })

  const validationTimeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    const currentUser = sessionStorage.getItem("currentUser")
    if (currentUser) {
      router.push("/")
    }

    const newUser = JSON.parse(sessionStorage.getItem("currentUser") || "null")
    if (newUser && newUser.firstLogin) {
      showAvatarBubble()
    }
  }, [router])

  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem("users")) {
      localStorage.setItem("users", JSON.stringify([]))
    }
    initializeAdminAccount()
  }, [])

  const validateUsername = (username: string): ValidationResult => {
    if (!username) return { valid: false, message: "" }
    if (username.length < 3 || username.length > 20) {
      return { valid: false, message: "Tên người dùng phải từ 3-20 ký tự" }
    }

    // Check first and last characters cannot be dot or underscore
    if (username.startsWith(".") || username.startsWith("_") || username.endsWith(".") || username.endsWith("_")) {
      return { valid: false, message: "Dấu chấm và gạch dưới không được ở đầu hoặc cuối tên" }
    }

    // Only allow lowercase letters, numbers, underscore, and dot
    const regex = /^[a-z0-9_.]+$/
    if (!regex.test(username)) {
      return { valid: false, message: "Chỉ chứa chữ thường không dấu, số, dấu gạch dưới và dấu chấm" }
    }

    return { valid: true, message: "" }
  }

  const validateEmail = (email: string): ValidationResult => {
    if (!email) return { valid: false, message: "" }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return { valid: false, message: "Định dạng email không hợp lệ" }
    }

    const trustedDomains = [
      "gmail.com",
      "yahoo.com",
      "outlook.com",
      "hotmail.com",
      "icloud.com",
      "protonmail.com",
      "yandex.com",
      "aol.com",
      "mail.com",
      "zoho.com",
      "tutanota.com",
      "fastmail.com",
    ]

    const domain = email.split("@")[1]?.toLowerCase()
    if (!trustedDomains.includes(domain)) {
      return { valid: false, message: "Vui lòng nhập đúng hoặc sử dụng email từ nhà cung cấp uy tín" }
    }

    return { valid: true, message: "Email hợp lệ!" }
  }

  const validatePassword = (password: string): ValidationResult => {
    if (!password) return { valid: false, message: "" }

    if (password.length < 6) {
      return { valid: false, message: "Mật khẩu phải có ít nhất 6 ký tự" }
    }

    return { valid: true, message: "Mật khẩu hợp lệ!" }
  }

  const isUsernameExists = (username: string): boolean => {
    if (typeof window === "undefined") return false
    const users: User[] = JSON.parse(localStorage.getItem("users") || "[]")
    return users.some((u) => u.username === username)
  }

  const isEmailExists = (email: string): boolean => {
    if (typeof window === "undefined") return false
    const users: User[] = JSON.parse(localStorage.getItem("users") || "[]")
    return users.some((u) => u.email === email)
  }

  const validateUsernameWithDelay = (username: string) => {
    if (validationTimeoutRef.current) {
      clearTimeout(validationTimeoutRef.current)
    }

    // Reset validation state
    setUsernameValidation({ isChecking: false, isValid: false, message: "", showMessage: false })

    if (!username || username.length < 3) {
      return
    }

    // Show loading spinner
    setUsernameValidation({ isChecking: true, isValid: false, message: "", showMessage: false })

    // Set 1.5 second delay like original
    validationTimeoutRef.current = setTimeout(() => {
      const validation = validateUsername(username)

      if (!validation.valid) {
        setUsernameValidation({
          isChecking: false,
          isValid: false,
          message: validation.message,
          showMessage: true,
        })
      } else if (isUsernameExists(username)) {
        setUsernameValidation({
          isChecking: false,
          isValid: false,
          message: "Tên người dùng đã tồn tại! Vui lòng chọn tên khác.",
          showMessage: true,
        })
      } else {
        setUsernameValidation({
          isChecking: false,
          isValid: true,
          message: "Tên người dùng hợp lệ!",
          showMessage: true,
        })
      }
    }, 1500)
  }

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const users: User[] = JSON.parse(localStorage.getItem("users") || "[]")
    const emailOrUsername = (formData.get("emailOrUsername") as string).trim()
    const password = formData.get("password") as string

    const userByEmail = users.find((u) => u.email === emailOrUsername)
    const userByUsername = users.find((u) => u.username === emailOrUsername)
    const foundUser = userByEmail || userByUsername

    if (!foundUser) {
      alert("Tài khoản không tồn tại! Vui lòng kiểm tra lại thông tin hoặc đăng ký tài khoản mới.")
      return
    }

    if (foundUser.password !== password) {
      alert("Mật khẩu không đúng! Vui lòng thử lại.")
      return
    }

    sessionStorage.setItem("currentUser", JSON.stringify(foundUser))
    router.push("/")
  }

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const users: User[] = JSON.parse(localStorage.getItem("users") || "[]")
    const username = formData.get("username") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirm_password") as string

    // Validate all fields
    const usernameValidation = validateUsername(username)
    if (!usernameValidation.valid) {
      alert(`Tên người dùng không hợp lệ! ${usernameValidation.message}`)
      return
    }

    if (isUsernameExists(username)) {
      alert("Tên người dùng đã tồn tại! Vui lòng chọn tên khác.")
      return
    }

    const emailValidation = validateEmail(email)
    if (!emailValidation.valid) {
      alert(`Email không hợp lệ! ${emailValidation.message}`)
      return
    }

    if (isEmailExists(email)) {
      alert("Email đã được đăng ký!")
      return
    }

    const passwordValidation = validatePassword(password)
    if (!passwordValidation.valid) {
      alert(`Mật khẩu không hợp lệ! ${passwordValidation.message}`)
      return
    }

    if (password !== confirmPassword) {
      alert("Mật khẩu không khớp!")
      return
    }

    const newUser: User = {
      id: Date.now(),
      username: username,
      name: formData.get("name") as string,
      email: email,
      password: password,
      avatar: null,
      firstLogin: true,
      phone: "",
      address: "",
      birthdate: "",
      profileCompleted: false,
      isAdmin: false,
      favorites: [],
      favoriteApps: [],
      favoriteArticles: [],
      favoriteVideos: [],
      favoriteSongs: [],
      cart: [],
      orders: [],
    }

    users.push(newUser)
    localStorage.setItem("users", JSON.stringify(users))

    const storedRules = localStorage.getItem("automated_rules")
    if (!storedRules) {
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
      localStorage.setItem("automated_rules", JSON.stringify(defaultRules))
    }

    try {
      const response = await fetch("/api/get-automated-rules")
      if (response.ok) {
        const rules = await response.json()
        const newUserRules = rules.filter(
          (rule: any) => rule.triggerEvent === "new_user_registration" && rule.isEnabled,
        )

        const userNotifications = JSON.parse(localStorage.getItem(`notifications_${newUser.id}`) || "[]")

        for (const rule of newUserRules) {
          // Validate that template exists and is a string
          if (!rule.template || typeof rule.template !== "string") {
            console.warn("Invalid template for rule:", rule.name)
            continue
          }

          // Use a safer replacement method that doesn't interpret special regex characters
          let content = rule.template

          // Replace {{userName}} with actual name
          if (content.includes("{{userName}}")) {
            content = content.split("{{userName}}").join(newUser.name || "")
          }

          // Replace {{username}} with actual username
          if (content.includes("{{username}}")) {
            content = content.split("{{username}}").join(newUser.username || "")
          }

          userNotifications.unshift({
            id: Date.now() + Math.floor(Math.random() * 1000),
            title: rule.name || "Thông báo",
            content: content,
            icon: rule.icon || "bell",
            type: "automated",
            primaryColor: rule.primaryColor || "#f97316",
            secondaryColor: rule.secondaryColor || "#fed7aa",
            createdAt: new Date().toISOString(),
            read: false,
          })
        }

        localStorage.setItem(`notifications_${newUser.id}`, JSON.stringify(userNotifications))

        window.dispatchEvent(new Event("notificationsUpdated"))
      }
    } catch (error) {
      console.error("Lỗi khi kích hoạt thông báo:", error)
      // Don't block registration if notification fails
    }

    alert("Đăng ký thành công! Vui lòng đăng nhập.")
    setIsLogin(true)
  }

  const showAvatarBubble = () => {
    console.log("Showing avatar bubble for first-time user")
  }

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const username = e.target.value
    validateUsernameWithDelay(username)
  }

  const handleUsernameBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const username = e.target.value.trim()
    if (username && username.length >= 3) {
      validateUsernameWithDelay(username)
    }
  }

  const handleEmailBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const email = e.target.value.trim()
    if (email) {
      const validation = validateEmail(email)
      if (!validation.valid) {
        setEmailValidation({
          isValid: false,
          message: validation.message,
          showMessage: true,
          borderColor: "border-red-500",
        })
      } else {
        // Check if email exists (only for registration form)
        if (!isLogin && isEmailExists(email)) {
          setEmailValidation({
            isValid: false,
            message: "Email đã được đăng ký!",
            showMessage: true,
            borderColor: "border-red-500",
          })
        } else {
          setEmailValidation({
            isValid: true,
            message: validation.message,
            showMessage: true,
            borderColor: "border-green-500",
          })
        }
      }
    }
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Clear validation when user starts typing
    if (emailValidation.showMessage) {
      setEmailValidation((prev) => ({ ...prev, showMessage: false, borderColor: "" }))
    }
  }

  const handlePasswordBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const password = e.target.value
    if (password) {
      const validation = validatePassword(password)
      if (!isLogin) {
        // Show validation for registration form
        setPasswordValidation({
          isValid: validation.valid,
          message: validation.message,
          showMessage: true,
          borderColor: validation.valid ? "border-green-500" : "border-red-500",
        })
      } else {
        // Only show error for login form
        if (!validation.valid) {
          setPasswordValidation({
            isValid: false,
            message: validation.message,
            showMessage: true,
            borderColor: "border-red-500",
          })
        } else {
          setPasswordValidation({ isValid: true, message: "", showMessage: false, borderColor: "" })
        }
      }
    }
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Clear validation when user starts typing
    if (passwordValidation.showMessage) {
      setPasswordValidation((prev) => ({ ...prev, showMessage: false, borderColor: "" }))
    }
  }

  const handleConfirmPasswordBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const confirmPassword = e.target.value
    const passwordInput = document.querySelector('input[name="password"]') as HTMLInputElement
    const password = passwordInput?.value || ""

    if (confirmPassword) {
      if (confirmPassword !== password) {
        setConfirmPasswordValidation({
          isValid: false,
          message: "Mật khẩu không khớp!",
          showMessage: true,
          borderColor: "border-red-500",
        })
      } else {
        setConfirmPasswordValidation({
          isValid: true,
          message: "Mật khẩu khớp!",
          showMessage: true,
          borderColor: "border-green-500",
        })
      }
    }
  }

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Clear validation when user starts typing
    if (confirmPasswordValidation.showMessage) {
      setConfirmPasswordValidation((prev) => ({ ...prev, showMessage: false, borderColor: "" }))
    }
  }

  const toggleForms = () => {
    setIsLogin(!isLogin)
    // Reset all validation states when switching forms
    setUsernameValidation({ isChecking: false, isValid: false, message: "", showMessage: false })
    setEmailValidation({ isValid: false, message: "", showMessage: false, borderColor: "" })
    setPasswordValidation({ isValid: false, message: "", showMessage: false, borderColor: "" })
    setConfirmPasswordValidation({ isValid: false, message: "", showMessage: false, borderColor: "" })
  }

  const initializeAdminAccount = () => {
    if (typeof window === "undefined") return

    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const adminExists = users.some((user: User) => user.username === "admin")

    if (!adminExists) {
      const adminUser: User = {
        id: Date.now(),
        username: "admin",
        name: "Quản trị viên",
        email: "admin@conme.com",
        password: "admin123",
        avatar: null,
        firstLogin: false,
        phone: "",
        address: "",
        birthdate: "",
        profileCompleted: true,
        isAdmin: true,
        favorites: [],
        favoriteApps: [],
        favoriteArticles: [],
        favoriteVideos: [],
        favoriteSongs: [],
        cart: [],
        orders: [],
      }

      users.push(adminUser)
      localStorage.setItem("users", JSON.stringify(users))
      console.log("[v0] Tài khoản admin mặc định đã được tạo: username='admin', password='admin123'")
    }
  }

  return (
    <div className="bg-gradient-to-br from-orange-50 to-red-50 min-h-screen">
      <style jsx>{`
        .form-transition {
          transition: opacity 0.3s ease, transform 0.3s ease;
        }
        .form-hidden {
          opacity: 0;
          transform: translateX(20px);
          pointer-events: none;
          position: absolute;
          width: 100%;
        }
        .spinner {
          border: 2px solid #f3f3f3;
          border-top: 2px solid #f97316;
          border-radius: 50%;
          width: 16px;
          height: 16px;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-8">
            <div className="flex justify-center mb-6">
              <Image
                src="/placeholder.svg?height=80&width=80"
                alt="Logo"
                width={80}
                height={80}
                className="w-20 h-20"
              />
            </div>

            {/* Login Form */}
            <form
              id="loginForm"
              className={`space-y-6 form-transition ${!isLogin ? "form-hidden" : ""}`}
              onSubmit={handleLogin}
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email hoặc Tên người dùng</label>
                <input
                  type="text"
                  name="emailOrUsername"
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Email hoặc @username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
                <input
                  type="password"
                  name="password"
                  required
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${passwordValidation.borderColor}`}
                  onBlur={handlePasswordBlur}
                  onChange={handlePasswordChange}
                />
                {passwordValidation.showMessage && passwordValidation.message && (
                  <p className={`text-xs mt-1 ${passwordValidation.isValid ? "text-green-500" : "text-red-500"}`}>
                    {passwordValidation.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors"
              >
                Đăng nhập
              </button>
            </form>

            {/* Registration Form */}
            <form
              id="registerForm"
              className={`space-y-6 form-transition ${isLogin ? "form-hidden" : ""}`}
              onSubmit={handleRegister}
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên người dùng</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">@</span>
                  <input
                    type="text"
                    name="username"
                    required
                    className={`w-full pl-8 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                      usernameValidation.isValid
                        ? "border-green-500"
                        : usernameValidation.showMessage && !usernameValidation.isValid
                          ? "border-red-500"
                          : ""
                    }`}
                    placeholder="username"
                    onChange={handleUsernameChange}
                    onBlur={handleUsernameBlur}
                  />
                  <div className="absolute right-3 top-2">
                    {usernameValidation.isChecking && <div className="spinner"></div>}
                    {!usernameValidation.isChecking && usernameValidation.isValid && (
                      <Check className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                </div>
                {usernameValidation.showMessage && usernameValidation.message && (
                  <p className={`text-xs mt-1 ${usernameValidation.isValid ? "text-green-500" : "text-red-500"}`}>
                    {usernameValidation.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Họ tên</label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${emailValidation.borderColor}`}
                  onBlur={handleEmailBlur}
                  onChange={handleEmailChange}
                />
                {emailValidation.showMessage && emailValidation.message && (
                  <p className={`text-xs mt-1 ${emailValidation.isValid ? "text-green-500" : "text-red-500"}`}>
                    {emailValidation.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
                <input
                  type="password"
                  name="password"
                  required
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${passwordValidation.borderColor}`}
                  onBlur={handlePasswordBlur}
                  onChange={handlePasswordChange}
                />
                {passwordValidation.showMessage && passwordValidation.message && (
                  <p className={`text-xs mt-1 ${passwordValidation.isValid ? "text-green-500" : "text-red-500"}`}>
                    {passwordValidation.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nhập lại mật khẩu</label>
                <input
                  type="password"
                  name="confirm_password"
                  required
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${confirmPasswordValidation.borderColor}`}
                  onBlur={handleConfirmPasswordBlur}
                  onChange={handleConfirmPasswordChange}
                />
                {confirmPasswordValidation.showMessage && confirmPasswordValidation.message && (
                  <p
                    className={`text-xs mt-1 ${confirmPasswordValidation.isValid ? "text-green-500" : "text-red-500"}`}
                  >
                    {confirmPasswordValidation.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors"
              >
                Đăng ký
              </button>
            </form>

            <div className="mt-4 text-center">
              <button onClick={toggleForms} className="text-orange-600 hover:text-orange-700 text-sm">
                {isLogin ? "Chưa có tài khoản? Đăng ký ngay" : "Đã có tài khoản? Đăng nhập ngay"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
