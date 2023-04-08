import React, { useState, useEffect } from "react";
import "../auth.css";
import axios from "axios";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import { LineWave } from "react-loader-spinner";

const Index = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleLogin = (e) => {
    e.preventDefault();
    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/v1/user/login`, form)
      .then((response) => {
        if (response.data.status !== "success") {
          Swal.fire({
            title: "Login Failed",
            text: `${response.data.message}`,
            icon: "warning",
          });
        } else {
          const token = response.data.data.token;
          localStorage.setItem("token", token);
          localStorage.setItem("users", JSON.stringify(response.data.data));
          localStorage.setItem(
            "email",
            JSON.stringify(response.data.data.email)
          );
          localStorage.setItem("name", JSON.stringify(response.data.data.name));
        }
        Swal.fire({
          title: "Login Success",
          text: `${response.data.message}`,
          icon: "success",
        });
        return navigate("/");
      })
      .catch((error) => {
        Swal.fire({
          title: "Login Failed",
          text: `${error.response.data.message}`,
          icon: "warning",
        });
      });
  };

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);
  if (loading) {
    return (
      <div
        style={{
          paddingLeft: "50px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#6a30e9",
        }}
      >
        <LineWave
          height="145"
          width="140"
          color="white"
          ariaLabel="line-wave"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
          firstLineColor=""
          middleLineColor=""
          lastLineColor=""
        />
      </div>
    );
  }
  return (
    <>
      <div className="login-box">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <div className="user-box">
            <input
              onChange={(e) =>
                setForm({
                  ...form,
                  email: e.target.value,
                })
              }
              type="email"
              name="email"
              placeholder="Email"
              required
            />
            <label>Email</label>
          </div>
          <div className="user-box">
            <input
              type="password"
              name="password"
              onChange={(e) =>
                setForm({
                  ...form,
                  password: e.target.value,
                })
              }
              placeholder="Password"
              required
            />
            <label>Password</label>
          </div>

          <button
            type="submit"
            className=" btn btn-none justify-content-center m-auto align-items-center d-flex"
          >
            <a className="text-white px-5">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              Login
            </a>
          </button>
        </form>

        <Link to="/register">
          <p
            style={{
              color: "#6a30e9",
            }}
            className="d-flex justify-content-end mt-3 fw-bold"
          >
            Register
          </p>
        </Link>
      </div>
    </>
  );
};

export default Index;
