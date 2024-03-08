import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Paper.scss";
import { PaperContext } from "../../Context/PaperContext";
export default function Paper() {
  const { paper, setPaper, addPaper } = useContext(PaperContext);

  const [Afro3, setAfro3] = useState([]);
  async function getAllFar3() {
    let { data } = await axios.get("http://localhost:3000/api/v1/gear/allfar3");
    if (data.message == "Done") {
      setAfro3(data.all);
    }
  }
  function getPaper(e) {
    let myPaper = { ...paper };
    myPaper[e.target.name] = e.target.value;
    setPaper(myPaper);
  }
  const handleInputfar3 = (e) => {
    const { value } = e.target;
    paper.far3 = value;
  };
  const handleInputtype = (e) => {
    const { value } = e.target;
    paper.type = value;
  };
  useEffect(() => {
    getAllFar3();
  }, []);

  return (
    <>
      <section className="paper">
        <div className="top-section w-75 m-auto mb-3">
          <div className="title">
            <h2>إضافة صرف ورق</h2>
          </div>
          <div className="view-paper">
            <Link className=" btn btn-danger" to={"/paperview"}>
              عرض سجل الصرف
            </Link>
          </div>
        </div>

        <div className="box w-75 m-auto">
          <form onSubmit={addPaper} id="form-add">
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

            <input
              onChange={getPaper}
              type={"number"}
              placeholder="العدد"
              name="count"
              className="form-control mb-2"
            />
            <select
              className="form-select mb-2"
              aria-label="Default select example"
              onChange={handleInputtype}
            >
              <option defaultValue="نوع الورق">نوع الورق</option>
              <option value="A4">A4</option>
            </select>

            <input
              onChange={getPaper}
              placeholder="المستلم"
              name="reciver"
              className="form-control mb-2"
            />
            <button className="btn btn-primary" type="submit">
              تسجيل الصرف
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
