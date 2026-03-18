export const RATE_LIMIT_WINDOW = 60_000;
export const RATE_LIMIT_MAX = 3;

export const FIELD_MAX_LENGTHS = {
    name: 100,
    email: 254,
    subject: 200,
    message: 5000,
} as const;
