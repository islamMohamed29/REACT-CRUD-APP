import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { Link, useNavigate } from "react-router-dom";
import Viewer from "viewerjs";
import "viewerjs/dist/viewer.css";
import "./Showmokatba.scss";
import $ from "jquery";
import Swal from "sweetalert2";
export default function Showmokatba(props) {
  let hreeef = window.location.href.slice(0, -12);
  let URL = "http://localhost:3000/api/v1/mokatbat/";
  const [showData, setShowData] = useState([]);
  const [totalPages, setTotalPages] = useState([]);
  let [count, setCount] = useState([]);
  const [total, setTotal] = useState([]);
  let nums = new Array(totalPages).fill(1).map((ele, index) => index + 1);
  const [imagesShowing, setImagesShowing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [textDesc, setTextDesc] = useState("");
  const [now, setNow] = useState("1");
  const [fullData, setFullData] = useState();
  let token = localStorage.getItem("userToken");
  let navigate = useNavigate();
  async function showMokatbat(pageNumber = 1) {
    let response = await axios.get(
      `${hreeef}3000/api/v1/mokatbat?page=${pageNumber}&&limit=30`
    );
    if (response.status == "200") {
      setFullData(response.data.all.fullData);
      setShowData(response.data.all.data);
      setTotalPages(response.data.all.metaData.totalPages);
      setTotal(response.data.all.metaData.totalDocuments);
      setCount(response.data.all.metaData.counter);
      setLoading(false);
      return;
    }
  }

  async function showPic(id) {
    let response = await axios.get(
      `http://localhost:3000/api/v1/mokatbat/pic/${id}`
    );
    if (response.status == 200) {
      setImagesShowing(response.data.mokatba.mokatbaImgs);
      setTextDesc(response.data.mokatba.subject);
    }
  }

  function clickableee() {
    var gallery = document.getElementById("myListImg");
    if (gallery) {
      const viewer = new Viewer(gallery, {
        toolbar: {
          oneToOne: true,
          zoomIn: 4,
          zoomOut: 4,
          reset: 4,

          prev() {
            viewer.prev(true);
          },

          play: true,

          next() {
            viewer.next(true);
          },
          rotateLeft: 4,
          rotateRight: 4,
          flipHorizontal: 4,
          flipVertical: 4,
        },
      });
    }
  }
  function deleteMokatba(id) {
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
          .delete(`http://localhost:3000/api/v1/mokatbat/${id}`, {
            data: {
              id,
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            if (response.data.status == "success") {
              showMokatbat(now);
              setLoading(false);
              Swal.fire("تم الحذف !", "تم حذف المكاتبة", "success");
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
  useEffect(() => {
    showMokatbat(now);
    getCategory();
    setLoading(true);
  }, []);

  function getMokatbaIndex(index) {
    const btons = document.querySelectorAll(".type-btn");
    btons.forEach((el) => {
      el.addEventListener("click", (e) => {
        btons.forEach((el) => {
          el.classList.remove("focuseaa");
        });
        e.target.classList.add("focuseaa");
      });
    });
    document.querySelector("#exampleModal input.entity").value =
      showData[index].entity;
    document.querySelector("#exampleModal input.subject").value =
      showData[index].subject;
    document.querySelector("#exampleModal input.regNum").value =
      showData[index].regNum;
    document.querySelector("#exampleModal input.savedFile").value =
      showData[index].savedFile;

    let sadr = document.querySelector("#exampleModal button.sadr");
    let ward = document.querySelector("#exampleModal button.ward");

    if (showData[index].type === "وارد") {
      ward.classList.add("focuseaa");
      sadr.classList.remove("focuseaa");
    } else {
      sadr.classList.add("focuseaa");
      ward.classList.remove("focuseaa");
    }
    setMokatbatUpdate({
      ...mokatbatUpdate,
      entity: showData[index].entity,
      subject: showData[index].subject,
      regNum: showData[index].regNum,
      savedFile: showData[index].savedFile,
      type: showData[index].type,
      MokatbaID: showData[index]._id,
    });
  }
  function handleCloseModal() {
    document
      .querySelectorAll(".modal-backdrop")
      .forEach((el) => el.classList.remove("modal-backdrop"));
  }
  async function updateMokatba(e) {
    e.preventDefault();
    var framl;
    showData.map((ele) => {
      if (ele._id == mokatbatUpdate.MokatbaID) {
        if (
          ele.type == mokatbatUpdate.type &&
          ele.regNum == mokatbatUpdate.regNum &&
          ele.savedFile == mokatbatUpdate.savedFile &&
          ele.entity == mokatbatUpdate.entity &&
          ele.subject == mokatbatUpdate.subject
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
        `${hreeef}3000/api/v1/mokatbat/${mokatbatUpdate.MokatbaID}`,
        mokatbatUpdate,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data.message == "Done") {
        showMokatbat(1);
        handleCloseModal();
        Swal.fire("تم التحديث!", "المكاتبة قد تم تعديلها.", "success");
      } else if (data.message == "regNum is n.t a number") {
        Swal.fire({
          icon: "error",
          title: "خطأ",
          text: "رقم القيد لا يمكن أن يكون مكون من أحرف",
        });
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

  const [mokatbatUpdate, setMokatbatUpdate] = useState({
    type: "",
    regNum: "",
    entity: "",
    subject: "",
    savedFile: "",
  });
  function getMokatba({ target }) {
    setMokatbatUpdate({ ...mokatbatUpdate, [target.name]: target.value });
  }
  const [files, setFiles] = useState();
  const submitIMG = async (id) => {
    const formData = new FormData();
    if (files) {
      for (let i = 0; i < files.length; i++) {
        formData.append(`image`, files[i]);
      }
      const result = await axios.post(
        `http://localhost:3000/api/v1/mokatbat/pic/${id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
    } else {
      console.log("plz upload files");
    }
  };
  const handleInputUpdate = (e) => {
    e.preventDefault();
    const { value } = e.target;
    mokatbatUpdate.type = value;
  };

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "سجل المكاتبات",
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
  const [filter, setFilter] = useState("");

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };
  let filteredItems = showData.filter((mok) => mok.subject.includes(filter));

  const [numberFilter, setNumberFilter] = useState("");

  const handleNumberChange = (event) => {
    setNumberFilter(event.target.value);
  };

  filteredItems = filteredItems.filter((mok) =>
    mok.type.includes(numberFilter)
  );
  let [regFilter, setRegFilter] = useState("");

  const handleRegFilter = (event) => {
    setRegFilter(event.target.value);
  };

  filteredItems = filteredItems.filter((mok) =>
    mok.regNum.toString().includes(regFilter)
  );
  let [categoryFilter, setHandleFor] = useState("");

  const handleFor = (event) => {
    setHandleFor(event.target.value);
  };

  filteredItems = filteredItems.filter((mok) =>
    mok.category.includes(categoryFilter)
  );

  const showAllMok = () => {
    setShowData(fullData);

    $(".pagination-buttons").hide();
  };
  const showLimit = () => {
    showMokatbat();
    $(".pagination-buttons").show();
  };

  const renderMok = () => {
    return filteredItems.map((ele, index) => {
      return (
        <tr key={ele._id}>
          <th className="mosalsl" scope="row">
            {(count += 1)}
          </th>
          <td className="dataAdd">{ele.createdAt.slice(0, 10)}</td>
          <td className="time">{ele.createdAt.slice(12, 16)}</td>
          <td className="type">{ele.type}</td>
          <td className="regNum">{ele.regNum}</td>
          <td>{ele.entity}</td>
          <td>{ele.category}</td>
          <td>{ele.subject}</td>
          <td>{ele.savedFile}</td>
          {ele.mokatbaImgs.length != 0 ? (
            <td className="showPic">
              <div
                className="btn btn-dark"
                data-bs-toggle="modal"
                data-bs-target="#exampleModalImages"
                onClick={() => {
                  showPic(ele._id);
                }}
              >
                <i class="fa-solid fa-image"></i>
              </div>
            </td>
          ) : (
            <td className="showPic not">
              <div
                className="btn btn-dark"
                data-bs-toggle="modal"
                data-bs-target="#exampleModalImages"
                onClick={() => {
                  showPic(ele._id);
                }}
              >
                <i class="fa-solid fa-image"></i>
              </div>
            </td>
          )}
          <td className="deleteV">
            {/* <i class="fa-regular fa-face-smile"></i> */}
            <div
              onClick={() => {
                deleteMokatba(ele._id);
              }}
              className="btn btn-danger "
            >
              <i class="fa-solid fa-trash-can"></i>
            </div>
          </td>
          <td className="editV">
            <div
              onClick={() => {
                getMokatbaIndex(index);
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
    });
  };

  const [categoryMok, setCategory] = useState([]);

  async function getCategory() {
    let response = await axios.get(`${URL}category/all`);
    if (response.data.message == "Done") {
      setCategory(response.data.allcategorys);
    }
  }

  return (
    <>
      {loading ? (
        <div className="loading">
          <span class="loader"></span>
        </div>
      ) : (
        ""
      )}

      <div
        class="modal fade"
        id="exampleModalImages"
        tabindex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">
                عرض صور المكاتبة
              </h5>
              <button
                type="button"
                class="close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="p-2 m-2 content-preview d-flex justify-content-between">
              <div>
                {textDesc ? (
                  <h6 class="descccc">موضوع المكاتبة: {textDesc}</h6>
                ) : (
                  ""
                )}
              </div>
            </div>

            {imagesShowing ? (
              <h6 className="count-img">عدد الصور: {imagesShowing.length}</h6>
            ) : !imagesShowing == null ? (
              <>
                <button onClick={submitIMG}>إضغط لإضافة صور</button>
                <input
                  onChange={(e) => setFiles(e.target.files)}
                  type="file"
                  accept="images/*"
                  multiple
                ></input>{" "}
              </>
            ) : (
              ""
            )}

            <div class="modal-body">
              <ul id="myListImg">
                {imagesShowing?.map((ele) => {
                  return (
                    <li>
                      <img
                        onClick={clickableee}
                        className="image_showing"
                        src={`http://localhost:3000/api/v1/${ele}`}
                        alt=""
                      />
                    </li>
                  );
                })}
              </ul>
            </div>
            <div class="modal-footer">
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
                تعديل المكاتبة
              </h1>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <form onSubmit={updateMokatba} id="form-update">
                <input
                  onChange={getMokatba}
                  name="regNum"
                  placeholder="رقم القيد"
                  className="form-control mt-2 mb-2 regNum"
                />

                <button
                  onClick={handleInputUpdate}
                  className="sadr type-btn btn btn-success ms-2"
                  value={"صادر"}
                >
                  صادر
                </button>
                <button
                  onClick={handleInputUpdate}
                  className="ward type-btn btn btn-success"
                  value={"وارد"}
                >
                  وارد
                </button>
                <input
                  onChange={getMokatba}
                  name="entity"
                  placeholder="الجهة"
                  className="form-control my-2 entity"
                />
                <input
                  onChange={getMokatba}
                  name="subject"
                  placeholder="الموضوع"
                  className="form-control mb-2 subject"
                />
                <input
                  onChange={getMokatba}
                  name="savedFile"
                  placeholder="ملف الحفظ"
                  className="form-control mb-2 savedFile"
                />
              </form>
            </div>
            <div class="modal-footer">
              <button
                id="btn-save"
                onClick={updateMokatba}
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
      <section className="show-mokatbat">
        <div className="top-section w-100 m-auto mb-3">
          <div className="title">
            <h2>سجل عرض المكاتبات</h2>
          </div>
          <div className="add-mok">
            <Link className=" btn btn-danger" to={"/addmok"}>
              إضافة مكاتبة جديدة
            </Link>
            <button className=" btn btn-primary me-2" onClick={handlePrint}>
              طباعة سجل المكاتبات
            </button>
          </div>
        </div>

        <div
          className="printer"
          ref={componentRef}
          style={{ width: "100%", height: "100px" }}
        >
          <div className="top-print hide_ele d-flex justify-content-between align-items-center ">
            <div>
              <h4>سجل المكاتبات</h4>
            </div>
          </div>
          <style type="text/css" media="print">
            {
              "\
        @page { size: landscape; }\
"
            }
          </style>

          <div className="serach-box">
            <form id="form-search">
              <div className="form-group">
                <input
                  type="search"
                  className="form-control"
                  placeholder="ابحث بـ رقم القيد"
                  value={regFilter}
                  onChange={handleRegFilter}
                />
              </div>
              <div className="form-group">
                <select
                  className="form-select mb-2"
                  aria-label="Default select example"
                  onChange={handleNumberChange}
                >
                  <option value={""} defaultValue="صادر + وارد">
                    صادر + وارد
                  </option>

                  <option className="mb-2" value="صادر">
                    صادر
                  </option>
                  <option className="mb-2" value="وارد">
                    وارد
                  </option>
                </select>
              </div>
              <div className="form-group">
                <select
                  className="form-select mb-2"
                  aria-label="Default select example"
                  onChange={handleFor}
                >
                  <option value={""} defaultValue="حساب صنف">
                    كل الموضوعات
                  </option>

                  {categoryMok.map((cat) => {
                    return (
                      <option className="mb-2" value={cat.categoryName}>
                        {cat.categoryName}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="form-group">
                <input
                  type="search"
                  className="form-control"
                  placeholder="ابحث بـ ملخص الموضوع"
                  value={filter}
                  onChange={handleFilterChange}
                />
              </div>
            </form>

            <div className="group-btn">
              <button className="btn btn-dark" onClick={showAllMok}>
                عرض الكل
              </button>
              <button className="btn btn-dark" onClick={showLimit}>
                عرض مخصص
              </button>
            </div>
          </div>

          <table id="myTable" className="  my-1 m-auto table">
            {filteredItems.length ? (
              <thead>
                <tr>
                  <th className="mosalsl" scope="col ">
                    م
                  </th>
                  <th className="dataADD" scope="col ">
                    تاريخ الإضافة
                  </th>
                  <th className="time" scope="col">
                    الوقت
                  </th>
                  <th className="type" scope="col">
                    نوع المكاتبة
                  </th>
                  <th className="regNum" scope="col">
                    رقم القيد
                  </th>
                  <th scope="col">الجهة</th>
                  <th scope="col">الموضوع</th>
                  <th scope="col">ملخص الموضوع</th>
                  <th scope="col">ملف الحفظ</th>
                  <th className="showPic" scope="col">
                    عرض الصور
                  </th>
                  <th className="deleteV" scope="col">
                    حذف
                  </th>
                  <th className="editV" scope="col">
                    تعديل
                  </th>
                </tr>
              </thead>
            ) : (
              <h2 className="py-3">لا يوجد اي نتائج بحث</h2>
            )}
            <tbody>{renderMok()}</tbody>
          </table>
          <nav aria-label="Page navigation example">
            <ul className="pagination-buttons pagination ">
              {nums.length > 1
                ? nums.map((pageNumber) => {
                    return (
                      <li
                        onClick={() => {
                          showMokatbat(pageNumber);
                          setNow(pageNumber);
                        }}
                        className="paginate page-item"
                      >
                        {pageNumber}
                      </li>
                    );
                  })
                : ""}
            </ul>
          </nav>
        </div>
      </section>
    </>
  );
}
