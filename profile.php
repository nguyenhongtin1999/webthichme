<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thông tin cá nhân</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.12/cropper.min.css" rel="stylesheet">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.12/cropper.min.js"></script>
    <script src="https://unpkg.com/lucide@latest"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap');
        body {
            font-family: 'Quicksand', sans-serif;
        }
        .gradient-bg {
            background: linear-gradient(135deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%);
        }
        .avatar-container {
            background: linear-gradient(45deg, #ff9a9e, #fad0c4, #ffecd2);
            animation: gradient 15s ease infinite;
            background-size: 400% 400%;
        }
        @keyframes gradient {
            0% {
                background-position: 0% 50%;
            }
            50% {
                background-position: 100% 50%;
            }
            100% {
                background-position: 0% 50%;
            }
        }
        .cute-input {
            transition: all 0.3s ease;
        }
        .cute-input:focus {
            transform: scale(1.02);
        }
        .cute-button {
            transition: all 0.3s ease;
        }
        .cute-button:hover {
            transform: translateY(-3px);
            box-shadow: 0 7px 14px rgba(50, 50, 93, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08);
        }
        .username-display {
            background: linear-gradient(45deg, #ff9a9e, #fad0c4);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        .spinner {
            border: 2px solid #f3f3f3;
            border-top: 2px solid #ff9a9e;
            border-radius: 50%;
            width: 16px;
            height: 16px;
            animation: spin 1s linear infinite;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    </style>
</head>
<body class="bg-pink-50">
    <div class="container mx-auto px-4 py-8">
        <h1 class="text-4xl font-bold text-center text-pink-600 mb-8">Thông tin cá nhân</h1>

        <div class="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
            <div class="md:flex">
                <div class="md:flex-shrink-0">
                    <div class="avatar-container p-8 flex flex-col items-center justify-center">
                        <div class="relative w-48 h-48 rounded-full overflow-hidden shadow-lg mb-4">
                            <img id="avatarPreview" src="/placeholder.svg?height=192&width=192" alt="Avatar" class="w-full h-full object-cover">
                        </div>
                        <div class="text-center mb-4">
                            <p id="usernameDisplay" class="username-display text-2xl font-bold">@username</p>
                        </div>
                        <input type="file" id="avatarUpload" class="hidden" accept="image/*">
                        <button id="changeAvatarBtn" class="cute-button bg-white text-pink-500 px-4 py-2 rounded-full font-semibold hover:bg-pink-100 transition-colors duration-300">
                            <i data-lucide="camera" class="w-5 h-5 inline-block mr-2"></i>Đổi ảnh đại diện
                        </button>
                    </div>
                </div>
                <div class="p-8 flex-grow">
                    <form id="profileForm" class="space-y-6">
                        <div>
                            <label for="username" class="block text-sm font-medium text-gray-700 mb-1">Tên người dùng</label>
                            <div class="relative">
                                <span class="absolute left-3 top-2 text-gray-500">@</span>
                                <input type="text" id="username" name="username" class="cute-input w-full pl-8 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent" placeholder="username">
                                <div id="usernameLoader" class="absolute right-3 top-2 hidden">
                                    <div class="spinner"></div>
                                </div>
                                <div id="usernameCheck" class="absolute right-3 top-2 hidden">
                                    <i data-lucide="check" class="w-5 h-5 text-green-500"></i>
                                </div>
                            </div>
                            <p id="usernameHelp" class="text-xs mt-1 hidden">Đang kiểm tra...</p>
                        </div>
                        <div>
                            <label for="fullName" class="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                            <input type="text" id="fullName" name="fullName" class="cute-input w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent">
                        </div>
                        <div>
                            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input type="email" id="email" name="email" class="cute-input w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent" readonly>
                        </div>
                        <div>
                            <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                            <input type="tel" id="phone" name="phone" class="cute-input w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent">
                        </div>
                        <div>
                            <label for="birthdate" class="block text-sm font-medium text-gray-700 mb-1">Ngày sinh</label>
                            <input type="date" id="birthdate" name="birthdate" class="cute-input w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent">
                        </div>
                        <div>
                            <label for="address" class="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                            <textarea id="address" name="address" rows="3" class="cute-input w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"></textarea>
                        </div>
                        <div class="flex justify-end">
                            <button type="submit" class="cute-button bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-full font-semibold hover:from-pink-600 hover:to-purple-600 transition-all duration-300">
                                <i data-lucide="save" class="w-5 h-5 inline-block mr-2"></i>Lưu thông tin
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal cho việc cắt ảnh -->
    <div id="cropperModal" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center hidden">
        <div class="bg-white rounded-lg p-8 max-w-2xl w-full">
            <h2 class="text-2xl font-bold mb-4 text-gray-800">Cắt ảnh đại diện</h2>
            <div id="cropperContainer" class="mb-4">
                <img id="cropperImage" src="/placeholder.svg?height=400&width=400" alt="Image to crop" class="max-w-full">
            </div>
            <div class="flex justify-end space-x-4">
                <button id="cancelCropBtn" class="cute-button bg-gray-300 text-gray-800 px-4 py-2 rounded-full font-semibold hover:bg-gray-400 transition-colors duration-300">Hủy</button>
                <button id="applyCropBtn" class="cute-button bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-full font-semibold hover:from-pink-600 hover:to-purple-600 transition-colors duration-300">Áp dụng</button>
            </div>
        </div>
    </div>

    <script>
        let cropper;
        let validationTimeout;
        const avatarPreview = document.getElementById('avatarPreview');
        const avatarUpload = document.getElementById('avatarUpload');
        const changeAvatarBtn = document.getElementById('changeAvatarBtn');
        const cropperModal = document.getElementById('cropperModal');
        const cropperImage = document.getElementById('cropperImage');
        const cancelCropBtn = document.getElementById('cancelCropBtn');
        const applyCropBtn = document.getElementById('applyCropBtn');
        const profileForm = document.getElementById('profileForm');
        const usernameDisplay = document.getElementById('usernameDisplay');
        const usernameInput = document.getElementById('username');
        const usernameLoader = document.getElementById('usernameLoader');
        const usernameCheck = document.getElementById('usernameCheck');
        const usernameHelp = document.getElementById('usernameHelp');

        // Khởi tạo các icon
        lucide.createIcons();

        // Lấy thông tin người dùng từ sessionStorage
        function getCurrentUser() {
            const userData = sessionStorage.getItem('currentUser');
            return userData ? JSON.parse(userData) : null;
        }

        // Cập nhật thông tin người dùng trong sessionStorage và localStorage
        function updateCurrentUser(updatedData) {
            const currentUser = getCurrentUser();
            const updatedUser = { ...currentUser, ...updatedData };
            sessionStorage.setItem('currentUser', JSON.stringify(updatedUser));
            
            // Cập nhật trong localStorage
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const userIndex = users.findIndex(u => u.id === updatedUser.id);
            if (userIndex !== -1) {
                users[userIndex] = updatedUser;
                localStorage.setItem('users', JSON.stringify(users));
            }
        }

        // Kiểm tra username có tồn tại không
        function isUsernameExists(username, currentUserId) {
            const users = JSON.parse(localStorage.getItem('users')) || [];
            return users.some(u => u.username === username && u.id !== currentUserId);
        }

        // Validate username - chỉ cho phép chữ thường không dấu, số, dấu gạch dưới và dấu chấm
        function validateUsername(username) {
            if (!username) return { valid: false, message: '' };
            if (username.length < 3 || username.length > 20) {
                return { valid: false, message: 'Tên người dùng phải từ 3-20 ký tự' };
            }
            
            // Kiểm tra ký tự đầu và cuối không được là dấu chấm hoặc gạch dưới
            if (username.startsWith('.') || username.startsWith('_') || 
                username.endsWith('.') || username.endsWith('_')) {
                return { valid: false, message: 'Dấu chấm và gạch dưới không được ở đầu hoặc cuối tên' };
            }
            
            // Regex chỉ cho phép: a-z (chữ thường), 0-9 (số), _ (gạch dưới), . (chấm)
            const regex = /^[a-z0-9_.]+$/;
            if (!regex.test(username)) {
                return { valid: false, message: 'Chỉ chứa chữ thường không dấu, số, dấu gạch dưới và dấu chấm' };
            }
            
            return { valid: true, message: '' };
        }

        // Validate email - kiểm tra email hợp lệ với các nhà cung cấp uy tín
        function validateEmail(email) {
            if (!email) return { valid: false, message: '' };
            
            // Regex kiểm tra format email cơ bản
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return { valid: false, message: 'Định dạng email không hợp lệ' };
            }
            
            // Danh sách các nhà cung cấp email uy tín
            const trustedDomains = [
                'gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 
                'icloud.com', 'protonmail.com', 'yandex.com', 'aol.com',
                'mail.com', 'zoho.com', 'tutanota.com', 'fastmail.com'
            ];
            
            const domain = email.split('@')[1]?.toLowerCase();
            if (!trustedDomains.includes(domain)) {
                return { valid: false, message: 'Vui lòng nhập đúng hoặc sử dụng email từ nhà cung cấp uy tín' };
            }
            
            return { valid: true, message: 'Email hợp lệ!' };
        }

        // Kiểm tra email có tồn tại không (trừ user hiện tại)
        function isEmailExists(email, currentUserId) {
            const users = JSON.parse(localStorage.getItem('users')) || [];
            return users.some(u => u.email === email && u.id !== currentUserId);
        }

        // Hiển thị validation message cho input
        function showValidationMessage(inputElement, validation, isSuccess = false) {
            // Tìm hoặc tạo element hiển thị message
            let messageElement = inputElement.parentNode.querySelector('.validation-message');
            if (!messageElement) {
                messageElement = document.createElement('p');
                messageElement.className = 'validation-message text-xs mt-1';
                inputElement.parentNode.appendChild(messageElement);
            }
            
            if (!validation.valid && validation.message) {
                inputElement.classList.remove('border-green-500');
                inputElement.classList.add('border-red-500');
                messageElement.textContent = validation.message;
                messageElement.className = 'validation-message text-xs mt-1 text-red-500';
                messageElement.classList.remove('hidden');
            } else if (isSuccess && validation.valid) {
                inputElement.classList.remove('border-red-500');
                inputElement.classList.add('border-green-500');
                messageElement.textContent = validation.message;
                messageElement.className = 'validation-message text-xs mt-1 text-green-500';
                messageElement.classList.remove('hidden');
            } else {
                inputElement.classList.remove('border-red-500', 'border-green-500');
                messageElement.classList.add('hidden');
            }
        }

        // Cập nhật hiển thị username
        function updateUsernameDisplay(username) {
            usernameDisplay.textContent = `@${username || 'username'}`;
        }

        // Load thông tin người dùng
        function loadUserProfile() {
            const user = getCurrentUser();
            if (user) {
                document.getElementById('username').value = user.username || '';
                document.getElementById('fullName').value = user.name || '';
                document.getElementById('email').value = user.email || '';
                document.getElementById('phone').value = user.phone || '';
                document.getElementById('birthdate').value = user.birthdate || '';
                document.getElementById('address').value = user.address || '';
                avatarPreview.src = user.avatar || '/placeholder.svg?height=192&width=192';
                updateUsernameDisplay(user.username);
            }
        }

        // Reset tất cả trạng thái validation
        function resetValidationState() {
            usernameHelp.classList.add('hidden');
            usernameLoader.classList.add('hidden');
            usernameCheck.classList.add('hidden');
            usernameInput.classList.remove('border-red-500', 'border-green-500');
        }

        // Xử lý validation với delay
        function validateUsernameWithDelay(username) {
            // Clear timeout trước đó
            if (validationTimeout) {
                clearTimeout(validationTimeout);
            }

            // Reset tất cả trạng thái
            resetValidationState();

            // Nếu username rỗng hoặc ít hơn 3 ký tự, không làm gì cả
            if (!username || username.length < 3) {
                return;
            }

            // Hiện loader
            usernameLoader.classList.remove('hidden');

            // Set timeout 1.5 giây
            validationTimeout = setTimeout(() => {
                usernameLoader.classList.add('hidden');
                
                const currentUser = getCurrentUser();
                const validation = validateUsername(username);
                
                if (!validation.valid) {
                    usernameInput.classList.add('border-red-500');
                    usernameHelp.textContent = validation.message;
                    usernameHelp.classList.remove('hidden', 'text-gray-500', 'text-green-500');
                    usernameHelp.classList.add('text-red-500');
                } else if (isUsernameExists(username, currentUser?.id)) {
                    usernameInput.classList.add('border-red-500');
                    usernameHelp.textContent = 'Tên người dùng đã tồn tại! Vui lòng chọn tên khác.';
                    usernameHelp.classList.remove('hidden', 'text-gray-500', 'text-green-500');
                    usernameHelp.classList.add('text-red-500');
                } else {
                    // Username hợp lệ - hiện dấu check
                    usernameInput.classList.add('border-green-500');
                    usernameCheck.classList.remove('hidden');
                    lucide.createIcons(); // Tạo lại icon check
                    usernameHelp.textContent = 'Tên người dùng hợp lệ!';
                    usernameHelp.classList.remove('hidden', 'text-gray-500', 'text-red-500');
                    usernameHelp.classList.add('text-green-500');
                }
            }, 1500);
        }

        // Xử lý thay đổi username real-time
        usernameInput.addEventListener('input', (e) => {
            const username = e.target.value;
            updateUsernameDisplay(username);
            validateUsernameWithDelay(username);
        });

        // Xử lý validation cho email
        document.getElementById('email').addEventListener('blur', (e) => {
            const email = e.target.value.trim();
            const currentUser = getCurrentUser();
            
            if (email) {
                const validation = validateEmail(email);
                if (!validation.valid) {
                    showValidationMessage(e.target, validation);
                } else if (isEmailExists(email, currentUser?.id)) {
                    showValidationMessage(e.target, { valid: false, message: 'Email đã được sử dụng bởi tài khoản khác!' });
                } else {
                    showValidationMessage(e.target, validation, true);
                }
            }
        });

        // Xóa border đỏ khi người dùng bắt đầu sửa email
        document.getElementById('email').addEventListener('input', (e) => {
            if (e.target.classList.contains('border-red-500')) {
                e.target.classList.remove('border-red-500');
                const messageElement = e.target.parentNode.querySelector('.validation-message');
                if (messageElement) {
                    messageElement.classList.add('hidden');
                }
            }
        });

        // Xử lý sự kiện khi người dùng chọn file ảnh
        changeAvatarBtn.addEventListener('click', () => avatarUpload.click());
        avatarUpload.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    cropperImage.src = e.target.result;
                    cropperModal.classList.remove('hidden');
                    if (cropper) {
                        cropper.destroy();
                    }
                    cropper = new Cropper(cropperImage, {
                        aspectRatio: 1,
                        viewMode: 1,
                    });
                };
                reader.readAsDataURL(file);
            }
        });

        // Xử lý sự kiện khi người dùng hủy cắt ảnh
        cancelCropBtn.addEventListener('click', () => {
            cropperModal.classList.add('hidden');
            if (cropper) {
                cropper.destroy();
            }
        });

        // Xử lý sự kiện khi người dùng áp dụng cắt ảnh
        applyCropBtn.addEventListener('click', () => {
            const croppedCanvas = cropper.getCroppedCanvas();
            avatarPreview.src = croppedCanvas.toDataURL();
            updateCurrentUser({ avatar: avatarPreview.src });
            cropperModal.classList.add('hidden');
            cropper.destroy();
        });

        // Xử lý sự kiện khi người dùng submit form
        profileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const currentUser = getCurrentUser();
            
            // Validate username
            if (username) {
                const validation = validateUsername(username);
                if (!validation.valid) {
                    alert(`Tên người dùng không hợp lệ! ${validation.message}`);
                    return;
                }
                
                if (isUsernameExists(username, currentUser?.id)) {
                    alert('Tên người dùng đã tồn tại! Vui lòng chọn tên khác.');
                    return;
                }
            }
            
            // Validate email
            if (email) {
                const emailValidation = validateEmail(email);
                if (!emailValidation.valid) {
                    alert(`Email không hợp lệ! ${emailValidation.message}`);
                    return;
                }
                
                if (isEmailExists(email, currentUser?.id)) {
                    alert('Email đã được sử dụng bởi tài khoản khác!');
                    return;
                }
            }
            
            const updatedData = {
                username: username,
                name: document.getElementById('fullName').value,
                email: email,
                phone: document.getElementById('phone').value,
                birthdate: document.getElementById('birthdate').value,
                address: document.getElementById('address').value,
            };
            
            updateCurrentUser(updatedData);
            alert('Thông tin đã được cập nhật thành công!');
        });

        // Load thông tin người dùng khi trang được tải
        window.addEventListener('DOMContentLoaded', loadUserProfile);
    </script>
</body>
</html>
