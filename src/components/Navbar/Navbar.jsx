import React from "react";
import "./Navbar.scss";
import { NavLink } from "react-router-dom";

export default function Navbar(props) {
  let info = props.userData;

  return (
    <>
      <nav className="d-flex top">
        <ul className="links">
          <div className="logo">المكاتبات وإدارة بيئة العمل</div>
          {props.userData ? (
            <>
              {" "}
              <li>
                <NavLink
                  to={"/home"}
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  <span>
                    <i className="ms-1 fa-solid fa-house"></i> الصفحة الرئيسية
                  </span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to={"/showmok"}
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  <span>
                    <i class="fa-solid fa-pencil"></i>سجل المكاتبات
                  </span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to={"/paperview"}
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  <span>
                    <i class="fa-regular fa-newspaper"></i>سجل صرف الورق
                  </span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to={"/viewcopyin"}
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  <span>
                    <i class="fa-brands fa-usb"></i>سجل نقل بيانات داخلي
                  </span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to={"/viewcopyout"}
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  <span>
                    <i class="fa-brands fa-usb"></i>سجل نقل بيانات خارجي
                  </span>
                </NavLink>
              </li>
              <li></li>
              {info ? (
                <div className="user-info ">
                  <div className="info">
                    <h5 className="name">
                      {info.deg}/ {info.name}
                    </h5>
                    {info.role == "USER" ? (
                      <span className="role">مستخدم عادى</span>
                    ) : (
                      <span className="role">مدير نظام</span>
                    )}
                  </div>
                </div>
              ) : (
                ""
              )}
              <li>
                {" "}
                <span
                  onClick={() => {
                    props.logOut();
                  }}
                >
                  <i class="fa-solid fa-screwdriver-wrench"></i>تسجيل خروج
                </span>
              </li>
            </>
          ) : (
            <>
              <div className="registration py-2">
                <li>
                  {" "}
                  <NavLink to={"/login"}>
                    <i class="fa-solid fa-screwdriver-wrench"></i>دخول
                  </NavLink>
                </li>
                <li>
                  {" "}
                  <NavLink to={"/register"}>
                    <i class="fa-solid fa-screwdriver-wrench"></i>مستخدم جديد
                  </NavLink>
                </li>
              </div>
            </>
          )}
        </ul>
      </nav>
    </>
  );
}
