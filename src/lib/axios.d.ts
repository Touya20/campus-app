export declare class ApiError extends Error { status: number; requestId?: string; constructor(message: string, status: number, requestId?: string) }
export declare function setAccessToken(value: string | null): void
export declare function getCampusTimeZone(): string
export declare function request<T = unknown>(path: string, init?: RequestInit): Promise<T>

