import React, { useEffect, useState } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import Joi from "joi";
export default function Register() {
  const [error, setError] = useState("");
  const [errorList, setErrorList] = useState("");
  let navigate = useNavigate();
  const [user, setUser] = useState({
    userName: "",
    email: "",
    password: "",
    deg: "",
    role: "USER",
  });

  function getUserData(e) {
    let myUser = { ...user };
    myUser[e.target.name] = e.target.value;
    setUser(myUser);
  }
  const handleInputDeg = (e) => {
    const { value } = e.target;
    user.deg = value;
  };
  async function submitRegisterForm(e) {
    e.preventDefault();
    try {
      let validationResult = validateRegisterForm();
      if (validationResult.error) {
        setErrorList(validationResult.error.details);
      } else {
        let secureCodeInput = document.getElementById("secureCode");
        if (secureCodeInput.value == "1") {
          let { data } = await Axios.post(
            "http://localhost:3000/api/v1/auth/register",
            user
          );
          if (data.status == "success") {
            setError("");
            navigate("/login");
          } else {
            setError(data.message);
          }
        } else {
          setError(`يجب التأكد من إدخال الكود السرى بشكل صحيح`);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
  function validateRegisterForm() {
    let schema = Joi.object({
      userName: Joi.string()
        .min(3)
        .max(30)
        .pattern(
          new RegExp(
            /^(?:[a-zA-Z0-9\s@,=%$#&_\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDCF\uFDF0-\uFDFF\uFE70-\uFEFF]|(?:\uD802[\uDE60-\uDE9F]|\uD83B[\uDE00-\uDEFF])){0,30}$/
          )
        )
        .required(),
      email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ["net", "com"] } })
        .required(),
      password: Joi.string()
        .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
        .required(),
      role: Joi.string().required(),
      deg: Joi.string().required(),
    });
    return schema.validate(user, { abortEarly: false });
  }

  return (
    <>
      <section className="register">
        <h2 className="mb-3 me-5">إضافة حساب جديد</h2>
        <div className="box w-75 m-auto">
          {errorList
            ? errorList.map((err, index) => {
                if (err.context.label == "password") {
                  return (
                    <div key={index} className="alert alert-danger">
                      in-valid password
                    </div>
                  );
                } else if (err.context.label == "userName") {
                  return (
                    <div key={index} className="alert alert-danger">
                      الإسم يجب ان يكون مكون من أحرف ولا يزيد عن 30
                    </div>
                  );
                }
              })
            : ""}
          {error.length > 0 ? (
            <div className="alert alert-danger">{error}</div>
          ) : (
            ""
          )}
          <form onSubmit={submitRegisterForm}>
            <label className="mb-1" htmlFor="userName">
              الإسم
            </label>
            <input
              onChange={getUserData}
              required
              className="form-control mb-2"
              id="userName"
              name="userName"
            />
            <label className="mb-1">الوظيفة</label>

            <select
              className="form-select mb-2"
              aria-label="Default select example"
              onChange={handleInputDeg}
            >
              <option defaultValue="اختر الوظيفة من فضلك">
                إختر الوظيفة من فضلك
              </option>
              <option value="مدخل بيانات">مدخل بيانات</option>
              <option value="مراقب بيانات">مراقب بيانات</option>
              <option value="مدير">مدير</option>
            </select>
            <label className="mb-1" htmlFor="email">
              البريد الإلكترونى
            </label>
            <input
              onChange={getUserData}
              required
              type="email"
              className="form-control mb-2"
              id="email"
              name="email"
            />
            <label className="mb-1" htmlFor="secureCode">
              الكود السرى
            </label>
            <input
              required
              type="password"
              className="form-control mb-2"
              id="secureCode"
              name="code"
            />
            <label className="mb-1" htmlFor="password">
              الباسورد
            </label>
            <input
              onChange={getUserData}
              required
              type="password"
              id="password"
              className="form-control mb-2"
              name="password"
            />
            <button className="btn btn-primary" type="submit">
              إضافة الحساب
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
