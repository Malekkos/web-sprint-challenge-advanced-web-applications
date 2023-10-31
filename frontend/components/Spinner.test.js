// Import the Spinner component into this file and test
// that it renders what it should for the different props it can take.
import Spinner from "./Spinner"
import { render } from "@testing-library/react"
import React from "react"


test('sanity', () => {
  expect(true).toBe(false)
})
test("render spinner works", () => {
  render(<Spinner />)
})
