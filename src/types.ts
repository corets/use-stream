import { Async, AsyncProducer } from "@corets/use-async"

export type UseStream = <TResult>(
  initializer: AsyncProducer<TResult> | TResult,
  interval: number,
  dependencies?: any[]
) => Async<TResult>
