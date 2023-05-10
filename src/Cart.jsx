import { useNavigate } from "react-router-dom";
export const Cart = () => {
  const navigate = useNavigate();
  return (
    <div>
      <p onClick={() => navigate("/")}>Back</p>
    </div>
  );
};
