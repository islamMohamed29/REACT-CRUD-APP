import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import $ from "jquery";
import { useReactToPrint } from "react-to-print";

export default function Viewcopyin(props) {
  const [copyInUpdate, setCopyUpdate] = useState({
    storage: "",
    far3: "",
    entityOut: "",
    subject: "",
    reciver: "",
    writer: "",
  });
  function getCopyInUpdate(e) {
    let myCopy = { ...copyInUpdate };
    myCopy[e.target.name] = e.target.value;
    setCopyUpdate(myCopy);
    // console.log(copyInUpdate);
  }

  const handleInputfar3 = (e) => {
    const { value } = e.target;
    copyInUpdate.far3 = value;
  };
  const handleInputstorage = (e) => {
    const { value } = e.target;
    copyInUpdate.storage = value;
  };

  const handleInputEntityOut = (e) => {
    const { value } = e.target;
    copyInUpdate.entityOut = value;
  };
  const [loading, setLoading] = useState(false);
  const [copysin, setCopyin] = useState([]);
  const [err, setErr] = useState("");
  const [filter, setFilter] = useState("");
  let token = localStorage.getItem("userToken");

  let navigate = useNavigate();

  async function getCopyIn() {
    let { data } = await axios.get("http://localhost:3000/api/v1/copy/allin");

    if (data.message == "Done") {
      setLoading(false);
      setCopyin(data.allCopysin);
    } else {
      setErr("لا يوجد مواضيع في الوقت الحالى");
    }
  }
  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    buttonActive();
  };
  const filteredItems = copysin.filter((copy) => copy.far3.includes(filter));
  useEffect(() => {
    getAllFar3();
    getCopyIn();
    setLoading(true);
  }, []);

  const [Afro3, setAfro3] = useState([]);

  async function getAllFar3() {
    let { data } = await axios.get("http://localhost:3000/api/v1/gear/allfar3");
    if (data.message == "Done") {
      setAfro3(data.all);
    }
  }
  function buttonActive() {
    const btns_afro3 = document.querySelectorAll(".afro3-btn");
    btns_afro3.forEach((el) => {
      el.addEventListener("click", (e) => {
        e.target.classList.add("activePaper");
        btns_afro3.forEach((el) => {
          el.classList.remove("activePaper");
        });
        e.target.classList.add("activePaper");
      });
    });
  }
  function deleteCopyIn(id) {
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
          .delete(`http://localhost:3000/api/v1/copy/allin/${id}`, {
            data: {
              id,
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            if (response.data.status == "success") {
              getCopyIn();
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
  function handleCloseModal() {
    document
      .querySelectorAll(".modal-backdrop")
      .forEach((el) => el.classList.remove("modal-backdrop"));
  }

  function getCopyInIndex(index) {
    document.querySelector("#exampleModal select.storage").value =
      copysin[index].storage;
    document.querySelector("#exampleModal select.far3").value =
      copysin[index].far3;
    document.querySelector("#exampleModal select.entityOut").value =
      copysin[index].entityOut;
    document.querySelector("#exampleModal textarea.subject").value =
      copysin[index].subject;
    document.querySelector("#exampleModal input.reciver").value =
      copysin[index].reciver;
    document.querySelector("#exampleModal input.writer").value =
      copysin[index].writer;
    setCopyUpdate({
      ...copyInUpdate,
      storage: copysin[index].storage,
      far3: copysin[index].far3,
      entityOut: copysin[index].entityOut,
      subject: copysin[index].subject,
      reciver: copysin[index].reciver,
      writer: copysin[index].writer,
      copyInID: copysin[index]._id,
    });
  }
  async function updateCopyIn(e) {
    e.preventDefault();
    var framl;
    copysin.map((ele) => {
      if (ele._id == copyInUpdate.copyInID) {
        if (
          ele.storage == copyInUpdate.storage &&
          ele.far3 == copyInUpdate.far3 &&
          ele.entityOut == copyInUpdate.entityOut &&
          ele.subject == copyInUpdate.subject &&
          ele.reciver == copyInUpdate.reciver &&
          ele.writer == copyInUpdate.writer
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
        `http://localhost:3000/api/v1/copy/in/${copyInUpdate.copyInID}`,
        copyInUpdate,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data.message == "Done") {
        getCopyIn();
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

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "سجل صرف الورق",
    onBeforeGetContent: () => {
      $(".deleteV").hide();
      $(".editV").hide();
      $(".time").hide();
      $(".dataAdd").hide();
      $(".pagination-buttons").hide();
      $(".serach-box").hide();
      $(".top-print").removeClass("hide_ele");
    },
    onAfterPrint: () => {
      $(".deleteV").show();
      $(".editV").show();
      $(".time").show();
      $(".dataAdd").hide();
      $(".pagination-buttons").show();
      $(".serach-box").show();
      $(".top-print").addClass("hide_ele");
    },
  });

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
                تعديل نقل بيانات داخلي
              </h1>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <form onSubmit={updateCopyIn} id="form-update">
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
                <select
                  className="form-select mb-2 entityOut"
                  aria-label="Default select example"
                  onChange={handleInputEntityOut}
                >
                  <option defaultValue="الجهة الصادرة">الجهة الصادرة</option>
                  {Afro3.map((ele) => {
                    return (
                      <option className="mb-2" value={ele.far3Name}>
                        {ele.far3Name}
                      </option>
                    );
                  })}
                </select>
                <textarea
                  onChange={getCopyInUpdate}
                  className="form-control mb-2 m-auto subject"
                  name="subject"
                  placeholder="ملخص المحتوى"
                  type="text"
                />
                <input
                  onChange={getCopyInUpdate}
                  className="form-control mb-2 m-auto reciver"
                  name="reciver"
                  placeholder="المستلم"
                  type="text"
                />
                <input
                  onChange={getCopyInUpdate}
                  className="form-control mb-2 m-auto writer"
                  name="writer"
                  placeholder="القائم بالنسخ"
                  type="text"
                />
              </form>
            </div>
            <div class="modal-footer">
              <button
                id="btn-save"
                onClick={updateCopyIn}
                data-bs-dismiss="modal"
                type="button"
                class="btn btn-primary"
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
      <section className="view-copyin pt-5">
        <div className="m-auto py-5 w-100 head-paper-view">
          <ul className="linkPaperAfro3">
            {Afro3.map((ele) => {
              return (
                <button
                  value={ele.far3Name}
                  onClick={handleFilterChange}
                  className={`afro3-btn`}
                >
                  {ele.far3Name}
                </button>
              );
            })}
          </ul>
          <div className="top-section w-100 m-auto mb-3 p-4">
            <div className="title">
              <h2>سجل نقل بيانات داخلي</h2>
            </div>
            <div className="add-copyin">
              <Link className=" btn btn-danger" to={"/copyin"}>
                إضافة نقل بيانات جديد
              </Link>
              <button className=" btn btn-primary me-2" onClick={handlePrint}>
                طباعة سجل النقل الداخلي
              </button>
            </div>
          </div>
        </div>
        {err.length > 0 ? <div className="alert alert-danger">{err}</div> : ""}
        <div
          className="printer"
          ref={componentRef}
          style={{ width: "100%", height: "100px" }}
        >
          <div className="top-print hide_ele d-flex justify-content-between align-items-center ">
            <div>
              <h4>سجل نقل بيانات خارجي</h4>
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
                <th className="dataAdd" scope="col">
                  التاريخ
                </th>
                <th className="time" scope="col">
                  الوقت
                </th>
                <th scope="col">وسيلة التخزين</th>
                <th scope="col">المكتب</th>
                <th scope="col">الجهة الصادرة</th>
                <th scope="col">ملخص المحتوى</th>
                <th scope="col">المستلم</th>
                <th scope="col">القائم بالنسخ</th>

                <th className="deleteV" scope="col">
                  حذف
                </th>
                <th className="editV" scope="col">
                  تعديل
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((ele, index) => {
                return (
                  <tr key={ele._id}>
                    <th className="mosalsl" scope="row">
                      {index + 1}
                    </th>
                    <td className="dataAdd">{ele.createdAt.slice(0, 10)}</td>
                    <td className="time">{ele.createdAt.slice(12, 16)}</td>
                    <td className="storage">{ele.storage}</td>
                    <td className="far3">{ele.far3}</td>
                    <td className="entityOut">{ele.entityOut}</td>
                    <td className="subject">{ele.subject}</td>
                    <td className="reciver">{ele.reciver}</td>
                    <td className="writer">{ele.writer}</td>

                    <td className="deleteV">
                      <div
                        onClick={() => {
                          deleteCopyIn(ele._id);
                        }}
                        className="btn btn-danger "
                      >
                        <i class="fa-solid fa-trash-can"></i>
                      </div>
                    </td>
                    <td className="editV">
                      <div
                        onClick={() => {
                          getCopyInIndex(index);
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
