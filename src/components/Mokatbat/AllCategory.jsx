import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";

export default function Allcategory(props) {
  const [err, setErr] = useState("");
  const [categorys, setCategorys] = useState([]);
  let token = localStorage.getItem("userToken");
  let navigate = useNavigate();

  async function getAllCategory() {
    let { data } = await axios.get(
      "http://localhost:3000/api/v1/mokatbat/category/all"
    );
    if (data.message == "Done") {
      setCategorys(data.allcategorys);
    } else {
      setErr("لا يوجد مواضيع في الوقت الحالى");
    }
  }

  function deleteCategory(id) {
    Swal.fire({
      title: "هل أنت متأكد ؟",
      text: "لن تتمكن من التراجع عن هذا!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "نعم أريد ذلك!",
      cancelButtonText: "إغلاق.",
    }).then((result) => {
      if (result.isConfirmed) {
        // console.log(id)
        axios
          .delete(`http://localhost:3000/api/v1/mokatbat/category/${id}`, {
            data: {
              id,
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            if (response.data.status == "success") {
              getAllCategory();
              Swal.fire("تم الحذف !", "تم حذف الموضوع", "success");
            } else {
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "حدث خطأ برجاء الرجوع إلي المطور",
              });
            }
          })
          .catch((err) => {
            if (err.response.data.message == "invalid token") {
              Swal.fire({
                title: "إنتهت صلاحية الجلسة برجاء تسجيل الدخول مرة أخرى",
                confirmButtonColor: "#3085d6",
                confirmButtonText: "موافق",
              }).then((result) => {
                if (result.isConfirmed) {
                  props.setUserData(null);
                  localStorage.removeItem("userToken");
                  navigate("/login");
                }
              });
            } else {
              Swal.fire({
                icon: "warning",
                title: "خطأ",
                text: "لا تملك صلاحيات للحذف.",
              });
            }
          });
      }
    });
  }

  const [categoryUpdate, setCategoryUpdate] = useState({
    categoryName: "",
  });
  function getCategory({ target }) {
    setCategoryUpdate({ ...categoryUpdate, [target.name]: target.value });
  }

  function getCategoryIndex(index) {
    document.querySelector("#exampleModal input.updateCategory").value =
      categorys[index].categoryName;
    setCategoryUpdate({
      ...categoryUpdate,
      categoryName: categorys[index].categoryName,
      CategoryID: categorys[index]._id,
    });
  }

  async function updateCategory(e) {
    e.preventDefault();
    var framl;
    categorys.map((ele) => {
      if (ele._id == categoryUpdate.CategoryID) {
        if (ele.categoryName == categoryUpdate.categoryUpdate) {
          framl = "no data edit";
        } else framl = "edit start to call api";
      }
    });
    if (framl == "no data edit") {
      Swal.fire("لا يوجد تعديلات", "لم يتم تعديل أي بيانات", "success");
      return;
    }
    try {
      let { data } = await axios.put(
        `http://localhost:3000/api/v1/mokatbat/category/${categoryUpdate.CategoryID}`,
        categoryUpdate,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data.message == "Done") {
        getAllCategory();

        Swal.fire("تم التحديث!", "المكاتبة قد تم تعديلها.", "success");
      }
    } catch (error) {
      if (error.response.data.message == "this role is n.t authorized") {
        Swal.fire({
          icon: "warning",
          title: "خطأ",
          text: "لا تملك صلاحيات للتعديل.",
        });
      }
    }
  }

  useEffect(() => {
    getAllCategory();
  }, []);

  return (
    <>
      <div
        class="modal fade"
        id="exampleModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="exampleModalLabel">
                تعديل الموضوع
              </h1>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <form id="form-update">
                <input
                  onChange={getCategory}
                  name="categoryName"
                  placeholder="اسم الموضوع الجديد"
                  className="form-control mb-2 updateCategory"
                />
              </form>
            </div>
            <div class="modal-footer">
              <button
                id="btn-save"
                data-bs-dismiss="modal"
                type="button"
                class="btn btn-primary"
                onClick={updateCategory}
              >
                تعديل
              </button>
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      </div>

      <section className="add-category pt-5">
        <div className="top-section w-75 m-auto mb-3">
          <h2 className="mb-3 me-5 pt-5">جميع مواضيع المكاتبات</h2>
          <div className="add-cat">
            <Link className=" btn btn-danger" to={"/addcategory"}>
              إضافة موضوع جديد
            </Link>
            <Link className=" btn btn-primary me-2" to={"/showmok"}>
              عرض جميع المكاتبات
            </Link>
          </div>
        </div>

        <div className="box w-75 m-auto">
          {err.length > 0 ? (
            <div className="alert alert-danger">{err}</div>
          ) : (
            ""
          )}
          <table id="myTable" className="  my-1 m-auto table">
            <thead>
              <tr>
                <th className="name" scope="col ">
                  إسم الموضوع
                </th>
                <th className="deleteV" scope="col">
                  حذف
                </th>
                <th className="editV" scope="col">
                  تعديل
                </th>
              </tr>
            </thead>
            <tbody>
              {categorys.map((ele, index) => {
                return (
                  <tr key={ele._id}>
                    <td className="name">{ele.categoryName}</td>
                    <td className="deleteV">
                      <div
                        onClick={() => {
                          deleteCategory(ele._id);
                        }}
                        className="btn btn-danger "
                      >
                        <i class="fa-solid fa-trash-can"></i>
                      </div>
                    </td>
                    <td className="editV">
                      <div
                        onClick={() => {
                          getCategoryIndex(index);
                        }}
                        className="btn btn-dark"
                        data-bs-toggle="modal"
                        data-bs-target="#exampleModal"
                      >
                        <i class="fa-solid fa-pen-to-square"></i>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
