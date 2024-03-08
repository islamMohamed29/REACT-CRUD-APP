import React from "react";
import { Link } from "react-router-dom";
import "./Utils.scss";
export default function Utils() {
  return (
    <ul className="main">
      <li class="cardsss card1 ">
        <div className="over-buttons"></div>
        <Link to={"/addfar3"}>إضافة مكتب</Link>
      </li>
      <li class="cardsss card2 mt-3">
        <div className="over-buttons"></div>
        <Link to={"/sarfpaper"}>إضافة لمخزن الورق</Link>
      </li>
    </ul>
  );
}
