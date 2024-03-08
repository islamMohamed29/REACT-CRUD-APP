import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

export default function Copyout() {
  const [copyAddedOut, setCopyAddedOut] = useState({
    storage: "",
    entityIn: "",
    entityOut: "",
    subject: "",
    reciver: "",
    sendar: "",
    owner: "",
    password: "",
  });

  function getCopyOutAdd(e) {
    let myCopyOut = { ...copyAddedOut };
    myCopyOut[e.target.name] = e.target.value;
    setCopyAddedOut(myCopyOut);
  }

  const handleInputstorage = (e) => {
    const { value } = e.target;
    copyAddedOut.storage = value;
  };
  async function addCopyOut(e) {
    e.preventDefault();
    let { data } = await axios.post(
      "http://localhost:3000/api/v1/copy/addout",
      copyAddedOut
    );
    if (data.message == "Done") {
      // console.log(data);
      Swal.fire({
        // position: 'top-end',
        position: "center",
        icon: "success",
        title: "تم إضافة النسخ بنجاح.",
        showConfirmButton: false,
        timer: 1200,
      });
      document.getElementById("copy-out").reset();
      setCopyAddedOut({
        storage: "",
        entityIn: "",
        entityOut: "",
        subject: "",
        reciver: "",
        sendar: "",
        owner: "",
        password: "",
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
  const handleInputfar3 = (e) => {
    const { value } = e.target;
    copyAddedOut.entityIn = value;
  };
  return (
    <>
      <section className="copyout">
        <div className="top-section w-75 m-auto mb-3">
          <div className="title">
            <h2>إضافة نقل بيانات مكاتب خارجية</h2>
          </div>
          <div className="view-copyout">
            <Link className=" btn btn-danger" to={"/viewcopyout"}>
              عرض سجل نقل بيانات مكاتب خارجية
            </Link>
          </div>
        </div>
        <div className="box w-75 m-auto">
          <form id="copy-out">
            <div className="form-group">
              <select
                className="form-select mb-2"
                aria-label="Default select example"
                onChange={handleInputstorage}
                required
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
              </select>{" "}
            </div>
            <div className="form-group">
              <input
                required
                onChange={getCopyOutAdd}
                className="form-control  mb-2 m-auto"
                placeholder="الجهة الصادرة"
                name="entityOut"
                type="text"
              />
            </div>
            <div className="form-group">
              <input
                required
                onChange={getCopyOutAdd}
                className="form-control  mb-2 m-auto"
                placeholder="ملخص الموضوع"
                name="subject"
                type="text"
              />
            </div>
            <div className="form-group">
              <input
                required
                onChange={getCopyOutAdd}
                className="form-control  mb-2 m-auto"
                placeholder="المسلم"
                name="reciver"
                type="text"
              />
            </div>
            <div className="form-group">
              <input
                required
                onChange={getCopyOutAdd}
                className="form-control  mb-2 m-auto"
                placeholder="القائم بالنسخ"
                name="sendar"
                type="text"
              />
            </div>
            <div className="form-group">
              <input
                required
                onChange={getCopyOutAdd}
                className="form-control  mb-2 m-auto"
                placeholder="الأمر بالنسخ"
                name="owner"
                type="text"
              />
            </div>
            <div className="form-group">
              <input
                required
                onChange={getCopyOutAdd}
                className="form-control  mb-2 m-auto"
                placeholder="الباسورد"
                name="password"
                type="password"
              />
            </div>
            <button
              onClick={addCopyOut}
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
