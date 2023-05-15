import * as React from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { useState } from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { API } from "../global";
import * as yup from "yup";
import Checkbox from "@mui/material/Checkbox";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const formValidationSchema = yup.object({
  name: yup.string().required("required"),
  email: yup.string().email().required("Email address is required"),
  password: yup.string().required("password required").min(8),
});

export const SignUpPage = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [show, setShow] = useState(false);
  const [drop, setDrop] = useState(false);
  const [severity, setSeverity] = useState(true);

  const handleToggle = () => {
    setDrop(!drop);
  };

  const handleCloseDrop = () => {
    setDrop(false);
  };

  const { handleSubmit, handleChange, handleBlur, values, touched, errors } =
    useFormik({
      initialValues: {
        name: "",
        email: "",
        password: "",
      },
      validationSchema: formValidationSchema,
      onSubmit: async (values) => {
        handleToggle();
        const data = await fetch(`${API}/signup`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(values),
        });
        const result = await data.json();
        console.log(data);
        if (data.status === 200) {
          navigate("/");
        }
        if (data.status === 401) {
          setOpen(true);
          handleCloseDrop();
        }
      },
    });

  const reDirect = () => {
    navigate("/");
  };

  const togglePassword = () => {
    setShow(!show);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  return (
    <div className="login-page-main-container">
      <Stack spacing={2} sx={{ width: "100%" }}>
        <form onSubmit={handleSubmit}>
          <Card id="login-container">
            <h2>Sign up</h2>
            <CardContent className="card-content">
              <TextField
                name="name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                label="Name"
                variant="outlined"
                error={touched.name && errors.name}
                helperText={touched.name && errors.name ? errors.name : null}
              />
              <TextField
                name="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                label="email"
                variant="outlined"
                error={touched.email && errors.email}
                helperText={touched.email && errors.email ? errors.email : null}
              />
              <TextField
                name="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                label="password"
                variant="outlined"
                type={show ? "text" : "password"}
                error={touched.password && errors.password}
                helperText={
                  touched.password && errors.password ? errors.password : null
                }
              />
              <span className="showpassword">
                <Checkbox onClick={togglePassword} aria-label="Checkbox demo" />
                <span>Show password</span>
              </span>
              <Button type="submit" color="success" variant="contained">
                Register
              </Button>
              <small style={{ opacity: 0.5 }}>already registered ?</small>
              <h5 className="signin" onClick={() => reDirect()}>
                sign in
              </h5>
            </CardContent>
          </Card>
        </form>
        <Snackbar
          open={open}
          autoHideDuration={6000}
          onClose={handleClose}
          key="top"
        >
          <Alert
            onClose={handleClose}
            severity={severity ? "error" : "success"}
            sx={{ width: "100%" }}
          >
            {severity ? "Email already registered" : "Signup successfully"}
          </Alert>
        </Snackbar>
      </Stack>
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
