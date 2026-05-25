/>

```php file="admin/products-admin.php"
<?php
session_start();
require_once __DIR__ . '/../admin-auth.php';
ensureAdminAuthenticated();
?>
<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Quản trị sản phẩm</title>
<script src="https://cdn.tailwindcss.com"></script>
<script src="https://unpkg.com/lucide@latest"></script>
<style>
  /* Ngăn tràn ngang toàn trang */
  html, body {
    width: 100%;
    max-width: 100%;
    overflow-x: hidden;
  }
  /* Vùng cần cuộn ngang cục bộ (table) dùng overflow-x-auto để không tràn toàn trang */
  .scroll-shadow {
    -webkit-mask-image: linear-gradient(to bottom, black 85%, transparent);
    mask-image: linear-gradient(to bottom, black 85%, transparent);
  }
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>
</head>
<body class="bg-gray-50 text-gray-900">
<header class="bg-white border-b sticky top-0 z-40 w-full">
<div class="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
  <div class="flex items-center gap-3">
    <a href="../index.php" class="hidden sm:flex items-center gap-2 text-gray-600 hover:text-gray-900">
      <i data-lucide="arrow-left" class="w-5 h-5"></i>
      <span class="text-sm">Về trang chủ</span>
    </a>
    <h1 class="text-lg sm:text-xl font-semibold">Trang quản trị sản phẩm</h1>
  </div>
  <div class="flex items-center gap-2">
    <button id="btnAddProductHeader" class="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-md text-sm">
      <i data-lucide="plus" class="w-4 h-4"></i> <span class="hidden sm:inline">Thêm sản phẩm</span><span class="sm:hidden">Thêm</span>
    </button>
  </div>
</div>

<div class="max-w-7xl mx-auto px-4">
  <div class="bg-gray-100 rounded-lg p-1 flex gap-1">
    <button id="tabProducts" class="flex-1 py-2 rounded-md text-sm font-medium bg-white shadow">Sản phẩm</button>
    <button id="tabTags" class="flex-1 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900">Thẻ sản phẩm</button>
  </div>
</div>

<div id="filtersBar" class="max-w-7xl mx-auto px-4 py-2 w-full">
  <div class="flex flex-col sm:flex-row gap-2 sm:items-center">
    <div class="flex-1 flex items-center gap-2 w-full">
      <div class="relative flex-1 min-w-0">
        <i data-lucide="search" class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"></i>
        <input id="productSearch" class="w-full pl-9 pr-3 py-2 rounded-md border border-gray-300 text-sm" placeholder="Tìm theo tên, slug..." />
      </div>
      <div class="relative">
        <i data-lucide="layers" class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"></i>
        <select id="categoryFilter" class="appearance-none pl-9 pr-8 py-2 rounded-md border border-gray-300 text-sm bg-white max-w-[220px] w-full">
          <option value="">Tất cả danh mục</option>
        </select>
        <i data-lucide="chevron-down" class="w-4 h-4 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"></i>
      </div>
    </div>
    <div class="flex items-center gap-2 w-full sm:w-auto">
      <div class="relative">
        <i data-lucide="sort-desc" class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"></i>
        <select id="sortBy" class="appearance-none pl-9 pr-8 py-2 rounded-md border border-gray-300 text-sm bg-white max-w-[180px] w-full">
          <option value="created_desc">Mới nhất</option>
          <option value="created_asc">Cũ nhất</option>
          <option value="name_asc">Tên A→Z</option>
          <option value="name_desc">Tên Z→A</option>
          <option value="category_asc">Danh mục A→Z</option>
        </select>
        <i data-lucide="chevron-down" class="w-4 h-4 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"></i>
      </div>
      <div class="relative">
        <i data-lucide="list-filter" class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"></i>
        <select id="pageSize" class="appearance-none pl-9 pr-8 py-2 rounded-md border border-gray-300 text-sm bg-white max-w-[140px] w-full">
          <option value="8">8/trang</option>
          <option value="12">12/trang</option>
          <option value="24">24/trang</option>
          <option value="48">48/trang</option>
        </select>
        <i data-lucide="chevron-down" class="w-4 h-4 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"></i>
      </div>
      <button id="clearFilters" class="inline-flex items-center gap-1 px-3 py-2 rounded-md border border-gray-300 text-sm bg-white">
        <i data-lucide="x-circle" class="w-4 h-4"></i> Xóa lọc
      </button>
    </div>
  </div>
</div>
</header>

<main class="max-w-7xl mx-auto p-4 w-full overflow-x-hidden">
<section id="panelProducts" class="space-y-4">
  <div id="loadingState" class="bg-white border rounded-lg p-6 flex items-center gap-3">
    <i data-lucide="loader-2" class="w-5 h-5 animate-spin text-gray-400"></i>
    <p class="text-sm text-gray-600">Đang tải dữ liệu...</p>
  </div>

  <div id="emptyState" class="hidden bg-white border rounded-lg p-8 text-center">
    <i data-lucide="package-open" class="w-10 h-10 text-gray-400 mx-auto mb-3"></i>
    <p class="text-gray-600 mb-4">Chưa có sản phẩm nào.</p>
    <button id="btnAddProductEmpty" class="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md text-sm">
      <i data-lucide="plus" class="w-4 h-4"></i> Thêm sản phẩm đầu tiên
    </button>
  </div>

  <!-- Desktop table (ẩn trên mobile) + an toàn cuộn ngang cục bộ -->
  <div class="hidden md:block bg-white border rounded-lg overflow-x-auto">
    <table class="min-w-[900px] w-full text-sm">
      <thead class="bg-gray-50">
        <tr>
          <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
          <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Sản phẩm</th>
          <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Slug</th>
          <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Danh mục</th>
          <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Thẻ</th>
          <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
        </tr>
      </thead>
      <tbody id="productsTableBody" class="divide-y divide-gray-100"></tbody>
    </table>
  </div>

  <!-- Mobile cards -->
  <div id="productsCards" class="md:hidden grid grid-cols-1 gap-3"></div>

  <div id="paginationBar" class="hidden bg-white border rounded-lg p-3 flex items-center justify-between">
    <div class="text-sm text-gray-600">
      <span id="pageInfo">Trang 1</span>
    </div>
    <div class="flex items-center gap-2">
      <button id="prevPage" class="inline-flex items-center gap-1 px-3 py-2 rounded-md border border-gray-300 text-sm bg-white disabled:opacity-50 disabled:cursor-not-allowed">
        <i data-lucide="chevron-left" class="w-4 h-4"></i> Trước
      </button>
      <button id="nextPage" class="inline-flex items-center gap-1 px-3 py-2 rounded-md border border-gray-300 text-sm bg-white disabled:opacity-50 disabled:cursor-not-allowed">
        Sau <i data-lucide="chevron-right" class="w-4 h-4"></i>
      </button>
    </div>
  </div>
</section>

<section id="panelTags" class="hidden space-y-4">
  <div class="bg-white border rounded-lg p-4 flex items-center justify-between gap-2">
    <div class="relative w-full sm:w-auto">
      <i data-lucide="search" class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"></i>
      <input id="tagSearch" class="pl-9 pr-3 py-2 rounded-md border border-gray-300 text-sm w-full sm:w-64" placeholder="Tìm thẻ..." />
    </div>
    <button id="btnAddTag" class="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-md text-sm">
      <i data-lucide="plus" class="w-4 h-4"></i> Thêm thẻ
    </button>
  </div>

  <!-- Bọc table bằng overflow-x-auto để không làm tràn toàn trang -->
  <div class="bg-white border rounded-lg overflow-x-auto">
    <table class="min-w-[800px] w-full text-sm">
      <thead class="bg-gray-50">
        <tr>
          <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
          <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tên</th>
          <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Icon</th>
          <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Màu</th>
          <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Màu chữ</th>
          <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
        </tr>
      </thead>
      <tbody id="tagsTableBody" class="divide-y divide-gray-100"></tbody>
    </table>
  </div>
</section>
</main>

<!-- Product Modal (scrollable, compact) -->
<div id="productModal" class="fixed inset-0 modal-backdrop hidden items-center justify-center z-50 p-2 sm:p-4">
<div class="bg-white rounded-lg shadow-lg w-full max-w-[95vw] sm:max-w-2xl h-[90vh] flex flex-col">
  <!-- Header -->
  <div class="px-3 sm:px-4 py-2 sm:py-3 border-b flex items-center justify-between flex-none">
    <h3 id="productModalTitle" class="text-base sm:text-lg font-semibold">Thêm sản phẩm</h3>
    <button id="closeProductModal" class="p-2 rounded-md hover:bg-gray-100" aria-label="Đóng modal">
      <i data-lucide="x" class="w-5 h-5"></i>
    </button>
  </div>
  <!-- Body -->
  <div class="flex-1 overflow-y-auto">
    <form id="productForm" class="px-3 sm:px-4 py-3 grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
      <input type="hidden" id="productId" />
      <div class="md:col-span-2">
        <label class="block text-sm font-medium mb-1" for="productName">Tên sản phẩm</label>
        <input id="productName" class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" required />
      </div>

      <div>
        <label class="block text-sm font-medium mb-1" for="productSlug">Slug</label>
        <input id="productSlug" class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm break-all" placeholder="Tự tạo theo tên nếu để trống" />
      </div>

      <!-- Category: full list + custom -->
      <div>
        <label class="block text-sm font-medium mb-1">Danh mục</label>
        <div class="space-y-2">
          <div class="flex items-center gap-2">
            <select id="productCategorySelect" class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-white">
              <option value="">Chọn danh mục...</option>
              <!-- options sẽ được render bằng JS -->
              <option value="__custom__">Nhập danh mục mới...</option>
            </select>
            <button type="button" id="addCategoryBtn" class="inline-flex items-center justify-center p-2 rounded-md border border-gray-300 hover:bg-gray-50" title="Thêm danh mục" aria-label="Thêm danh mục">
              <i data-lucide="plus" class="w-4 h-4"></i>
            </button>
          </div>
          <input id="productCategory" class="hidden w-full rounded-md border border-gray-300 px-3 py-2 text-sm" placeholder="Nhập danh mục mới" />
        </div>
      </div>

      <!-- Images section -->
      <div class="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label class="block text-sm font-medium mb-1">Ảnh chính</label>
          <div class="flex items-start gap-3">
            <img id="productImagePreview" src="/placeholder.svg?height=64&width=64" alt="Xem trước ảnh" class="w-16 h-16 object-cover rounded border bg-gray-50" />
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-2">
                <button type="button" id="btnUploadMain" class="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-emerald-500 hover:bg-emerald-600 text-white text-xs">
                  <i data-lucide="upload" class="w-3.5 h-3.5"></i> Tải ảnh lên
                </button>
                <input type="file" id="mainImageFile" accept="image/*" class="hidden" />
              </div>
              <input id="productImage" class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm break-all" placeholder="https://..." />
              <p class="text-xs text-gray-500 mt-1">Có thể dán URL trực tiếp hoặc tải ảnh lên.</p>
            </div>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Thư viện ảnh</label>
          <div class="flex items-center gap-2 mb-2">
            <button type="button" id="btnUploadGallery" class="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-emerald-500 hover:bg-emerald-600 text-white text-xs">
              <i data-lucide="images" class="w-3.5 h-3.5"></i> Thêm ảnh
            </button>
            <input type="file" id="galleryFiles" accept="image/*" multiple class="hidden" />
          </div>
          <input id="productImages" class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm break-all" placeholder="https://img1.jpg, https://img2.jpg" />
          <div id="galleryPreview" class="mt-2 grid grid-cols-5 gap-2"></div>
        </div>
      </div>

      <div class="md:col-span-2">
        <label class="block text-sm font-medium mb-1" for="productDescription">Mô tả</label>
        <textarea id="productDescription" class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" rows="3" placeholder="Mô tả ngắn..."></textarea>
      </div>

      <div class="md:col-span-2">
        <div class="flex items-center justify-between mb-1">
          <label class="block text-sm font-medium">Thẻ sản phẩm</label>
          <div class="flex items-center gap-2">
            <div class="relative">
              <i data-lucide="search" class="w-4 h-4 text-gray-400 absolute left-2 top-1/2 -translate-y-1/2"></i>
              <input id="tagPickerSearch" class="pl-7 pr-2 py-1.5 rounded-md border border-gray-300 text-sm" placeholder="Lọc thẻ..." />
            </div>
            <button type="button" id="refreshTagsBtn" class="inline-flex items-center gap-1 px-2 py-1 rounded-md border border-gray-300 text-xs bg-white">
              <i data-lucide="refresh-ccw" class="w-3.5 h-3.5"></i> Tải thẻ
            </button>
          </div>
        </div>

        <!-- Selected tags meta actions -->
        <div class="flex items-center justify-between mb-2">
          <div class="text-xs text-gray-500"><span id="selectedTagsCount">0</span> thẻ đã chọn</div>
          <button type="button" id="clearAllTagsBtn" class="text-xs text-red-600 hover:underline">Xóa tất cả</button>
        </div>

        <!-- Chips of currently selected tags -->
        <div id="currentTagsChips" class="flex flex-wrap gap-1 mb-2"></div>

        <!-- Picker -->
        <div id="productTagsContainer" class="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-auto pr-1 scroll-shadow border rounded-md p-2"></div>
      </div>
    </form>
  </div>
  <!-- Footer -->
  <div class="px-3 sm:px-4 py-2 sm:py-3 border-t flex items-center justify-end gap-2 flex-none">
    <button type="button" class="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-gray-300 bg-white text-sm" id="cancelProduct">
      Hủy
    </button>
    <button form="productForm" type="submit" class="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-orange-500 hover:bg-orange-600 text-white text-sm">
      <i data-lucide="save" class="w-4 h-4"></i> Lưu
    </button>
  </div>
</div>
</div>

<!-- Tag Modal -->
<div id="tagModal" class="fixed inset-0 modal-backdrop hidden items-center justify-center z-50 p-4">
<div class="bg-white rounded-lg shadow-lg w-full max-w-lg">
  <div class="px-4 py-3 border-b flex items-center justify-between">
    <h3 id="tagModalTitle" class="text-base sm:text-lg font-semibold">Thêm thẻ</h3>
    <button id="closeTagModal" class="p-2 rounded-md hover:bg-gray-100" aria-label="Đóng modal">
      <i data-lucide="x" class="w-5 h-5"></i>
    </button>
  </div>
  <form id="tagForm" class="p-4 grid grid-cols-1 gap-4">
    <input type="hidden" id="tagId" />
    <div>
      <label class="block text-sm font-medium mb-1" for="tagName">Tên thẻ</label>
      <input id="tagName" class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" required />
    </div>
    <div>
      <label class="block text-sm font-medium mb-1" for="tagIcon">Icon (Lucide key)</label>
      <input id="tagIcon" class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" placeholder="sparkles, flame, tag..." />
    </div>
    <div>
      <label class="block text-sm font-medium mb-1" for="tagBg">Màu nền (class Tailwind)</label>
      <input id="tagBg" class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" placeholder="bg-orange-100" />
    </div>
    <div>
      <label class="block text-sm font-medium mb-1" for="tagText">Màu chữ (class Tailwind)</label>
      <input id="tagText" class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" placeholder="text-orange-700" />
    </div>
    <div class="mt-2 flex items-center justify-end gap-2">
      <button type="button" class="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-gray-300 bg-white text-sm" id="cancelTag">Hủy</button>
      <button type="submit" class="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-orange-500 hover:bg-orange-600 text-white text-sm">
        <i data-lucide="save" class="w-4 h-4"></i> Lưu
      </button>
    </div>
  </form>
</div>
</div>

<!-- Toast -->
<div id="toast" class="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 hidden">
<div class="bg-gray-900 text-white px-4 py-2 rounded-md text-sm shadow-lg flex items-center gap-2">
  <i data-lucide="check-circle-2" class="w-4 h-4 text-green-400"></i>
  <span id="toastMsg">Đã lưu</span>
</div>
</div>

<script>
let lucideIcons;
document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) {
    lucideIcons = window.lucide;
    lucideIcons.createIcons();
  }
});

const productsApi = 'products-api.php';
const tagsApi = 'tags-api.php';
const categoriesApi = 'categories-api.php';
const uploadApi = 'upload.php';

const tabProducts = document.getElementById('tabProducts');
const tabTags = document.getElementById('tabTags');
const panelProducts = document.getElementById('panelProducts');
const panelTags = document.getElementById('panelTags');
const filtersBar = document.getElementById('filtersBar');

tabProducts.addEventListener('click', () => {
  tabProducts.classList.add('bg-white','shadow','text-gray-900');
  tabTags.classList.remove('bg-white','shadow','text-gray-900');
  panelProducts.classList.remove('hidden');
  panelTags.classList.add('hidden');
  filtersBar.classList.remove('hidden');
  if (lucideIcons) lucideIcons.createIcons();
});
tabTags.addEventListener('click', () => {
  tabTags.classList.add('bg-white','shadow','text-gray-900');
  tabProducts.classList.remove('bg-white','shadow','text-gray-900');
  panelTags.classList.remove('hidden');
  panelProducts.classList.add('hidden');
  filtersBar.classList.add('hidden');
  if (lucideIcons) lucideIcons.createIcons();
});

let products = [];
let tags = [];
let categories = [];
let currentPage = 1;

const btnAddProductHeader = document.getElementById('btnAddProductHeader');
const btnAddProductEmpty = document.getElementById('btnAddProductEmpty');
const clearFilters = document.getElementById('clearFilters');

const productSearch = document.getElementById('productSearch');
const categoryFilter = document.getElementById('categoryFilter');
const sortBy = document.getElementById('sortBy');
const pageSize = document.getElementById('pageSize');

const productsTableBody = document.getElementById('productsTableBody');
const productsCards = document.getElementById('productsCards');
const paginationBar = document.getElementById('paginationBar');
const prevPageBtn = document.getElementById('prevPage');
const nextPageBtn = document.getElementById('nextPage');
const pageInfo = document.getElementById('pageInfo');
const loadingState = document.getElementById('loadingState');
const emptyState = document.getElementById('emptyState');

const tagSearch = document.getElementById('tagSearch');
const tagsTableBody = document.getElementById('tagsTableBody');

const toast = document.getElementById('toast');
const toastMsg = document.getElementById('toastMsg');

const productModal = document.getElementById('productModal');
const productModalTitle = document.getElementById('productModalTitle');
const productForm = document.getElementById('productForm');
const closeProductModal = document.getElementById('closeProductModal');
const cancelProduct = document.getElementById('cancelProduct');
const productId = document.getElementById('productId');
const productName = document.getElementById('productName');
const productSlug = document.getElementById('productSlug');

const productCategory = document.getElementById('productCategory'); // hidden/linked input
const productCategorySelect = document.getElementById('productCategorySelect');
const addCategoryBtn = document.getElementById('addCategoryBtn');

const productImage = document.getElementById('productImage');
const productImagePreview = document.getElementById('productImagePreview');
const btnUploadMain = document.getElementById('btnUploadMain');
const mainImageFile = document.getElementById('mainImageFile');
const btnUploadGallery = document.getElementById('btnUploadGallery');
const galleryFiles = document.getElementById('galleryFiles');
const productImages = document.getElementById('productImages');
const galleryPreview = document.getElementById('galleryPreview');

const productDescription = document.getElementById('productDescription');
const productTagsContainer = document.getElementById('productTagsContainer');
const tagPickerSearch = document.getElementById('tagPickerSearch');
const refreshTagsBtn = document.getElementById('refreshTagsBtn');

const currentTagsChips = document.getElementById('currentTagsChips');
const selectedTagsCount = document.getElementById('selectedTagsCount');
const clearAllTagsBtn = document.getElementById('clearAllTagsBtn');

const tagModal = document.getElementById('tagModal');
const tagModalTitle = document.getElementById('tagModalTitle');
const tagForm = document.getElementById('tagForm');
const closeTagModal = document.getElementById('closeTagModal');
const cancelTag = document.getElementById('cancelTag');
const tagId = document.getElementById('tagId');
const tagNameEl = document.getElementById('tagName');
const tagIconEl = document.getElementById('tagIcon');
const tagBgEl = document.getElementById('tagBg');
const tagTextEl = document.getElementById('tagText');

function slugify(str) {
  return (str || '')
    .toString()
    .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g,'')
    .trim()
    .replace(/\s+/g,'-')
    .replace(/-+/g,'-');
}

function showToast(message, icon = 'check-circle-2') {
  toastMsg.textContent = message;
  const iconEl = toast.querySelector('i');
  if (iconEl) iconEl.setAttribute('data-lucide', icon);
  toast.classList.remove('hidden');
  if (lucideIcons) lucideIcons.createIcons();
  setTimeout(() => { toast.classList.add('hidden'); }, 1800);
}

// Upload helpers (optional: used if upload.php is implemented)
async function uploadSingleFile(file) {
  const form = new FormData();
  form.append('file', file);
  const res = await fetch(uploadApi, { method: 'POST', body: form });
  if (!res.ok) throw new Error('Upload thất bại');
  const data = await res.json();
  return data.url;
}
async function uploadMultipleFiles(files) {
  const out = [];
  for (const f of files) {
    try { out.push(await uploadSingleFile(f)); } catch(e){ console.error(e); }
  }
  return out;
}

function updateMainPreview() {
  const url = (productImage.value || '').trim();
  productImagePreview.src = url || '/placeholder.svg?height=64&width=64';
}

// Gallery helpers
function parseGalleryCsv() {
  const v = (productImages.value || '').trim();
  if (!v) return [];
  return v.split(',').map(s => s.trim()).filter(Boolean);
}
function setGalleryCsv(list) {
  productImages.value = list.join(', ');
  renderGalleryPreview();
}
function renderGalleryPreview() {
  const urls = parseGalleryCsv();
  galleryPreview.innerHTML = '';
  urls.forEach((u, idx) => {
    const item = document.createElement('div');
    item.className = 'relative';
    item.innerHTML = `
      <img src="${u}" alt="gallery ${idx+1}" class="w-14 h-14 object-cover rounded border bg-gray-50" />
      <button type="button" class="absolute -top-2 -right-2 bg-white border rounded-full p-1 shadow" data-idx="${idx}" title="Xóa" aria-label="Xóa ảnh">
        <i data-lucide="x" class="w-3.5 h-3.5"></i>
      </button>
    `;
    galleryPreview.appendChild(item);
  });
  galleryPreview.querySelectorAll('button[data-idx]').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-idx'), 10);
      const arr = parseGalleryCsv();
      arr.splice(idx, 1);
      setGalleryCsv(arr);
    });
  });
  if (lucideIcons) lucideIcons.createIcons();
}

// Categories
async function loadCategories() {
  try {
    const res = await fetch(categoriesApi + '?action=list');
    const data = await res.json();
    categories = data.categories || [];
  } catch {
    categories = [];
  }
}
function getAllKnownCategories() {
  return Array.from(new Set([
    ...categories.map(c => c.name).filter(Boolean),
    ...products.map(p => p.category).filter(Boolean)
  ])).sort((a,b)=>a.localeCompare(b));
}
function renderProductCategorySelect(currentValue = '') {
  // Reset options (keep first "Chọn..." and last "__custom__")
  productCategorySelect.innerHTML = '';
  const defaultOpt = document.createElement('option');
  defaultOpt.value = '';
  defaultOpt.textContent = 'Chọn danh mục...';
  productCategorySelect.appendChild(defaultOpt);

  const list = getAllKnownCategories();
  list.forEach(name => {
    const opt = document.createElement('option');
    opt.value = name;
    opt.textContent = name;
    productCategorySelect.appendChild(opt);
  });

  const customOpt = document.createElement('option');
  customOpt.value = '__custom__';
  customOpt.textContent = 'Nhập danh mục mới...';
  productCategorySelect.appendChild(customOpt);

  // Resolve selection
  if (!currentValue) {
    productCategorySelect.value = '';
    productCategory.classList.add('hidden');
    productCategory.value = '';
    return;
  }
  if (list.includes(currentValue)) {
    productCategorySelect.value = currentValue;
    productCategory.classList.add('hidden');
    productCategory.value = currentValue;
  } else {
    productCategorySelect.value = '__custom__';
    productCategory.classList.remove('hidden');
    productCategory.value = currentValue;
  }
}

// Tags
function getTagById(id) {
  return tags.find(t => String(t.id) === String(id));
}
function getSelectedTagIdsFromUI() {
  return Array.from(productTagsContainer.querySelectorAll('input[type="checkbox"]:checked')).map(i => i.value);
}
function setSelectedTagIdsInUI(selectedIds) {
  productTagsContainer.querySelectorAll('input[type="checkbox"]').forEach(ch => {
    ch.checked = selectedIds.map(String).includes(String(ch.value));
  });
}
function updateSelectedTagsMeta() {
  const count = getSelectedTagIdsFromUI().length;
  selectedTagsCount.textContent = String(count);
}
function renderSelectedTagChips() {
  const selectedIds = getSelectedTagIdsFromUI();
  currentTagsChips.innerHTML = '';
  selectedIds.forEach(id => {
    const t = getTagById(id);
    if (!t) return;
    const chip = document.createElement('span');
    chip.className = `inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${t.color || 'bg-gray-100'} ${t.textColor || 'text-gray-700'}`;
    chip.innerHTML = `
      <i data-lucide="${t.icon || 'tag'}" class="w-3 h-3"></i>
      <span>${t.name}</span>
      <button type="button" data-remove-id="${t.id}" class="ml-1 rounded hover:bg-black/10 p-0.5" title="Gỡ thẻ" aria-label="Gỡ thẻ">
        <i data-lucide="x" class="w-3 h-3"></i>
      </button>
    `;
    currentTagsChips.appendChild(chip);
  });
  // Remove handlers
  currentTagsChips.querySelectorAll('button[data-remove-id]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-remove-id');
      const selected = getSelectedTagIdsFromUI().filter(sid => String(sid) !== String(id));
      setSelectedTagIdsInUI(selected);
      updateSelectedTagsMeta();
      renderSelectedTagChips();
      if (lucideIcons) lucideIcons.createIcons();
    });
  });
  if (lucideIcons) lucideIcons.createIcons();
}
function renderProductTagsSelection(selectedTagIds = []) {
  const q = (tagPickerSearch?.value || '').trim().toLowerCase();
  productTagsContainer.innerHTML = '';
  if (!tags.length) {
    const span = document.createElement('span');
    span.className = 'text-sm text-gray-500';
    span.textContent = 'Chưa có thẻ nào. Thêm tại tab "Thẻ sản phẩm".';
    productTagsContainer.appendChild(span);
    updateSelectedTagsMeta();
    currentTagsChips.innerHTML = '';
    return;
  }
  tags
    .filter(t => q ? (t.name || '').toLowerCase().includes(q) : true)
    .forEach(t => {
      const label = document.createElement('label');
      label.className = 'flex items-center gap-2 border rounded-md px-2 py-1';
      const input = document.createElement('input');
      input.type = 'checkbox';
      input.value = t.id;
      input.checked = selectedTagIds.map(String).includes(String(t.id));
      input.className = 'h-4 w-4';
      const icon = document.createElement('i');
      icon.setAttribute('data-lucide', t.icon || 'tag');
      const span = document.createElement('span');
      span.textContent = t.name;
      label.appendChild(input);
      label.appendChild(icon);
      label.appendChild(span);
      productTagsContainer.appendChild(label);
    });

  // Sync meta and chips
  updateSelectedTagsMeta();
  renderSelectedTagChips();

  // Listen for changes to keep chips in sync
  productTagsContainer.querySelectorAll('input[type="checkbox"]').forEach(ch => {
    ch.addEventListener('change', () => {
      updateSelectedTagsMeta();
      renderSelectedTagChips();
    });
  });

  if (lucideIcons) lucideIcons.createIcons();
}

function applyFiltersAndSort(list) {
  const q = productSearch.value.trim().toLowerCase();
  const cat = categoryFilter.value.trim().toLowerCase();
  let out = list.filter(p => {
    const okText = q ? ((p.name||'').toLowerCase().includes(q) || (p.slug||'').toLowerCase().includes(q)) : true;
    const okCat = cat ? (p.category||'').toLowerCase() === cat : true;
    return okText && okCat;
  });

  switch (sortBy.value) {
    case 'created_desc':
      out.sort((a,b) => {
        const ta = Date.parse(a.created_at || a.updated_at || 0);
        const tb = Date.parse(b.created_at || b.updated_at || 0);
        return (tb||0) - (ta||0);
      });
      break;
    case 'created_asc':
      out.sort((a,b) => {
        const ta = Date.parse(a.created_at || a.updated_at || 0);
        const tb = Date.parse(b.created_at || b.updated_at || 0);
        return (ta||0) - (tb||0);
      });
      break;
    case 'name_asc':
      out.sort((a,b) => (a.name||'').localeCompare(b.name||''));
      break;
    case 'name_desc':
      out.sort((a,b) => (b.name||'').localeCompare(a.name||''));
      break;
    case 'category_asc':
      out.sort((a,b) => (a.category||'').localeCompare(b.category||''));
      break;
  }
  return out;
}

function paginate(list) {
  const size = parseInt(pageSize.value, 10) || 12;
  const total = list.length;
  const pages = Math.max(1, Math.ceil(total / size));
  if (currentPage > pages) currentPage = pages;
  const start = (currentPage - 1) * size;
  const end = start + size;
  const items = list.slice(start, end);
  return { items, total, pages, size, start, end };
}

function rebuildCategoryFilterOptions() {
  const keepFirst = categoryFilter.querySelector('option[value=""]');
  categoryFilter.innerHTML = '';
  if (keepFirst) categoryFilter.appendChild(keepFirst);
  const list = getAllKnownCategories();
  list.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c;
    opt.textContent = c;
    categoryFilter.appendChild(opt);
  });
}

function renderProducts() {
  rebuildCategoryFilterOptions();

  const filtered = applyFiltersAndSort(products);
  productsTableBody.innerHTML = '';
  productsCards.innerHTML = '';

  if (!products.length) {
    emptyState.classList.remove('hidden');
  } else {
    emptyState.classList.add('hidden');
  }

  const { items, total, pages } = paginate(filtered);
  paginationBar.classList.remove('hidden');
  pageInfo.textContent = `Trang ${currentPage} / ${pages} • ${total} sản phẩm`;
  prevPageBtn.disabled = currentPage <= 1;
  nextPageBtn.disabled = currentPage >= pages;

  // Desktop table rows
  items.forEach(p => {
    const tr = document.createElement('tr');

    const tdId = document.createElement('td');
    tdId.className = 'px-3 py-2 align-top text-gray-500';
    tdId.textContent = p.id;

    const tdProd = document.createElement('td');
    tdProd.className = 'px-3 py-2 align-top';
    tdProd.innerHTML = `
      <div class="flex items-start gap-3">
        <img src="${p.image}" alt="${p.name}" class="w-14 h-14 object-cover rounded border" />
        <div>
          <div class="font-medium">${p.name || ''}</div>
          <div class="text-xs text-gray-500 line-clamp-2">${p.description || ''}</div>
        </div>
      </div>
    `;

    const tdSlug = document.createElement('td');
    tdSlug.className = 'px-3 py-2 align-top text-gray-700 break-all';
    tdSlug.textContent = p.slug || '';

    const tdCat = document.createElement('td');
    tdCat.className = 'px-3 py-2 align-top';
    tdCat.innerHTML = p.category
      ? `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-700">
           <i data-lucide="folder" class="w-3.5 h-3.5"></i>${p.category}
         </span>`
      : `<span class="text-gray-400">—</span>`;

    const tdTags = document.createElement('td');
    tdTags.className = 'px-3 py-2 align-top';
    const tagIds = p.tags || [];
    if (tagIds.length) {
      tagIds.forEach(id => {
        const t = tags.find(x => String(x.id) === String(id));
        if (!t) return;
        const span = document.createElement('span');
        span.className = `inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs mr-1 mb-1 ${t.color||'bg-gray-100'} ${t.textColor||'text-gray-700'}`;
        span.innerHTML = `<i data-lucide="${t.icon||'tag'}" class="w-3 h-3"></i><span>${t.name}</span>`;
        tdTags.appendChild(span);
      });
    } else {
      tdTags.innerHTML = `<span class="text-gray-400">—</span>`;
    }

    const tdAct = document.createElement('td');
    tdAct.className = 'px-3 py-2 align-top whitespace-nowrap';
    tdAct.innerHTML = `
      <div class="flex items-center gap-2">
        <button class="inline-flex items-center gap-1 px-2 py-1 rounded-md border border-gray-300 text-xs bg-white" data-action="edit" data-id="${p.id}">
          <i data-lucide="pencil" class="w-3.5 h-3.5"></i> Sửa
        </button>
        <button class="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-red-500 hover:bg-red-600 text-white text-xs" data-action="delete" data-id="${p.id}">
          <i data-lucide="trash-2" class="w-3.5 h-3.5"></i> Xóa
        </button>
      </div>
    `;

    tr.appendChild(tdId);
    tr.appendChild(tdProd);
    tr.appendChild(tdSlug);
    tr.appendChild(tdCat);
    tr.appendChild(tdTags);
    tr.appendChild(tdAct);
    productsTableBody.appendChild(tr);
  });

  // Mobile cards
  items.forEach(p => {
    const card = document.createElement('div');
    card.className = 'bg-white border rounded-lg overflow-hidden';
    card.innerHTML = `
      <div class="flex items-center gap-3 p-3">
        <img src="${p.image}" alt="${p.name}" class="w-16 h-16 object-cover rounded border" />
        <div class="flex-1 min-w-0">
          <div class="font-medium">${p.name || ''}</div>
          <div class="text-xs text-gray-500 break-all">${p.slug || ''}</div>
          <div class="mt-1">
            ${p.category
              ? `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-700">
                   <i data-lucide="folder" class="w-3 h-3"></i>${p.category}
                 </span>`
              : ``}
          </div>
        </div>
      </div>
      <div class="px-3 pb-3 flex items-center justify-end gap-2">
        <button class="inline-flex items-center gap-1 px-3 py-1.5 rounded-md border border-gray-300 text-xs bg-white" data-action="edit" data-id="${p.id}">
          <i data-lucide="pencil" class="w-3.5 h-3.5"></i> Sửa
        </button>
        <button class="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-red-500 hover:bg-red-600 text-white text-xs" data-action="delete" data-id="${p.id}">
          <i data-lucide="trash-2" class="w-3.5 h-3.5"></i> Xóa
        </button>
      </div>
    `;
    productsCards.appendChild(card);
  });

  document.querySelectorAll('button[data-action="edit"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.getAttribute('data-id'));
      const p = products.find(x => x.id === id);
      openProductModal('edit', p);
    });
  });
  document.querySelectorAll('button[data-action="delete"]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = parseInt(btn.getAttribute('data-id'));
      if (!confirm('Xóa sản phẩm này?')) return;
      const res = await fetch(productsApi + '?action=delete', {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        showToast('Đã xóa sản phẩm', 'trash-2');
        await loadAll();
      } else {
        alert('Xóa sản phẩm thất bại');
      }
    });
  });

  if (lucideIcons) lucideIcons.createIcons();
}

function renderTagsTable() {
  const q = (tagSearch?.value || '').trim().toLowerCase();
  tagsTableBody.innerHTML = '';
  tags
    .filter(t => q ? (t.name||'').toLowerCase().includes(q) : true)
    .forEach(t => {
      const tr = document.createElement('tr');

      const tdId = document.createElement('td');
      tdId.className = 'px-3 py-2 align-top text-gray-500';
      tdId.textContent = t.id;

      const tdName = document.createElement('td');
      tdName.className = 'px-3 py-2 align-top font-medium';
      tdName.textContent = t.name;

      const tdIcon = document.createElement('td');
      tdIcon.className = 'px-3 py-2 align-top';
      tdIcon.innerHTML = `<i data-lucide="${t.icon || 'tag'}" class="w-4 h-4"></i>`;

      const tdBg = document.createElement('td');
      tdBg.className = 'px-3 py-2 align-top';
      tdBg.innerHTML = `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${t.color || 'bg-gray-100'} ${t.textColor || 'text-gray-700'}">${t.color || 'bg-gray-100'}</span>`;

      const tdText = document.createElement('td');
      tdText.className = 'px-3 py-2 align-top';
      tdText.innerHTML = `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border border-gray-200">${t.textColor || 'text-gray-700'}</span>`;

      const tdAct = document.createElement('td');
      tdAct.className = 'px-3 py-2 align-top whitespace-nowrap';
      tdAct.innerHTML = `
        <div class="flex items-center gap-2">
          <button class="inline-flex items-center gap-1 px-2 py-1 rounded-md border border-gray-300 text-xs bg-white" data-action="edit-tag" data-id="${t.id}">
            <i data-lucide="pencil" class="w-3.5 h-3.5"></i> Sửa
          </button>
          <button class="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-red-500 hover:bg-red-600 text-white text-xs" data-action="delete-tag" data-id="${t.id}">
            <i data-lucide="trash-2" class="w-3.5 h-3.5"></i> Xóa
          </button>
        </div>
      `;

      tr.appendChild(tdId);
      tr.appendChild(tdName);
      tr.appendChild(tdIcon);
      tr.appendChild(tdBg);
      tr.appendChild(tdText);
      tr.appendChild(tdAct);
      tagsTableBody.appendChild(tr);
    });

  tagsTableBody.querySelectorAll('button[data-action="edit-tag"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const t = tags.find(x => String(x.id) === String(id));
      openTagModal('edit', t);
    });
  });
  tagsTableBody.querySelectorAll('button[data-action="delete-tag"]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.getAttribute('data-id');
      if (!confirm('Xóa thẻ này? Thẻ sẽ được gỡ khỏi mọi sản phẩm đang sử dụng.')) return;
      const res = await fetch(tagsApi + '?action=delete', {
        method:'POST',
        headers:{ 'Content-Type':'application/json' },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        showToast('Đã xóa thẻ', 'trash-2');
        await loadAll();
      } else {
        alert('Xóa thẻ thất bại');
      }
    });
  });

  if (lucideIcons) lucideIcons.createIcons();
}

async function loadAll() {
  loadingState.classList.remove('hidden');
  try {
    const [resP, resT] = await Promise.all([
      fetch(productsApi + '?action=list'),
      fetch(tagsApi + '?action=list'),
    ]);
    const dataP = await resP.json();
    const dataT = await resT.json();
    products = dataP.products || [];
    tags = dataT.tags || [];

    products.forEach(p => { if (typeof p.id === 'string') p.id = parseInt(p.id, 10); });

    await loadCategories();

    renderProducts();
    renderTagsTable();
  } catch (e) {
    alert('Không thể tải dữ liệu. Vui lòng thử lại.');
  } finally {
    loadingState.classList.add('hidden');
  }
}

// Open/Close modals
function openProductModal(mode, data = null) {
  productModalTitle.textContent = mode === 'edit' ? 'Sửa sản phẩm' : 'Thêm sản phẩm';
  if (data) {
    productId.value = data.id || '';
    productName.value = data.name || '';
    productSlug.value = data.slug || '';
    // Category: will render select then resolve value
    // Images
    productImage.value = data.image || '';
    productImages.value = (data.images || []).join(', ');
    // Description
    productDescription.value = data.description || '';
    // Tags
    renderProductTagsSelection((data.tags || []).map(String));
    // Category select after categories are loaded
    renderProductCategorySelect(data.category || '');
  } else {
    productForm.reset();
    productId.value = '';
    renderProductTagsSelection([]);
    renderProductCategorySelect('');
  }
  updateMainPreview();
  renderGalleryPreview();

  productModal.classList.remove('hidden');
  productModal.classList.add('flex');
  if (lucideIcons) lucideIcons.createIcons();
}
function closeProduct() {
  productModal.classList.add('hidden');
  productModal.classList.remove('flex');
}

function openTagModal(mode, data = null) {
  tagModalTitle.textContent = mode === 'edit' ? 'Sửa thẻ' : 'Thêm thẻ';
  if (data) {
    tagId.value = data.id || '';
    tagNameEl.value = data.name || '';
    tagIconEl.value = data.icon || '';
    tagBgEl.value = data.color || '';
    tagTextEl.value = data.textColor || '';
  } else {
    tagForm.reset();
    tagId.value = '';
  }
  tagModal.classList.remove('hidden');
  tagModal.classList.add('flex');
  if (lucideIcons) lucideIcons.createIcons();
}
function closeTag() {
  tagModal.classList.add('hidden');
  tagModal.classList.remove('flex');
}

// Events: Filters/Pagination
productSearch.addEventListener('input', () => { currentPage = 1; renderProducts(); });
categoryFilter.addEventListener('change', () => { currentPage = 1; renderProducts(); });
sortBy.addEventListener('change', () => { currentPage = 1; renderProducts(); });
pageSize.addEventListener('change', () => { currentPage = 1; renderProducts(); });
clearFilters.addEventListener('click', () => {
  productSearch.value = '';
  categoryFilter.value = '';
  sortBy.value = 'created_desc';
  currentPage = 1;
  renderProducts();
});
prevPageBtn.addEventListener('click', () => { if (currentPage > 1) { currentPage--; renderProducts(); } });
nextPageBtn.addEventListener('click', () => { currentPage++; renderProducts(); });

btnAddProductHeader.addEventListener('click', () => openProductModal('create'));
btnAddProductEmpty?.addEventListener('click', () => openProductModal('create'));

closeProductModal.addEventListener('click', closeProduct);
cancelProduct.addEventListener('click', closeProduct);

document.getElementById('btnAddTag').addEventListener('click', () => openTagModal('create'));
closeTagModal.addEventListener('click', closeTag);
cancelTag.addEventListener('click', closeTag);

// Auto slug
productName.addEventListener('input', () => {
  if (!productSlug.value) productSlug.value = slugify(productName.value);
});

// Category select interactions
productCategorySelect.addEventListener('change', () => {
  const v = productCategorySelect.value;
  if (v === '__custom__') {
    productCategory.classList.remove('hidden');
    productCategory.value = '';
    productCategory.focus();
  } else {
    productCategory.classList.add('hidden');
    productCategory.value = v || '';
  }
});
// Quick add category
addCategoryBtn.addEventListener('click', async () => {
  const name = (prompt('Nhập tên danh mục mới:') || '').trim();
  if (!name) return;
  try {
    const res = await fetch(categoriesApi + '?action=upsert', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    });
    if (!res.ok) throw new Error();
    await loadCategories();
    renderProductCategorySelect(name);
    rebuildCategoryFilterOptions();
    showToast('Đã thêm danh mục');
  } catch {
    alert('Thêm danh mục thất bại');
  }
});

// Tag picker: filter and refresh
tagPickerSearch.addEventListener('input', () => {
  const selected = getSelectedTagIdsFromUI();
  renderProductTagsSelection(selected);
});
refreshTagsBtn.addEventListener('click', async () => {
  const resT = await fetch(tagsApi + '?action=list');
  const dataT = await resT.json();
  tags = dataT.tags || [];
  const selected = getSelectedTagIdsFromUI();
  renderProductTagsSelection(selected);
  if (lucideIcons) lucideIcons.createIcons();
});
// Clear all selected tags
clearAllTagsBtn.addEventListener('click', () => {
  setSelectedTagIdsInUI([]);
  updateSelectedTagsMeta();
  renderSelectedTagChips();
});

// Upload triggers
btnUploadMain.addEventListener('click', () => mainImageFile.click());
mainImageFile.addEventListener('change', async () => {
  const file = mainImageFile.files?.[0];
  if (!file) return;
  try {
    const url = await uploadSingleFile(file);
    productImage.value = url;
    updateMainPreview();
    showToast('Đã tải ảnh chính');
  } catch (e) {
    alert('Tải ảnh thất bại');
  } finally {
    mainImageFile.value = '';
  }
});
productImage.addEventListener('input', updateMainPreview);

btnUploadGallery.addEventListener('click', () => galleryFiles.click());
galleryFiles.addEventListener('change', async () => {
  const files = Array.from(galleryFiles.files || []);
  if (!files.length) return;
  try {
    const urls = await uploadMultipleFiles(files);
    const current = parseGalleryCsv();
    setGalleryCsv([...current, ...urls]);
    showToast('Đã thêm ảnh thư viện');
  } catch (e) {
    alert('Tải ảnh thất bại');
  } finally {
    galleryFiles.value = '';
  }
});
productImages.addEventListener('input', renderGalleryPreview);

// Submit product
productForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const desiredSlug = (productSlug.value || slugify(productName.value)).trim();
  const editingId = productId.value ? parseInt(productId.value, 10) : null;
  const dup = products.find(p => p.slug === desiredSlug && p.id !== editingId);
  if (dup) {
    alert('Slug đã tồn tại. Vui lòng chọn slug khác.');
    return;
  }

  // Determine category (from select or custom input)
  let categoryValue = '';
  if (productCategorySelect.value === '__custom__') {
    categoryValue = productCategory.value.trim();
  } else {
    categoryValue = productCategorySelect.value || productCategory.value.trim();
  }

  const selectedTagIds = getSelectedTagIdsFromUI();

  const payload = {
    id: editingId,
    name: productName.value.trim(),
    slug: desiredSlug,
    category: categoryValue,
    image: productImage.value.trim(),
    images: productImages.value ? productImages.value.split(',').map(s => s.trim()).filter(Boolean) : [],
    description: productDescription.value.trim(),
    tags: selectedTagIds
  };

  const res = await fetch(productsApi + '?action=upsert', {
    method:'POST',
    headers:{ 'Content-Type':'application/json' },
    body: JSON.stringify(payload)
  });
  if (res.ok) {
    closeProduct();
    showToast('Đã lưu sản phẩm');
    await loadAll();
  } else {
    alert('Lưu sản phẩm thất bại');
  }
});

// Tag modal submit
tagForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const payload = {
    id: tagId.value || null,
    name: tagNameEl.value.trim(),
    icon: tagIconEl.value.trim() || 'tag',
    color: tagBgEl.value.trim() || 'bg-gray-100',
    textColor: tagTextEl.value.trim() || 'text-gray-700'
  };
  const res = await fetch(tagsApi + '?action=upsert', {
    method:'POST',
    headers:{ 'Content-Type':'application/json' },
    body: JSON.stringify(payload)
  });
  if (res.ok) {
    closeTag();
    showToast('Đã lưu thẻ');
    await loadAll();
  } else {
    alert('Lưu thẻ thất bại');
  }
});

// Initial load
loadAll();

// Close on backdrop click
productModal.addEventListener('click', (e) => { if (e.target === productModal) closeProduct(); });
tagModal.addEventListener('click', (e) => { if (e.target === tagModal) closeTag(); });
</script>
</body>
</html>
