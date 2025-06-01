// Dữ liệu ảnh
let photos = [];
let currentPhotoIndex = 0;
let musicPlaying = false;
let giftOpened = false;
let audioContext = null;
let audio = null;

// Mảng các từ/icon xuất hiện khi click
const clickWords = ['💕', '❤️', '💖', '💗', '💝', '💘', 'Yêu em', 'Love', '😘', '🥰', '💑', '👫', '🌹', '✨', '💎', '🦋'];

// Khởi tạo trang
document.addEventListener('DOMContentLoaded', function() {
    // Ẩn loading sau 2 giây
    setTimeout(() => {
        document.getElementById('loading').classList.add('hidden');
    }, 2000);

    // Khởi tạo custom cursor (chỉ trên desktop)
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        initCustomCursor();
    }

    // Xử lý click hộp quà
    document.getElementById('giftBox').addEventListener('click', openGift);
    document.getElementById('giftBox').addEventListener('touchstart', function(e) {
        e.preventDefault(); // Ngăn chặn các hành vi mặc định trên mobile
        openGift();
    });

    // Xử lý click để tạo hiệu ứng
    document.addEventListener('click', createClickEffect);
    document.addEventListener('touchstart', function(e) {
        // Chuyển đổi sự kiện touch thành click effect
        const touch = e.touches[0];
        if (touch && giftOpened) {
            createClickEffect({
                clientX: touch.clientX,
                clientY: touch.clientY
            });
        }
    });

    // Khởi tạo hiệu ứng 3D chuột (chỉ trên desktop)
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        initMouseEffects();
    }

    // Thiết lập các nút điều khiển
    document.getElementById('addPhotoBtn').addEventListener('click', addPhoto);
    document.getElementById('editMessageBtn').addEventListener('click', editMessage);
    document.getElementById('musicBtn').addEventListener('click', toggleMusic);
    document.getElementById('resetGiftBtn').addEventListener('click', resetGift);

    // Xử lý khi chọn ảnh
    document.getElementById('photoInput').addEventListener('change', handlePhotoUpload);

    // Kiểm tra trạng thái đã lưu
    loadState();

    // Kiểm tra ngày đặc biệt
    checkSpecialDay();

    // Thêm xử lý phím tắt
    document.addEventListener('keydown', handleKeyboardShortcuts);

    // Tối ưu hiệu suất trên mobile
    optimizeForMobile();
});

// Custom cursor (chỉ trên desktop)
function initCustomCursor() {
    const cursor = document.getElementById('customCursor');
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX - 10 + 'px';
        cursor.style.top = e.clientY - 10 + 'px';
    });

    document.addEventListener('mousedown', () => {
        cursor.style.transform = 'scale(1.5)';
    });

    document.addEventListener('mouseup', () => {
        cursor.style.transform = 'scale(1)';
    });
}

// Mở hộp quà
function openGift() {
    if (giftOpened) return;
    
    giftOpened = true;
    const giftBox = document.getElementById('giftBox');
    const giftScreen = document.getElementById('giftScreen');
    const mainContainer = document.getElementById('mainContainer');
    const controls = document.getElementById('controls');

    // Tạo confetti
    createConfetti();

    // Animation mở hộp
    giftBox.classList.add('gift-opening');

    // Sau 1 giây ẩn màn hình hộp quà
    setTimeout(() => {
        giftScreen.classList.add('hidden');
        mainContainer.classList.add('visible');
        controls.classList.add('visible');

        // Bắt đầu các hiệu ứng
        createFloatingHearts();
        createParticles();
        startPhotoSlideshow();
        
        // Lưu trạng thái
        saveState();
    }, 1500);
}

// Tạo confetti khi mở hộp
function createConfetti() {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7', '#a55eea'];
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const confettiCount = isMobile ? 25 : 50; // Giảm số lượng trên mobile
    
    for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.top = '50%';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = Math.random() * 2 + 's';
            
            document.body.appendChild(confetti);
            
            setTimeout(() => {
                if (confetti.parentNode) {
                    confetti.parentNode.removeChild(confetti);
                }
            }, 3000);
        }, i * (isMobile ? 100 : 50)); // Tăng khoảng cách thời gian trên mobile
    }
}

// Tạo hiệu ứng khi click chuột
function createClickEffect(e) {
    if (!giftOpened) return;

    // Tạo hiệu ứng tròn lan rộng
    const effect = document.createElement('div');
    effect.className = 'click-effect';
    effect.style.left = e.clientX - 25 + 'px';
    effect.style.top = e.clientY - 25 + 'px';
    effect.style.width = '50px';
    effect.style.height = '50px';
    effect.style.border = '3px solid rgba(255,255,255,0.8)';
    effect.style.borderRadius = '50%';
    
    document.body.appendChild(effect);

    // Tạo text/icon xuất hiện
    const text = document.createElement('div');
    text.className = 'click-text';
    text.textContent = clickWords[Math.floor(Math.random() * clickWords.length)];
    text.style.left = e.clientX - 20 + 'px';
    text.style.top = e.clientY - 20 + 'px';
    
    document.body.appendChild(text);

    // Xóa các element sau khi animation hoàn thành
    setTimeout(() => {
        if (effect.parentNode) effect.parentNode.removeChild(effect);
        if (text.parentNode) text.parentNode.removeChild(text);
    }, 2000);
    
    // Phát âm thanh click (nếu không phải mobile)
    if (!window.matchMedia("(max-width: 768px)").matches) {
        try {
            playClickSound();
        } catch (error) {
            // Không làm gì nếu không thể tạo âm thanh
        }
    }
}

// Khởi tạo hiệu ứng 3D với chuột
function initMouseEffects() {
    document.addEventListener('mousemove', (e) => {
        if (!giftOpened) return;

        const container = document.querySelector('.main-container');
        const x = (e.clientX / window.innerWidth) - 0.5;
        const y = (e.clientY / window.innerHeight) - 0.5;
        
        // Giảm độ nghiêng để tránh hiệu ứng quá mức
        container.style.transform = `rotateY(${x * 5}deg) rotateX(${-y * 5}deg) scale(1)`;
    });
}

// Tạo trái tim bay
function createFloatingHearts() {
    const hearts = ['💖', '💕', '💗', '💝', '❤️', '💘'];
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const interval = isMobile ? 2000 : 1000; // Giảm tần suất trên mobile
    
    const heartInterval = setInterval(() => {
        if (!giftOpened) {
            clearInterval(heartInterval);
            return;
        }
        
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.innerHTML = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.animationDelay = Math.random() * 2 + 's';
        heart.style.animationDuration = (4 + Math.random() * 4) + 's';
        
        document.body.appendChild(heart);
        
        setTimeout(() => {
            if (heart.parentNode) {
                heart.parentNode.removeChild(heart);
            }
        }, 8000);
    }, interval);
}

// Tạo particles
function createParticles() {
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const interval = isMobile ? 1000 : 500; // Giảm tần suất trên mobile
    const maxParticles = isMobile ? 15 : 30; // Giới hạn số lượng particles
    let particleCount = 0;
    
    const particleInterval = setInterval(() => {
        if (!giftOpened) {
            clearInterval(particleInterval);
            return;
        }
        
        // Giới hạn số lượng particles để tránh làm chậm thiết bị
        if (particleCount >= maxParticles) {
            return;
        }
        
        particleCount++;
        
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.width = (2 + Math.random() * 4) + 'px';
        particle.style.height = particle.style.width;
        particle.style.animationDelay = Math.random() * 3 + 's';
        particle.style.animationDuration = (6 + Math.random() * 4) + 's';
        
        document.body.appendChild(particle);
        
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
                particleCount--;
            }
        }, 10000);
    }, interval);
}

// Thêm ảnh
function addPhoto() {
    document.getElementById('photoInput').click();
}

// Xử lý khi chọn ảnh
function handlePhotoUpload(e) {
    const files = Array.from(e.target.files);
    const container = document.getElementById('photoContainer');
    
    // Giới hạn số lượng ảnh để tránh làm chậm thiết bị
    const maxPhotos = 10;
    const filesToProcess = files.slice(0, maxPhotos - photos.length);
    
    filesToProcess.forEach(file => {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                photos.push(e.target.result);
                
                // Nếu đây là ảnh đầu tiên, thay thế placeholder
                if (photos.length === 1) {
                    const firstFrame = container.querySelector('.photo-frame');
                    firstFrame.innerHTML = `<img src="${e.target.result}" alt="Ảnh kỷ niệm">`;
                } else {
                    // Thêm frame mới
                    const frame = document.createElement('div');
                    frame.className = 'photo-frame';
                    frame.innerHTML = `<img src="${e.target.result}" alt="Ảnh kỷ niệm">`;
                    container.appendChild(frame);
                }
                
                // Lưu trạng thái
                saveState();
            };
            reader.readAsDataURL(file);
        }
    });
}

// Slideshow ảnh
function startPhotoSlideshow() {
    const frames = document.querySelectorAll('.photo-frame');
    if (frames.length <= 1) return;
    
    const slideshowInterval = setInterval(() => {
        if (!giftOpened) {
            clearInterval(slideshowInterval);
            return;
        }
        
        frames[currentPhotoIndex].classList.remove('active');
        currentPhotoIndex = (currentPhotoIndex + 1) % frames.length;
        frames[currentPhotoIndex].classList.add('active');
    }, 4000);
}

// Sửa lời chúc
function editMessage() {
    const currentMessage = document.getElementById('messageText').innerHTML;
    const cleanMessage = currentMessage.replace(/<br>/g, '\n').replace(/<.*?>/g, '');
    
    const newMessage = prompt('Nhập lời chúc mới:', cleanMessage);
    
    if (newMessage !== null && newMessage.trim() !== '') {
        document.getElementById('messageText').innerHTML = newMessage.replace(/\n/g, '<br>');
        
        // Lưu trạng thái
        saveState();
    }
}

// Bật/tắt nhạc nền
function toggleMusic() {
    const btn = document.getElementById('musicBtn');
    
    if (!musicPlaying) {
        // Tạo audio element nếu chưa có
        if (!audio) {
            audio = new Audio();
            audio.src = 'audio/romantic.mp3'; // Đường dẫn mặc định
            audio.loop = true;
            audio.volume = 0.3;
        }
        
        // Phát nhạc
        const playPromise = audio.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                btn.innerHTML = '🔇';
                musicPlaying = true;
            }).catch(error => {
                // Tự động phát không được phép trên nhiều trình duyệt mobile
                alert('Vui lòng tương tác với trang trước khi phát nhạc!');
            });
        }
    } else {
        // Dừng nhạc
        if (audio) {
            audio.pause();
        }
        btn.innerHTML = '🎵';
        musicPlaying = false;
    }
}

// Reset về màn hình hộp quà
function resetGift() {
    giftOpened = false;
    document.getElementById('giftScreen').classList.remove('hidden');
    document.getElementById('mainContainer').classList.remove('visible');
    document.getElementById('controls').classList.remove('visible');
    document.getElementById('giftBox').classList.remove('gift-opening');
    
    // Dừng tất cả hiệu ứng
    const hearts = document.querySelectorAll('.heart');
    const particles = document.querySelectorAll('.particle');
    const effects = document.querySelectorAll('.click-effect, .click-text, .confetti');
    
    hearts.forEach(heart => heart.remove());
    particles.forEach(particle => particle.remove());
    effects.forEach(effect => effect.remove());
    
    // Dừng nhạc
    if (audio && !audio.paused) {
        audio.pause();
        document.getElementById('musicBtn').innerHTML = '🎵';
        musicPlaying = false;
    }
}

// Hiệu ứng âm thanh khi click
function playClickSound() {
    // Tạo âm thanh đơn giản bằng Web Audio API
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.1);
}

// Tự động save trạng thái để không mất khi refresh
function saveState() {
    const state = {
        giftOpened: giftOpened,
        photos: photos,
        message: document.getElementById('messageText').innerHTML
    };
    localStorage.setItem('loveWebState', JSON.stringify(state));
}

// Khôi phục trạng thái
function loadState() {
    const savedState = localStorage.getItem('loveWebState');
    if (savedState) {
        try {
            const state = JSON.parse(savedState);
            
            if (state.giftOpened) {
                // Tự động mở hộp quà nếu đã từng mở
                setTimeout(() => {
                    openGift();
                }, 3000);
            }
            
            // Khôi phục ảnh
            if (state.photos && state.photos.length > 0) {
                photos = state.photos;
                const container = document.getElementById('photoContainer');
                
                // Thay thế ảnh đầu tiên
                if (photos.length > 0) {
                    container.querySelector('.photo-frame').innerHTML = `<img src="${photos[0]}" alt="Ảnh kỷ niệm">`;
                }
                
                // Thêm các ảnh còn lại
                for (let i = 1; i < photos.length; i++) {
                    const frame = document.createElement('div');
                    frame.className = 'photo-frame';
                    frame.innerHTML = `<img src="${photos[i]}" alt="Ảnh kỷ niệm">`;
                    container.appendChild(frame);
                }
            }
            
            // Khôi phục lời nhắn
            if (state.message) {
                document.getElementById('messageText').innerHTML = state.message;
            }
        } catch (error) {
            console.error('Lỗi khi khôi phục trạng thái:', error);
            localStorage.removeItem('loveWebState');
        }
    }
}

// Kiểm tra ngày đặc biệt
function checkSpecialDay() {
    const today = new Date();
    const specialDate = new Date(today.getFullYear(), 1, 14); // 14 tháng 2 (Valentine's Day)
    
    if (today.getMonth() === specialDate.getMonth() && today.getDate() === specialDate.getDate()) {
        document.getElementById('specialMessage').classList.remove('hidden');
    }
}
// Xử lý phím tắt