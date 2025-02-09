"use client";
import React, { useEffect, useState, useMemo } from "react";
import { client } from "@/sanity/lib/client";
import Image from "next/image";
import Swal from "sweetalert2";
import ProtectedRoute from "@/app/component/ProtectedRoute";
import { urlFor } from "@/sanity/lib/image";

interface Order {
  _id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  zipCode: string;
  total: number;
  discount: number;
  orderDate: string;
  status: string | null;
  ImageUrl:string;
  cartItems: { productName: string; imageUrl: string }[];
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    client
      .fetch(
        `*[_type == "order"]{
          _id,
          firstName,
          lastName,
          phone,
          email,
          address,
          city,
          zipCode,
          total,
          discount,
          orderDate,
          status,
          cartItems[]->{
            productName,
            image
          }
        }`
      )
      .then((data) => setOrders(data))
      .catch((error) => console.error("Error fetching orders:", error));
  }, []);

  const filteredOrders = useMemo(
    () => (filter === "All" ? orders : orders.filter((order) => order.status === filter)),
    [filter, orders]
  );

  const toggleOrderDetails = (orderId: string) => {
    setSelectedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  const handleDelete = async (orderId: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      await client.delete(orderId);
      setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId));
      Swal.fire("Deleted!", "Your order has been deleted.", "success");
    } catch (error) {
      console.error("Error deleting order:", error);
      Swal.fire("Error!", "Something went wrong while deleting.", "error");
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await client
        .patch(orderId)
        .set({ status: newStatus })
        .commit();

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );

      if (newStatus === "dispatch") {
        Swal.fire("Dispatch", "The order is now dispatched.", "success");
      } else if (newStatus === "success") {
        Swal.fire("Success", "The order has been completed.", "success");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      Swal.fire("Error!", "Something went wrong while updating the status.", "error");
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex flex-col h-screen bg-gray-50">
        {/* Navbar */}
       

<nav className="bg-blue-700 text-white shadow-md p-4 flex flex-wrap justify-between items-center">
  <h2 className="text-2xl font-bold">Admin Dashboard</h2>
  <div className="flex flex-wrap space-x-1 mt-6 gap-3">
    {["All", "pending", "dispatch", "success"].map((status) => (
      <button
        key={status}
        className={`px-4 py-2 rounded-lg transition-all ${
          filter === status ? "bg-blue-500 text-white font-bold" : "text-white hover:bg-gray-100 hover:text-gray-700"
        }`}
        onClick={() => setFilter(status)}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </button>
    ))}
  </div>
</nav>


        {/* Orders Table */}
        <div className="flex-1 p-6 overflow-y-auto">
  <h2 className="text-2xl font-bold mb-6 text-gray-800">Orders</h2>
  <div className="bg-white shadow-md rounded-lg overflow-hidden">
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {["ID", "Customer", "Address", "Total", "Status", "Action"].map((heading) => (
              <th key={heading} className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {filteredOrders.map((order) => (
            <React.Fragment key={order._id}>
              <tr
                className="hover:bg-gradient-to-r from-blue-50 to-blue-100 transition-all cursor-pointer"
                onClick={() => toggleOrderDetails(order._id)}
              >
                <td className="px-6 py-4 text-sm text-gray-700">{order._id}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{order.firstName} {order.lastName}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{order.address}</td>
                <td className="px-6 py-4 text-sm text-gray-700">${order.total}</td>
                <td className="px-6 py-4 text-sm">
                  <select
                    value={order.status || ""}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className="bg-gray-100 p-1 rounded text-sm"
                  >
                    <option value="pending">Pending</option>
                    <option value="dispatch">Dispatch</option>
                    <option value="success">Completed</option>
                  </select>
                </td>
                <td className="px-6 py-4 text-sm">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(order._id);
                    }}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
              {selectedOrderId === order._id && (
                <tr>
                  <td colSpan={6} className="bg-gray-50 p-4 transition-all animate-fadeIn">
                    <h3 className="font-bold text-lg text-gray-800 mb-2">Order Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-4 text-sm text-gray-700">
                      <p><strong>Customer Name:</strong> {order.firstName} {order.lastName}</p>
                      <p><strong>Order Date:</strong> {new Date(order.orderDate).toLocaleString()}</p>
                      <p><strong>Address:</strong> {order.address}</p>
                      <p><strong>Phone:</strong> {order.phone}</p>
                      <p><strong>Email:</strong> {order.email}</p>
                      <p><strong>City:</strong> {order.city}</p>
                      <p><strong>Total Amount:</strong> ${order.total}</p>
                    </div>
                    {/* <ul className="mt-4 space-y-2">
                            {order.cartItems.map((item, index) => (
                              <li key={`${order._id}-${index}`} className="flex items-center gap-2">
                                {item.imageUrl && (
                                  <Image
                                    src={urlFor(item.imageUrl).url()}
                                    width={40}
                                    height={40}
                                    alt={item.productName}
                                    className="rounded"
                                    loading="lazy"
                                  />
                                )}
                                <span>{item.productName}</span>
                              </li>
                            ))}
                          </ul> */}
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  </div>
</div>

      </div>
    </ProtectedRoute>
  );
}



























