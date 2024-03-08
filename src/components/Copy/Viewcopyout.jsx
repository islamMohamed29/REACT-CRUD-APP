import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import $ from "jquery";
import { useReactToPrint } from "react-to-print";

export default function Viewcopyout(props) {
  const [loading, setLoading] = useState(false);
  const [copysout, setCopyout] = useState();
  const [copyOutUpdate, setCopyUpdate] = useState({
    storage: "",
    entityIn: "",
    entityOut: "",
    subject: "",
    reciver: "",
    sendar: "",
    owner: "",
    password: "",
  });
  const [err, setErr] = useState("");
  let token = localStorage.getItem("userToken");
  const [Afro3, setAfro3] = useState([]);

  async function getAllFar3() {
    let { data } = await axios.get("http://localhost:3000/api/v1/gear/allfar3");
    if (data.message == "Done") {
      setAfro3(data.all);
    }
  }
  let navigate = useNavigate();
  async function getCopyout() {
    let { data } = await axios.get("http://localhost:3000/api/v1/copy/allout");

    if (data.message == "Done") {
      setLoading(false);
      setCopyout(data.allCopysout);
    } else if (data.allCopysout.length == 0) {
      setErr("حدث خطأ ما برجاء الرجوع الي المطور.");
    }
  }

  useEffect(() => {
    getCopyout();
    setLoading(true);
    getAllFar3();
  }, []);

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "سجل نقل بيانات مكاتب خارجية",
    onBeforeGetContent: () => {
      $(".deleteV").hide();
      $(".editV").hide();
      $(".time").hide();
      $(".top-print").removeClass("hide_ele");
    },

    onAfterPrint: () => {
      $(".deleteV").show();
      $(".editV").show();
      $(".time").show();
      $(".top-print").addClass("hide_ele");
    },
  });
  function handleCloseModal() {
    document
      .querySelectorAll(".modal-backdrop")
      .forEach((el) => el.classList.remove("modal-backdrop"));
  }
  async function updateCopyOut(e) {
    e.preventDefault();
    var framl;
    copysout.map((ele) => {
      if (ele._id == copyOutUpdate.copyOutID) {
        if (
          ele.storage == copyOutUpdate.storage &&
          ele.entityIn == copyOutUpdate.entityIn &&
          ele.entityOut == copyOutUpdate.entityOut &&
          ele.subject == copyOutUpdate.subject &&
          ele.reciver == copyOutUpdate.reciver &&
          ele.sendar == copyOutUpdate.sendar &&
          ele.owner == copyOutUpdate.owner &&
          ele.password == copyOutUpdate.password
        ) {
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
        `http://localhost:3000/api/v1/copy/out/${copyOutUpdate.copyOutID}`,
        copyOutUpdate,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.message == "Done") {
        getCopyout();
        handleCloseModal();
        Swal.fire("تم التحديث!", "الصرفية قد تم تعديلها.", "success");
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
  function deleteCopyOut(id) {
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
          .delete(`http://localhost:3000/api/v1/copy/allout/${id}`, {
            data: {
              id,
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            if (response.data.status == "success") {
              getCopyout();
              Swal.fire("تم الحذف !", "تم حذف النسخ", "success");
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
  function getCopyOutUpdate(e) {
    let myCopy = { ...copyOutUpdate };
    myCopy[e.target.name] = e.target.value;
    setCopyUpdate(myCopy);
    // console.log(copyOutUpdate);
  }

  const handleInputfar3 = (e) => {
    const { value } = e.target;
    copyOutUpdate.entityIn = value;
  };
  const handleInputstorage = (e) => {
    const { value } = e.target;
    copyOutUpdate.storage = value;
  };

  const handleInputEntityOut = (e) => {
    const { value } = e.target;
    copyOutUpdate.entityOut = value;
  };
  function getCopyOutIndex(index) {
    document.querySelector("#exampleModal select.storage").value =
      copysout[index].storage;
    document.querySelector("#exampleModal select.far3").value =
      copysout[index].entityIn;
    document.querySelector("#exampleModal input.entityOut").value =
      copysout[index].entityOut;
    document.querySelector("#exampleModal textarea.subject").value =
      copysout[index].subject;
    document.querySelector("#exampleModal input.reciver").value =
      copysout[index].reciver;
    document.querySelector("#exampleModal input.sendar").value =
      copysout[index].sendar;
    document.querySelector("#exampleModal input.owner").value =
      copysout[index].owner;
    document.querySelector("#exampleModal input.password").value =
      copysout[index].password;
    setCopyUpdate({
      ...copyOutUpdate,
      storage: copysout[index].storage,
      entityIn: copysout[index].entityIn,
      entityOut: copysout[index].entityOut,
      subject: copysout[index].subject,
      reciver: copysout[index].reciver,
      sendar: copysout[index].sendar,
      owner: copysout[index].owner,
      password: copysout[index].password,
      copyOutID: copysout[index]._id,
    });
  }
  return (
    <>
      {" "}
      {loading ? (
        <div className="loading">
          <span class="loader"></span>
        </div>
      ) : (
        ""
      )}
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
                تعديل سجل نقل بيانات مكاتب خارجية
              </h1>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <form onSubmit={updateCopyOut} id="form-update">
                <select
                  className="form-select mb-2 storage"
                  name="storage"
                  aria-label="Default select example"
                  onChange={handleInputstorage}
                >
                  <option defaultValue="وسيلة التخزين">وسيلة التخزين</option>
                  <option value="USB">USB</option>
                  <option value="CD">CD</option>
                  <option value="HARD">HARD</option>
                </select>
                <select
                  className="form-select mb-2 far3"
                  aria-label="Default select example"
                  onChange={handleInputfar3}
                >
                  <option defaultValue="المكتب">المكتب</option>
                  {Afro3.map((ele) => {
                    return (
                      <option className="mb-2" value={ele.far3Name}>
                        {ele.far3Name}
                      </option>
                    );
                  })}
                </select>

                <input
                  onChange={getCopyOutUpdate}
                  className="form-control mb-2 m-auto entityOut"
                  name="entityOut"
                  placeholder="الجهة الصادرة"
                  type="text"
                />
                <textarea
                  onChange={getCopyOutUpdate}
                  className="form-control mb-2 m-auto subject"
                  name="subject"
                  placeholder="ملخص المحتوى"
                  type="text"
                />
                <input
                  onChange={getCopyOutUpdate}
                  className="form-control mb-2 m-auto reciver"
                  name="reciver"
                  placeholder="المستلم"
                  type="text"
                />
                <input
                  onChange={getCopyOutUpdate}
                  className="form-control mb-2 m-auto sendar"
                  name="sendar"
                  placeholder="القائم بالنسخ"
                  type="text"
                />
                <input
                  onChange={getCopyOutUpdate}
                  className="form-control mb-2 m-auto owner"
                  name="الأمر بالنسخ"
                  placeholder="القائم بالنسخ"
                  type="text"
                />
                <input
                  onChange={getCopyOutUpdate}
                  className="form-control mb-2 m-auto password"
                  name="password"
                  placeholder="الباسورد"
                  type="password"
                />
              </form>
            </div>
            <div class="modal-footer">
              <button
                id="btn-save"
                data-bs-dismiss="modal"
                type="submit"
                class="btn btn-primary"
                onClick={updateCopyOut}
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
      <section className="view-copyin p-4 pt-5">
        <div className="m-auto py-5 w-100 head-paper-view">
          <div className="top-section w-100 m-auto mb-3 p-4">
            <div className="title">
              <h2>سجل نقل بيانات مكاتب خارجية</h2>
            </div>
            <div className="add-copyin">
              <Link className=" btn btn-danger" to={"/copyout"}>
                إضافة نسخ جديد
              </Link>
              <button className=" btn btn-primary me-2" onClick={handlePrint}>
                طباعة سجل النقل الخارجي
              </button>
            </div>
          </div>
        </div>
        {err.length !== 0 ? (
          <div className="alert alert-danger">{err}</div>
        ) : (
          ""
        )}
        <div
          className="printer"
          ref={componentRef}
          style={{ width: "100%", height: "100px" }}
        >
          <div className="top-print hide_ele d-flex justify-content-between align-items-center ">
            <div>
              <h4>سجل نقل بيانات مكاتب خارجية</h4>
            </div>
          </div>
          <style type="text/css" media="print">
            {
              "\
        @page { size: landscape; }\
"
            }
          </style>
          <table id="myTable" className="w-80 m-auto table">
            <thead>
              <tr>
                <th scope="col">م</th>
                <th scope="col">التاريخ</th>
                <th className="time" scope="time">
                  الوقت
                </th>
                <th scope="col">وسيلة التخزين</th>
                <th scope="col">المكتب</th>
                <th scope="col">الجهة الصادرة</th>
                <th scope="col">ملخص المحتوى</th>
                <th scope="col">المستلم</th>
                <th scope="col">القائم بالنسخ</th>
                <th scope="col">الأمر بالنسخ</th>
                <th scope="col">الباسورد</th>
                <th className="deleteV" scope="col">
                  حذف
                </th>
                <th className="editV" scope="col">
                  تعديل
                </th>
              </tr>
            </thead>
            <tbody>
              {copysout ? (
                copysout.map((ele, index) => {
                  return (
                    <tr key={ele._id}>
                      <th className="mosalsl" scope="row">
                        {index + 1}
                      </th>
                      <td className="dataAdd">{ele.createdAt.slice(0, 10)}</td>
                      <td className="time">{ele.createdAt.slice(12, 16)}</td>
                      <td className="storage">{ele.storage}</td>
                      <td className="far3">{ele.entityIn}</td>
                      <td className="entityOut">{ele.entityOut}</td>
                      <td className="subject">{ele.subject}</td>
                      <td className="reciver">{ele.reciver}</td>
                      <td className="writer">{ele.sendar}</td>
                      <td className="owner">{ele.owner}</td>
                      <td className="password">{ele.password}</td>

                      <td className="deleteV">
                        <div
                          className="btn btn-danger 
                        "
                          onClick={() => {
                            deleteCopyOut(ele._id);
                          }}
                        >
                          <i class="fa-solid fa-trash-can"></i>
                        </div>
                      </td>
                      <td className="editV">
                        <div
                          className="btn btn-dark"
                          data-bs-toggle="modal"
                          data-bs-target="#exampleModal"
                          onClick={() => {
                            getCopyOutIndex(index);
                          }}
                        >
                          <i class="fa-solid fa-pen-to-square"></i>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <h3 className="mt-2">لا يوجد أي بيانات حاليا لعرضها</h3>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
