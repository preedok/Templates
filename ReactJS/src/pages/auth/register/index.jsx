import React, { useState, useEffect } from "react";
import "../auth.css";
import { useNavigate } from "react-router-dom";
import { LineWave } from "react-loader-spinner";
import axios from "axios";
import swal from "sweetalert";

const Index = () => {
  const navigate = useNavigate();

  const [registerForm, setRegisterForm] = useState({
    full_name: "",
    email: "",
    password: "",
  });

  const handleInput = (e) => {
    setRegisterForm({
      ...registerForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/v1/user/register`,
        registerForm
      );
      swal({
        title: "Register Success",
        icon: "success",
      });
      return navigate("/login");
    } catch (error) {
      console.log(error);
      swal({
        title: "Failed",
        icon: "warning",
      });
    }
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
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="user-box">
            <input
              value={registerForm.full_name}
              onChange={handleInput}
              type="text"
              name="full_name"
              placeholder="Full Name"
            />
            <label>Full Name</label>
          </div>
          <div className="user-box">
            <input
              value={registerForm.email}
              onChange={handleInput}
              name="email"
              type="email"
              placeholder="Email"
            />
            <label>Email</label>
          </div>
          <div className="user-box">
            <input
              type="password"
              name="password"
              value={registerForm.password}
              onChange={handleInput}
              placeholder="Password"
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
              Register
            </a>
          </button>
        </form>
      </div>
    </>
  );
};

export default Index;
