import { AsyncProducerWithoutArgs, ObservableAsync } from "@corets/async"

export type UseStream = <TResult>(
  producer: ObservableAsync<TResult> | AsyncProducerWithoutArgs<TResult>,
  ms: number,
  dependencies?: any[]
) => ObservableAsync<TResult>
