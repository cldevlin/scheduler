import React from "react";
import "components/Appointment/styles.scss";
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";
import Error from "./Error";
import useVisualMode from '../../hooks/useVisualMode'

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const DELETING = "DELETING"
const CONFIRM = "CONFIRM"
const EDIT = "EDIT";
const ERROR_SAVE = "ERROR_SAVE";
const ERROR_DELETE = "ERROR_DELETE"

export default function Appointment(props) {
  //props.bookInterview(id, interview)
  // props.cancelInterview(id)
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

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
      .catch(err => {
        transition(ERROR_SAVE, true)
      })
  }

  function deleteApp() {
    transition(DELETING, true);
    props.cancelInterview(props.id)
      .then(() => {
        transition(EMPTY);
      })
      .catch(() => {
        transition(ERROR_DELETE, true)
      })
  }


  return (
    <article className="appointment" data-testid="appointment">
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (
        <Show
          id={props.id}
          student={props.interview.student}
          interviewer={props.interview.interviewer.name}
          onEdit={() => transition(EDIT)}
          onDelete={() => transition(CONFIRM)}
        />
      )}
      {mode === CREATE && <Form
        interviewers={props.interviewers}
        onCancel={back}
        onSave={save}
      />}
      {mode === SAVING && <Status message={"Saving"} />}
      {mode === DELETING && <Status message={"Deleting"} />}
      {mode === CONFIRM && <Confirm
        message="Are you sure you would like to delete?"
        onConfirm={deleteApp}
        onCancel={back}
      />}
      {mode === EDIT && <Form
        interviewers={props.interviewers}
        onCancel={back}
        onSave={save}
        name={props.interview.student}
        interviewer={props.interview.interviewer.id}
      />}
      {mode === ERROR_SAVE && <Error
        message="Could not save appointment"
        onClose={back}
      />}
      {mode === ERROR_DELETE && <Error
        message="Could not delete appointment"
        onClose={back}
      />}
    </article>
  )
};