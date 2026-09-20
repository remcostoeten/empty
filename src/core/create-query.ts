import { errorMessage, failure, success, type Result } from "@/core/result"

export function createQuery<Args extends unknown[], Output>(
  fallback: string,
  handler: (...args: Args) => Promise<Output>
) {
  return async function query(...args: Args): Promise<Result<Output>> {
    try {
      return success(await handler(...args))
    } catch (error) {
      return failure(errorMessage(error, fallback))
    }
  }
}
