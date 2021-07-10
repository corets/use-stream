import { useAsync } from "@corets/use-async"
import { useEffect } from "react"
import { UseStream } from "./types"

export const useStream: UseStream = (action, interval, dependencies = []) => {
  const asyncHandle = useAsync(action, dependencies)

  useEffect(() => {
    const intervalHandle = setInterval(async () => {
      if (
        !asyncHandle.isLoading &&
        !asyncHandle.isErrored &&
        !asyncHandle.isCancelled
      ) {
        asyncHandle.refresh()
      }
    }, interval)

    return () => {
      clearInterval(intervalHandle)
    }
  }, [
    asyncHandle.isLoading,
    asyncHandle.isErrored,
    asyncHandle.isCancelled,
    interval,
    ...dependencies,
  ])

  return asyncHandle
}
