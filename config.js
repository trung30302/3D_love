/**
 * Cấu hình cho trang web tỏ tình/kỷ niệm
 * Bạn có thể dễ dàng thay đổi các thông tin dưới đây để tùy chỉnh trang web
 */

const CONFIG = {
    // Thông tin người nhận
    recipient: {
        name: "Người Yêu Của Tôi", // Thay đổi tên người nhận ở đây
    },
    
    // Nội dung lời nhắn
    messages: {
        main: [
            "Anh/Em đã mang đến cho cuộc đời tôi những khoảnh khắc tuyệt vời nhất. Mỗi ngày bên em/anh là một ngày tràn đầy hạnh phúc.",
            "Tình yêu của chúng ta như những vì sao trên bầu trời, lấp lánh và vĩnh cửu.",
            "Anh/Em yêu em/anh rất nhiều!"
        ],
        special: "Mãi mãi bên nhau!" // Thông điệp đặc biệt
    },
    
    // Cấu hình hiệu ứng 3D
    animation: {
        heartColor: 0xff5e5e, // Màu trái tim (định dạng hex)
        rotationSpeed: 0.01, // Tốc độ xoay
        floatSpeed: 0.5, // Tốc độ nổi lên xuống
        particleCount: 50, // Số lượng hạt
        particleColors: [0xff9a9e, 0xfad0c4, 0xffecd2], // Màu sắc các hạt
    },
    
    // Cấu hình âm thanh
    audio: {
        backgroundMusic: "audio/romantic.mp3", // Đường dẫn đến file nhạc nền
        autoplay: true, // Tự động phát nhạc khi tải trang
        volume: 0.5 // Âm lượng (0.0 - 1.0)
    }
};
