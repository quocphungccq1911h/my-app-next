export class MobileShopError extends Error {
  status: number;
  cause?: Error;
  query?: any;
  error?: any;
  constructor(
    message: string,
    status: number,
    query?: any,
    error?: any,
    cause?: Error
  ) {
    super(message);
    this.name = "MobileShopError"; // Đặt tên class error
    this.status = status;
    this.query = query;
    this.error = error;
    this.cause = cause;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, MobileShopError);
    }
  }
}

export interface MobileShopErrorLike {
  status: number;
  message: string;
  cause?: Error;
}

export const isObject = (
  object: unknown
): object is Record<string, unknown> => {
  return (
    typeof object === "object" && object !== null && !Array.isArray(object)
  );
};

export const isMobileShopError = (
  error: unknown
): error is MobileShopErrorLike => {
  if (!isObject(error)) return false;
  if (error instanceof Error) return true;
  return findError(error);
};

function findError<T extends object>(error: T): boolean {
  if (Object.prototype.toString.call(error) === "[object Error]") return true;

  const prototype = Object.getPrototypeOf(error) as T | null;

  return prototype === null ? false : findError(prototype);
}

export function handleFetchError(e: unknown, query: string): never {
  if (isMobileShopError(e)) {
    throw new MobileShopError(e.message, e.status || 500, query, e, e.cause);
  }
  if (e instanceof Error) {
    throw new Error(e.message);
  }
  throw new Error("Unknown error occurred");
}
