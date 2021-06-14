import React from "react";
import "components/Appointment/styles.scss";
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";
import useVisualMode from '../../hooks/useVisualMode'

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const CONFIRM = "CONFIRM"
const EDIT = "EDIT";

export default function Appointment(props) {
  //props.bookInterview(id, interview)
  // props.cancelInterview(id)
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );
  let statusMessage = "Saving";

  // console.log("props", props);

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING);
    props.bookInterview(props.id, interview)
      .then(result => {

        transition(SHOW);
      })
  }

  function confirm() {
    console.log("this is id", props.id);
    transition(CONFIRM)
  }

  function deleteApp() {
    statusMessage = "Deleting";
    transition(SAVING);
    props.cancelInterview(props.id)
      .then(result => {
        transition(EMPTY);
      })
  }

  return (
    <article className="appointment">
      <Header time={props.time} />

      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (
        <Show
          id={props.id}
          student={props.interview.student}
          interviewer={props.interview.interviewer.name}
          onDelete={confirm}
        />
      )}
      {mode === CREATE && <Form
        interviewers={props.interviewers}
        onCancel={back}
        onSave={save}
      />}
      {mode === SAVING && <Status
        message={statusMessage}
      />}
      {mode === CONFIRM && <Confirm
        onConfirm={deleteApp}
        onCancel={back}
      />}
      {mode === EDIT && <Form />}

    </article>
  )
};