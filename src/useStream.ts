import { UseStream } from "./types"
import { useEffect } from "react"
import { useAsync } from "@corets/use-async"

export const useStream: UseStream = (
  producer,
  ms,
  dependencies = [] as any[]
) => {
  const async = useAsync(producer, dependencies)

  useEffect(() => {
    if (!async.isRunning() && !async.isCancelled()) {
      const timeoutHandle = setTimeout(() => {
        async.run()
      }, ms)

      return () => clearTimeout(timeoutHandle)
    }
  }, [ms, async.isRunning(), async.isCancelled(), ...dependencies])

  return async
}
