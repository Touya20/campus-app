export declare class ApiError extends Error { status: number; requestId?: string; constructor(message: string, status: number, requestId?: string) }
export declare function setAccessToken(value: string | null): void
export declare function getCampusTimeZone(): string
export type ApiRequestInit = Omit<RequestInit, 'body'> & { body?: BodyInit | Record<string, unknown> | null; timeoutMs?: number }
export declare function request<T = unknown>(path: string, init?: ApiRequestInit): Promise<T>

