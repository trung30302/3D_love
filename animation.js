/**
 * Quản lý hiệu ứng 3D cho trang web
 */

class AnimationManager {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.heart = null;
        this.particles = [];
        this.container = document.getElementById('canvas-container');
        
        this.initialize();
    }

    initialize() {
        // Khởi tạo scene
        this.scene = new THREE.Scene();
        
        // Khởi tạo camera
        const aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
        this.camera.position.z = 5;
        
        // Khởi tạo renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setClearColor(0x000000, 0);
        this.container.appendChild(this.renderer.domElement);
        
        // Thêm ánh sáng
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);
        
        const pointLight = new THREE.PointLight(0xffffff, 1);
        pointLight.position.set(10, 10, 10);
        this.scene.add(pointLight);
        
        // Tạo trái tim 3D
        this.createHeart();
        
        // Tạo các hạt
        this.createParticles();
        
        // Bắt đầu animation
        this.animate();
        
        // Xử lý sự kiện resize
        window.addEventListener('resize', () => this.onWindowResize());
    }
    
    createHeart() {
        // Tạo hình dạng trái tim 2D
        const heartShape = new THREE.Shape();
        
        heartShape.moveTo(0, 0);
        heartShape.bezierCurveTo(0, -0.5, -1, -1.5, -2, -1.5);
        heartShape.bezierCurveTo(-3, -1.5, -3, 0, -3, 0);
        heartShape.bezierCurveTo(-3, 1, -2, 2, 0, 3);
        heartShape.bezierCurveTo(2, 2, 3, 1, 3, 0);
        heartShape.bezierCurveTo(3, 0, 3, -1.5, 2, -1.5);
        heartShape.bezierCurveTo(1, -1.5, 0, -0.5, 0, 0);
        
        // Tạo geometry từ hình dạng
        const extrudeSettings = {
            depth: 0.5,
            bevelEnabled: true,
            bevelSegments: 2,
            steps: 2,
            bevelSize: 0.1,
            bevelThickness: 0.1
        };
        
        const geometry = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
        
        // Tạo material
        const material = new THREE.MeshPhongMaterial({
            color: CONFIG.animation.heartColor,
            shininess: 100,
            specular: 0xffffff
        });
        
        // Tạo mesh
        this.heart = new THREE.Mesh(geometry, material);
        
        // Điều chỉnh vị trí và kích thước
        this.heart.scale.set(0.7, 0.7, 0.7);
        this.heart.rotation.x = Math.PI;
        this.heart.position.y = 0.5;
        
        this.scene.add(this.heart);
    }
    
    createParticles() {
        const particleCount = CONFIG.animation.particleCount;
        
        for (let i = 0; i < particleCount; i++) {
            // Tạo hình dạng hạt (hình cầu nhỏ)
            const geometry = new THREE.SphereGeometry(0.05, 8, 8);
            
            // Chọn ngẫu nhiên màu sắc từ cấu hình
            const colorIndex = Math.floor(Math.random() * CONFIG.animation.particleColors.length);
            const color = CONFIG.animation.particleColors[colorIndex];
            
            const material = new THREE.MeshPhongMaterial({
                color: color,
                shininess: 80,
                transparent: true,
                opacity: 0.7
            });
            
            const particle = new THREE.Mesh(geometry, material);
            
            // Đặt vị trí ngẫu nhiên xung quanh trái tim
            particle.position.x = (Math.random() - 0.5) * 6;
            particle.position.y = (Math.random() - 0.5) * 6;
            particle.position.z = (Math.random() - 0.5) * 6;
            
            // Lưu thông tin tốc độ cho mỗi hạt
            particle.userData = {
                speed: Math.random() * 0.02 + 0.01,
                direction: Math.random() > 0.5 ? 1 : -1,
                rotationSpeed: {
                    x: (Math.random() - 0.5) * 0.02,
                    y: (Math.random() - 0.5) * 0.02,
                    z: (Math.random() - 0.5) * 0.02
                }
            };
            
            this.particles.push(particle);
            this.scene.add(particle);
        }
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        // Xoay trái tim
        if (this.heart) {
            this.heart.rotation.y += CONFIG.animation.rotationSpeed;
            
            // Hiệu ứng nổi lên xuống
            const time = Date.now() * 0.001;
            this.heart.position.y = 0.5 + Math.sin(time * CONFIG.animation.floatSpeed) * 0.2;
        }
        
        // Cập nhật các hạt
        this.particles.forEach(particle => {
            // Di chuyển hạt
            particle.position.y += particle.userData.speed * particle.userData.direction;
            
            // Xoay hạt
            particle.rotation.x += particle.userData.rotationSpeed.x;
            particle.rotation.y += particle.userData.rotationSpeed.y;
            particle.rotation.z += particle.userData.rotationSpeed.z;
            
            // Đảo chiều khi đi quá xa
            if (Math.abs(particle.position.y) > 3) {
                particle.userData.direction *= -1;
            }
        });
        
        this.renderer.render(this.scene, this.camera);
    }
    
    onWindowResize() {
        const aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera.aspect = aspect;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }
}
