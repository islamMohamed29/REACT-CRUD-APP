import { Link, useNavigate } from "react-router-dom";
import { PaperContext } from "../../Context/PaperContext";
import "./chiled/PaperChild.scss";
import React, { useContext, useRef, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useReactToPrint } from "react-to-print";
import $ from "jquery";

import axios from "axios";

export default function Paperview(props) {
  const { showPaper, getAllPaper, loading, setLoading } =
    useContext(PaperContext);
  const [Afro3, setAfro3] = useState([]);
  let token = localStorage.getItem("userToken");
  let navigate = useNavigate();

  async function getAllFar3() {
    let { data } = await axios.get("http://localhost:3000/api/v1/gear/allfar3");
    if (data.message == "Done") {
      setAfro3(data.all);
    }
  }

  useEffect(() => {
    getAllFar3();
    getAllPaper();
  }, []);

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
  const [filter, setFilter] = useState("");
  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    buttonActive();
  };
  const filteredItems = showPaper.filter((paper) =>
    paper.far3.includes(filter)
  );

  function deletePaper(id) {
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
        setLoading(true);
        axios
          .delete(`http://localhost:3000/api/v1/paper/${id}`, {
            data: {
              id,
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            if (response.data.message == "Done") {
              getAllPaper();
              setLoading(false);
              Swal.fire("تم الحذف !", "تم حذف الصرفية بنجاح", "success");
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
            setLoading(false);
          });
      }
    });
  }
  const [paperUpdate, setPaperUpdate] = useState({
    far3: "",
    count: "",
    type: "",
    reciver: "",
  });

  function getPaper({ target }) {
    setPaperUpdate({ ...paperUpdate, [target.name]: target.value });
  }
  function getPaperIndex(index) {
    document.querySelector("#exampleModalPaper select.far3").value =
      showPaper[index].far3;
    document.querySelector("#exampleModalPaper input.count").value =
      showPaper[index].count;
    document.querySelector("#exampleModalPaper select.type").value =
      showPaper[index].type;
    document.querySelector("#exampleModalPaper input.reciver").value =
      showPaper[index].reciver;
    setPaperUpdate({
      ...paperUpdate,
      far3: showPaper[index].far3,
      count: showPaper[index].count,
      type: showPaper[index].type,
      reciver: showPaper[index].reciver,
      PaperID: showPaper[index]._id,
    });
  }
  function handleCloseModal() {
    document
      .querySelectorAll(".modal-backdrop")
      .forEach((el) => el.classList.remove("modal-backdrop"));
  }
  async function updatePaper(e) {
    e.preventDefault();
    var framl;
    showPaper.map((ele) => {
      if (ele._id == paperUpdate.PaperID) {
        if (
          ele.far3 == paperUpdate.far3 &&
          ele.count == paperUpdate.count &&
          ele.type == paperUpdate.type &&
          ele.reciver == paperUpdate.reciver
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
        `http://localhost:3000/api/v1/paper/${paperUpdate.PaperID}`,
        paperUpdate,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data.message == "Done") {
        getAllPaper();
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
      $(".showPic").hide();
      $(".pagination-buttons").hide();
      $(".serach-box").hide();
      $(".top-print").removeClass("hide_ele");
    },
    onAfterPrint: () => {
      $(".deleteV").show();
      $(".editV").show();
      $(".time").show();
      $(".showPic").show();
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
        id="exampleModalPaper"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="exampleModalLabel">
                تعديل صرفية الورق
              </h1>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <form id="form-update" onSubmit={updatePaper}>
                <select
                  className="form-select mb-2 far3"
                  aria-label="Default select example"
                  name="far3"
                  onChange={getPaper}
                >
                  <option defaultValue="المنطقة">المكتب</option>
                  {Afro3.map((ele) => {
                    return (
                      <option className="mb-2" value={ele.far3Name}>
                        {ele.far3Name}
                      </option>
                    );
                  })}
                </select>

                <input
                  onChange={getPaper}
                  name="count"
                  type={"number"}
                  placeholder="العدد"
                  className="form-control my-2 count"
                />
                <select
                  className="form-select mb-2 type"
                  name="type"
                  aria-label="Default select example"
                  onChange={getPaper}
                >
                  <option defaultValue="نوع الورق">نوع الورق</option>
                  <option value="A4">A4</option>
                </select>

                <input
                  onChange={getPaper}
                  name="reciver"
                  placeholder="المستلم"
                  className="form-control mb-2 reciver"
                />
              </form>
            </div>
            <div class="modal-footer">
              <button
                id="btn-save"
                onClick={updatePaper}
                data-bs-dismiss="modal"
                type="submit"
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
      <section className="paper-view">
        <div className="m-auto my-5 w-100 head-paper-view">
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
          <div className="top-section w-100 m-auto mb-3">
            <div className="title">
              <h2>سجل صرف الورق</h2>
            </div>
            <div className="add-paper print-paper">
              <Link className=" btn btn-danger" to={"/paper"}>
                إضافة صرفية جديدة
              </Link>
              <Link className=" btn btn-primary me-2" to={"/allpaper"}>
                سجل مجمع
              </Link>
              <button className=" btn btn-primary me-2" onClick={handlePrint}>
                طباعة سجل صرف الورق
              </button>
            </div>
          </div>
        </div>

        <div
          className="printer"
          ref={componentRef}
          style={{ width: "100%", height: "100px" }}
        >
          <div className="top-print hide_ele d-flex justify-content-between align-items-center ">
            <div>
              <h4>سجل صرف الورق</h4>
            </div>
          </div>
          <style type="text/css" media="print">
            {
              "\
        @page { size: landscape; }\
"
            }
          </style>

          <table id="myTable" className="w-100 m-auto table">
            <thead>
              <tr>
                <th className="mosalsl" scope="col">
                  م
                </th>
                <th className="dataAdd" scope="col">
                  التاريخ
                </th>
                <th className="time" scope="col">
                  الوقت
                </th>
                <th className="far3" scope="col">
                  المكتب
                </th>
                <th className="count" scope="col">
                  العدد
                </th>
                <th className="type" scope="col">
                  النوع
                </th>
                <th className="reciver" scope="col">
                  المستلم
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
              {filteredItems.map((ele, index) => {
                return (
                  <tr key={ele._id}>
                    <th className="mosalsl" scope="row">
                      {index + 1}
                    </th>
                    <td className="dataAdd">{ele.createdAt.slice(0, 10)}</td>
                    <td className="time">{ele.createdAt.slice(12, 16)}</td>
                    <td className="far3">{ele.far3}</td>
                    <td className="count">{ele.count}</td>
                    <td className="type">{ele.type}</td>
                    <td className="reciver">{ele.reciver}</td>
                    <td className="deleteV">
                      <div
                        onClick={() => {
                          deletePaper(ele._id);
                        }}
                        className="btn btn-danger "
                      >
                        <i class="fa-solid fa-trash-can"></i>
                      </div>
                    </td>
                    <td className="editV">
                      <div
                        onClick={() => {
                          getPaperIndex(index);
                        }}
                        className="btn btn-dark"
                        data-bs-toggle="modal"
                        data-bs-target="#exampleModalPaper"
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
