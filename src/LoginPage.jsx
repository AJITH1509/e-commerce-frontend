import * as React from "react";
import { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { API } from "../global";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Checkbox from "@mui/material/Checkbox";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const formValidationSchema = yup.object({
  email: yup.string().email().required("Email address is required"),
  password: yup.string().required("password required").min(8),
});

export const LoginPage = () => {
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState(true);
  const [show, setShow] = useState(false);
  const [drop, setDrop] = useState(false);
  const handleCloseDrop = () => {
    setDrop(false);
  };
  const handleToggle = () => {
    setDrop(!drop);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const navigate = useNavigate();
  const { handleSubmit, handleChange, handleBlur, values, touched, errors } =
    useFormik({
      initialValues: {
        email: "test@123.com",
        password: "test@123",
      },
      validationSchema: formValidationSchema,
      onSubmit: async (values) => {
        handleToggle();
        const data = await fetch(`${API}/login`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(values),
        });

        if (data.status === 401) {
          setOpen(true);
          handleCloseDrop();
        } else {
          setOpen(true);
          setSeverity(false);
          const result = await data.json();
          localStorage.setItem("token", result.token);
          localStorage.setItem("id", result.id);

          navigate("/products");
        }
      },
    });

  const togglePassword = () => {
    setShow(!show);
  };

  return (
    <div className="login-page-main-container">
      <div className="main-container">
        <Stack spacing={2} sx={{ width: "100%" }}>
          <form onSubmit={handleSubmit}>
            <Card id="login-container">
              <h4>Welcome to Ekart !</h4>
              <CardContent className="card-content">
                <TextField
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  label="Email"
                  variant="standard"
                  error={touched.email && errors.email}
                  helperText={
                    touched.email && errors.email ? errors.email : null
                  }
                />
                <TextField
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  label="password"
                  type={show ? "text" : "password"}
                  variant="standard"
                  error={touched.password && errors.password}
                  helperText={
                    touched.password && errors.password ? errors.password : null
                  }
                />
                <span className="showpassword">
                  <Checkbox
                    onClick={togglePassword}
                    aria-label="Checkbox demo"
                  />
                  <span>Show password</span>
                </span>

                <Button
                  // onClick={handleToggle}
                  sx={{ borderRadius: "10px" }}
                  type="submit"
                  variant="contained"
                  color="error"
                >
                  Login
                </Button>
                <small
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate("/login/forgetpassword")}
                >
                  forget password?
                  <hr style={{ opacity: 0.5, width: "70%" }} />
                </small>

                <Button
                  style={{ width: "50%", margin: "0px auto" }}
                  onClick={() => navigate("/signup")}
                  variant="outlined"
                  color="success"
                >
                  Create Account
                </Button>
              </CardContent>
            </Card>
          </form>
          <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
            <Alert
              onClose={handleClose}
              severity={severity ? "error" : "success"}
              sx={{ width: "100%" }}
            >
              {severity ? "Invalid credentials" : "login successfully"}
            </Alert>
          </Snackbar>
        </Stack>
      </div>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={drop}
        onClick={handleCloseDrop}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
};
