import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { productsAPI, ordersAPI, authAPI } from '../utils/api';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const AdminDashboard = () => {
  const queryClient = useQueryClient();
  const [view, setView] = useState('users');
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Fetch stats
  const { data: stats, isLoading: statsLoading } = useQuery(
    'admin-stats',
    ordersAPI.getAdminStats,
    { select: (response) => response.data }
  );

  // Fetch users (simple list)
  const { data: users, isLoading: usersLoading } = useQuery(
    'users',
    () => authAPI.getUsers(),
    { select: (response) => response.data.results }
  );

  // Fetch products (pending approval)
  const { data: pendingProducts, isLoading: productsLoading } = useQuery(
    'pending-products',
    () => productsAPI.getProducts({ status: 'pending' }),
    { select: (response) => response.data.results }
  );

  // Approve/reject/feature product
  const approveProduct = useMutation(
    (id) => productsAPI.updateProduct(id, { status: 'approved' }),
    { onSuccess: () => queryClient.invalidateQueries('pending-products') }
  );
  const rejectProduct = useMutation(
    (id) => productsAPI.updateProduct(id, { status: 'rejected' }),
    { onSuccess: () => queryClient.invalidateQueries('pending-products') }
  );
  const featureProduct = useMutation(
    (id) => productsAPI.updateProduct(id, { is_featured: true }),
    { onSuccess: () => queryClient.invalidateQueries('pending-products') }
  );

  if (statsLoading || usersLoading || productsLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

        {/* Analytics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div>
            <span className="text-gray-600">Total Orders</span>
            <div className="text-2xl font-bold">{stats?.total_orders ?? 0}</div>
          </div>
          <div>
            <span className="text-gray-600">Pending</span>
            <div className="text-2xl font-bold">{stats?.pending_orders ?? 0}</div>
          </div>
          <div>
            <span className="text-gray-600">Delivered</span>
            <div className="text-2xl font-bold">{stats?.delivered_orders ?? 0}</div>
          </div>
          <div>
            <span className="text-gray-600">Total Revenue</span>
            <div className="text-2xl font-bold">${stats?.total_revenue ?? 0}</div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex gap-4 mb-6">
          <button className={`btn ${view === 'users' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setView('users')}>Users</button>
          <button className={`btn ${view === 'products' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setView('products')}>Products</button>
        </div>

        {/* Users Management */}
        {view === 'users' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">User Management</h2>
            <table className="w-full table-auto">
              <thead>
                <tr>
                  <th className="px-2 py-1">Name</th>
                  <th className="px-2 py-1">Email</th>
                  <th className="px-2 py-1">Status</th>
                  <th className="px-2 py-1">Seller</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b">
                    <td className="px-2 py-1">{user.first_name} {user.last_name}</td>
                    <td className="px-2 py-1">{user.email}</td>
                    <td className="px-2 py-1">{user.is_active ? 'Active' : 'Inactive'}</td>
                    <td className="px-2 py-1">{user.is_seller ? 'Yes' : 'No'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Products Management */}
        {view === 'products' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Products Pending Approval</h2>
            <table className="w-full table-auto">
              <thead>
                <tr>
                  <th className="px-2 py-1">Title</th>
                  <th className="px-2 py-1">Seller</th>
                  <th className="px-2 py-1">Status</th>
                  <th className="px-2 py-1">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingProducts.map((product) => (
                  <tr key={product.id} className="border-b">
                    <td className="px-2 py-1">{product.title}</td>
                    <td className="px-2 py-1">{product.seller?.first_name} {product.seller?.last_name}</td>
                    <td className="px-2 py-1">{product.status}</td>
                    <td className="px-2 py-1 flex gap-2">
                      <button className="btn btn-sm btn-primary" onClick={() => approveProduct.mutate(product.id)}>Approve</button>
                      <button className="btn btn-sm btn-danger" onClick={() => rejectProduct.mutate(product.id)}>Reject</button>
                      <button className="btn btn-sm btn-outline" onClick={() => featureProduct.mutate(product.id)}>Feature</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;





