import "./App.css";
import { Routes, Route } from "react-router-dom";

import { ProductList } from "./Product";
import { Cart } from "./Cart";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<ProductList />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </div>
  );
}
export default App;
