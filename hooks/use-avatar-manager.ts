"use client"

import { useState, useCallback } from "react"

interface User {
  id: string
  avatar?: string
  firstLogin?: boolean
  [key: string]: any
}

interface AvatarManagerState {
  isAvatarOverlayOpen: boolean
  selectedAvatar: string | null
  previewImage: string | null
  cropper: any
  currentUser: User | null
}

export function useAvatarManager() {
  const [state, setState] = useState<AvatarManagerState>({
    isAvatarOverlayOpen: false,
    selectedAvatar: null,
    previewImage: null,
    cropper: null,
    currentUser: null,
  })

  const initializeUser = useCallback(() => {
    const userString = sessionStorage.getItem("currentUser")
    if (userString) {
      const user = JSON.parse(userString)
      setState((prev) => ({ ...prev, currentUser: user }))

      // Show avatar bubble for first-time users
      if (user.firstLogin) {
        setState((prev) => ({ ...prev, isAvatarOverlayOpen: true }))
      }
    }
  }, [])

  const handleFileSelect = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      showToast("Vui lòng chọn file ảnh!", "error")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast("Kích thước ảnh tối đa 5MB!", "error")
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      setState((prev) => ({
        ...prev,
        previewImage: result,
        selectedAvatar: null,
      }))

      // Initialize cropper here if needed
      initializeCropper(result)
    }
    reader.readAsDataURL(file)
  }, [])

  const initializeCropper = useCallback((imageSrc: string) => {
    // This would integrate with Cropper.js
    // For now, we'll handle it in the component
    console.log("[v0] Initializing cropper for:", imageSrc)
  }, [])

  const selectPresetAvatar = useCallback((avatarSrc: string) => {
    setState((prev) => ({
      ...prev,
      selectedAvatar: avatarSrc,
      previewImage: avatarSrc,
      cropper: null,
    }))
  }, [])

  const updateAvatar = useCallback(() => {
    let avatarData: string

    if (state.cropper) {
      // Get cropped canvas data
      avatarData = state.cropper
        .getCroppedCanvas({
          width: 160,
          height: 160,
          imageSmoothingEnabled: true,
          imageSmoothingQuality: "high",
          fillColor: "#fff",
        })
        .toDataURL("image/webp", 0.8)
    } else if (state.selectedAvatar) {
      avatarData = state.selectedAvatar
    } else {
      showToast("Vui lòng chọn hoặc tải lên một avatar!", "error")
      return
    }

    if (!state.currentUser) return

    // Update user data
    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const userIndex = users.findIndex((u: User) => u.id === state.currentUser!.id)

    if (userIndex !== -1) {
      users[userIndex].avatar = avatarData
      users[userIndex].firstLogin = false

      localStorage.setItem("users", JSON.stringify(users))
      sessionStorage.setItem("currentUser", JSON.stringify(users[userIndex]))

      setState((prev) => ({
        ...prev,
        currentUser: users[userIndex],
        isAvatarOverlayOpen: false,
        selectedAvatar: null,
        previewImage: null,
        cropper: null,
      }))

      updateAvatarUI(avatarData)
      showToast("Cập nhật avatar thành công!", "success")
    }
  }, [state.cropper, state.selectedAvatar, state.currentUser])

  const updateAvatarUI = useCallback((avatarData: string) => {
    // Update avatar elements in the DOM
    const accountAvatar = document.querySelector("#accountContainer img") as HTMLImageElement
    const headerAvatar = document.getElementById("headerAvatar") as HTMLImageElement
    ;[accountAvatar, headerAvatar].forEach((avatar) => {
      if (avatar) {
        avatar.style.transition = "opacity 0.3s ease-in-out"
        avatar.style.opacity = "0"
        setTimeout(() => {
          avatar.src = avatarData
          avatar.style.opacity = "1"
        }, 50)
      }
    })
  }, [])

  const showToast = useCallback((message: string, type: "success" | "error") => {
    // This would integrate with a toast system
    console.log(`[v0] Toast ${type}:`, message)
    // You can integrate with react-hot-toast or similar
  }, [])

  const closeAvatarOverlay = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isAvatarOverlayOpen: false,
      selectedAvatar: null,
      previewImage: null,
      cropper: null,
    }))
  }, [])

  const openAvatarOverlay = useCallback(() => {
    setState((prev) => ({ ...prev, isAvatarOverlayOpen: true }))
  }, [])

  return {
    ...state,
    initializeUser,
    handleFileSelect,
    selectPresetAvatar,
    updateAvatar,
    closeAvatarOverlay,
    openAvatarOverlay,
    showToast,
  }
}
