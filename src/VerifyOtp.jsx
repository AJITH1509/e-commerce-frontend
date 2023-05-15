import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { API } from "../global.js";

export const VerifyOtp = () => {
  const navigate = useNavigate();
  const { handleSubmit, handleChange, values } = useFormik({
    initialValues: {
      OTP: "",
    },
    onSubmit: async (values) => {
      const data = await fetch(`${API}/verifyotp`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(values),
      });

      if (data.status === 401) {
        alert("Invalid Otp");
      } else {
        navigate("/setpassword");
      }
    },
  });
  return (
    <div className="login-page-main-container">
      <form onSubmit={handleSubmit}>
        <Card id="login-container">
          <h4>OTP verification</h4>
          <p>Enter the OTP, that we sent to your registerd Email</p>
          <CardContent className="card-content">
            <TextField
              name="OTP"
              value={values.OTP}
              onChange={handleChange}
              label="Enter OTP"
              variant="outlined"
            />
            <Button color="success" type="submit" variant="contained">
              Verify Otp
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};
