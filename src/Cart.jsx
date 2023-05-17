import { useNavigate } from "react-router-dom";
import "./cart.css";
import { useState } from "react";
import { API } from "../global";
import { useEffect } from "react";
import { NavBar } from "./NavBar";
import Button from "@mui/material/Button";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import DeleteIcon from "@mui/icons-material/Delete";
import { LinearColor } from "./Loading";

export const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = "645b7dfa0f3e50ca3bd39a4f"; //localStorage.getItem("id");

  const getCartItems = () => {
    setLoading(true);
    fetch(`${API}/cart/${user}`)
      .then((res) => res.json())
      .then((data) => {
        setCartItems(data.cart);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  };

  useEffect(() => {
    getCartItems();
  }, []);

  const deleteCartItems = (id) => {
    fetch(`${API}/delete/${id}/${user}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then(() => getCartItems())
      .catch((error) => console.error(error));
  };

  const subTotal = () => {
    let total = 0;
    for (let i = 0; i < cartItems.length; i++) {
      let price = +cartItems[i].price || 0;
      let quantity = +cartItems[i].quantity || 1;
      total = total + price * quantity;
    }
    return total;
  };

  const updateCartItem = (id, number) => {
    fetch(`${API}/quantity/${id}/${user}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ number }),
    })
      .then(() => getCartItems())
      .catch((error) => console.error(error));
  };

  return (
    <div>
      <NavBar cart={cartItems.length} />
      {loading ? <LinearColor /> : null}
      {cartItems.length !== 0 ? (
        <p className="sub-total">
          Subtotal: Rs.<span>{subTotal()}</span> /-
        </p>
      ) : null}

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <img
            src="https://skoozo.com/assets/img/empty-cart.png"
            alt="no-items-image"
          />
        </div>
      ) : (
        <div className="product-list-cart">
          {cartItems.map((data) => (
            <CartItemCard
              key={data._id}
              data={data}
              deleteCartItems={deleteCartItems}
              updateCartItem={updateCartItem}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const CartItemCard = ({ data, deleteCartItems, updateCartItem }) => {
  const [quantity, setQuantity] = useState(data.quantity || 1);

  const handleIncrement = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
    updateCartItem(data._id, quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prevQuantity) => prevQuantity - 1);
      updateCartItem(data._id, quantity - 1);
    }
  };
  return (
    <div className="product-card-cart">
      <img src={data.image} />
      <div className="product-details-cart">
        <div>
          <h3>{data.name}</h3>
          <p className="description">{data.description}</p>
        </div>
        <h4>{`Rs.${data.price} /-`}</h4>
        <h4>Quantity</h4>
        <div className="qunatity-btn">
          <p onClick={handleDecrement}>-</p>
          <span>{quantity}</span>
          <p onClick={handleIncrement}>+</p>
        </div>
        <div className="cart-btn">
          <Button
            color="success"
            onClick={() => {}}
            variant="outlined"
            startIcon={<ShoppingCartIcon />}
          >
            Buy now
          </Button>
          <Button
            color="error"
            onClick={() => {
              deleteCartItems(data._id);
            }}
            variant="outlined"
            startIcon={<DeleteIcon />}
          >
            remove
          </Button>
        </div>
      </div>
    </div>
  );
};
