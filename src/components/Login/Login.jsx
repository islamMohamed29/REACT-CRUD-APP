import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
export default function Login(props) {
  const [error, setError] = useState("");
  let navigate = useNavigate();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  function getUserData(e) {
    let myUser = { ...user };
    myUser[e.target.name] = e.target.value;
    setUser(myUser);
  }
  async function submitLoginForm(e) {
    e.preventDefault();
    try {
      let { data } = await axios.post(
        "http://localhost:3000/api/v1/auth/login",
        user
      );
      if (data.status == "success") {
        localStorage.setItem("userToken", data.token);
        props.savedUserData();
        navigate("/home");
      }
    } catch (error) {
      let { response } = error;
      if (response.data.message == "email and password are required") {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "يجب إدخال الإيميل والباسورد بشكل صحيح.",
          showConfirmButton: false,
          timer: 1200,
        });
      } else if (response.data.message == "user not found") {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "هذا الحساب غير موجود.",
          showConfirmButton: false,
          timer: 1200,
        });
      } else {
        setError("الرجاء التأكد من صحة البيانات");
      }
    }
  }

  return (
    <>
      <section className="login ">
        <div className="box w-75 m-auto">
          <h2 className="mb-3 ">تسجيل الدخول</h2>
          {error.length > 0 ? (
            <div className="alert alert-danger">{error}</div>
          ) : (
            ""
          )}
          <form>
            <label className="mb-1" htmlFor="email">
              البريد الإلكتروني
            </label>
            <input
              onChange={getUserData}
              className="form-control w-25 mb-2"
              id="email"
              name="email"
            />
            <label className="mb-1" htmlFor="password">
              الباسورد
            </label>

            <input
              onChange={getUserData}
              required
              type="password"
              className="form-control w-25 mb-2"
              id="password"
              name="password"
            />
            <button
              onClick={submitLoginForm}
              className="btn btn-dark w-25"
              type="submit"
            >
              تسجيل الدخول
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
