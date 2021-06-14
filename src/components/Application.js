import React, { useState, useEffect } from "react";
import axios from 'axios';

import "components/Application.scss";
import DayList from "components/DayList.js";
import Appointment from "components/Appointment";
import { getInterviewersForDay, getAppointmentsForDay, getInterview } from "../helpers/selectors"

// const appointments1 = [
//   {
//     id: 1,
//     time: "12pm",
//   },
//   {
//     id: 2,
//     time: "1pm",
//     interview: {
//       student: "Lydia Miller-Jones",
//       interviewer: {
//         id: 1,
//         name: "Sylvia Palmer",
//         avatar: "https://i.imgur.com/LpaY82x.png",
//       }
//     }
//   },
//   {
//     id: 3,
//     time: "2pm",
//     interview: {
//       student: "suzy",
//       interviewer: {
//         id: 2,
//         name: "Tori Malcolm",
//         avatar: "https://i.imgur.com/Nmx0Qxo.png"
//       }
//     }
//   },
//   {
//     id: 4,
//     time: "3pm",
//   },
//   {
//     id: 5,
//     time: "4pm",
//     interview: {
//       student: "bob",
//       interviewer: {
//         id: 5,
//         name: "Sven Jones",
//         avatar: "https://i.imgur.com/twYrpay.jpg"
//       }
//     }
//   }
// ];

// const days = [
//   {
//     id: 1,
//     name: "Monday",
//     spots: 2,
//   },
//   {
//     id: 2,
//     name: "Tuesday",
//     spots: 5,
//   },
//   {
//     id: 3,
//     name: "Wednesday",
//     spots: 0,
//   },
// ];

export default function Application(props) {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  })

  function bookInterview(id, interview) {
    // console.log("(id, interview)", id, interview); //appointment id, interview object( student and interviewer id)
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    // const bookInterviewPromise = appointment && 
    return axios.put(`/api/appointments/${id}`, appointment)
      .then(result => {
        // console.log("result", result);
        setState({ ...state, appointments })
      })
      .catch(err => {
        console.log(err);
      })

    // return bookInterviewPromise;
    // console.log("state, line 92 ----", state);
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
    console.log("appointment id", id);
    console.log(state);
    console.log("appointments", appointments);
    console.log("appointment", appointment);
    // WHY DOESN"T THIS WORK WTRHW%^Y$%WU&$^&$TKTHLRHKTRLITJWR:BJSFLKGHLSFKGH"QERL"W:%L:Y$:%:
    const putPromise = axios.delete(`/api/appointments/${id}`, {})
      .then(result => {
        console.log(result);
        console.log("line 117");
        setState({ ...state, appointments })
      })
      .catch(err => {
        console.log(err);
      })
    console.log(putPromise);
    return putPromise;
  }

  const dailyAppointments = getAppointmentsForDay(state, state.day);
  const schedule = dailyAppointments.map((appointment, index) => {
    const interview = getInterview(state, appointment.interview)
    return (
      <Appointment
        key={appointment.id}
        {...appointment}
        interview={interview}
        interviewers={getInterviewersForDay(state, state.day)}
        bookInterview={bookInterview}
        cancelInterview={cancelInterview}
      />)
  })
  schedule.push(<Appointment key="last" time="5pm" />)

  // const dailyInterviewers = getInterviewersForDay(state, state.day);

  // console.log("dailyInterviewers--------", dailyInterviewers);

  const setDay = day => setState({ ...state, day });
  // const setDays = days => setState((prev) => ({ ...prev, days }));

  //get days data
  useEffect(() => {
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('api/interviewers')
    ]).then((all) => {
      setState(prev => ({ ...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data }));
    })
  }, [])




  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList
            days={state.days}
            day={state.day}
            setDay={setDay}
          />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />      </section>
      <section className="schedule">
        {schedule}
      </section>
    </main>
  );
}

// Empty - Create - Saving