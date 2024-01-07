import React, { useEffect, useState } from "react";
import { BehaviorSubject } from "rxjs";

const API_SERVER = "http://localhost:8080";

export const jwt = new BehaviorSubject(null);
export const cart = new BehaviorSubject(null);

export const getCart = async () => {
  const res = await fetch(`${API_SERVER}/cart`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt.value}`,
    },
  });
  const res_1 = await res.json();
  cart.next(res_1);
  return res_1;
}

export const addToCart = async (id) => {
  const res = await fetch(`${API_SERVER}/cart`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt.value}`,
    },
    body: JSON.stringify({ id }),
  });
  const res_1 = await res.json();
  getCart();
}

export const clearCart = async () => {
  const res = await fetch(`${API_SERVER}/cart`, {
    method: 'DELETE',
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt.value}`,
    },
  })
  const res_1 = await res.json();
  getCart();
}

export const login = async (username, password) => {
  console.log("Called");
  return await fetch(`${API_SERVER}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      jwt.next(data.access_token);
      getCart();
      return data.access_token;
    });
}

export function useLoggedIn() {
  const [loggedIn, setLoggedIn] = useState(!!jwt.value);
  useEffect(() => {
    setLoggedIn(!!jwt.value);
    return jwt.subscribe((c) => {
      setLoggedIn(!!jwt.value)
    })
  }, []);
  return loggedIn;
}
