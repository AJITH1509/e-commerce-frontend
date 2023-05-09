import "./App.css";
import { Routes, Route } from "react-router-dom";
import { NavBar } from "./NavBar";
import { ProductList } from "./Product";

function App() {
  return (
    <div>
      <NavBar />
      <ProductList />

      {/* <Routes>
     <Route path="/" element={<Home />} />
     <Route path="about" element={<About />} />
   </Routes> */}
    </div>
  );
}
export default App;
