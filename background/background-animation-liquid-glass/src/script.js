        const blocks = document.querySelectorAll('.color-block');
        const container = document.querySelector('.color');
        let containerRect = container.getBoundingClientRect();

        const positions = Array.from({length: 10}, () => ({
            x: Math.random() * 80 + 10,
            y: Math.random() * 80 + 10
        }));

        const directions = Array.from({length: 10}, () => ({
            dx: (Math.random() - 0.5) * 2,
            dy: (Math.random() - 0.5) * 2
        }));
        
        const speeds = Array.from({length: 10}, () => Math.random() * 0.4 + 0.2);

        const pulseParams = Array.from({length: 10}, () => ({
            scale: Math.random() * 0.5 + 0.8,
            speed: Math.random() * 0.005 + 0.005,
            direction: 1
        }));

        const sizes = Array.from({length: 10}, () => ({
            width: Math.random() * 200 + 150,
            height: Math.random() * 200 + 150
        }));
        
        function updatePositions() {
            const containerWidth = containerRect.width;
            const containerHeight = containerRect.height;
            
            positions.forEach((pos, index) => {
                const block = blocks[index];
                const dir = directions[index];
                const speed = speeds[index];
                const pulse = pulseParams[index];
                const size = sizes[index];

                pos.x += dir.dx * speed;
                pos.y += dir.dy * speed;
                
                if (pos.x <= 0 || pos.x >= 100) {
                    dir.dx *= -1;
                    dir.dy += (Math.random() - 0.5) * 0.5;
                }
                
                if (pos.y <= 0 || pos.y >= 100) {
                    dir.dy *= -1;
                    dir.dx += (Math.random() - 0.5) * 0.5;
                }

                pos.x = Math.max(0, Math.min(100, pos.x));
                pos.y = Math.max(0, Math.min(100, pos.y));

                pulse.scale += pulse.speed * pulse.direction;
                if (pulse.scale > 1.3 || pulse.scale < 0.7) {
                    pulse.direction *= -1;
                }
                
                block.style.width = `${size.width * pulse.scale}px`;
                block.style.height = `${size.height * pulse.scale}px`;
                block.style.left = `calc(${pos.x}% - ${size.width * pulse.scale / 2}px)`;
                block.style.top = `calc(${pos.y}% - ${size.height * pulse.scale / 2}px)`;
            });
            
            requestAnimationFrame(updatePositions);
        }
        
        function initBlocks() {
            blocks.forEach((block, index) => {
                const pos = positions[index];
                const size = sizes[index];
                
                block.style.width = `${size.width}px`;
                block.style.height = `${size.height}px`;
                block.style.left = `calc(${pos.x}% - ${size.width/2}px)`;
                block.style.top = `calc(${pos.y}% - ${size.height/2}px)`;
            });
        }
        
        window.addEventListener('load', () => {
            initBlocks();
            updatePositions();
        });

        window.addEventListener('resize', () => {
            containerRect = container.getBoundingClientRect();
        });

document.addEventListener('DOMContentLoaded', () => {
  const target = document.querySelector('.subscribe');

  setTimeout(() => {
    target.classList.add('active');
  }, 4000);
});