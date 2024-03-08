import { Routes, Route, Navigate, useNavigate, Link } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Home from "./components/Home/Home";
import Addmokatba from "./components/Mokatbat/Addmokatba";
import Copyout from "./components/Copy/Copyout";
import Register from "./components/Register/Register";
import Login from "./components/Login/Login";
import Paper from "./components/Paper/Paper";
import Paperview from "./components/Paper/Paperview";
import Copyin from "./components/Copy/Copyin";
import Showmokatba from "./components/Mokatbat/Showmokatba";
import "./App.scss";
import { useEffect, useState } from "react";
import PaperProvider from "./Context/PaperContext";
import PaperTable from "./components/Paper/PaperTable";
import HandleAuth from "./components/HandleAuth";
import Addcategory from "./components/Mokatbat/Addcategory";
import Allcategory from "./components/Mokatbat/AllCategory";
import Viewcopyin from "./components/Copy/Viewcopyin";
import Viewcopyout from "./components/Copy/Viewcopyout";
import { jwtDecode } from "jwt-decode";
import Utils from "./components/Utils/Utils";
import Addfar3 from "./components/Far3/Addfar3";
import AllAfro3 from "./components/Far3/AllAfro3";
import SarfPaper from "./components/Paper/SarfPaper";
import Feature from "./components/Feature/Feature";

function App() {
  let navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  function savedUserData() {
    let encToken = localStorage.getItem("userToken");
    let decToken = jwtDecode(encToken);
    setUserData(decToken);
  }

  function Example() {
    useEffect(() => {
      document.title = "بيئة العمل";
      if (localStorage.getItem("userToken")) {
        savedUserData();
      }
    }, []);
  }

  Example();

  function ProtectedRoute(props) {
    const { children } = props;
    const userProfile = localStorage.getItem("userToken");
    return userProfile ? children : <Navigate replace to="/login" />;
  }
  function logOut() {
    setUserData(null);
    localStorage.removeItem("userToken");
    navigate("/login");
  }
  return (
    <>
      <div className="parent-app">
        {userData !== null ? (
          <div className="setting">
            <Link to={"/utils"}>
              <i class="fa-solid fa-gears"></i>
            </Link>
          </div>
        ) : (
          ""
        )}
        <Navbar logOut={logOut} userData={userData} />

        <PaperProvider>
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            ></Route>
            <Route
              path="home"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            ></Route>
            <Route
              path="addmok"
              element={
                <ProtectedRoute>
                  <Addmokatba />
                </ProtectedRoute>
              }
            ></Route>
            <Route
              path="copyin"
              element={
                <ProtectedRoute>
                  <Copyin />
                </ProtectedRoute>
              }
            ></Route>
            <Route
              path="copyout"
              element={
                <ProtectedRoute>
                  <Copyout />
                </ProtectedRoute>
              }
            ></Route>
            <Route path="register" element={<Register />}></Route>
            <Route
              path="login"
              element={<Login savedUserData={savedUserData} />}
            ></Route>
            <Route
              path="paper"
              element={
                <ProtectedRoute>
                  <Paper />
                </ProtectedRoute>
              }
            ></Route>
            <Route
              path="paperview"
              element={
                <ProtectedRoute>
                  <Paperview />
                </ProtectedRoute>
              }
            ></Route>
            <Route
              path="showmok"
              element={
                <ProtectedRoute>
                  <Showmokatba setUserData={setUserData} />
                </ProtectedRoute>
              }
            ></Route>
            <Route
              path="allpaper"
              element={
                <ProtectedRoute>
                  <PaperTable />
                </ProtectedRoute>
              }
            ></Route>
            <Route
              path="authandler"
              element={
                <ProtectedRoute>
                  <HandleAuth />
                </ProtectedRoute>
              }
            ></Route>
            <Route
              path="addcategory"
              element={
                <ProtectedRoute>
                  <Addcategory />
                </ProtectedRoute>
              }
            ></Route>
            <Route
              path="allcategory"
              element={
                <ProtectedRoute>
                  <Allcategory setUserData={setUserData} />
                </ProtectedRoute>
              }
            ></Route>
            <Route
              path="viewcopyin"
              element={
                <ProtectedRoute>
                  <Viewcopyin />
                </ProtectedRoute>
              }
            ></Route>
            <Route
              path="viewcopyout"
              element={
                <ProtectedRoute>
                  <Viewcopyout setUserData={setUserData} />
                </ProtectedRoute>
              }
            ></Route>

            <Route
              path="utils"
              element={
                <ProtectedRoute>
                  <Utils />
                </ProtectedRoute>
              }
            ></Route>
            <Route
              path="feature"
              element={
                <ProtectedRoute>
                  <Feature />
                </ProtectedRoute>
              }
            ></Route>
            <Route
              path="addfar3"
              element={
                <ProtectedRoute>
                  <Addfar3 />
                </ProtectedRoute>
              }
            ></Route>
            <Route
              path="allfar3"
              element={
                <ProtectedRoute>
                  <AllAfro3 setUserData={setUserData} />
                </ProtectedRoute>
              }
            ></Route>
            <Route
              path="sarfpaper"
              element={
                <ProtectedRoute>
                  <SarfPaper />
                </ProtectedRoute>
              }
            ></Route>
          </Routes>
        </PaperProvider>
      </div>
    </>
  );
}

export default App;
