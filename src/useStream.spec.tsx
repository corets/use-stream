import { useStream } from "./useStream"
import React from "react"
import { act, render, screen } from "@testing-library/react"
import { createTimeout } from "@corets/promise-helpers/dist"

describe("useStream", () => {
  beforeEach(() => jest.useFakeTimers())
  afterEach(() => jest.useRealTimers())

  it("streams data in a repeating interval", async () => {
    let renders = 0
    let counter = 0
    let stream

    const Test = () => {
      renders++
      stream = useStream(async () => {
        await createTimeout(100)
        counter++

        return counter
      }, 1000)

      return (
        <h1>
          {renders},{stream.result ?? "undefined"},
          {stream.isLoading
            ? "loading"
            : stream.isRefreshing
            ? "refreshing"
            : stream.isCancelled
            ? "cancelled"
            : "idle"}
        </h1>
      )
    }

    render(<Test />)

    expect(screen.getByRole("heading")).toHaveTextContent("2,undefined,loading")

    act(() => {
      jest.advanceTimersByTime(100)
    })

    expect(await screen.findByRole("heading")).toHaveTextContent("3,1,idle")

    act(() => {
      jest.advanceTimersByTime(500)
    })

    expect(await screen.findByRole("heading")).toHaveTextContent("3,1,idle")

    act(() => {
      jest.advanceTimersByTime(500)
    })

    expect(await screen.findByRole("heading")).toHaveTextContent(
      "4,1,refreshing"
    )

    act(() => {
      jest.advanceTimersByTime(100)
    })

    expect(await screen.findByRole("heading")).toHaveTextContent("5,2,idle")

    act(() => {
      jest.advanceTimersByTime(1100)
    })

    expect(await screen.findByRole("heading")).toHaveTextContent("7,3,idle")

    act(() => {
      stream.cancel()
      jest.advanceTimersByTime(500)
    })

    expect(await screen.findByRole("heading")).toHaveTextContent(
      "8,3,cancelled"
    )

    act(() => {
      stream.cancel()
      jest.advanceTimersByTime(3000)
    })

    expect(await screen.findByRole("heading")).toHaveTextContent(
      "8,3,cancelled"
    )

    act(() => {
      stream.refresh()
      jest.advanceTimersByTime(50)
    })

    expect(await screen.findByRole("heading")).toHaveTextContent(
      "9,3,refreshing"
    )

    act(() => {
      jest.advanceTimersByTime(50)
    })

    expect(await screen.findByRole("heading")).toHaveTextContent("10,4,idle")
  })
})
