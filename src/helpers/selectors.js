export function getInterviewersForDay(state, day) {
  //find object in state.days that matches day
  const dayObj = state.days.filter(currentDay => currentDay.name === day)[0]

  //iterate through that day's appointments array (using id)
  const interviewers = dayObj && dayObj.interviewers.map(interviewerID => state.interviewers[interviewerID]);

  //validation: if there  are no appointments then return empty array
  if (!interviewers) {
    return [];
  }

  return interviewers;
}


export function getAppointmentsForDay(state, day) {
  //find object in state.days that matches day
  const dayObj = state.days.filter(currentDay => currentDay.name === day)[0]

  //iterate through that day's appointments array (using id)
  const appointments = dayObj && dayObj.appointments.map(appointmentID => state.appointments[appointmentID]);

  //validation: if there  are no appointments then return empty array
  if (!appointments) {
    return [];
  }

  return appointments;
}

export function getInterview(state, interviewObj) {
  if (!interviewObj) {
    return null;
  }

  const detailedInterviewObj = {
    ...interviewObj,
    interviewer: {
      id: state.interviewers[interviewObj.interviewer].id,
      name: state.interviewers[interviewObj.interviewer].name,
      avatar: state.interviewers[interviewObj.interviewer].avatar
    }
  }
  return detailedInterviewObj;
}