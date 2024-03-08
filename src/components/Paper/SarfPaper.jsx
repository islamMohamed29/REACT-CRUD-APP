import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import "./Paper.scss";

export default function SarfPaper() {
  let token = localStorage.getItem("userToken");

  const [sarf, setSarf] = useState({
    numberSarf: "",
  });
  function getSarfData(e) {
    let mySarf = { ...sarf };
    mySarf[e.target.name] = e.target.value;
    setSarf(mySarf);
  }
  async function submitSarf(e) {
    e.preventDefault();
    try {
      if (sarf.numberSarf <= 0) {
        Swal.fire({
          icon: "error",
          title: "ادخل رقم اكبر من صفر",
          showConfirmButton: false,
          timer: 1200,
        });
      } else {
        let { data } = await axios.post(
          "http://localhost:3000/api/v1/gear/addsarfpaper",
          sarf,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (data.message == "Done") {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "تم إضافة الصرف بنجاح.",
            showConfirmButton: false,
            timer: 1200,
          });
          document.getElementById("sarf-add").reset();
          setSarf({
            countSarf: "",
          });
        } else if (
          (data.error.errors.numberSarf.message =
            "Path `countSarf` is required.")
        ) {
          Swal.fire({
            // position: 'top-end',
            position: "center",
            icon: "error",
            title: "تأكد من إدخال البيانات بشكل صحيح.",
            showConfirmButton: false,
            timer: 1200,
          });
        } else {
          Swal.fire({
            // position: 'top-end',
            position: "center",
            icon: "error",
            title: "حدث خطأ ما الرجاء العودة للمطور!!",
            showConfirmButton: false,
            timer: 1200,
          });
        }
      }
    } catch (error) {
      if (error.response.data.message == "this role is n.t authorized") {
        Swal.fire({
          icon: "warning",
          title: "خطأ",
          text: "لا تملك صلاحيات للإضافة.",
        });
      } else {
        Swal.fire({
          // position: 'top-end',
          position: "center",
          icon: "error",
          title: "حدث خطأ ما الرجاء العودة للمطور!!",
          showConfirmButton: false,
          timer: 1200,
        });
      }
    }
  }

  return (
    <>
      <section className="sarf-paper pt-5">
        <div className="top-section w-75 m-auto mb-3">
          <h2 className="mb-3 me-5 pt-5 ">إضافة صرفية ورق جديدة</h2>
          <div className="add-cat">
            <Link className=" btn btn-danger" to={"/allpaper"}>
              عرض السجل التفصيلى
            </Link>
          </div>
        </div>
        <div className="box w-75 m-auto">
          <form id="sarf-add">
            <input
              onChange={getSarfData}
              placeholder="عدد الرزم الجديدة"
              type="number"
              required
              className="form-control mb-2"
              id="numberSarf"
              name="numberSarf"
            />
            <button
              onClick={submitSarf}
              className="btn btn-primary"
              type="submit"
            >
              إضافة
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
