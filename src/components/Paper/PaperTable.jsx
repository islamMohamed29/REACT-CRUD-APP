import React, { useEffect, useState } from "react";
import "./Paper.scss";
import { Link } from "react-router-dom";
import axios from "axios";
export default function PaperTable() {
  const [totalDataA, setTotalData] = useState([]);
  const [sarfPaper, setSarfPaper] = useState("");

  let totalCount = 0;
  let totalMa5zn = 0;

  async function dataTotal() {
    let data = await axios.get(`http://localhost:3000/api/v1/paper/total`);
    return setTotalData(data.data.data);
  }

  async function sarfPapers() {
    let data = await axios.get(
      `http://localhost:3000/api/v1/gear/allsarfpaper`
    );
    return setSarfPaper(data.data.all);
  }

  useEffect(() => {
    sarfPapers();
    dataTotal();
  }, []);
  return (
    <>
      <section className="paper-table pt-5">
        <div className="top-section mx-4 m-auto mt-3 mb-3">
          <div className="title">
            <h2>سجل تفصيلي لصرف الورق</h2>
          </div>
          <div className="view-paper">
            <Link className=" btn btn-danger" to={"/paper"}>
              إضافة صرفية جديدة
            </Link>
            <Link className=" btn btn-danger me-2" to={"/paperview"}>
              عرض سجل الصرف
            </Link>
          </div>
        </div>
        <table class="table">
          <thead class="thead-light">
            <tr>
              <th scope="col">#</th>
              <th scope="col">المكتب</th>
              <th scope="col">النوع</th>
              <th scope="col">إجمالي رزم الصرف</th>
              <th scope="col">أخر تاريخ صرف</th>
            </tr>
          </thead>
          <tbody>
            {totalDataA.map((ele, index) => {
              totalCount += ele.total;
              return (
                <tr>
                  <th scope="row">{index + 1}</th>
                  <td>{ele._id}</td>
                  <td>A4</td>
                  <td>{ele.total}</td>
                  <td>{ele.lastAdd.slice(0, 10)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="collect">
          <div className="box">
            <h6>إجمالي الرزم المتاحة في المخزن</h6>
          </div>
          {sarfPaper.length !== 0 ? (
            sarfPaper.map((ele) => {
              totalMa5zn += ele.numberSarf;
            })
          ) : (
            <div className="box">
              <h6>لا يوجد رزم متاحة في المخزن</h6>
            </div>
          )}
          {sarfPaper ? (
            <div className="box">
              <h6>{totalMa5zn - totalCount}</h6>
            </div>
          ) : (
            ""
          )}

          <div className="box">
            <h6>إجمالي الرزم المصروفة</h6> <span>{totalCount}</span>
          </div>
        </div>
      </section>
    </>
  );
}
