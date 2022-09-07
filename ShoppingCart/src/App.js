import axios from "axios";
import React from "react";
import { useState, useEffect } from "react";
let shoppingProducts = [
  
];

class ShoppingCart extends React.Component {
  constructor(props) {
    super(props);
    this.showOverlay = this.showOverlay.bind(this);
  }
  showOverlay() {
    document.getElementById("overlay").style.display = "flex";
    document.querySelector("body").style.overflow = "hidden";
  }
  render() {
    return (
      <div id="cart">
       
        <span className={this.props.quantity == 0 ? "hide-price" : ""}>
          {this.props.quantity}
        </span>
        <i className="fas fa-shopping-cart" onClick={this.showOverlay}></i>
      </div>
    );
  }
}

class ShoppingCartOverlay extends React.Component {
  constructor(props) {
    super(props);
    this.updateAmountToPay = this.updateAmountToPay.bind(this);
  }
  closeOverlay() {
    document.getElementById("overlay").style.display = "none";
    document.querySelector("body").style.overflow = "auto";
  }
  updateAmountToPay(item) {
    this.forceUpdate();
  }
  render() {
    let itemsInCart = this.props.data.itemsInCart.map((item, index) => {
      
      return (
        <ShoppingCartProduct
          key={index}
          item={item}
          indexInCart={index}
          removeFromCart={this.props.removeFromCart}
          updateAmountToPay={this.updateAmountToPay}
        />
      );
    });
    let amountToPay = 0;
    for (let i = 0; i < this.props.data.items.length; i++) {
      amountToPay +=
        this.props.data.items[i].price *
        this.props.data.items[i].quantityInCart;
    }
    return (
      <div id="overlay">
        <section id="shopping-cart">
          <div id="cart-header">
            <span id="cart-title">Shopping Cart</span>
            <i
              className="far fa-times-circle"
              onClick={this.closeOverlay.bind(this)}
            ></i>
          </div>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Name</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>{itemsInCart}</tbody>
          </table>
          <span id="empty-cart">
            {itemsInCart.length === 0 ? "Shopping cart is empty" : ""}
          </span>
          <h3 id="cart-total">Cart Total</h3>
          <div id="totals">
            <span>Cart Totals</span>
            <span>Number of items: {this.props.data.quantity}</span>
            <span>Total: ${amountToPay}</span>
          </div>
        </section>
      </div>
    );
  }
}

class ShoppingCartProduct extends React.Component {
  constructor(props) {
    super(props);
    this.handleRemoveFromCart = this.handleRemoveFromCart.bind(this);
    this.handleQuantityChange = this.handleQuantityChange.bind(this);
  }
  handleRemoveFromCart(e) {
    this.props.removeFromCart(this.props.item, this.props.indexInCart);
  }
  

  handleQuantityChange(operation) {
    if (operation === "add") {
      this.props.item.quantityInCart = this.props.item.quantityInCart + 1;
      
      this.forceUpdate();
      this.props.updateAmountToPay(this.props.item);
    } else {
      this.props.item.quantityInCart = this.props.item.quantityInCart - 1;
      
      this.forceUpdate();
      this.props.updateAmountToPay(this.props.item);
    }
  }

  render() {
    return (
      <tr className="items-in-cart">
        <td>
          <img src={this.props.item.image} alt="asdf" />
        </td>
        <td>{this.props.item.title}</td>
        <td>${this.props.item.price}</td>
        <td>
          <p>{this.props.item.quantityInCart}</p>
          <button onClick={() => this.handleQuantityChange("add")}>+</button>
          <button onClick={() => this.handleQuantityChange("remove")}>-</button>
        </td>
        <td>${this.props.item.price * this.props.item.quantityInCart}</td>
        <td>
          <i className="fas fa-trash" onClick={this.handleRemoveFromCart}></i>
        </td>
      </tr>
    );
  }
}

class ProductList extends React.Component {
  render() {
    let items = this.props.items.map((item, index) => {
      return (
        <Product key={item.id} item={item} addToCart={this.props.addToCart} />
      );
    });
    return <section id="list">{items}</section>;
  }
}

class Product extends React.Component {
  constructor(props) {
    super(props);
    this.handleAddToCart = this.handleAddToCart.bind(this);
  }
  handleAddToCart(e) {
    this.props.addToCart(this.props.item);
  }
  render() {
    return (
      <div className="container">
        <div className="items">
          <img src={this.props.item.image} alt="asdfas" />
          <div className="info">
            <h3>{this.props.item.title}</h3>
            <span>$ {this.props.item.price}</span>
            <button
              onClick={this.handleAddToCart}
              disabled={this.props.item.inCart}
              className={this.props.item.inCart ? "button-disabled" : ""}
            >
              {this.props.item.inCart ? "Item in a cart" : "Add to cart"}
            </button>
          </div>
        </div>
      </div>
    );
  }
}

class ShoppingCartApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: shoppingProducts,
      quantity: 0,
      amountToPay: 0,
      itemsInCart: [],
    };
    this.addToCart = this.addToCart.bind(this);
    this.removeFromCart = this.removeFromCart.bind(this);
  }

  addToCart(item) {
    let itemsInCart = this.state.itemsInCart;
    itemsInCart.push(this.props.items[item.id]);
    shoppingProducts[item.id].inCart = true;
    shoppingProducts[item.id].quantityInCart = 1;
    this.setState({
      quantity: this.state.quantity + 1,
      amountToPay: this.state.amountToPay + this.props.items[item.id].price,
      itemsInCart: itemsInCart,
      items: shoppingProducts,
    });
  }
  removeFromCart(item, indexInCart) {
    let itemsInCart = this.state.itemsInCart;
    shoppingProducts[item.id].inCart = false;
    shoppingProducts[item.id].quantityInCart = 0;
    itemsInCart.splice(indexInCart, 1);
    this.setState({
      quantity: this.state.quantity - 1,
      amountToPay: this.state.amountToPay - this.props.items[item.id].price,
      itemsInCart: itemsInCart,
      items: shoppingProducts,
    });
  }
  render() {
    return (
      <main>
        
        <ShoppingCartOverlay
          data={this.state}
          removeFromCart={this.removeFromCart}
        />
        <ProductList items={this.props.items} addToCart={this.addToCart} />
      </main>
    );
  }
}

export default function App() {
  const [products, SetProducts] = useState([]);

  useEffect(() => {
    axios.get("https://fakestoreapi.com/products").then((result) => {
      console.log(result.data);

      let ADSFADSF = [];
      for (let index = 0; index < result.data.length; index++) {
        const element = result.data[index];

        ADSFADSF.push({
          ...element,
          quantityInCart: 0,
          inCart: false,
          id: index,
        });
      }
      shoppingProducts = ADSFADSF;
      SetProducts(ADSFADSF);
    });
  }, []);

  return <ShoppingCartApp items={products} />;
}
