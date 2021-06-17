import { useState, useEffect } from 'react';
import axios from 'axios';


export default function useApplicationData() {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  })

  function updateSpots(state, day) {
    //find all the days
    const days = state.days;
    //access the current day based on name
    const currentDayObj = days.find((dayObj) => dayObj.name === day)
    const currentDayObjIndex = days.findIndex((dayObj) => dayObj.name === day)
    //get array of appointment ids 
    const appointmentIds = currentDayObj.appointments;

    //iterate over appointments and verify if interview === null
    const emptyAppointments = appointmentIds.filter(appointmentId => state.appointments[appointmentId].interview === null)
    const spots = emptyAppointments.length;

    //update spots value in day
    const newDay = { ...currentDayObj, spots }
    const newDays = [...days];
    newDays[currentDayObjIndex] = newDay;
    const newState = { ...state, days: newDays }

    return newState;
  }

  const setDay = day => setState({ ...state, day });

  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    return axios.put(`/api/appointments/${id}`, appointment)
      .then(() => {
        const newState = { ...state, appointments }
        const coolerNewState = updateSpots(newState, newState.day)
        setState(coolerNewState)
      })
  }

  function cancelInterview(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null
    }
    const appointments = {
      ...state.appointments,
      [id]: appointment
    }

    const putPromise = axios.delete(`/api/appointments/${id}`, {})
      .then(() => {
        const newState = { ...state, appointments }
        const coolerNewState = updateSpots(newState, newState.day)
        setState(coolerNewState)
      })

    return putPromise;
  }
  useEffect(() => {
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers')
    ]).then((all) => {
      setState(prev => ({ ...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data }));
    })
  }, [])
  return {
    state,
    setDay,
    bookInterview,
    cancelInterview
  }
};