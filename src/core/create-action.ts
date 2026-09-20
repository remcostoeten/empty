import { unstable_rethrow } from "next/navigation"
import type { z } from "zod"
import { errorMessage, failure, success, type Result } from "@/core/result"

type Handler<Input, Output> = (input: Input) => Promise<Output>

export function createAction<Schema extends z.ZodType, Output>(
  schema: Schema,
  handler: Handler<z.infer<Schema>, Output>
) {
  return async function action(
    _previous: Result<Output> | null,
    formData: FormData
  ): Promise<Result<Output>> {
    const parsed = schema.safeParse(Object.fromEntries(formData.entries()))
    if (!parsed.success) {
      const flattened = parsed.error.flatten()
      return failure("Check the highlighted fields.", flattened.fieldErrors as Record<string, string[]>)
    }
    try {
      return success(await handler(parsed.data))
    } catch (error) {
      unstable_rethrow(error)
      return failure(errorMessage(error, "Something went wrong."))
    }
  }
}
