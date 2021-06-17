import React from "react";
import axios from "axios";

import { prettyDOM, render, cleanup, waitForElement, fireEvent, getByAltText, getByPlaceholderText, getByRole, getByText, getAllByTestId, queryByText, queryByAltText, getByTestId } from "@testing-library/react";

import Application from "components/Application";

describe("Application", () => {
  it("defaults to Monday and changes the schedule when a new day is selected", async () => {
    const { getByText, debug } = render(<Application />);


    await waitForElement(() => getByText("Monday"))

    fireEvent.click(getByText("Tuesday"))
    expect(getByText("Leopold Silvers")).toBeInTheDocument();


  });

  it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {
    const { container, debug } = render(<Application />);

    // Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"))

    const appointments = getAllByTestId(container, "appointment")
    const appointment = appointments[0];

    // Click the "Add" button on the first empty appointment.
    fireEvent.click(getByAltText(appointment, "Add"));

    // Enter the name "Lydia Miller-Jones" into the input with the placeholder "Enter Student Name".
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), { target: { value: "Lydia Miller-Jones" } });

    // Click the first interviewer in the list.
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"))

    // ////// Click the "Save" button on that same appointment.
    fireEvent.click(getByText(appointment, "Save"))
    // ////// Check that the element with the text "Saving" is displayed.
    expect(getByText(appointment, "Saving")).toBeInTheDocument();
    // ////// Wait until the element with the text "Lydia Miller-Jones" is displayed.
    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"))

    // ////// Check that the DayListItem with the text "Monday" also has the text "no spots remaining".
    const day = getAllByTestId(container, "day").find(day => queryByText(day, "Monday"))
    expect(getByText(day, /no spots remaining/i)).toBeInTheDocument()
  })

  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    // Render the application
    const { container, debug } = render(<Application />);

    // wait until text "Archie Cohen" is displayed
    await waitForElement(() => getByText(container, "Archie Cohen"))

    const appointments = getAllByTestId(container, "appointment")
    const appointment = appointments[1];

    // click the "Delete" button on that appointment
    fireEvent.click(queryByAltText(appointment, "Delete"));

    // check that the confirmation message is shown
    expect(getByText(appointment, "Are you sure you would like to delete?")).toBeInTheDocument();

    // click the "Confirm" button on that appointment
    fireEvent.click(queryByText(appointment, "Confirm"))
    // check that the element with the text "Deleting" is displayed
    expect(getByText(appointment, "Deleting")).toBeInTheDocument();


    // wait until the element with the "Add" button is displayed
    await waitForElement(() => getByAltText(appointment, "Add"))

    // checkthat the DayListItem with the text "Monday" also has the text "2 spots remaining"
    const day = getAllByTestId(container, "day").find(day => queryByText(day, "Monday"))
    expect(getByText(day, /2 spots remaining/i)).toBeInTheDocument()
  })

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    // 1. Render the Application.
    const { container, debug } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"))

    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );

    // 3. Click the "Edit" button on the booked appointment.
    fireEvent.click(queryByAltText(appointment, "Edit"));

    // 4. Check that the Form is shown with "Archie Cohen" as value and "Tori Malcolm" as interviewer
    // await waitForElement(() => getByText(appointment, "Archie Cohen"))
    // expect(queryByPlaceholderText(appointment, "Archie Cohen")).toBeInTheDocument();

    // 5. // Enter the name "Lydia Miller-Jones" into the input with the placeholder "Enter Student Name".
    fireEvent.change(getByTestId(appointment, "student-name-input"), { target: { value: "Archie Bob Cohen" } });

    // Click the first interviewer in the list.
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"))

    // Click the "Save" button on that same appointment.
    fireEvent.click(getByText(appointment, "Save"))

    // Check that the element with the text "Saving" is displayed.
    expect(getByText(appointment, "Saving")).toBeInTheDocument();
    // wait for show
    await waitForElement(() => getByText(appointment, "Archie Bob Cohen"))
    // Check that the DayListItem with the text "Monday" still has "1 spot remaining".
    const day = getAllByTestId(container, "day").find(day => queryByText(day, "Monday"))
    expect(getByText(day, /1 spot remaining/i)).toBeInTheDocument()
  });

  it("shows the save error when failing to save an appointment", async () => {
    axios.put.mockRejectedValueOnce();
    const { container, debug } = render(<Application />);

    // Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"))

    const appointments = getAllByTestId(container, "appointment")
    const appointment = appointments[0];

    // Click the "Add" button on the first empty appointment.
    fireEvent.click(getByAltText(appointment, "Add"));

    // Enter the name "Lydia Miller-Jones" into the input with the placeholder "Enter Student Name".
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), { target: { value: "Lydia Miller-Jones" } });

    // Click the first interviewer in the list.
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"))

    // ////// Click the "Save" button on that same appointment.
    fireEvent.click(getByText(appointment, "Save"))

    // Check that the element with the text "Saving" is displayed.
    expect(getByText(appointment, "Saving")).toBeInTheDocument();
    // ////// Wait until the element with the text "Lydia Miller-Jones" is displayed.
    await waitForElement(() => getByText(appointment, "Error"))

    //Click close button
    fireEvent.click(getByAltText(appointment, "Close"))
    //expect to return to form
    expect(getByTestId(appointment, "student-name-input")).toBeInTheDocument();
  });

  it("shows the delete error when failing to delete an existing appointment", async () => {
    axios.delete.mockRejectedValueOnce();
    const { container, debug } = render(<Application />);

    // wait until text "Archie Cohen" is displayed
    await waitForElement(() => getByText(container, "Archie Cohen"))

    const appointments = getAllByTestId(container, "appointment")
    const appointment = appointments[1];

    // click the "Delete" button on that appointment
    fireEvent.click(queryByAltText(appointment, "Delete"));

    // check that the confirmation message is shown
    expect(getByText(appointment, "Are you sure you would like to delete?")).toBeInTheDocument();

    // click the "Confirm" button on that appointment
    fireEvent.click(queryByText(appointment, "Confirm"))
    // check that the element with the text "Deleting" is displayed
    expect(getByText(appointment, "Deleting")).toBeInTheDocument();
    // ////// Wait until the element with the text "Error" is displayed.
    await waitForElement(() => queryByText(appointment, "Error"))

    //Click close button
    fireEvent.click(getByAltText(appointment, "Close"))
    //expect to return to form
    expect(getByText(container, "Archie Cohen")).toBeInTheDocument();

  });
})
