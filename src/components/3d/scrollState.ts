// Shared mutable state — read by R3F useFrame loops without causing React re-renders

export interface SectionProgress {
    hero: number;
    about: number;
    projects: number;
    contact: number;
}

export const scrollState = {
    progress: 0,
    target: 0,
    sections: {
        hero: 0,
        about: 0,
        projects: 0,
        contact: 0,
    } as SectionProgress,
};

export const mouseState = {
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
};

export type SectionId = keyof SectionProgress;
