"use client"

import type React from "react"
import { useRef, useEffect, useState } from "react"
import { Upload, CheckCircle, UserPlus, ZoomIn, ZoomOut, Move, RotateCcw, AlertCircle } from "lucide-react"

interface AvatarUploadModalProps {
  isOpen: boolean
  previewImage: string | null
  selectedAvatar: string | null
  onClose: () => void
  onFileSelect: (file: File) => void
  onPresetSelect: (avatar: string) => void
  onUpdateAvatar: (avatarData?: string) => void // Added optional avatarData parameter
}

const PRESET_AVATARS = [
  "avatar1.png",
  "avatar2.png",
  "avatar3.png",
  "avatar4.png",
  "avatar5.png",
  "avatar6.png",
  "avatar7.png",
  "avatar8.png",
  "avatar9.png",
  "avatar10.png",
]

declare global {
  interface Window {
    Cropper: any
  }
}

export default function AvatarUploadModal({
  isOpen,
  previewImage,
  selectedAvatar,
  onClose,
  onFileSelect,
  onPresetSelect,
  onUpdateAvatar,
}: AvatarUploadModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cropperRef = useRef<any>(null)
  const previewImageRef = useRef<HTMLImageElement>(null)
  const initializingRef = useRef(false)
  const [showCropper, setShowCropper] = useState(false)
  const [showGrid, setShowGrid] = useState(false)
  const [interactionTimeout, setInteractionTimeout] = useState<NodeJS.Timeout | null>(null)
  const [cropperLoaded, setCropperLoaded] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [showValidationError, setShowValidationError] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }, [isOpen])

  useEffect(() => {
    if (isOpen && !cropperLoaded) {
      const loadCropper = async () => {
        if (!document.querySelector('link[href*="cropper"]')) {
          const link = document.createElement("link")
          link.rel = "stylesheet"
          link.href = "https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.12/cropper.min.css"
          document.head.appendChild(link)
        }

        if (!window.Cropper) {
          const script = document.createElement("script")
          script.src = "https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.12/cropper.min.js"
          script.onload = () => setCropperLoaded(true)
          document.head.appendChild(script)
        } else {
          setCropperLoaded(true)
        }
      }
      loadCropper()
    }
  }, [isOpen, cropperLoaded])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      alert("Vui lòng chọn file ảnh!")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Kích thước ảnh tối đa 5MB!")
      return
    }

    if (cropperRef.current) {
      cropperRef.current.destroy()
      cropperRef.current = null
    }
    setShowCropper(false)
    initializingRef.current = false

    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      onFileSelect(file)
    }
    reader.readAsDataURL(file)
  }

  const initializeCropper = () => {
    if (initializingRef.current || !cropperLoaded || !window.Cropper || !previewImageRef.current) {
      console.log("[v0] Cropper not ready or already initializing:", {
        initializing: initializingRef.current,
        cropperLoaded,
        windowCropper: !!window.Cropper,
        previewImageRef: !!previewImageRef.current,
      })
      return
    }

    const img = previewImageRef.current
    if (!img.complete || !img.naturalWidth) {
      console.log("[v0] Image not loaded yet, waiting...")
      const handleImageLoad = () => {
        img.removeEventListener("load", handleImageLoad)
        if (!initializingRef.current) {
          initializeCropper()
        }
      }
      img.addEventListener("load", handleImageLoad)
      return
    }

    initializingRef.current = true
    console.log("[v0] Initializing cropper for:", img.src.substring(0, 100) + "...")
    setShowCropper(true)

    const containerSize = 160

    try {
      cropperRef.current = new window.Cropper(previewImageRef.current, {
        aspectRatio: 1,
        viewMode: 3,
        dragMode: "move",
        autoCropArea: 1,
        restore: false,
        guides: false,
        center: false,
        highlight: false,
        cropBoxMovable: false,
        cropBoxResizable: false,
        toggleDragModeOnDblclick: false,
        background: true,
        responsive: true,
        checkOrientation: false,
        minContainerWidth: containerSize,
        minContainerHeight: containerSize,
        minCanvasWidth: containerSize,
        minCanvasHeight: containerSize,
        minCropBoxWidth: containerSize,
        minCropBoxHeight: containerSize,
        ready: function () {
          const cropper = this.cropper
          const previewRect = previewImageRef.current.getBoundingClientRect()
          cropper.setCropBoxData({
            left: (cropper.containerData.width - containerSize) / 2,
            top: (cropper.containerData.height - containerSize) / 2,
            width: containerSize,
            height: containerSize,
          })

          const canvasData = cropper.getCanvasData()
          const cropBoxData = cropper.getCropBoxData()
          const left = cropBoxData.left + (cropBoxData.width - canvasData.width) / 2
          const top = cropBoxData.top + (cropBoxData.height - canvasData.height) / 2

          cropper.setCanvasData({
            left: left,
            top: top,
            width: canvasData.width,
            height: canvasData.height,
          })

          cropper.crop()
          initializingRef.current = false
        },
        crop: function (e) {
          const cropper = this.cropper
          const cropBoxData = cropper.getCropBoxData()
          const containerData = cropper.containerData
          const expectedLeft = (containerData.width - containerSize) / 2
          const expectedTop = (containerData.height - containerSize) / 2

          if (cropBoxData.left !== expectedLeft || cropBoxData.top !== expectedTop) {
            cropper.setCropBoxData({
              left: expectedLeft,
              top: expectedTop,
              width: containerSize,
              height: containerSize,
            })
          }
        },
        cropstart: () => {
          showGridDisplay()
        },
        cropmove: () => {
          showGridDisplay()
        },
        cropend: () => {
          hideGridWithDelay()
        },
        zoom: () => {
          showGridDisplay()
          hideGridWithDelay()
        },
      })

      setTimeout(() => {
        const cropperContainer = document.querySelector(".cropper-container")
        if (cropperContainer) {
          cropperContainer.classList.add("cropper-fixed-grid")
        }
      }, 100)
    } catch (error) {
      console.error("[v0] Error initializing cropper:", error)
      initializingRef.current = false
    }
  }

  const showGridDisplay = () => {
    if (interactionTimeout) {
      clearTimeout(interactionTimeout)
    }
    setShowGrid(true)
    const cropperContainer = document.querySelector(".cropper-container")
    if (cropperContainer) {
      cropperContainer.classList.add("cropper-interacting")
    }
  }

  const hideGridWithDelay = () => {
    if (interactionTimeout) {
      clearTimeout(interactionTimeout)
    }
    const timeout = setTimeout(() => {
      setShowGrid(false)
      const cropperContainer = document.querySelector(".cropper-container")
      if (cropperContainer) {
        cropperContainer.classList.remove("cropper-interacting")
      }
    }, 1000)
    setInteractionTimeout(timeout)
  }

  const zoomIn = () => {
    if (cropperRef.current) {
      cropperRef.current.zoom(0.1)
      showGridDisplay()
      hideGridWithDelay()
    }
  }

  const zoomOut = () => {
    if (cropperRef.current) {
      cropperRef.current.zoom(-0.1)
      showGridDisplay()
      hideGridWithDelay()
    }
  }

  const resetCrop = () => {
    if (cropperRef.current) {
      cropperRef.current.reset()
      showGridDisplay()
      hideGridWithDelay()
    }
  }

  const handlePresetSelect = (avatar: string) => {
    if (cropperRef.current) {
      cropperRef.current.destroy()
      cropperRef.current = null
    }
    setShowCropper(false)
    initializingRef.current = false
    onPresetSelect(avatar)
  }

  const handleUpdateAvatar = () => {
    if (!previewImage && !selectedAvatar) {
      setShowValidationError(true)
      setTimeout(() => setShowValidationError(false), 3000)
      return
    }

    if (cropperRef.current) {
      const canvas = cropperRef.current.getCroppedCanvas({
        width: 160,
        height: 160,
        imageSmoothingEnabled: true,
        imageSmoothingQuality: "high",
        fillColor: "#fff",
      })

      const avatarData = canvas.toDataURL("image/webp", 0.8)
      console.log("[v0] Saving cropped avatar data:", avatarData.substring(0, 100) + "...")

      setIsVisible(false)
      setTimeout(() => {
        onUpdateAvatar(avatarData)
      }, 300)
    } else {
      setIsVisible(false)
      setTimeout(() => {
        onUpdateAvatar()
      }, 300)
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  useEffect(() => {
    if (!isOpen && cropperRef.current) {
      cropperRef.current.destroy()
      cropperRef.current = null
      setShowCropper(false)
      initializingRef.current = false
    }
  }, [isOpen])

  useEffect(() => {
    if (previewImage && cropperLoaded && window.Cropper && previewImageRef.current && !initializingRef.current) {
      const timer = setTimeout(() => {
        if (!initializingRef.current) {
          initializeCropper()
        }
      }, 200)
      return () => clearTimeout(timer)
    }
  }, [previewImage, cropperLoaded])

  if (!isOpen) return null

  return (
    <>
      <style jsx global>{`
        .cropper-view-box,
        .cropper-face {
          border-radius: 50%;
        }

        .cropper-view-box {
          box-shadow: none !important;
          outline: 0;
          border: none !important;
        }

        .cropper-face {
          background-color: inherit !important;
        }

        .cropper-dashed,
        .cropper-point {
          display: none;
        }

        .cropper-line {
          background-color: transparent !important;
        }

        .cropper-fixed-grid .cropper-dashed {
          display: none;
        }

        .cropper-interacting .cropper-dashed {
          display: block !important;
          opacity: 0.8;
        }

        .cropper-interacting .cropper-line {
          display: block !important;
          opacity: 0.8;
          background-color: transparent !important;
        }

        .cropper-container::after {
          content: '+';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: white;
          font-size: 16px;
          font-weight: 300;
          font-family: 'Arial', sans-serif;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: 10;
          text-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
        }

        .cropper-interacting::after {
          opacity: 0.9;
        }

        .cropper-modal {
          background-color: transparent !important;
        }

        .cropper-bg {
          background-image: none !important;
        }

        .avatar-preview {
          transition: all 0.3s ease;
        }

        .avatar-preview:hover {
          transform: scale(1.05);
        }

        .modal-backdrop {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .modal-backdrop.entering {
          opacity: 1;
        }

        .modal-backdrop.exiting {
          opacity: 0;
        }

        .modal-content {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .modal-content.entering {
          opacity: 1;
          transform: scale(1) translateY(0);
        }

        .modal-content.exiting {
          opacity: 0;
          transform: scale(0.9) translateY(-20px);
        }

        .validation-error {
          animation: shake 0.5s ease-in-out;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
      `}</style>

      <div
        className={`fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center modal-backdrop ${isVisible ? "entering" : "exiting"}`}
      >
        <div
          className={`bg-white rounded-3xl shadow-2xl p-6 w-80 sm:w-96 max-w-full mx-4 relative modal-content ${isVisible ? "entering" : "exiting"} ${showValidationError ? "validation-error" : ""}`}
        >
          {showValidationError && (
            <div className="absolute top-16 left-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg flex items-center z-20">
              <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
              <span className="text-sm">Vui lòng chọn ảnh hoặc avatar trước khi cập nhật!</span>
            </div>
          )}

          {!previewImage ? (
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-pink-300 to-purple-300 rounded-full mb-4 shadow-lg">
                <UserPlus className="h-10 w-10 text-white" />
              </div>
              <h3 className="font-bold text-xl mb-2 text-purple-600">Chào mừng bạn! 🎉</h3>
              <p className="text-sm text-gray-600">Hãy tạo ấn tượng với avatar cá nhân nhé</p>
            </div>
          ) : (
            <div className="mb-6">
              <div className="relative w-40 h-40 mx-auto rounded-full overflow-hidden shadow-lg avatar-preview">
                <img
                  ref={previewImageRef}
                  src={previewImage || "/placeholder.svg"}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>

              {showCropper && (
                <div className="mt-4">
                  <div className="flex justify-center space-x-2 mb-3">
                    <button
                      onClick={zoomIn}
                      className="p-2 bg-gradient-to-r from-teal-400 to-cyan-500 hover:from-teal-500 hover:to-cyan-600 text-white rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                      title="Phóng to"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>
                    <button
                      onClick={zoomOut}
                      className="p-2 bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                      title="Thu nhỏ"
                    >
                      <ZoomOut className="w-4 h-4" />
                    </button>
                    <button
                      onClick={resetCrop}
                      className="p-2 bg-gradient-to-r from-purple-400 to-indigo-500 hover:from-purple-500 hover:to-indigo-600 text-white rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                      title="Đặt lại"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500 flex items-center justify-center">
                      <Move className="w-3 h-3 mr-1" />
                      Kéo để di chuyển, cuộn để phóng to/thu nhỏ
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="space-y-4">
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

            <button
              onClick={handleUploadClick}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2.5 rounded-full hover:from-pink-600 hover:to-purple-600 transition-all duration-300 flex items-center justify-center text-base font-semibold shadow-lg"
            >
              <Upload className="w-5 h-5 mr-2" />
              Tải ảnh lên
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white text-gray-500 font-medium">Hoặc chọn avatar có sẵn</span>
              </div>
            </div>

            <div className="overflow-x-auto whitespace-nowrap pb-4 -mx-6 px-6">
              <div className="flex space-x-3">
                {PRESET_AVATARS.map((avatar, index) => (
                  <img
                    key={avatar}
                    src={`/avatars/${avatar}`}
                    alt={`Avatar ${index + 1}`}
                    className={`w-16 h-16 rounded-full cursor-pointer hover:ring-4 hover:ring-pink-300 transition-all duration-200 flex-shrink-0 ${
                      selectedAvatar === `/avatars/${avatar}` ? "ring-4 ring-pink-500" : ""
                    }`}
                    onClick={() => handlePresetSelect(`/avatars/${avatar}`)}
                  />
                ))}
              </div>
            </div>

            <button
              onClick={handleUpdateAvatar}
              className="w-full bg-gradient-to-r from-green-400 to-blue-500 text-white py-2.5 rounded-full hover:from-green-500 hover:to-blue-600 transition-all duration-300 flex items-center justify-center text-base font-semibold shadow-lg"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              Lưu Avatar
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
