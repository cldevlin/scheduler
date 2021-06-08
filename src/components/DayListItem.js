import React from "react";
import "components/DayListItem.scss";
import classNames from "classnames";

export default function DayListItem(props) {
  const { name, spots, selected, setDay } = props;

  let dayClass = classNames("day-list__item", {
    'day-list__item--full': spots === 0,
    'day-list__item--selected': selected
  });

  const formatSpots = (input) => {
    if (input === 0) {
      return "no spots remaining";
    }
    if (input === 1) {
      return "1 spot remaining"
    }
    return `${input} spots remaining`;
  }

  return (
    <li className={dayClass} onClick={() => setDay(name)}>
      <h2 className="text--regular">{name}</h2>
      <h3 className="text--light">{formatSpots(spots)}</h3>
    </li>
  );
}