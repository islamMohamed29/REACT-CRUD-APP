import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
export default function Addcategory() {
  let token = localStorage.getItem("userToken");
  const [category, setCategoryName] = useState({
    categoryName: "",
  });

  function getCatData(e) {
    let myCategory = { ...category };
    myCategory[e.target.name] = e.target.value;
    setCategoryName(myCategory);
  }

  async function submitCategory(e) {
    e.preventDefault();
    try {
      let { data } = await axios.post(
        "http://localhost:3000/api/v1/mokatbat/category/add",
        category,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data.message == "Done") {
        Swal.fire({
          // position: 'top-end',
          position: "center",
          icon: "success",
          title: "تم إضافة الموضوع بنجاح.",
          showConfirmButton: false,
          timer: 1200,
        });
        document.getElementById("category-add").reset();
        setCategoryName({
          categoryName: "",
        });
      } else if (
        (data.error.errors.categoryName.message =
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
      <section className="add-category pt-5">
        <div className="top-section w-75 m-auto mb-3">
          <h2 className="mb-3 me-5 pt-5">إضافة مواضيع المكاتبات</h2>
          <div className="add-cat">
            <Link className=" btn btn-primary ms-2" to={"/showmok"}>
              عرض سجل المكاتبات
            </Link>
            <Link className=" btn btn-danger" to={"/allcategory"}>
              عرض كل المواضيع
            </Link>
          </div>
        </div>

        <div className="box w-75 m-auto">
          <form id="category-add">
            <input
              onChange={getCatData}
              placeholder="إسم الموضوع"
              required
              className="form-control mb-2"
              id="category"
              name="categoryName"
            />
            <button
              onClick={submitCategory}
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
