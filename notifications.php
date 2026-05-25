<?php
session_start();

// Hàm để lấy thông báo toàn hệ thống
function getGlobalNotifications() {
    if (file_exists('notifications.json')) {
        $json = file_get_contents('notifications.json');
        return json_decode($json, true);
    }
    return [];
}

// Lọc thông báo theo ngày hiện tại và trạng thái
function filterNotifications($notifications) {
    $currentDate = date('Y-m-d\TH:i');
    return array_filter($notifications, function($notification) use ($currentDate) {
        return ($notification['status'] === 'active' || $notification['status'] === 'scheduled') &&
               $notification['startDate'] <= $currentDate &&
               (!isset($notification['endDate']) || $notification['endDate'] > $currentDate);
    });
}

$globalNotifications = filterNotifications(getGlobalNotifications());
?>

<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thông báo của tôi</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/lucide@latest"></script>
    <style>
        .notification-item {
            opacity: 0;
            transform: translateY(10px);
            animation: fadeInUp 0.3s ease forwards;
        }

        @keyframes fadeInUp {
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .notification-item:nth-child(1) { animation-delay: 0.1s; }
        .notification-item:nth-child(2) { animation-delay: 0.2s; }
        .notification-item:nth-child(3) { animation-delay: 0.3s; }
        .notification-item:nth-child(4) { animation-delay: 0.4s; }
        .notification-item:nth-child(5) { animation-delay: 0.5s; }

        .filter-button.active {
            background-color: #f97316;
            color: white;
        }

        .shimmer {
            background: linear-gradient(90deg, #f4f4f4 25%, #e9e9e9 50%, #f4f4f4 75%);
            background-size: 200% 100%;
            animation: shimmer 1.5s infinite;
        }

        @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
        }

        .infinite-scroll-trigger {
            width: 100%;
            height: 20px;
            visibility: hidden;
        }
    </style>
</head>
<body class="bg-gray-50">
    <?php include 'header.php'; ?>

    <main class="container mx-auto px-4 py-8">
        <div class="max-w-4xl mx-auto">
            <!-- Header Section -->
            <div class="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 class="text-2xl font-bold text-gray-900">Thông báo của tôi</h1>
                    <p class="text-sm text-gray-500 mt-1">Xem tất cả thông báo và cập nhật</p>
                </div>
                <div class="flex items-center gap-2">
                    <button id="markAllReadBtn" class="text-sm text-blue-600 hover:text-blue-700 hidden">
                        Đánh dấu tất cả đã đọc
                    </button>
                    <button id="clearAllBtn" class="text-sm text-gray-600 hover:text-gray-700 hidden">
                        Xóa tất cả
                    </button>
                </div>
            </div>

            <!-- Search and Filter Section -->
            <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
                <div class="flex flex-col sm:flex-row gap-4">
                    <!-- Search Input -->
                    <div class="flex-1">
                        <div class="relative">
                            <input type="text" 
                                   id="searchInput"
                                   placeholder="Tìm kiếm thông báo..." 
                                   class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                            <i data-lucide="search" class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"></i>
                        </div>
                    </div>

                    <!-- Filter Buttons -->
                    <div class="flex flex-wrap gap-2">
                        <button class="filter-button active px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                                data-type="all">
                            Tất cả
                        </button>
                        <button class="filter-button px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                                data-type="order">
                            Đơn hàng
                        </button>
                        <button class="filter-button px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                                data-type="product">
                            Sản phẩm
                        </button>
                        <button class="filter-button px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                                data-type="system">
                            Hệ thống
                        </button>
                    </div>
                </div>
            </div>

            <!-- Notifications List -->
            <div id="notificationsList" class="space-y-4">
                <!-- Notifications will be dynamically added here -->
            </div>

            <!-- Loading Indicator -->
            <div id="loadingIndicator" class="hidden">
                <div class="animate-pulse space-y-4 mt-4">
                    <div class="bg-white rounded-lg p-4">
                        <div class="flex items-center space-x-3">
                            <div class="rounded-full bg-gray-200 h-10 w-10"></div>
                            <div class="flex-1 space-y-2">
                                <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                                <div class="h-3 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        </div>
                    </div>
                    <div class="bg-white rounded-lg p-4">
                        <div class="flex items-center space-x-3">
                            <div class="rounded-full bg-gray-200 h-10 w-10"></div>
                            <div class="flex-1 space-y-2">
                                <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                                <div class="h-3 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Infinite Scroll Trigger -->
            <div class="infinite-scroll-trigger" id="infiniteScrollTrigger"></div>

            <!-- Empty State -->
            <div id="emptyState" class="hidden text-center py-12">
                <div class="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                    <i data-lucide="bell-off" class="w-8 h-8 text-gray-400"></i>
                </div>
                <h3 class="text-lg font-medium text-gray-900 mb-2">Không có thông báo nào</h3>
                <p class="text-sm text-gray-500">Bạn sẽ nhận được thông báo khi có cập nhật mới.</p>
            </div>
        </div>
    </main>

    <script>
        // Initialize Lucide icons
        lucide.createIcons();

        // Variables for pagination and filtering
        let currentPage = 1;
        const itemsPerPage = 10;
        let currentFilter = 'all';
        let isLoading = false;
        let hasMoreItems = true;

        // Get current user from session storage
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));

        // Initialize notifications array
        let notifications = [];

        // Function to load notifications
        async function loadNotifications(page = 1, filter = 'all') {
            if (isLoading || !hasMoreItems) return;
            isLoading = true;

            showLoading(true);

            try {
                // Load global notifications from server
                const response = await fetch('get_notifications.php');
                const globalNotifications = await response.json();

                // Load user-specific notifications from localStorage
                const userNotifications = currentUser 
                    ? JSON.parse(localStorage.getItem(`notifications_${currentUser.id}`)) || []
                    : [];

                // Combine and sort notifications
                notifications = [...globalNotifications, ...userNotifications]
                    .sort((a, b) => new Date(b.createdAt || b.startDate) - new Date(a.createdAt || a.startDate));

                // Apply filters
                if (filter !== 'all') {
                    notifications = notifications.filter(n => n.type === filter);
                }

                // Apply pagination
                const start = (page - 1) * itemsPerPage;
                const end = start + itemsPerPage;
                const paginatedNotifications = notifications.slice(start, end);

                hasMoreItems = notifications.length > end;

                if (page === 1) {
                    document.getElementById('notificationsList').innerHTML = '';
                }

                renderNotifications(paginatedNotifications);
                updateUI();

            } catch (error) {
                console.error('Error loading notifications:', error);
                showToast('Có lỗi xảy ra khi tải thông báo', 'error');
            } finally {
                isLoading = false;
                showLoading(false);
            }
        }

        // Function to render notifications
        function renderNotifications(notifications) {
            const container = document.getElementById('notificationsList');
            const readNotifications = currentUser 
                ? JSON.parse(localStorage.getItem(`readNotifications_${currentUser.id}`)) || {}
                : {};

            notifications.forEach((notification, index) => {
                const element = document.createElement('div');
                element.className = `notification-item bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md ${
                    readNotifications[notification.id] ? 'opacity-60' : ''
                }`;
                element.style.animationDelay = `${index * 0.1}s`;

                element.innerHTML = `
                    <div class="p-4">
                        <div class="flex items-center gap-4">
                            <div class="flex-shrink-0">
                                <div class="w-10 h-10 rounded-full flex items-center justify-center" 
                                     style="background-color: ${notification.primaryColor || '#f97316'}">
                                    <i data-lucide="${notification.icon}" 
                                       class="w-5 h-5" 
                                       style="color: ${notification.secondaryColor || '#ffffff'}"></i>
                                </div>
                            </div>
                            <div class="flex-grow min-w-0">
                                <div class="flex items-center justify-between gap-2">
                                    <h3 class="font-medium text-gray-900 truncate">${notification.title}</h3>
                                    <div class="flex items-center gap-2">
                                        ${!readNotifications[notification.id] ? `
                                            <span class="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full"></span>
                                        ` : ''}
                                        <button onclick="markAsRead('${notification.id}')" 
                                                class="text-gray-400 hover:text-gray-600 transition-colors">
                                            <i data-lucide="${readNotifications[notification.id] ? 'check-circle' : 'circle'}" class="w-5 h-5"></i>
                                        </button>
                                    </div>
                                </div>
                                <p class="text-sm text-gray-500 mt-1">${notification.content}</p>
                                ${notification.showDateTime ? `
                                    <p class="text-xs text-gray-400 mt-2">
                                        ${formatDate(notification.createdAt || notification.startDate)}
                                    </p>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                `;

                container.appendChild(element);
            });

            lucide.createIcons();

            // Show/hide empty state
            document.getElementById('emptyState').classList.toggle('hidden', notifications.length > 0);
            
            // Show/hide action buttons
            const hasUnreadNotifications = notifications.some(n => !readNotifications[n.id]);
            document.getElementById('markAllReadBtn').classList.toggle('hidden', !hasUnreadNotifications);
            document.getElementById('clearAllBtn').classList.toggle('hidden', notifications.length === 0);
        }

        // Function to mark notification as read
        function markAsRead(notificationId) {
            if (!currentUser) return;

            const readNotifications = JSON.parse(localStorage.getItem(`readNotifications_${currentUser.id}`)) || {};
            readNotifications[notificationId] = true;
            localStorage.setItem(`readNotifications_${currentUser.id}`, JSON.stringify(readNotifications));

            loadNotifications(1, currentFilter);
        }

        // Function to mark all notifications as read
        function markAllAsRead() {
            if (!currentUser) return;

            const readNotifications = {};
            notifications.forEach(notification => {
                readNotifications[notification.id] = true;
            });

            localStorage.setItem(`readNotifications_${currentUser.id}`, JSON.stringify(readNotifications));
            loadNotifications(1, currentFilter);
            showToast('Đã đánh dấu tất cả thông báo là đã đọc', 'success');
        }

        // Function to clear all notifications
        function clearAllNotifications() {
            if (!currentUser) return;

            if (confirm('Bạn có chắc chắn muốn xóa tất cả thông báo?')) {
                localStorage.removeItem(`notifications_${currentUser.id}`);
                localStorage.removeItem(`readNotifications_${currentUser.id}`);
                loadNotifications(1, currentFilter);
                showToast('Đã xóa tất cả thông báo', 'success');
            }
        }

        // Function to format date
        function formatDate(dateString) {
            const date = new Date(dateString);
            return date.toLocaleString('vi-VN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false // Sử dụng định dạng 24h
            });
        }

        // Function to show/hide loading indicator
        function showLoading(show) {
            document.getElementById('loadingIndicator').classList.toggle('hidden', !show);
        }

        // Function to show toast message
        function showToast(message, type = 'info') {
            const toast = document.createElement('div');
            toast.className = `fixed bottom-4 right-4 px-4 py-2 rounded-lg shadow-lg ${
                type === 'success' ? 'bg-green-500' : 
                type === 'error' ? 'bg-red-500' : 
                'bg-blue-500'
            } text-white z-50`;
            toast.textContent = message;
            document.body.appendChild(toast);

            setTimeout(() => {
                toast.style.opacity = '0';
                toast.style.transform = 'translateY(100%)';
                setTimeout(() => toast.remove(), 300);
            }, 3000);
        }

        // Function to update UI elements
        function updateUI() {
            // Update filter buttons
            document.querySelectorAll('.filter-button').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.type === currentFilter);
            });

            // Update action buttons visibility
            const hasNotifications = notifications.length > 0;
            const hasUnreadNotifications = notifications.some(n => {
                const readNotifications = currentUser 
                    ? JSON.parse(localStorage.getItem(`readNotifications_${currentUser.id}`)) || {}
                    : {};
                return !readNotifications[n.id];
            });

            document.getElementById('markAllReadBtn').classList.toggle('hidden', !hasUnreadNotifications);
            document.getElementById('clearAllBtn').classList.toggle('hidden', !hasNotifications);
        }

        // Event Listeners
        document.addEventListener('DOMContentLoaded', () => {
            // Load initial notifications
            loadNotifications();

            // Filter buttons
            document.querySelectorAll('.filter-button').forEach(btn => {
                btn.addEventListener('click', () => {
                    currentFilter = btn.dataset.type;
                    currentPage = 1;
                    hasMoreItems = true;
                    loadNotifications(currentPage, currentFilter);
                });
            });

            // Search input
            let searchTimeout;
            document.getElementById('searchInput').addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    const searchTerm = e.target.value.toLowerCase();
                    const filteredNotifications = notifications.filter(n =>
                        n.title.toLowerCase().includes(searchTerm) ||
                        n.content.toLowerCase().includes(searchTerm)
                    );
                    document.getElementById('notificationsList').innerHTML = '';
                    renderNotifications(filteredNotifications);
                }, 300);
            });

            // Mark all as read button
            document.getElementById('markAllReadBtn').addEventListener('click', markAllAsRead);

            // Clear all button
            document.getElementById('clearAllBtn').addEventListener('click', clearAllNotifications);

            // Infinite scroll
            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && !isLoading && hasMoreItems) {
                    currentPage++;
                    loadNotifications(currentPage, currentFilter);
                }
            });

            observer.observe(document.getElementById('infiniteScrollTrigger'));
        });

        // Handle user login/logout
        window.addEventListener('storage', (e) => {
            if (e.key === 'currentUser') {
                loadNotifications(1, currentFilter);
            }
        });
    </script>
</body>
</html>
