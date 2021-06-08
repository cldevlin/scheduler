import React from "react";
import DayListItem from "./DayListItem";

export default function DayList(props) {
  const { days, day, setDay } = props;

  const dayList = days.map((dayData) => {
    return <DayListItem
      key={dayData.id}
      name={dayData.name}
      spots={dayData.spots}
      selected={dayData.name === day}
      setDay={setDay}
    />
  });

  return (
    <ul>
      {dayList}
    </ul>
  );
}