// Import the Spinner component into this file and test
// that it renders what it should for the different props it can take.
import Spinner from "./Spinner"
import { render, screen } from "@testing-library/react"
import React from "react"

test('sanity', () => {
  expect(true).not.toBe(false)
})
test("render spinner works wihtout errors", () => {
  render(<Spinner />)
})
test("render spinner with a passed prop of 'on' as 'true', should display said spinner as well as the text 'Please wait...' ", () => {
  const {rerender} = render(<Spinner on={true} />)
  const text = screen.queryByText("Please wait...")
  console.log(text.id)
  expect(text).toBeTruthy()
  rerender(<Spinner on={false} />)
  expect(screen.queryByText("Please wait...")).toBeFalsy()
})
