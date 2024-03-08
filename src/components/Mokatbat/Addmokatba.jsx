import React, { useEffect, useState } from "react";
import "./Addmokatba.scss";
import axios from "axios";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

export default function Addmokatba() {
  const [files, setFiles] = useState();
  const [progressBar, setProgressBar] = useState(0);
  const [getErrIMG, setErrIMG] = useState("");
  const [getERR, setErrors] = useState("");
  const [categoryMok, setCategory] = useState([]);

  let URL = "http://localhost:3000/api/v1/mokatbat/";

  useEffect(() => {
    const btons = document.querySelectorAll(".type-btn");
    btons.forEach((el) => {
      el.addEventListener("click", (e) => {
        btons.forEach((el) => {
          el.classList.remove("is-focused");
        });
        e.target.classList.add("is-focused");
      });
    });
  });

  useEffect(() => {
    getCategory();
  }, []);
  const [mokatbat, setMokatbat] = useState({
    type: "",
    regNum: "",
    entity: "",
    category: "فاكسات",
    subject: "",
    savedFile: "",
  });
  function getMokatbat(e) {
    let myMokatba = { ...mokatbat };
    myMokatba[e.target.name] = e.target.value;
    setMokatbat(myMokatba);
  }

  async function getCategory() {
    let response = await axios.get(`${URL}category/all`);
    if (response.data.message == "Done") {
      setCategory(response.data.allcategorys);
    }
  }
  const submitIMG = async (id) => {
    const formData = new FormData();
    if (files) {
      for (let i = 0; i < files.length; i++) {
        formData.append(`image`, files[i]);
      }
      const result = await axios
        .post(`http://localhost:3000/api/v1/mokatbat/pic/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (event) => {
            setProgressBar(Math.round(100 * event.loaded) / event.total);
          },
        })
        .then((res) => setProgressBar(0))
        .catch((err) => console.log(err));
    }
  };
  async function addMokatba(e) {
    e.preventDefault();
    let { data } = await axios.post(URL, mokatbat);

    if (data.message === "Done") {
      setProgressBar(0);
      submitIMG(data.savedMokatba._id);
      Swal.fire({
        position: "center",
        icon: "success",
        title: "تم إضافة المكاتبة بنجاح.",
        showConfirmButton: false,
        timer: 1200,
      });
      document.getElementById("form-add").reset();
      setErrors("");
      let btnCheck = document.querySelectorAll(".type-btn");
      btnCheck.forEach((el) => {
        el.classList.remove("is-focused");
      });
      setMokatbat({
        type: "",
        regNum: "",
        entity: "",
        category: "فاكسات",
        subject: "",
        savedFile: "",
      });
    } else if (data.message === "catch error") {
      setErrors(data.error.errors);
    }
  }

  const handleInput = (e) => {
    e.preventDefault();
    const { value } = e.target;
    mokatbat.type = value;
  };
  const handleCategory = (e) => {
    const { value } = e.target;
    mokatbat.category = value;
  };
  return (
    <>
      <section className="addmok">
        <div className="top-section w-50 m-auto mb-3">
          <div className="title">
            <h2>إضافة مكاتبة</h2>
          </div>
          <div className="add-mok">
            <Link className=" btn btn-danger" to={"/addcategory"}>
              إضافة مواضيع المكاتبة
            </Link>
            <Link className=" btn btn-primary me-2" to={"/showmok"}>
              عرض سجل المكاتبات
            </Link>
          </div>
        </div>
        <div className="box w-50 m-auto">
          <form id="form-add">
            {getErrIMG ? getErrIMG : ""}

            <div className="form-group">
              {getERR.regNum ? (
                <div className="alerta">
                  لا يمكن ان يكون رقم القيد مكون من أحرف أو أن يكون فارغ
                </div>
              ) : (
                ""
              )}
              <input
                onChange={getMokatbat}
                name="regNum"
                placeholder="رقم القيد"
                className="form-control mt-2 mb-2"
              />
            </div>
            <div className="form-group">
              {getERR.type ? (
                <div className="alerta">من فضلك إختر نوع المكاتبة</div>
              ) : (
                ""
              )}
              <button
                className="type-btn btn btn-light ms-2"
                onClick={handleInput}
                value={"صادر"}
              >
                صادر
              </button>
              <button
                className="type-btn btn btn-light"
                onClick={handleInput}
                value={"وارد"}
              >
                وارد
              </button>
            </div>
            <div className="form-group">
              {getERR.entity ? (
                <div className="alerta">لا يمكن ترك خانة الجهة فارغة</div>
              ) : (
                ""
              )}

              <input
                onChange={getMokatbat}
                name="entity"
                placeholder="الجهة"
                className="form-control my-2"
              />
            </div>
            <select
              className="form-select mb-2"
              aria-label="Default select example"
              onChange={handleCategory}
            >
              <option defaultValue="موضوع المكاتبة">موضوع المكاتبة</option>

              {categoryMok.map((cat) => {
                return (
                  <option className="mb-2" value={cat.categoryName}>
                    {cat.categoryName}
                  </option>
                );
              })}
            </select>
            <div className="form-group">
              {getERR.subject ? (
                <div className="alerta">من فضلك إكتب ملخص المكاتبة.</div>
              ) : (
                ""
              )}

              <input
                onChange={getMokatbat}
                name="subject"
                placeholder="ملخص الموضوع"
                className="form-control mb-2"
              />
            </div>
            <div className="form-group">
              {" "}
              {getERR.savedFile ? (
                <div className="alerta">من فضلك أدخل إسم ملف الحفظ</div>
              ) : (
                ""
              )}
              <input
                onChange={getMokatbat}
                name="savedFile"
                placeholder="ملف الحفظ"
                className="form-control mb-2"
              />
            </div>

            <div className="add-now d-flex align-items-center justify-content-between">
              <input
                onChange={(e) => setFiles(e.target.files)}
                type="file"
                accept="images/*"
                multiple
              ></input>
              <button
                onClick={addMokatba}
                className="btn btn-primary w-100"
                type="submit"
              >
                إضافة المكاتبة
              </button>
            </div>
          </form>
          {progressBar ? (
            <div className="progress mt-3">
              <div
                className="progress-bar progress-bar-striped progress-bar-animated"
                role="progressbar"
                aria-label="progressbar"
                aria-valuenow={progressBar}
                aria-valuemin="0"
                aria-valuemax="100"
                style={{ width: `${progressBar}%` }}
              ></div>
            </div>
          ) : (
            ""
          )}
        </div>
      </section>
    </>
  );
}
