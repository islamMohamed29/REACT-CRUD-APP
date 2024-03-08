import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

export default function Copyin() {
  const [Afro3, setAfro3] = useState([]);

  async function getAllFar3() {
    let { data } = await axios.get("http://localhost:3000/api/v1/gear/allfar3");
    if (data.message == "Done") {
      setAfro3(data.all);
    }
  }
  useEffect(() => {
    getAllFar3();
  }, []);

  const [copyAdded, setCopyAdded] = useState({
    storage: "",
    far3: "",
    entityOut: "",
    subject: "",
    reciver: "",
    writer: "",
  });
  function getCopyInAdd(e) {
    let myCopy = { ...copyAdded };
    myCopy[e.target.name] = e.target.value;
    setCopyAdded(myCopy);
  }
  const handleInputfar3 = (e) => {
    const { value } = e.target;
    copyAdded.far3 = value;
  };
  const handleInputstorage = (e) => {
    const { value } = e.target;
    copyAdded.storage = value;
  };

  const handleInputEntityOut = (e) => {
    const { value } = e.target;
    copyAdded.entityOut = value;
  };

  async function addCopyIn(e) {
    e.preventDefault();

    let { data } = await axios.post(
      "http://localhost:3000/api/v1/copy/addin",
      copyAdded
    );
    if (data.message == "Done") {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "تم إضافة النسخ بنجاح.",
        showConfirmButton: false,
        timer: 1200,
      });
      document.getElementById("copy-in").reset();
      setCopyAdded({
        storage: "",
        far3: "",
        entityOut: "",
        subject: "",
        reciver: "",
        writer: "",
      });
    } else {
      Swal.fire({
        // position: 'top-end',
        position: "center",
        icon: "error",
        title: "الرجاء التأكد من صحةالبيانات.",
        showConfirmButton: false,
        timer: 1200,
      });
    }
  }

  return (
    <>
      <section className="copyin">
        <div className="top-section w-75 m-auto mb-3">
          <div className="title">
            <h2>إضافة نقل بيانات مكاتب داخلية</h2>
          </div>
          <div className="view-copyin">
            <Link className=" btn btn-danger" to={"/viewcopyin"}>
              عرض سجل نقل بيانات مكاتب داخلية
            </Link>
          </div>
        </div>
        <div className="box w-75 m-auto">
          <form id="copy-in">
            <div className="form-group">
              <select
                className="form-select mb-2"
                aria-label="Default select example"
                onChange={handleInputstorage}
              >
                <option defaultValue="وسيلة التخزين">وسيلة التخزين</option>
                <option value="USB">USB</option>
                <option value="CD">CD</option>
                <option value="HARD">HARD</option>
              </select>
            </div>
            <div className="form-group">
              <select
                className="form-select mb-2"
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
            </div>
            <div className="form-group">
              <select
                className="form-select mb-2"
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
            </div>

            <div className="form-group">
              <textarea
                onChange={getCopyInAdd}
                className="form-control mb-2 m-auto"
                name="subject"
                placeholder="ملخص المحتوى"
                type="text"
              />
            </div>
            <div className="form-group">
              <input
                onChange={getCopyInAdd}
                className="form-control mb-2 m-auto"
                name="reciver"
                placeholder="المستلم"
                type="text"
              />
            </div>
            <div className="form-group">
              <input
                onChange={getCopyInAdd}
                className="form-control mb-2 m-auto"
                name="writer"
                placeholder="القائم بالنسخ"
                type="text"
              />
            </div>
            <button
              onClick={addCopyIn}
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
