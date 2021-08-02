import { createAsync, createAsyncState } from "@corets/async"
import { createTimeout } from "@corets/promise-helpers"
import { useStream } from "./useStream"
import { createValue } from "@corets/value"
import { useValue } from "@corets/use-value"
import { render, screen, act, waitFor } from "@testing-library/react"
import React from "react"

beforeAll(() => {
  jest.useFakeTimers()
})

afterAll(() => {
  jest.useRealTimers()
})

describe("useStream", () => {
  it("uses stream with an async producer instance", async () => {
    let counter = 0
    const globalValue = createValue("foo")
    const globalAsync = createAsync(async () => {
      await createTimeout(100)

      return ++counter
    })
    let renders = 0

    const Test = () => {
      renders++

      const value = useValue(globalValue)
      const stream = useStream(globalAsync, 1000, [value.get()])

      return <h1>{JSON.stringify(stream.getState())}</h1>
    }

    render(<Test />)

    const target = screen.getByRole("heading")

    expect(renders).toBe(2)
    expect(globalAsync.getState()).toEqual(
      createAsyncState({ isRunning: true })
    )

    act(() => {
      jest.advanceTimersByTime(100)
    })

    await waitFor(() => {
      expect(renders).toBe(3)
      expect(target).toHaveTextContent(
        JSON.stringify(createAsyncState({ result: 1 }))
      )
    })

    act(() => {
      jest.advanceTimersByTime(500)
    })

    expect(renders).toBe(3)
    expect(target).toHaveTextContent(
      JSON.stringify(createAsyncState({ result: 1 }))
    )

    act(() => {
      jest.advanceTimersByTime(500)
    })

    expect(renders).toBe(4)
    expect(target).toHaveTextContent(
      JSON.stringify(createAsyncState({ result: 1, isRunning: true }))
    )

    act(() => {
      jest.advanceTimersByTime(100)
    })

    await waitFor(() => {
      expect(renders).toBe(5)
      expect(target).toHaveTextContent(
        JSON.stringify(createAsyncState({ result: 2 }))
      )
    })

    act(() => {
      jest.advanceTimersByTime(500)
    })

    expect(renders).toBe(5)
    expect(target).toHaveTextContent(
      JSON.stringify(createAsyncState({ result: 2 }))
    )

    act(() => {
      globalAsync.cancel()
    })

    expect(renders).toBe(6)
    expect(target).toHaveTextContent(
      JSON.stringify(createAsyncState({ result: 2, isCancelled: true }))
    )

    act(() => {
      jest.advanceTimersByTime(2000)
    })

    expect(renders).toBe(6)
    expect(target).toHaveTextContent(
      JSON.stringify(createAsyncState({ result: 2, isCancelled: true }))
    )

    act(() => {
      globalAsync.run()
    })

    expect(renders).toBe(7)
    expect(target).toHaveTextContent(
      JSON.stringify(createAsyncState({ result: 2, isRunning: true }))
    )

    act(() => {
      jest.advanceTimersByTime(100)
    })

    await waitFor(() => {
      expect(renders).toBe(8)
      expect(target).toHaveTextContent(
        JSON.stringify(createAsyncState({ result: 3 }))
      )
    })
  })
})
