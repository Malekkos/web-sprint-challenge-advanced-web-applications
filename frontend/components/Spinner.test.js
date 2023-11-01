// Import the Spinner component into this file and test
// that it renders what it should for the different props it can take.
import Spinner from "./Spinner"
import { render, screen, queryByAttribute } from "@testing-library/react"
import React from "react"

test('sanity', () => {
  expect(true).not.toBe(false)
})
test("render spinner works wihtout errors", () => {
  render(<Spinner />)
})
test("render spinner with a passed prop of 'on' as 'true', should display said spinner as well as the text 'Please wait...' ", () => {
  render(<Spinner on={true} />)
  const spinnerMessage = screen.getByText(/please wait.../i)
  const spinner = document.getElementById("spinner")
  // console.log(spinnerMessage)
  // console.log(spinner)
  expect(spinnerMessage).toHaveTextContent("Please wait...")
})
