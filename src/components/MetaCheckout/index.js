// "use client";
// import React, { useContext, useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { GlobalContext } from "@/context";
// import { fetchAllAddresses } from "@/services/address";
// import { verifyCryptoTransaction } from "@/services/crypto order";
// import { createNewCryptoOrder } from "@/services/crypto order";
// import { toast } from "react-toastify";
// import Notification from "../Notification";

// const MetaCheckoutComponent = () => {
//   const {
//     cartItems,
//     user,
//     setAddresses,
//     checkoutFormData,
//     setCheckoutFormData,
//   } = useContext(GlobalContext);

//   const [selectedAddress, setSelectedAddress] = useState(null);
//   const [defaultAccount, setDefaultAccount] = useState(null);
//   const [errorMessage, setErrorMessage] = useState("");
//   const [isOrderProcessing, setIsOrderProcessing] = useState(false);
//   const [cryptoOrderSuccess, setOrderSuccess] = useState(false);

//   const router = useRouter();

//   const connectWallet = () => {
//     if (window.ethereum) {
//       window.ethereum
//         .request({ method: "eth_requestAccounts" })
//         .then((accounts) => {
//           setDefaultAccount(accounts[0]);
//           console.log(accounts);
//           console.log("Wallet Connected");
//           alert("MetaMask Wallet Connected Successfully");
//         })
//         .catch((err) => {
//           setErrorMessage(err.message);
//           console.log(err.message);
//           alert("Failed to Connect MetaMask Wallet");
//         });
//     } else {
//       setErrorMessage("MetaMask Wallet not found");
//       alert("Please Install Meta Mask Wallet");
//     }
//   };

//   async function getAllAddresses() {
//     const res = await fetchAllAddresses(user?._id);
//     if (res.success) {
//       setAddresses(res.data);
//     }
//   }
//   useEffect(() => {
//     if (user !== null) getAllAddresses();
//   }, [user]);

//   const handleCryptoCheckout = async () => {
//     if (!window.ethereum || !defaultAccount) {
//       alert("Please connect to MetaMask to proceed!");
//       return;
//     }

//     const totalPrice = cartItems.reduce(
//       (total, item) => item.productID.price + total,
//       0
//     );

//     try {
//       const transactionParameters = {
//         to: "0x812F19c61A029407931f28d875527ee0b1a1D1E6", // Required except during contract publications.
//         from: defaultAccount, // must match user's active address.
//         value: (totalPrice * 0.00032 * 1e18).toString(16), // the price in wei, in hexadecimal
//         gas: "0x76c0", // 30400 GWEI in hex customizable by user during MetaMask confirmation.
//         gasPrice: "0x9184e72a000", // 10000000000000 GWEI in hex customizable by user during MetaMask confirmation.
//       };

//       const txHash = await window.ethereum.request({
//         method: "eth_sendTransaction",
//         params: [transactionParameters],
//       });

//       setIsOrderProcessing(true);

//       const isTransactionValid = verifyCryptoTransaction(txHash);     
//       console.log(`Transaction hash: ${txHash}`);

//       if (isTransactionValid) {
//         setIsOrderProcessing(true);
//         const getCheckoutFormData = JSON.parse(
//           localStorage.getItem("checkoutFormData")
//         );
//         const formData = {
//           user: user?._id,
//           shippingAddress: getCheckoutFormData.shippingAddress,
//           orderItems: cartItems.map((item) => ({
//             qty: 1,
//             product: item.productID,
//           })),
//           paymentMethod: "MetaMask",
//           totalPrice: cartItems.reduce(
//             (total, item) => item.productID.price + total,
//             0
//           ),
//           transactionHash: txHash,
//           isPaid: true,
//           isProcessing: true,
//           paidAt: new Date(),
//         };

//         const orderResult = await createNewCryptoOrder(formData); // This function will call your API

//         if (orderResult.success) {
//           setIsOrderProcessing(false);
//           setOrderSuccess(true);
//           toast.success(orderResult.message, {
//             position: toast.POSITION.TOP_RIGHT,
//           });
//         } else {
//           setIsOrderProcessing(false);
//           setOrderSuccess(false);
//           toast.error(orderResult.message, {
//             position: toast.POSITION.TOP_RIGHT,
//           });
//         }

//         if (orderResult.success) {
//           setIsOrderProcessing(false);
//           setOrderSuccess(true);
//           router.push("/orders");
//         } else {
//           throw new Error("Order creation failed");
//         }
//       } else {
//         throw new Error("Transaction verification failed");
//       }
//     } catch (error) {
//       console.error("Checkout Error:", error);
//       alert("Checkout Failed: " + error.message);
//     } finally {
//       setIsOrderProcessing(false);
//     }
//   };

//   useEffect(() => {
//     if (cryptoOrderSuccess) {
//       setTimeout(() => {
//         router.push("/orders");
//       }, [2000]);
//     }
//     console.log("Account connected:", defaultAccount);
//   }, [cryptoOrderSuccess]);

//   return (
//     <div className="flex flex-col">
//       {errorMessage && (
//         <p className="font-semibold my-4 text-red-600">{errorMessage}</p>
//       )}
//       <button
//         onClick={connectWallet}
//         className="flex disabled:opacity-50 mt-2 mr-5 w-fit text-center items-center gap-2 bg-black text-white px-5 py-3 text-md font-medium rounded-md tracking-wide"
//       >
//         Connect Wallet
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           width="25"
//           height="24"
//           fill="none"
//           viewBox="0 0 50 48"
//           id="metamask"
//         >
//           <path
//             fill="#E2761B"
//             stroke="#E2761B"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             d="M46.6094 2L27.88 15.9106L31.3435 7.70353L46.6094 2Z"
//           ></path>
//           <path
//             fill="#E4761B"
//             stroke="#E4761B"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             d="M3.37177 2L21.9506 16.0424 18.6565 7.70353 3.37177 2zM39.8706 34.2447L34.8824 41.887 45.5553 44.8235 48.6235 34.4141 39.8706 34.2447zM1.39529 34.4141L4.44471 44.8235 15.1176 41.887 10.1294 34.2447 1.39529 34.4141z"
//           ></path>
//           <path
//             fill="#E4761B"
//             stroke="#E4761B"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             d="M14.5153 21.3318L11.5412 25.8306 22.1388 26.3012 21.7624 14.913 14.5153 21.3318zM35.4659 21.3317L28.1247 14.7812 27.88 26.3012 38.4588 25.8306 35.4659 21.3317zM15.1176 41.8871L21.48 38.7812 15.9835 34.4894 15.1176 41.8871zM28.5012 38.7812L34.8824 41.8871 33.9976 34.4894 28.5012 38.7812z"
//           ></path>
//           <path
//             fill="#D7C1B3"
//             stroke="#D7C1B3"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             d="M34.8823 41.8871L28.5012 38.7812 29.0094 42.9412 28.9529 44.6918 34.8823 41.8871zM15.1176 41.887L21.0471 44.6917 21.0094 42.9412 21.48 38.7812 15.1176 41.887z"
//           ></path>
//           <path
//             fill="#233447"
//             stroke="#233447"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             d="M21.1412 31.7412L15.8329 30.1788 19.5788 28.4659 21.1412 31.7412zM28.84 31.7412L30.4024 28.4659 34.1671 30.1788 28.84 31.7412z"
//           ></path>
//           <path
//             fill="#CD6116"
//             stroke="#CD6116"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             d="M15.1176 41.8872L16.0212 34.2448 10.1294 34.4143 15.1176 41.8872zM33.9788 34.2448L34.8824 41.8872 39.8706 34.4143 33.9788 34.2448zM38.4588 25.8307L27.88 26.3013 28.8588 31.7413 30.4212 28.466 34.1859 30.1789 38.4588 25.8307zM15.8329 30.1789L19.5977 28.466 21.1412 31.7413 22.1388 26.3013 11.5412 25.8307 15.8329 30.1789z"
//           ></path>
//           <path
//             fill="#E4751F"
//             stroke="#E4751F"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             d="M11.5412 25.8306L15.9835 34.4895 15.8329 30.1789 11.5412 25.8306zM34.1859 30.1789L33.9976 34.4895 38.4588 25.8307 34.1859 30.1789zM22.1388 26.3013L21.1412 31.7413 22.3835 38.1601 22.6659 29.7083 22.1388 26.3013zM27.88 26.3013L27.3717 29.6895 27.5976 38.1601 28.8588 31.7413 27.88 26.3013z"
//           ></path>
//           <path
//             fill="#F6851B"
//             stroke="#F6851B"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             d="M28.8588 31.7412L27.5976 38.16 28.5012 38.7812 33.9976 34.4895 34.1859 30.1789 28.8588 31.7412zM15.8329 30.1789L15.9835 34.4895 21.48 38.7812 22.3835 38.16 21.1412 31.7412 15.8329 30.1789z"
//           ></path>
//           <path
//             fill="#C0AD9E"
//             stroke="#C0AD9E"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             d="M28.9529 44.6918L29.0094 42.9412L28.5388 42.5271H21.4424L21.0094 42.9412L21.0471 44.6918L15.1176 41.8871L17.1882 43.5812L21.3859 46.4988H28.5953L32.8118 43.5812L34.8824 41.8871L28.9529 44.6918Z"
//           ></path>
//           <path
//             fill="#161616"
//             stroke="#161616"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             d="M28.5012 38.7812L27.5977 38.16H22.3835L21.48 38.7812L21.0094 42.9412L21.4424 42.5271H28.5388L29.0094 42.9412L28.5012 38.7812Z"
//           ></path>
//           <path
//             fill="#763D16"
//             stroke="#763D16"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             d="M47.4 16.8141L49 9.13412 46.6094 2 28.5012 15.44 35.4659 21.3318 45.3106 24.2118 47.4941 21.6706 46.5529 20.9929 48.0588 19.6188 46.8918 18.7153 48.3976 17.5671 47.4 16.8141zM1 9.13412L2.6 16.8141 1.58353 17.5671 3.08941 18.7153 1.94118 19.6188 3.44706 20.9929 2.50588 21.6706 4.67059 24.2118 14.5153 21.3318 21.48 15.44 3.37177 2 1 9.13412z"
//           ></path>
//           <path
//             fill="#F6851B"
//             stroke="#F6851B"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             d="M45.3106 24.2118L35.4659 21.3318 38.4588 25.8306 33.9977 34.4894 39.8706 34.4141H48.6235L45.3106 24.2118zM14.5153 21.3318L4.6706 24.2118 1.39531 34.4141H10.1294L15.9835 34.4894 11.5412 25.8306 14.5153 21.3318zM27.88 26.3011L28.5012 15.44 31.3623 7.70349H18.6565L21.48 15.44 22.1388 26.3011 22.3647 29.727 22.3835 38.16H27.5976L27.6353 29.727 27.88 26.3011z"
//           ></path>
//         </svg>
//       </button>
//       <button
//         disabled={!defaultAccount || isOrderProcessing}
//         onClick={handleCryptoCheckout}
//         className="flex disabled:opacity-50 mt-5 mr-5 w-fit text-center items-center gap-2 bg-black text-white px-5 py-3 text-md font-medium rounded-md tracking-wide"
//       >
//         Pay using MetaMask
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           width="25"
//           height="24"
//           fill="none"
//           viewBox="0 0 50 48"
//           id="metamask"
//         >
//           <path
//             fill="#E2761B"
//             stroke="#E2761B"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             d="M46.6094 2L27.88 15.9106L31.3435 7.70353L46.6094 2Z"
//           ></path>
//           <path
//             fill="#E4761B"
//             stroke="#E4761B"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             d="M3.37177 2L21.9506 16.0424 18.6565 7.70353 3.37177 2zM39.8706 34.2447L34.8824 41.887 45.5553 44.8235 48.6235 34.4141 39.8706 34.2447zM1.39529 34.4141L4.44471 44.8235 15.1176 41.887 10.1294 34.2447 1.39529 34.4141z"
//           ></path>
//           <path
//             fill="#E4761B"
//             stroke="#E4761B"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             d="M14.5153 21.3318L11.5412 25.8306 22.1388 26.3012 21.7624 14.913 14.5153 21.3318zM35.4659 21.3317L28.1247 14.7812 27.88 26.3012 38.4588 25.8306 35.4659 21.3317zM15.1176 41.8871L21.48 38.7812 15.9835 34.4894 15.1176 41.8871zM28.5012 38.7812L34.8824 41.8871 33.9976 34.4894 28.5012 38.7812z"
//           ></path>
//           <path
//             fill="#D7C1B3"
//             stroke="#D7C1B3"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             d="M34.8823 41.8871L28.5012 38.7812 29.0094 42.9412 28.9529 44.6918 34.8823 41.8871zM15.1176 41.887L21.0471 44.6917 21.0094 42.9412 21.48 38.7812 15.1176 41.887z"
//           ></path>
//           <path
//             fill="#233447"
//             stroke="#233447"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             d="M21.1412 31.7412L15.8329 30.1788 19.5788 28.4659 21.1412 31.7412zM28.84 31.7412L30.4024 28.4659 34.1671 30.1788 28.84 31.7412z"
//           ></path>
//           <path
//             fill="#CD6116"
//             stroke="#CD6116"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             d="M15.1176 41.8872L16.0212 34.2448 10.1294 34.4143 15.1176 41.8872zM33.9788 34.2448L34.8824 41.8872 39.8706 34.4143 33.9788 34.2448zM38.4588 25.8307L27.88 26.3013 28.8588 31.7413 30.4212 28.466 34.1859 30.1789 38.4588 25.8307zM15.8329 30.1789L19.5977 28.466 21.1412 31.7413 22.1388 26.3013 11.5412 25.8307 15.8329 30.1789z"
//           ></path>
//           <path
//             fill="#E4751F"
//             stroke="#E4751F"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             d="M11.5412 25.8306L15.9835 34.4895 15.8329 30.1789 11.5412 25.8306zM34.1859 30.1789L33.9976 34.4895 38.4588 25.8307 34.1859 30.1789zM22.1388 26.3013L21.1412 31.7413 22.3835 38.1601 22.6659 29.7083 22.1388 26.3013zM27.88 26.3013L27.3717 29.6895 27.5976 38.1601 28.8588 31.7413 27.88 26.3013z"
//           ></path>
//           <path
//             fill="#F6851B"
//             stroke="#F6851B"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             d="M28.8588 31.7412L27.5976 38.16 28.5012 38.7812 33.9976 34.4895 34.1859 30.1789 28.8588 31.7412zM15.8329 30.1789L15.9835 34.4895 21.48 38.7812 22.3835 38.16 21.1412 31.7412 15.8329 30.1789z"
//           ></path>
//           <path
//             fill="#C0AD9E"
//             stroke="#C0AD9E"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             d="M28.9529 44.6918L29.0094 42.9412L28.5388 42.5271H21.4424L21.0094 42.9412L21.0471 44.6918L15.1176 41.8871L17.1882 43.5812L21.3859 46.4988H28.5953L32.8118 43.5812L34.8824 41.8871L28.9529 44.6918Z"
//           ></path>
//           <path
//             fill="#161616"
//             stroke="#161616"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             d="M28.5012 38.7812L27.5977 38.16H22.3835L21.48 38.7812L21.0094 42.9412L21.4424 42.5271H28.5388L29.0094 42.9412L28.5012 38.7812Z"
//           ></path>
//           <path
//             fill="#763D16"
//             stroke="#763D16"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             d="M47.4 16.8141L49 9.13412 46.6094 2 28.5012 15.44 35.4659 21.3318 45.3106 24.2118 47.4941 21.6706 46.5529 20.9929 48.0588 19.6188 46.8918 18.7153 48.3976 17.5671 47.4 16.8141zM1 9.13412L2.6 16.8141 1.58353 17.5671 3.08941 18.7153 1.94118 19.6188 3.44706 20.9929 2.50588 21.6706 4.67059 24.2118 14.5153 21.3318 21.48 15.44 3.37177 2 1 9.13412z"
//           ></path>
//           <path
//             fill="#F6851B"
//             stroke="#F6851B"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             d="M45.3106 24.2118L35.4659 21.3318 38.4588 25.8306 33.9977 34.4894 39.8706 34.4141H48.6235L45.3106 24.2118zM14.5153 21.3318L4.6706 24.2118 1.39531 34.4141H10.1294L15.9835 34.4894 11.5412 25.8306 14.5153 21.3318zM27.88 26.3011L28.5012 15.44 31.3623 7.70349H18.6565L21.48 15.44 22.1388 26.3011 22.3647 29.727 22.3835 38.16H27.5976L27.6353 29.727 27.88 26.3011z"
//           ></path>
//         </svg>
//       </button>
//     </div>
//   );
// };
// export default MetaCheckoutComponent;
