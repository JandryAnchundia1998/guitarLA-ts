import { useEffect, useMemo, useState } from "react";
import { db } from "../data/db";
import type { CartItem, GuitarT } from "../types";


export const useCart = () => {
  const initialCart = () : CartItem[] => {
    const localStorageCart = localStorage.getItem("cart");

    return localStorageCart ? JSON.parse(localStorageCart) : [];
  };
  const [data] = useState(db);
  const [cart, setCart] = useState(initialCart);

  const MAX_ITEM = 5;

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // useEffect(() => {
  //   setData(db);
  // }, [data]);

  function addToCart(item: GuitarT ) {
    const itemExists = cart.findIndex((guitar) => guitar.id === item.id);

    if (itemExists >= 0) {
      if (cart[itemExists].quantity >= MAX_ITEM) return;

      const updateCart = [...cart];
      updateCart[itemExists].quantity++;
      setCart(updateCart);
    } else {
      const newItem : CartItem = {...item, quantity : 1}
      setCart([...cart, newItem]);
    }
  }

  function removeFromCart(id:  GuitarT['id'])  {
    const updatedCart = cart.filter((guitar) => guitar.id !== id);
    setCart(updatedCart);
  }

  function increaseQuantity(id:  GuitarT['id']) {
    const updatedCart = cart.map(
      (item) =>
        item.id === id && item.quantity < MAX_ITEM
          ? { ...item, quantity: item.quantity + 1 } // Crea un nuevo objeto con quantity incrementado
          : item // Devuelve el elemento sin cambios si el id no coincide
    );

    setCart(updatedCart); // Actualiza el estado con el nuevo arreglo
  }

  // function decrementQuantity(id) {
  //   const updatedCart = cart
  //     .map(item => {
  //       if (item.id === id && item.quantity > 1) {
  //         // Decrementar la cantidad si es mayor a 1
  //         return { ...item, quantity: item.quantity - 1 };
  //       }
  //       return item; // Devolver el resto de los elementos sin cambios
  //     })
  //     .filter(item => !(item.id === id && item.quantity === 1));
  //     // Filtrar para eliminar el elemento si la cantidad es 1 y debe ser decrecido

  //   setCart(updatedCart);
  // }

  function decrementQuantity(id:  GuitarT['id']) {
    const updatedCart = cart.map((item) => {
      if (item.id === id) {
        // Decrementar la cantidad, evitando valores negativos
        const newQuantity = Math.max(item.quantity - 1, 0);
        return { ...item, quantity: newQuantity };
      }
      return item;
    });

    // Filtrar para eliminar elementos con cantidad 0
    const filteredCart = updatedCart.filter((item) => item.quantity > 0);

    setCart(filteredCart);
  }

  function cleanCart() {
    setCart([]);
  }

  const isEmpty = () => useMemo(() => cart.length === 0, [cart]);
  const cartTotal = useMemo(
    () => cart.reduce((total, item) => total + item.quantity * item.price, 0),
    [cart]
  );

  return {
    data,
    cart,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decrementQuantity,
    cleanCart,
    isEmpty, 
    cartTotal
  };
};
