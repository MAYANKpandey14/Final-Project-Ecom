// API Helpers
import fetch from 'node-fetch';
import Cookies from 'js-cookie';

const ETHERSCAN_API_KEY = 'CUQBB69XDAKVNNBJQT9XNIPZA9ZF2VCTDH'; // Replace with your real API key
const ETHERSCAN_BASE_URL = 'https://api.etherscan.io/api'; // Change according to the network

export const createNewCryptoOrder = async (formData) => {
    try {
        const res = await fetch("/api/order/create-order", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${Cookies.get("token")}`
            },
            body: JSON.stringify(formData)
        });

        return await res.json();
    } catch (e) {
        console.error('Create Order Error:', e);
        return { success: false, message: e.toString() };
    }
};

export const verifyCryptoTransaction = async (txHash) => {
    const url = `${ETHERSCAN_BASE_URL}?module=transaction&action=gettxreceiptstatus&txhash=${txHash}&apikey=${ETHERSCAN_API_KEY}`;

    try {
        const response = await fetch(url); // Wait for fetch to complete
        const data = await response.json(); // Wait for json conversion

        // Now you can check the data and return true or false accordingly
        return data.status === '1' && data.message === "OK";
    } catch (error) {
        console.error('Transaction Verification Error:', error);
        return false; // Return false or handle the error as needed
    }
}

export const getAllOrdersForUser = async (id) => {
    try {
      const res = await fetch(`/api/order/get-all-orders?id=${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });
  
      const data = await res.json();
  
      return data;
    } catch (e) {
      console.log(e);
    }
  };
  
  export const getOrderDetails = async (id) => {
    try {
      const res = await fetch(`/api/order/order-details?id=${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });
  
      const data = await res.json();
  
      return data;
    } catch (e) {
      console.log(e);
    }
  };
  
  export const getAllOrdersForAllUsers = async () => {
    try {
      const res = await fetch(`/api/admin/orders/get-all-orders`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });
  
      const data = await res.json();
  
      return data;
    } catch (e) {
      console.log(e);
    }
  };
  
  export const updateStatusOfOrder = async (formData) => {
    try {
      const res = await fetch(`/api/admin/orders/update-order`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
        body: JSON.stringify(formData),
      });
  
      const data = await res.json();
  
      return data;
    } catch (e) {
      console.log(e);
    }
  };
  