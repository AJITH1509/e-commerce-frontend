import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { API } from "../global.js";

const formValidationSchema = yup.object({
  email: yup.string().email().required("Email address is required"),
});

export const ForgetPass = () => {
  const navigate = useNavigate();
  const { handleSubmit, handleChange, handleBlur, values, touched, errors } =
    useFormik({
      initialValues: {
        email: "",
      },
      validationSchema: formValidationSchema,
      onSubmit: async (values) => {
        const data = await fetch(`${API}/login/forgetpassword`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(values),
        });
        console.log(data);
        if (data.status === 200) {
          navigate("/verifyotp");
        } else {
          alert("user not found");
        }
      },
    });
  return (
    <div className="login-page-main-container">
      <form onSubmit={handleSubmit}>
        <Card id="login-container">
          <h4>Trouble with logging in ?</h4>
          <p>Enter your email address and we will send OTP</p>
          <CardContent className="card-content">
            <TextField
              name="email"
              value={values.email}
              onChange={handleChange}
              label="Enter Your Email Address"
              variant="outlined"
              onBlur={handleBlur}
              error={touched.email && errors.email}
              helperText={touched.email && errors.email ? errors.email : null}
            />
            <Button color="secondary" type="submit" variant="contained">
              Send OTP
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};
