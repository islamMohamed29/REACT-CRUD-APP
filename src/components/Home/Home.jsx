import React from "react";
import { Link } from "react-router-dom";
import "./Home.scss";
export default function Home() {
  return (
    <section className="home ">
      <ul class="main-container">
        <li class="cards card1">
          <div className="over-buttons">
            <ul>
              <Link to={"/addmok"}>اضافة مكاتبة</Link>
              <Link to={"/showmok"}>عرض المكاتبات</Link>
            </ul>
          </div>
          <p class="card-title">المكاتبات</p>
          <img
            src="assets/images/icon-supervisor.svg"
            class="card-images"
            alt=""
            aria-hidden="true"
          />
        </li>
        <li class="cards card2">
          <div className="over-buttons">
            <ul>
              <Link to={"/paper"}>اضافة صرف جديد</Link>
              <Link to={"/paperview"}>عرض سجل الصرف</Link>
            </ul>
          </div>
          <p class="card-title">صرف ورق</p>

          <img
            src="assets/images/icon-team-builder.svg"
            class="card-images"
            alt=""
            aria-hidden="true"
          />
        </li>
        <li class="cards card3">
          <div className="over-buttons">
            <ul>
              <Link>تحت الإنشاء</Link>
              <Link>تحت الإنشاء</Link>
            </ul>
          </div>
          <p class="card-title fs-5">صرف مستلزمات تشغيل</p>
          <img
            src="assets/images/icon-karma.svg"
            class="card-images"
            alt=""
            aria-hidden="true"
          />
        </li>
        <li class="cards card4">
          <div className="over-buttons">
            <ul>
              <Link to={"/copyout"}>سجل نقل بيانات خارج الشركة</Link>
              <Link to={"/copyin"}>سجل نقل بيانات داخل الشركة</Link>
            </ul>
          </div>
          <p class="card-title">سجل نقل البيانات</p>

          <img
            src="assets/images/icon-calculator.svg"
            class="card-images"
            alt=""
            aria-hidden="true"
          />
        </li>
      </ul>
    </section>
  );
}
