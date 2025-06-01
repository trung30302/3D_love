/**
 * Khởi tạo và quản lý trang web
 */

document.addEventListener('DOMContentLoaded', function() {
    // Cập nhật nội dung từ cấu hình
    updateContent();
    
    // Khởi tạo quản lý âm thanh
    const audioManager = new AudioManager();
    
    // Khởi tạo hiệu ứng 3D
    const animationManager = new AnimationManager();
});

/**
 * Cập nhật nội dung từ file cấu hình
 */
function updateContent() {
    // Cập nhật tên người nhận
    const recipientNameElement = document.getElementById('recipient-name');
    if (recipientNameElement) {
        recipientNameElement.textContent = CONFIG.recipient.name;
    }
    
    // Cập nhật lời nhắn
    const messageElement = document.getElementById('message');
    if (messageElement) {
        // Xóa nội dung cũ
        messageElement.innerHTML = '';
        
        // Thêm các đoạn lời nhắn
        CONFIG.messages.main.forEach((message, index) => {
            const paragraph = document.createElement('p');
            paragraph.textContent = message;
            
            // Đánh dấu đoạn cuối cùng là đặc biệt
            if (index === CONFIG.messages.main.length - 1) {
                paragraph.id = 'special-message';
            }
            
            messageElement.appendChild(paragraph);
        });
    }
    
    // Cập nhật thông điệp đặc biệt nếu có
    const specialMessageElement = document.getElementById('special-message');
    if (specialMessageElement && CONFIG.messages.special) {
        specialMessageElement.textContent = CONFIG.messages.special;
    }
}
