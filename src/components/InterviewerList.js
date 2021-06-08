import React from "react";
import InterviewerListItem from "./InterviewerListItem";
import "components/InterviewerList.scss";
import DayListItem from "./DayListItem";

export default function InterviewerList(props) {
  const { interviewers, interviewer, setInterview } = props;

  const interviewerList = interviewers.map((interviewerData) => {
    return (
      <InterviewerListItem
        id={interviewerData.id}
        name={interviewerData.name}
        avatar={interviewerData.avatar}
        setInterview={setInterview}
        selected={interviewerData.id === interviewer}
      />
    )
  })

  return (
    <section className="interviewers">
      <h4 className="interviewers__header text--light">Interviewer</h4>
      <ul className="interviewers__list">{interviewerList}</ul>
    </section>
  );
};