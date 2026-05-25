<?php include 'header.php'; ?>

<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Yêu thích của tôi - Cửa hàng đồ chơi thông minh</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/lucide@latest"></script>
  <style>
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in {
      animation: fadeIn 0.3s ease-out forwards;
    }
    .favorite-item {
      opacity: 0;
      animation: fadeIn 0.3s ease-out forwards;
    }
    .favorite-item:nth-child(1) { animation-delay: 0.05s; }
    .favorite-item:nth-child(2) { animation-delay: 0.1s; }
    .favorite-item:nth-child(3) { animation-delay: 0.15s; }
    .favorite-item:nth-child(4) { animation-delay: 0.2s; }
    .favorite-item:nth-child(5) { animation-delay: 0.25s; }
    .favorite-item:nth-child(6) { animation-delay: 0.3s; }
    .favorite-item:nth-child(7) { animation-delay: 0.35s; }
    .favorite-item:nth-child(8) { animation-delay: 0.4s; }
    
    .tab-button {
      position: relative;
      transition: all 0.3s ease;
    }
    
    .tab-button::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      width: 0;
      height: 2px;
      background-color: #f97316;
      transition: all 0.3s ease;
      transform: translateX(-50%);
    }
    
    .tab-button.active::after {
      width: 80%;
    }
    
    .tab-button:hover::after {
      width: 60%;
    }
    
    .tab-button.active {
      color: #f97316;
    }
    
    .empty-state {
      transition: all 0.3s ease;
    }
    
    .empty-state:hover {
      transform: translateY(-5px);
    }
    
    .search-container {
      position: relative;
    }
    
    .search-container i {
      position: absolute;
      top: 50%;
      left: 1rem;
      transform: translateY(-50%);
      color: #9ca3af;
    }
    
    .search-input {
      padding-left: 2.5rem;
    }
    
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }
    
    .pulse {
      animation: pulse 2s infinite;
    }
  </style>
</head>
<body class="bg-gray-50">
  <main class="container mx-auto px-4 py-8">
    <div class="max-w-6xl mx-auto">
      <!-- Header Section -->
      <div class="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 class="text-2xl md:text-3xl font-bold text-gray-900">Yêu thích của tôi</h1>
          <p class="text-sm text-gray-500 mt-1">Quản lý tất cả các mục yêu thích của bạn</p>
        </div>
      </div>

      <!-- Search and Filter Section -->
      <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div class="flex flex-col sm:flex-row gap-4">
          <!-- Search Input -->
          <div class="flex-1 search-container">
            <i data-lucide="search" class="w-5 h-5"></i>
            <input type="text" 
                   id="searchInput"
                   placeholder="Tìm kiếm trong yêu thích..." 
                   class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 search-input">
          </div>
        </div>
      </div>

      <!-- Tabs Navigation -->
      <div class="bg-white rounded-lg shadow-sm mb-6 overflow-hidden">
        <div class="flex border-b border-gray-200">
          <button id="productsTab" class="tab-button active flex-1 py-4 px-4 text-center font-medium">
            <i data-lucide="shopping-bag" class="w-5 h-5 mx-auto mb-1"></i>
            <span>Sản phẩm</span>
          </button>
          <button id="appsTab" class="tab-button flex-1 py-4 px-4 text-center font-medium">
            <i data-lucide="smartphone" class="w-5 h-5 mx-auto mb-1"></i>
            <span>Ứng dụng</span>
          </button>
          <button id="savedTab" class="tab-button flex-1 py-4 px-4 text-center font-medium">
            <i data-lucide="bookmark" class="w-5 h-5 mx-auto mb-1"></i>
            <span>Đã lưu</span>
          </button>
        </div>
      </div>

      <!-- Content Sections -->
      <!-- Products Section -->
      <div id="productsSection" class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-semibold text-gray-800">Sản phẩm yêu thích</h2>
          <div class="text-sm text-gray-500" id="productsCount">0 sản phẩm</div>
        </div>
        
        <div id="productsContainer" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <!-- Products will be dynamically added here -->
        </div>
        
        <!-- Empty State -->
        <div id="productsEmpty" class="hidden py-12 text-center empty-state">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <i data-lucide="shopping-bag" class="w-8 h-8 text-gray-400"></i>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">Chưa có sản phẩm yêu thích</h3>
          <p class="text-sm text-gray-500 max-w-md mx-auto">Hãy khám phá cửa hàng và thêm các sản phẩm bạn yêu thích vào đây.</p>
          <a href="index.php" class="mt-4 inline-block bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors">
            Khám phá sản phẩm
          </a>
        </div>
      </div>

      <!-- Apps Section -->
      <div id="appsSection" class="bg-white rounded-lg shadow-sm p-6 hidden">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-semibold text-gray-800">Ứng dụng yêu thích</h2>
          <div class="text-sm text-gray-500" id="appsCount">0 ứng dụng</div>
        </div>
        
        <div id="appsContainer" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <!-- Apps will be dynamically added here -->
        </div>
        
        <!-- Empty State -->
        <div id="appsEmpty" class="hidden py-12 text-center empty-state">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <i data-lucide="smartphone" class="w-8 h-8 text-gray-400"></i>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">Chưa có ứng dụng yêu thích</h3>
          <p class="text-sm text-gray-500 max-w-md mx-auto">Khám phá các ứng dụng và game mini để thêm vào danh sách yêu thích của bạn.</p>
          <a href="index.php#appsContainer" class="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
            Khám phá ứng dụng
          </a>
        </div>
      </div>

      <!-- Saved Section -->
      <div id="savedSection" class="bg-white rounded-lg shadow-sm p-6 hidden">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-semibold text-gray-800">Nội dung đã lưu</h2>
          <div class="text-sm text-gray-500" id="savedCount">0 mục</div>
        </div>
        
        <div class="mb-4 flex gap-2">
          <button id="allSavedBtn" class="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm">Tất cả</button>
          <button id="articlesBtn" class="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg text-sm">Bài viết</button>
          <button id="videosBtn" class="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg text-sm">Video</button>
        </div>
        
        <div id="savedContainer" class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Saved items will be dynamically added here -->
        </div>
        
        <!-- Empty State -->
        <div id="savedEmpty" class="hidden py-12 text-center empty-state">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <i data-lucide="bookmark" class="w-8 h-8 text-gray-400"></i>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">Chưa có nội dung đã lưu</h3>
          <p class="text-sm text-gray-500 max-w-md mx-auto">Lưu các bài viết và video bạn quan tâm để xem lại sau.</p>
          <a href="index.php#savedContainer" class="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
            Khám phá nội dung
          </a>
        </div>
      </div>
    </div>
  </main>

  <!-- Confirmation Modal -->
  <div id="confirmationModal" class="fixed inset-0 bg-black bg-opacity-50 hidden items-center justify-center z-50">
    <div class="bg-white rounded-lg max-w-md w-full p-6 animate-fade-in">
      <div class="text-center">
        <div id="modalIcon" class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
          <i data-lucide="trash-2" class="h-6 w-6 text-red-600"></i>
        </div>
        <h3 id="modalTitle" class="text-lg font-medium text-gray-900 mb-2">Xác nhận xóa</h3>
        <p id="modalMessage" class="text-sm text-gray-500">Bạn có chắc chắn muốn xóa mục này khỏi danh sách yêu thích?</p>
      </div>
      <div class="mt-6 flex justify-end gap-4">
        <button id="cancelButton" class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          Hủy bỏ
        </button>
        <button id="confirmButton" class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
          Xóa
        </button>
      </div>
    </div>
  </div>

  <script>
    // Initialize Lucide icons
    lucide.createIcons();

    // Mock data for products
    const mockProducts = [
      {
        id: 1,
        name: 'Bộ Xếp Hình Thông Minh',
        price: 750000,
        image: 'https://picsum.photos/300/200?random=1'
      },
      {
        id: 2,
        name: 'Robot Lập Trình Cho Bé',
        price: 1200000,
        image: 'https://picsum.photos/300/200?random=2'
      },
      {
        id: 3,
        name: 'Bảng Vẽ Điện Tử',
        price: 450000,
        image: 'https://picsum.photos/300/200?random=3'
      },
      {
        id: 4,
        name: 'Kính Hiển Vi Mini',
        price: 350000,
        image: 'https://picsum.photos/300/200?random=4'
      },
      {
        id: 5,
        name: 'Bộ Thí Nghiệm Khoa Học',
        price: 550000,
        image: 'https://picsum.photos/300/200?random=5'
      },
      {
        id: 6,
        name: 'Đồ Chơi Lắp Ráp Mạch Điện',
        price: 680000,
        image: 'https://picsum.photos/300/200?random=6'
      },
      {
        id: 7,
        name: 'Bộ Cờ Vua Điện Tử',
        price: 890000,
        image: 'https://picsum.photos/300/200?random=7'
      },
      {
        id: 8,
        name: 'Máy Tính Bỏ Túi Học Tập',
        price: 320000,
        image: 'https://picsum.photos/300/200?random=8'
      }
    ];

    // Dữ liệu mẫu cho Apps
    const mockApps = [
      {
        id: 101,
        name: "Sudoku Master",
        description: "Trò chơi Sudoku với nhiều cấp độ khó",
        icon: "https://picsum.photos/100/100?random=101",
        type: "Game"
      },
      {
        id: 102,
        name: "Từ điển Anh-Việt",
        description: "Ứng dụng từ điển hỗ trợ học tiếng Anh",
        icon: "https://picsum.photos/100/100?random=102",
        type: "Học tập"
      },
      {
        id: 103,
        name: "Flashcard Toán Học",
        description: "Ứng dụng học toán với thẻ ghi nhớ thông minh",
        icon: "https://picsum.photos/100/100?random=103",
        type: "Giáo dục"
      },
      {
        id: 104,
        name: "Luyện Nói Tiếng Anh",
        description: "Ứng dụng luyện phát âm và giao tiếp tiếng Anh",
        icon: "https://picsum.photos/100/100?random=104",
        type: "Học tập"
      },
      {
        id: 105,
        name: "Cờ Vua AI",
        description: "Chơi cờ vua với trí tuệ nhân tạo nhiều cấp độ",
        icon: "https://picsum.photos/100/100?random=105",
        type: "Game"
      },
      {
        id: 106,
        name: "Luyện Chữ Đẹp",
        description: "Ứng dụng hỗ trợ luyện viết chữ đẹp cho trẻ em",
        icon: "https://picsum.photos/100/100?random=106",
        type: "Giáo dục"
      }
    ];

    // Dữ liệu mẫu cho Saved Items
    const mockArticles = [
      {
        id: 201,
        title: "10 cách giúp trẻ phát triển tư duy logic",
        excerpt: "Bài viết chia sẻ các phương pháp giúp trẻ phát triển kỹ năng tư duy logic từ sớm",
        image: "https://picsum.photos/300/200?random=201",
        date: "2023-05-15T08:30:00",
        type: "article"
      },
      {
        id: 202,
        title: "Hướng dẫn chọn đồ chơi phù hợp với lứa tuổi",
        excerpt: "Tìm hiểu cách chọn đồ chơi phù hợp với từng giai đoạn phát triển của trẻ",
        image: "https://picsum.photos/300/200?random=202",
        date: "2023-06-10T10:15:00",
        type: "article"
      }
    ];

    const mockVideos = [
      {
        id: 301,
        title: "Hướng dẫn lắp ráp robot đơn giản",
        description: "Video hướng dẫn chi tiết cách lắp ráp robot từ bộ kit cơ bản",
        thumbnail: "https://picsum.photos/300/200?random=301",
        duration: "15:30",
        views: "1.2K",
        type: "video"
      },
      {
        id: 302,
        title: "Thí nghiệm khoa học tại nhà cho trẻ em",
        description: "Các thí nghiệm khoa học đơn giản và an toàn có thể thực hiện tại nhà",
        thumbnail: "https://picsum.photos/300/200?random=302",
        duration: "20:45",
        views: "3.5K",
        type: "video"
      }
    ];

    // Variables for confirmation modal
    let itemToRemove = null;
    let removeType = null;

    // Function to get current user
    function getCurrentUser() {
      const userData = sessionStorage.getItem('currentUser');
      return userData ? JSON.parse(userData) : null;
    }

    // Function to format currency
    function formatCurrency(amount) {
      return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    }

    // Function to format date
    function formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }

    // Function to show toast notification
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

    // Function to load favorite products
    function loadFavoriteProducts() {
      const currentUser = getCurrentUser();
      const productsContainer = document.getElementById('productsContainer');
      const productsEmpty = document.getElementById('productsEmpty');
      const productsCount = document.getElementById('productsCount');
      
      if (!currentUser) {
        window.location.href = 'login.php';
        return;
      }
      
      const favorites = currentUser.favorites || [];
      
      // Update count
      productsCount.textContent = `${favorites.length} sản phẩm`;
      
      // Show/hide empty state
      if (favorites.length === 0) {
        productsContainer.classList.add('hidden');
        productsEmpty.classList.remove('hidden');
        return;
      }
      
      productsContainer.classList.remove('hidden');
      productsEmpty.classList.add('hidden');
      
      // Clear container
      productsContainer.innerHTML = '';
      
      // Filter by search term if any
      const searchTerm = document.getElementById('searchInput').value.toLowerCase();
      const filteredProducts = searchTerm ? 
        favorites.filter(item => item.name.toLowerCase().includes(searchTerm)) : 
        favorites;
      
      // Render products
      filteredProducts.forEach(product => {
        const productElement = document.createElement('div');
        productElement.className = 'favorite-item bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow';
        productElement.innerHTML = `
          <div class="relative">
            <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover">
            <button class="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-red-50 transition-colors remove-favorite" 
                    data-id="${product.id}" data-type="product" data-name="${product.name}">
              <i data-lucide="trash-2" class="w-5 h-5 text-red-500"></i>
            </button>
          </div>
          <div class="p-4">
            <h3 class="font-semibold mb-2">${product.name}</h3>
            <p class="text-orange-600 font-bold mb-4">${formatCurrency(product.price)}</p>
            <div class="flex gap-2">
              <button class="flex-1 bg-orange-500 text-white py-2 rounded-full hover:bg-orange-600 transition-colors flex items-center justify-center add-to-cart-btn"
                      onclick="addToCart(${product.id})">
                <i data-lucide="shopping-cart" class="w-4 h-4 mr-1"></i>
                Thêm vào giỏ
              </button>
              <a href="#" class="flex-1 bg-gray-200 text-gray-800 py-2 rounded-full hover:bg-gray-300 transition-colors flex items-center justify-center">
                Chi tiết
              </a>
            </div>
          </div>
        `;
        productsContainer.appendChild(productElement);
      });
      
      // Initialize Lucide icons
      lucide.createIcons();
      
      // Add event listeners for remove buttons
      document.querySelectorAll('.remove-favorite').forEach(btn => {
        btn.addEventListener('click', function() {
          const id = parseInt(this.getAttribute('data-id'));
          const type = this.getAttribute('data-type');
          const name = this.getAttribute('data-name');
          showConfirmationModal(id, type, name);
        });
      });
    }

    // Function to load favorite apps
    function loadFavoriteApps() {
      const currentUser = getCurrentUser();
      const appsContainer = document.getElementById('appsContainer');
      const appsEmpty = document.getElementById('appsEmpty');
      const appsCount = document.getElementById('appsCount');
      
      if (!currentUser) {
        window.location.href = 'login.php';
        return;
      }
      
      const favoriteApps = currentUser.favoriteApps || [];
      
      // Update count
      appsCount.textContent = `${favoriteApps.length} ứng dụng`;
      
      // Show/hide empty state
      if (favoriteApps.length === 0) {
        appsContainer.classList.add('hidden');
        appsEmpty.classList.remove('hidden');
        return;
      }
      
      appsContainer.classList.remove('hidden');
      appsEmpty.classList.add('hidden');
      
      // Clear container
      appsContainer.innerHTML = '';
      
      // Filter by search term if any
      const searchTerm = document.getElementById('searchInput').value.toLowerCase();
      const filteredApps = searchTerm ? 
        favoriteApps.filter(app => app.name.toLowerCase().includes(searchTerm) || 
                                  (app.description && app.description.toLowerCase().includes(searchTerm))) : 
        favoriteApps;
      
      // Render apps
      filteredApps.forEach(app => {
        const appElement = document.createElement('div');
        appElement.className = 'favorite-item bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow';
        appElement.innerHTML = `
          <div class="p-4">
            <div class="flex items-center mb-3">
              <div class="w-16 h-16 rounded-xl overflow-hidden mr-3 bg-gray-100 flex items-center justify-center">
                <img src="${app.icon}" alt="${app.name}" class="w-full h-full object-cover">
              </div>
              <div class="flex-grow">
                <div class="flex justify-between items-start">
                  <h3 class="font-semibold">${app.name}</h3>
                  <button class="bg-white rounded-full p-1 hover:bg-red-50 transition-colors remove-favorite" 
                          data-id="${app.id}" data-type="app" data-name="${app.name}">
                    <i data-lucide="trash-2" class="w-4 h-4 text-red-500"></i>
                  </button>
                </div>
                <span class="text-xs px-2 py-0.5 bg-blue-100 text-blue-600 rounded-full">${app.type}</span>
              </div>
            </div>
            <p class="text-sm text-gray-600 mb-3">${app.description}</p>
            <div class="flex gap-2">
              <button class="flex-1 bg-blue-500 text-white py-2 rounded-full hover:bg-blue-600 transition-colors flex items-center justify-center">
                <i data-lucide="external-link" class="w-4 h-4 mr-1"></i>
                Mở
              </button>
              <button class="flex-1 bg-gray-200 text-gray-800 py-2 rounded-full hover:bg-gray-300 transition-colors flex items-center justify-center">
                Chi tiết
              </button>
            </div>
          </div>
        `;
        appsContainer.appendChild(appElement);
      });
      
      // Initialize Lucide icons
      lucide.createIcons();
      
      // Add event listeners for remove buttons
      document.querySelectorAll('.remove-favorite').forEach(btn => {
        btn.addEventListener('click', function() {
          const id = parseInt(this.getAttribute('data-id'));
          const type = this.getAttribute('data-type');
          const name = this.getAttribute('data-name');
          showConfirmationModal(id, type, name);
        });
      });
    }

    // Function to load saved items
    function loadSavedItems(filterType = 'all') {
      const currentUser = getCurrentUser();
      const savedContainer = document.getElementById('savedContainer');
      const savedEmpty = document.getElementById('savedEmpty');
      const savedCount = document.getElementById('savedCount');
      
      if (!currentUser) {
        window.location.href = 'login.php';
        return;
      }
      
      const favoriteArticles = currentUser.favoriteArticles || [];
      const favoriteVideos = currentUser.favoriteVideos || [];
      
      // Filter items based on type
      let savedItems = [];
      if (filterType === 'all') {
        savedItems = [...favoriteArticles, ...favoriteVideos];
      } else if (filterType === 'articles') {
        savedItems = favoriteArticles;
      } else if (filterType === 'videos') {
        savedItems = favoriteVideos;
      }
      
      // Update count
      savedCount.textContent = `${savedItems.length} mục`;
      
      // Show/hide empty state
      if (savedItems.length === 0) {
        savedContainer.classList.add('hidden');
        savedEmpty.classList.remove('hidden');
        return;
      }
      
      savedContainer.classList.remove('hidden');
      savedEmpty.classList.add('hidden');
      
      // Clear container
      savedContainer.innerHTML = '';
      
      // Filter by search term if any
      const searchTerm = document.getElementById('searchInput').value.toLowerCase();
      const filteredItems = searchTerm ? 
        savedItems.filter(item => 
          (item.title && item.title.toLowerCase().includes(searchTerm)) || 
          (item.description && item.description.toLowerCase().includes(searchTerm)) ||
          (item.excerpt && item.excerpt.toLowerCase().includes(searchTerm))
        ) : 
        savedItems;
      
      // Render saved items
      filteredItems.forEach(item => {
        const isArticle = item.type === 'article';
        const itemElement = document.createElement('div');
        itemElement.className = 'favorite-item bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow';
        
        if (isArticle) {
          itemElement.innerHTML = `
            <div class="flex">
              <div class="w-1/3 relative">
                <img src="${item.image}" alt="${item.title}" class="w-full h-full object-cover">
                <div class="absolute top-0 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded-br-lg">Bài viết</div>
              </div>
              <div class="w-2/3 p-4">
                <div class="flex justify-between items-start">
                  <h3 class="font-semibold mb-2">${item.title}</h3>
                  <button class="bg-white rounded-full p-1 hover:bg-blue-50 transition-colors remove-favorite" 
                          data-id="${item.id}" data-type="article" data-name="${item.title}">
                    <i data-lucide="trash-2" class="w-4 h-4 text-blue-500"></i>
                  </button>
                </div>
                <p class="text-sm text-gray-600 mb-3 line-clamp-2">${item.excerpt}</p>
                <div class="flex justify-between items-center">
                  <span class="text-xs text-gray-500">${formatDate(item.date)}</span>
                  <a href="#" class="text-blue-500 hover:text-blue-600 text-sm">Đọc tiếp</a>
                </div>
              </div>
            </div>
          `;
        } else {
          itemElement.innerHTML = `
            <div class="flex">
              <div class="w-1/3 relative">
                <img src="${item.thumbnail}" alt="${item.title}" class="w-full h-full object-cover">
                <div class="absolute top-0 left-0 bg-red-500 text-white text-xs px-2 py-1 rounded-br-lg">Video</div>
                <div class="absolute inset-0 flex items-center justify-center">
                  <div class="w-10 h-10 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                    <i data-lucide="play" class="w-5 h-5 text-white"></i>
                  </div>
                </div>
                <div class="absolute bottom-1 right-1 bg-black bg-opacity-70 text-white text-xs px-1 py-0.5 rounded">
                  ${item.duration}
                </div>
              </div>
              <div class="w-2/3 p-4">
                <div class="flex justify-between items-start">
                  <h3 class="font-semibold mb-2">${item.title}</h3>
                  <button class="bg-white rounded-full p-1 hover:bg-blue-50 transition-colors remove-favorite" 
                          data-id="${item.id}" data-type="video" data-name="${item.title}">
                    <i data-lucide="trash-2" class="w-4 h-4 text-blue-500"></i>
                  </button>
                </div>
                <p class="text-sm text-gray-600 mb-3 line-clamp-2">${item.description}</p>
                <div class="flex justify-between items-center">
                  <span class="text-xs text-gray-500">${item.views} lượt xem</span>
                  <a href="#" class="text-red-500 hover:text-red-600 text-sm">Xem video</a>
                </div>
              </div>
            </div>
          `;
        }
        
        savedContainer.appendChild(itemElement);
      });
      
      // Initialize Lucide icons
      lucide.createIcons();
      
      // Add event listeners for remove buttons
      document.querySelectorAll('.remove-favorite').forEach(btn => {
        btn.addEventListener('click', function() {
          const id = parseInt(this.getAttribute('data-id'));
          const type = this.getAttribute('data-type');
          const name = this.getAttribute('data-name');
          showConfirmationModal(id, type, name);
        });
      });
    }

    // Function to show confirmation modal
    function showConfirmationModal(id, type, name) {
      const modal = document.getElementById('confirmationModal');
      const modalTitle = document.getElementById('modalTitle');
      const modalMessage = document.getElementById('modalMessage');
      const modalIcon = document.getElementById('modalIcon');
      const confirmButton = document.getElementById('confirmButton');
      
      // Set item to remove
      itemToRemove = id;
      removeType = type;
      
      // Configure modal based on type
      if (type === 'product') {
        modalTitle.textContent = 'Xóa khỏi yêu thích?';
        modalMessage.textContent = `Bạn có chắc muốn xóa "${name}" khỏi danh sách sản phẩm yêu thích?`;
        modalIcon.innerHTML = '<i data-lucide="heart-off" class="h-6 w-6 text-red-600"></i>';
        modalIcon.className = 'mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4';
        confirmButton.className = 'px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors';
      } else if (type === 'app') {
        modalTitle.textContent = 'Xóa khỏi yêu thích?';
        modalMessage.textContent = `Bạn có chắc muốn xóa "${name}" khỏi danh sách ứng dụng yêu thích?`;
        modalIcon.innerHTML = '<i data-lucide="smartphone-x" class="h-6 w-6 text-red-600"></i>';
        modalIcon.className = 'mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4';
        confirmButton.className = 'px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors';
      } else if (type === 'article' || type === 'video') {
        modalTitle.textContent = 'Bỏ lưu?';
        modalMessage.textContent = `Bạn có chắc muốn bỏ lưu "${name}"?`;
        modalIcon.innerHTML = '<i data-lucide="bookmark-minus" class="h-6 w-6 text-blue-600"></i>';
        modalIcon.className = 'mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4';
        confirmButton.className = 'px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors';
      }
      
      // Show modal
      modal.classList.remove('hidden');
      modal.classList.add('flex');
      
      // Initialize Lucide icons
      lucide.createIcons();
    }

    // Function to hide confirmation modal
    function hideConfirmationModal() {
      const modal = document.getElementById('confirmationModal');
      modal.classList.add('hidden');
      modal.classList.remove('flex');
      
      // Reset variables
      itemToRemove = null;
      removeType = null;
    }

    // Function to remove item from favorites
    function removeFromFavorites() {
      if (!itemToRemove || !removeType) return;
      
      const currentUser = getCurrentUser();
      if (!currentUser) return;
      
      const users = JSON.parse(localStorage.getItem('users'));
      const userIndex = users.findIndex(u => u.id === currentUser.id);
      
      let itemArray;
      let successMessage;
      
      if (removeType === 'product') {
        itemArray = users[userIndex].favorites || [];
        successMessage = 'Đã xóa sản phẩm khỏi danh sách yêu thích!';
      } else if (removeType === 'app') {
        itemArray = users[userIndex].favoriteApps || [];
        successMessage = 'Đã xóa ứng dụng khỏi danh sách yêu thích!';
      } else if (removeType === 'article') {
        itemArray = users[userIndex].favoriteArticles || [];
        successMessage = 'Đã bỏ lưu bài viết!';
      } else if (removeType === 'video') {
        itemArray = users[userIndex].favoriteVideos || [];
        successMessage = 'Đã bỏ lưu video!';
      }
      
      const itemIndex = itemArray.findIndex(item => item.id === itemToRemove);
      if (itemIndex !== -1) {
        itemArray.splice(itemIndex, 1);
        
        // Update the appropriate array in the user object
        if (removeType === 'product') {
          users[userIndex].favorites = itemArray;
        } else if (removeType === 'app') {
          users[userIndex].favoriteApps = itemArray;
        } else if (removeType === 'article') {
          users[userIndex].favoriteArticles = itemArray;
        } else if (removeType === 'video') {
          users[userIndex].favoriteVideos = itemArray;
        }
        
        localStorage.setItem('users', JSON.stringify(users));
        sessionStorage.setItem('currentUser', JSON.stringify(users[userIndex]));
        
        // Reload the appropriate section
        if (removeType === 'product') {
          loadFavoriteProducts();
        } else if (removeType === 'app') {
          loadFavoriteApps();
        } else if (removeType === 'article' || removeType === 'video') {
          loadSavedItems(document.querySelector('.saved-filter-btn.active')?.dataset.type || 'all');
        }
        
        showToast(successMessage, 'success');
      }
      
      hideConfirmationModal();
    }

    // Function to add to cart
    function addToCart(productId) {
      const currentUser = getCurrentUser();
      if (!currentUser) {
        showToast('Vui lòng đăng nhập để thêm vào giỏ hàng!', 'error');
        return;
      }

      const product = mockProducts.find(p => p.id === productId);
      if (!product) return;

      const users = JSON.parse(localStorage.getItem('users'));
      const userIndex = users.findIndex(u => u.id === currentUser.id);

      if (!users[userIndex].cart) {
        users[userIndex].cart = [];
      }

      const cartItem = users[userIndex].cart.find(item => item.id === productId);
      if (cartItem) {
        cartItem.quantity++;
      } else {
        users[userIndex].cart.push({
          ...product,
          quantity: 1,
          addedAt: new Date().toISOString()
        });
      }

      localStorage.setItem('users', JSON.stringify(users));
      sessionStorage.setItem('currentUser', JSON.stringify(users[userIndex]));

      showToast('Đã thêm vào giỏ hàng!', 'success');
    }

    // Function to switch tabs
    function switchTab(tabId) {
      // Hide all sections
      document.getElementById('productsSection').classList.add('hidden');
      document.getElementById('appsSection').classList.add('hidden');
      document.getElementById('savedSection').classList.add('hidden');
      
      // Remove active class from all tabs
      document.getElementById('productsTab').classList.remove('active');
      document.getElementById('appsTab').classList.remove('active');
      document.getElementById('savedTab').classList.remove('active');
      
      // Show selected section and activate tab
      document.getElementById(tabId + 'Section').classList.remove('hidden');
      document.getElementById(tabId + 'Tab').classList.add('active');
      
      // Load content for the selected tab
      if (tabId === 'products') {
        loadFavoriteProducts();
      } else if (tabId === 'apps') {
        loadFavoriteApps();
      } else if (tabId === 'saved') {
        loadSavedItems();
      }
    }

    // Function to filter saved items
    function filterSavedItems(type) {
      // Update active button
      document.getElementById('allSavedBtn').classList.remove('bg-blue-500', 'text-white');
      document.getElementById('allSavedBtn').classList.add('bg-gray-200', 'text-gray-700');
      document.getElementById('articlesBtn').classList.remove('bg-blue-500', 'text-white');
      document.getElementById('articlesBtn').classList.add('bg-gray-200', 'text-gray-700');
      document.getElementById('videosBtn').classList.remove('bg-blue-500', 'text-white');
      document.getElementById('videosBtn').classList.add('bg-gray-200', 'text-gray-700');
      
      if (type === 'all') {
        document.getElementById('allSavedBtn').classList.remove('bg-gray-200', 'text-gray-700');
        document.getElementById('allSavedBtn').classList.add('bg-blue-500', 'text-white');
      } else if (type === 'articles') {
        document.getElementById('articlesBtn').classList.remove('bg-gray-200', 'text-gray-700');
        document.getElementById('articlesBtn').classList.add('bg-blue-500', 'text-white');
      } else if (type === 'videos') {
        document.getElementById('videosBtn').classList.remove('bg-gray-200', 'text-gray-700');
        document.getElementById('videosBtn').classList.add('bg-blue-500', 'text-white');
      }
      
      // Load filtered items
      loadSavedItems(type);
    }

    // Event listeners
    document.addEventListener('DOMContentLoaded', function() {
      // Load initial content
      switchTab('products');
      
      // Tab switching
      document.getElementById('productsTab').addEventListener('click', () => switchTab('products'));
      document.getElementById('appsTab').addEventListener('click', () => switchTab('apps'));
      document.getElementById('savedTab').addEventListener('click', () => switchTab('saved'));
      
      // Saved items filtering
      document.getElementById('allSavedBtn').addEventListener('click', () => filterSavedItems('all'));
      document.getElementById('articlesBtn').addEventListener('click', () => filterSavedItems('articles'));
      document.getElementById('videosBtn').addEventListener('click', () => filterSavedItems('videos'));
      
      // Search functionality
      let searchTimeout;
      document.getElementById('searchInput').addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
          const activeTab = document.querySelector('.tab-button.active').id;
          if (activeTab === 'productsTab') {
            loadFavoriteProducts();
          } else if (activeTab === 'appsTab') {
            loadFavoriteApps();
          } else if (activeTab === 'savedTab') {
            loadSavedItems(document.querySelector('.bg-blue-500').id === 'allSavedBtn' ? 'all' : 
                          document.querySelector('.bg-blue-500').id === 'articlesBtn' ? 'articles' : 'videos');
          }
        }, 300);
      });
      
      // Confirmation modal
      document.getElementById('cancelButton').addEventListener('click', hideConfirmationModal);
      document.getElementById('confirmButton').addEventListener('click', removeFromFavorites);
      
      // Close modal when clicking outside
      document.getElementById('confirmationModal').addEventListener('click', function(e) {
        if (e.target === this) {
          hideConfirmationModal();
        }
      });
    });
  </script>
</body>
</html>
