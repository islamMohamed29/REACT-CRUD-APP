import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import "./Addfar3.scss";
export default function Addfar3() {
  let token = localStorage.getItem("userToken");

  const [far3, setFar3Name] = useState({
    far3Name: "",
  });
  function getFar3Data(e) {
    let myFar3 = { ...far3 };
    myFar3[e.target.name] = e.target.value;
    setFar3Name(myFar3);
  }

  async function submitFar3(e) {
    e.preventDefault();
    try {
      let { data } = await axios.post(
        "http://localhost:3000/api/v1/gear/addfar3",
        far3,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data.message == "Done") {
        // console.log(data);
        Swal.fire({
          // position: 'top-end',
          position: "center",
          icon: "success",
          title: "تم إضافة المكتب بنجاح.",
          showConfirmButton: false,
          timer: 1200,
        });
        document.getElementById("far3-add").reset();
        setFar3Name({
          far3Name: "",
        });
      } else if (
        (data.error.errors.far3Name.message =
          "Path `categoryName` is required.")
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
      <section className="add-far3 pt-5">
        <div className="top-section w-75 m-auto mb-3">
          <h2 className="mb-3 me-5 pt-5">إضافة مكتب جديد</h2>
          <div className="add-cat">
            <Link className=" btn btn-danger" to={"/allfar3"}>
              عرض كل المكاتب
            </Link>
          </div>
        </div>
        <div className="box w-75 m-auto">
          <form id="far3-add">
            <input
              onChange={getFar3Data}
              placeholder="إسم المكتب"
              required
              className="form-control mb-2"
              id="far3"
              name="far3Name"
            />
            <button
              onClick={submitFar3}
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
