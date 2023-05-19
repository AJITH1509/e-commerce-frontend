import { useEffect, useState } from "react";
import { API } from "../global.js";
import Card from "@mui/material/Card";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import { useNavigate } from "react-router-dom";
import { LinearColor } from "./Loading.jsx";
import { Button } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import "./MyAccount.css";

export const Profile = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(true);
  const user = localStorage.getItem("id");

  const [imageSrc, setImageSrc] = useState("");

  const handleImageUpload = (event) => {
    const imageFile = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(imageFile);
    reader.onloadend = () => {
      setImageSrc(reader.result);
    };
  };

  useEffect(() => {
    fetch(`${API}/profile/${user}`, {
      headers: {
        "x-auth-token": localStorage.getItem("token"),
      },
    })
      .then((response) => response.json())
      .then((data) => setData(data));
  }, []);

  return (
    <div className="profile-main-container">
      {data ? (
        <Card id="profile-page-card">
          <div>
            {imageSrc ? (
              <img
                className="profile-image"
                src={imageSrc}
                alt="Selected Image"
              />
            ) : (
              <AccountCircleRoundedIcon sx={{ fontSize: "160px" }} />
            )}
          </div>
          <input id="uploadfile" type="file" onChange={handleImageUpload} />
          <label className="upload-btn" htmlFor="uploadfile">
            upload Picture
          </label>
          <hr style={{ opacity: 0.5, width: "70%" }} />
          <div className="profile-name-container">
            <h2>{data.name}</h2>
          </div>
          <div id="profile-btn">
            <Button
              color="success"
              onClick={() => navigate("/cart")}
              variant="outlined"
              startIcon={<ShoppingCartIcon />}
            >
              Cart
            </Button>
            <Button
              color="secondary"
              onClick={() => navigate("/cart")}
              variant="outlined"
              startIcon={<ShoppingBagIcon />}
            >
              Your Orders
            </Button>
          </div>
        </Card>
      ) : (
        <LinearColor />
      )}
    </div>
  );
};
