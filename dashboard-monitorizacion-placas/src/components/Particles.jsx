import { useEffect, useRef } from 'react';

function Particles() {
    const particlesRef = useRef(null);

    useEffect(() => {
        const container = particlesRef.current;
        const particleCount = 30;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            particle.style.animationDelay = `${Math.random() * 15}s`;
            particle.style.animationDuration = `${10 + Math.random() * 10}s`;
            container.appendChild(particle);
        }

        return () => {
            container.innerHTML = '';
        };
    }, []);

    return <div ref={particlesRef} className="particles" />;
}

export default Particles;
