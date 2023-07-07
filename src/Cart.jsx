import { useNavigate } from "react-router-dom";
import "./cart.css";
import { useState } from "react";
import { API } from "../global";
import { useEffect } from "react";
import { NavBar } from "./NavBar";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import { LinearColor } from "./Loading";
import GooglePayButton from "@google-pay/button-react";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

export const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = localStorage.getItem("id");
  const [state, setState] = useState({
    open: false,
    vertical: "top",
    horizontal: "center",
  });
  const { vertical, horizontal, open } = state;

  //for open snack Bar
  const handleOpenSnackbar = () => {
    setState({ ...state, open: true });
    //timer for snack bar
    setTimeout(handleClose, 5000);
  };

  //for close snack Bar
  const handleClose = () => {
    setState({ ...state, open: false });
  };

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
              handleOpenSnackbar={handleOpenSnackbar}
            />
          ))}
        </div>
      )}
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        onClose={handleClose}
        message={"Order Placed"}
        key={vertical + horizontal}
        action={
          <IconButton size="small" color="inherit" onClick={handleClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </div>
  );
};

const CartItemCard = ({
  data,
  deleteCartItems,
  updateCartItem,
  handleOpenSnackbar,
}) => {
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
          <GooglePayButton
            buttonType="plain"
            environment="TEST"
            paymentRequest={{
              apiVersion: 2,
              apiVersionMinor: 0,
              allowedPaymentMethods: [
                {
                  type: "CARD",
                  parameters: {
                    allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
                    allowedCardNetworks: ["MASTERCARD", "VISA"],
                  },
                  tokenizationSpecification: {
                    type: "PAYMENT_GATEWAY",
                    parameters: {
                      gateway: "example",
                      gatewayMerchantId: "exampleGatewayMerchantId",
                    },
                  },
                },
              ],
              merchantInfo: {
                merchantId: "12345678901234567890",
                merchantName: "Demo Merchant",
              },
              transactionInfo: {
                totalPriceStatus: "FINAL",
                totalPriceLabel: "Total",
                totalPrice: `${data.price}`,
                currencyCode: "USD",
                countryCode: "US",
              },
            }}
            onLoadPaymentData={(paymentRequest) => {
              handleOpenSnackbar();
            }}
          />
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
