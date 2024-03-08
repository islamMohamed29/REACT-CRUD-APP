import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";

export default function AllAfro3(props) {
  let navigate = useNavigate();
  let token = localStorage.getItem("userToken");

  const [err, setErr] = useState("");
  const [far3, setFar3] = useState([]);
  async function getAllFar3() {
    let { data } = await axios.get("http://localhost:3000/api/v1/gear/allfar3");
    if (data.message == "Done") {
      setFar3(data.all);
    } else {
      setErr("لا يوجد افرع في الوقت الحالى");
    }
  }
  function deleteFar3(id) {
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
        axios
          .delete(`http://localhost:3000/api/v1/gear/far3/${id}`, {
            data: {
              id,
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            if (response.data.status == "success") {
              getAllFar3();
              Swal.fire("تم الحذف !", "تم حذف المكتب", "success");
            } else {
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "حدث خطأ برجاء الرجوع إلي المطور",
              });
            }
          })
          .catch((err) => {
            // console.log(err);
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

  const [far3Update, setFar3Update] = useState({
    categoryName: "",
  });

  function getFar3({ target }) {
    setFar3Update({ ...far3Update, [target.name]: target.value });
  }

  function getFar3Index(index) {
    document.querySelector("#exampleModal input.updateFar3").value =
      far3[index].far3Name;
    setFar3Update({
      ...far3Update,
      far3Name: far3[index].far3Name,
      Far3ID: far3[index]._id,
    });
  }

  async function updateFar3(e) {
    e.preventDefault();
    try {
      var framl;
      far3.map((ele) => {
        if (ele._id == far3Update.Far3ID) {
          if (ele.far3Name == far3Update.far3Update) {
            framl = "no data edit";
          } else framl = "edit start to call api";
        }
      });
      if (framl == "no data edit") {
        Swal.fire("لا يوجد تعديلات", "لم يتم تعديل أي بيانات", "success");
        return;
      }
      let { data } = await axios.put(
        `http://localhost:3000/api/v1/gear/far3/${far3Update.Far3ID}`,
        far3Update,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data.message == "Done") {
        getAllFar3();
        // handleCloseModal();
        Swal.fire("تم التحديث!", "  المكتب قد تم تحديثه .", "success");
      } else {
        Swal.fire({
          icon: "error",
          title: "خطأ",
          text: "حدث خطأ ما الرجاء الرجوع إلي المطور",
        });
      }
    } catch (error) {
      if (error.response.data.message == "this role is n.t authorized") {
        Swal.fire({
          icon: "warning",
          title: "خطأ",
          text: "لا تملك صلاحيات للتعديل.",
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

  useEffect(() => {
    getAllFar3();
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
                تعديل المكتب
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
                  onChange={getFar3}
                  name="far3Name"
                  placeholder="اسم المكتب الجديد"
                  className="form-control mb-2 updateFar3"
                />
              </form>
            </div>
            <div class="modal-footer">
              <button
                id="btn-save"
                data-bs-dismiss="modal"
                type="button"
                class="btn btn-primary"
                onClick={updateFar3}
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
          <h2 className="mb-3 me-5 pt-5">جميع المكاتب</h2>
          <div className="add-cat">
            <Link className=" btn btn-primary" to={"/addfar3"}>
              إضافة مكتب جديد
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
                  إسم المكتب
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
              {far3.map((ele, index) => {
                return (
                  <tr key={ele._id}>
                    <td className="name">{ele.far3Name}</td>
                    <td className="deleteV">
                      <div
                        onClick={() => {
                          deleteFar3(ele._id);
                        }}
                        className="btn btn-danger "
                      >
                        <i class="fa-solid fa-trash-can"></i>
                      </div>
                    </td>
                    <td className="editV">
                      <div
                        onClick={() => {
                          getFar3Index(index);
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
