'use client'

import { X } from 'lucide-react'

interface VoiceInputGuideProps {
  isOpen: boolean
  onClose: () => void
}

export function VoiceInputGuide({ isOpen, onClose }: VoiceInputGuideProps) {
  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700 sticky top-0 bg-white dark:bg-slate-900">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Hướng dẫn sử dụng
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Nhấn giữ nút dấu cộng để nghe giọng nói
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-slate-500 dark:text-slate-400" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Step 1 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-violet-100 dark:bg-violet-900">
                  <span className="text-violet-700 dark:text-violet-300 font-bold text-lg">1</span>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Tìm nút dấu cộng
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                  Nút dấu cộng (+) nằm ở giữa thanh điều hướng dưới cùng màn hình
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-violet-100 dark:bg-violet-900">
                  <span className="text-violet-700 dark:text-violet-300 font-bold text-lg">2</span>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Nhấn giữ button
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                  Giữ ngón tay lên nút dấu cộng khoảng 0,5 giây (nửa giây) cho đến khi modal xuất hiện
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-violet-100 dark:bg-violet-900">
                  <span className="text-violet-700 dark:text-violet-300 font-bold text-lg">3</span>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Modal xuất hiện
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                  Một cửa sổ thoại sẽ hiển thị với nút microphone và gợi ý "Nói để mở tính năng"
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-violet-100 dark:bg-violet-900">
                  <span className="text-violet-700 dark:text-violet-300 font-bold text-lg">4</span>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Nhấn nút "Bắt đầu"
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                  Nhấn nút "Bắt đầu" (Bắt đầu) để bắt đầu lắng nghe. Nút microphone sẽ chuyển sang màu đỏ
                </p>
              </div>
            </div>

            {/* Step 5 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-violet-100 dark:bg-violet-900">
                  <span className="text-violet-700 dark:text-violet-300 font-bold text-lg">5</span>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Nói rõ ràng
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                  Nói vào microphone. Bạn sẽ thấy những hình vòng cung nhỏ (waveform) nảy lên khi lắng nghe
                </p>
              </div>
            </div>

            {/* Step 6 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-violet-100 dark:bg-violet-900">
                  <span className="text-violet-700 dark:text-violet-300 font-bold text-lg">6</span>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Xem bản ghi âm
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                  Lời nói của bạn sẽ được hiển thị ngay lập tức trong hộp văn bản
                </p>
              </div>
            </div>

            {/* Step 7 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-violet-100 dark:bg-violet-900">
                  <span className="text-violet-700 dark:text-violet-300 font-bold text-lg">7</span>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Nhấn nút "Dừng"
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                  Khi bạn nói xong, nhấn nút "Dừng" để kết thúc quá trình ghi âm
                </p>
              </div>
            </div>

            {/* Tips */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-700 mt-6">
              <h4 className="font-semibold text-slate-900 dark:text-white mb-3">
                💡 Mẹo sử dụng
              </h4>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li className="flex items-start gap-2">
                  <span className="text-violet-500 mt-1">•</span>
                  <span>Nói trong môi trường yên tĩnh để kết quả tốt hơn</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-500 mt-1">•</span>
                  <span>Nói với tốc độ bình thường, không quá nhanh hay quá chậm</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-500 mt-1">•</span>
                  <span>Đảm bảo thiết bị của bạn có quyền truy cập microphone</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-500 mt-1">•</span>
                  <span>Có thể nhấn "Đóng" hoặc khi nào cũng có thể chạm ngoài modal để huỷ</span>
                </li>
              </ul>
            </div>

            {/* Features */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
              <h4 className="font-semibold text-slate-900 dark:text-white mb-3">
                ✨ Tính năng
              </h4>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Ghi âm theo thời gian thực</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Hiệu ứng hình vòng cung trực quan</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Hỗ trợ chế độ tối</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Hoạt động trên cả thiết bị di động và máy tính</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
