import "./App.css";
import { Routes, Route } from "react-router-dom";
import { LoginPage } from "./LoginPage";
import { SignUpPage } from "./SignUpPage";
import { ForgetPass } from "./Forget";
import { VerifyOtp } from "./VerifyOtp";
import { NewPassword } from "./newPassword";
import { ProductList } from "./Product";
import { Profile } from "./MyAccount.jsx";
import { Cart } from "./Cart";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/products" element={<ProductList />} />
        <Route path="/cart" element={<Cart />} />
        <Route exact path="/" element={<LoginPage />} />
        <Route exact path="/signup" element={<SignUpPage />} />
        <Route exact path="/login/forgetpassword" element={<ForgetPass />} />
        <Route exact path="/verifyotp" element={<VerifyOtp />} />
        <Route exact path="/setpassword" element={<NewPassword />} />
        <Route exact path="/account" element={<Profile />} />
      </Routes>
    </div>
  );
}
export default App;
