import { useEffect, useRef } from 'react';

const SEQUENCE = [
    'ArrowUp', 'ArrowUp',
    'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight',
    'ArrowLeft', 'ArrowRight',
    'b', 'a',
];

export function useKonamiCode(onActivate: () => void) {
    const progress = useRef(0);

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === SEQUENCE[progress.current]) {
                progress.current += 1;
                if (progress.current === SEQUENCE.length) {
                    progress.current = 0;
                    onActivate();
                }
            } else {
                progress.current = e.key === SEQUENCE[0] ? 1 : 0;
            }
        };

        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [onActivate]);
}
