import axios from "axios";
import { createContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
export const PaperContext = createContext();
function PaperProvider(props) {
  const [loading, setLoading] = useState(false);
  const [showPaper, setShowPaper] = useState([]);
  const [paper, setPaper] = useState({
    far3: "",
    count: "",
    type: "",
    reciver: "",
  });
  let URL = "http://localhost:3000/api/v1/paper/add";

  let URL1 = "http://localhost:3000/api/v1/paper/show";
  async function getAllPaper() {
    let response = await axios.get(URL1);
    if (response.status == "200") {
      setLoading(false);
      setShowPaper(response.data.allPapers);
    }
  }
  async function addPaper(e) {
    e.preventDefault();

    if (paper.count <= 0) {
      Swal.fire({
        // position: 'top-end',

        icon: "error",
        title: "ادخل رقم اكبر من صفر",
        showConfirmButton: false,
        timer: 1200,
      });
    } else {
      let { data } = await axios.post(URL, paper);
      if (data.message === "Done") {
        Swal.fire({
          // position: 'top-end',
          position: "center",
          icon: "success",
          title: "تم إضافة  صرفية الورق بنجاح.",
          showConfirmButton: false,
          timer: 1200,
        });
        document.getElementById("form-add").reset();
        // setErrors('')

        setPaper({
          far3: "",
          count: "",
          type: "",
          reciver: "",
        });
      }
    }
  }

  useEffect(() => {
    setLoading(true);
    getAllPaper();
  }, []);

  return (
    <PaperContext.Provider
      value={{
        showPaper,
        setShowPaper,
        getAllPaper,
        loading,
        setLoading,
        paper,
        setPaper,
        addPaper,
      }}
    >
      {props.children}
    </PaperContext.Provider>
  );
}

export default PaperProvider;
