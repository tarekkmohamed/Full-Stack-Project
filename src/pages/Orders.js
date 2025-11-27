import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { ordersAPI } from '../utils/api';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const Orders = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Fetch user orders
  const { data: orders, isLoading } = useQuery(
    'my-orders',
    ordersAPI.getOrders,
    { select: (response) => response.data.results }
  );

  // Fetch order details on demand
  const { data: orderDetails, refetch, isFetching } = useQuery(
    ['order-details', selectedOrder],
    () => ordersAPI.getOrder(selectedOrder),
    {
      enabled: !!selectedOrder,
      select: (response) => response.data,
    }
  );

  const handleViewDetails = (orderId) => {
    setSelectedOrder(orderId);
    refetch();
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Orders</h1>
          <p className="text-gray-600">You have no orders yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">My Orders</h1>
          <table className="w-full table-auto mb-6">
            <thead>
              <tr>
                <th className="px-2 py-1">Order #</th>
                <th className="px-2 py-1">Date</th>
                <th className="px-2 py-1">Total</th>
                <th className="px-2 py-1">Status</th>
                <th className="px-2 py-1">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b">
                  <td className="px-2 py-1">{order.order_number}</td>
                  <td className="px-2 py-1">{new Date(order.created_at).toLocaleDateString()}</td>
                  <td className="px-2 py-1">${order.total_amount}</td>
                  <td className="px-2 py-1">{order.status}</td>
                  <td className="px-2 py-1">
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => handleViewDetails(order.id)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {selectedOrder && (
            <div className="bg-gray-100 rounded-lg p-6 mt-8">
              {isFetching || !orderDetails ? (
                <LoadingSpinner size="small" />
              ) : (
                <>
                  <h2 className="text-xl font-bold mb-2">
                    Order #{orderDetails.order_number}
                  </h2>
                  <div className="mb-4 text-gray-700">
                    <span className="font-bold">Status:</span> {orderDetails.status}
                  </div>
                  <div className="mb-4 text-gray-700">
                    <span className="font-bold">Total:</span> ${orderDetails.total_amount}
                  </div>
                  <div className="mb-4 text-gray-700">
                    <span className="font-bold">Shipping Address:</span> {orderDetails.shipping_address}, {orderDetails.shipping_city}, {orderDetails.shipping_country}
                  </div>
                  <div className="mb-4">
                    <span className="font-bold">Items:</span>
                    <ul className="ml-6 list-disc">
                      {orderDetails.items.map((item) => (
                        <li key={item.id}>
                          {item.product.title} x {item.quantity} = ${item.total_price}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mb-4">
                    <span className="font-bold">Status History:</span>
                    <ul className="ml-6 list-disc">
                      {orderDetails.status_history?.map((history, i) => (
                        <li key={i}>
                          {history.status} on {new Date(history.created_at).toLocaleDateString()}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <button
                    className="btn btn-outline btn-primary mt-2"
                    onClick={() => setSelectedOrder(null)}
                  >
                    Close
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;





