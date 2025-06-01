/**
 * Quản lý âm thanh cho trang web
 */

class AudioManager {
    constructor() {
        this.backgroundMusic = null;
        this.isMuted = !CONFIG.audio.autoplay;
        this.initialize();
    }

    initialize() {
        // Khởi tạo nhạc nền
        this.backgroundMusic = new Howl({
            src: [CONFIG.audio.backgroundMusic],
            loop: true,
            volume: CONFIG.audio.volume,
            autoplay: CONFIG.audio.autoplay
        });

        // Cập nhật trạng thái nút âm thanh
        this.updateAudioButtonState();

        // Thêm sự kiện cho nút bật/tắt âm thanh
        const audioButton = document.getElementById('toggle-audio');
        audioButton.addEventListener('click', () => this.toggleAudio());
    }

    toggleAudio() {
        if (this.isMuted) {
            this.backgroundMusic.play();
            this.isMuted = false;
        } else {
            this.backgroundMusic.pause();
            this.isMuted = true;
        }
        this.updateAudioButtonState();
    }

    updateAudioButtonState() {
        const container = document.querySelector('.controls');
        if (this.isMuted) {
            container.classList.add('muted');
        } else {
            container.classList.remove('muted');
        }
    }
}
// Khởi tạo AudioManager khi trang được tải
document.addEventListener('DOMContentLoaded', () => {
    window.audioManager = new AudioManager();
});