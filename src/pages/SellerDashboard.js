import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { productsAPI, ordersAPI } from '../utils/api';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const SellerDashboard = () => {
  const queryClient = useQueryClient();
  const [editMode, setEditMode] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Fetch seller products
  const { data: products, isLoading: productsLoading } = useQuery(
    'my-products',
    () => productsAPI.getProducts({ seller_only: true }),
    { select: (response) => response.data.results }
  );

  // Fetch seller stats
  const { data: stats, isLoading: statsLoading } = useQuery(
    'seller-stats',
    () => ordersAPI.getSellerStats(),
    { select: (response) => response.data }
  );

  // Mutations for product CRUD
  const createProduct = useMutation(productsAPI.createProduct, {
    onSuccess: () => queryClient.invalidateQueries('my-products'),
  });
  const updateProduct = useMutation(
    ({ id, data }) => productsAPI.updateProduct(id, data),
    {
      onSuccess: () => queryClient.invalidateQueries('my-products'),
    }
  );
  const deleteProduct = useMutation(productsAPI.deleteProduct, {
    onSuccess: () => queryClient.invalidateQueries('my-products'),
  });

  // Product form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    stock_quantity: '',
    category: '',
    brand: '',
    tags: [],
    discount_percentage: '',
    discount_start_date: '',
    discount_end_date: '',
    images: [],
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'images') {
      setFormData((prev) => ({ ...prev, images: files }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'images' && value.length > 0) {
        for (let i = 0; i < value.length; i++) {
          data.append('images', value[i]);
        }
      } else if (value) {
        data.append(key, value);
      }
    });
    if (editMode && selectedProduct) {
      await updateProduct.mutateAsync({ id: selectedProduct.id, data });
      setEditMode(false);
      setSelectedProduct(null);
    } else {
      await createProduct.mutateAsync(data);
    }
    setFormData({
      title: '',
      description: '',
      price: '',
      stock_quantity: '',
      category: '',
      brand: '',
      tags: [],
      discount_percentage: '',
      discount_start_date: '',
      discount_end_date: '',
      images: [],
    });
  };

  const handleEdit = (product) => {
    setEditMode(true);
    setSelectedProduct(product);
    setFormData({
      title: product.title || '',
      description: product.description || '',
      price: product.price || '',
      stock_quantity: product.stock_quantity || '',
      category: product.category || '',
      brand: product.brand || '',
      tags: product.tags || [],
      discount_percentage: product.discount_percentage || '',
      discount_start_date: product.discount_start_date || '',
      discount_end_date: product.discount_end_date || '',
      images: [],
    });
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Delete this product?')) {
      await deleteProduct.mutateAsync(productId);
    }
  };

  if (productsLoading || statsLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Seller Dashboard</h1>

        {/* Sales Stats */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Sales Stats</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
        </div>

        {/* Product Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">{editMode ? 'Edit Product' : 'Add New Product'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block">Title</label>
              <input name="title" value={formData.title} onChange={handleChange} className="input w-full border px-3 py-2 rounded" required />
            </div>
            <div>
              <label className="block">Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} className="input w-full border px-3 py-2 rounded" required />
            </div>
            <div>
              <label className="block">Price</label>
              <input name="price" type="number" value={formData.price} onChange={handleChange} className="input w-full border px-3 py-2 rounded" required />
            </div>
            <div>
              <label className="block">Stock Quantity</label>
              <input name="stock_quantity" type="number" value={formData.stock_quantity} onChange={handleChange} className="input w-full border px-3 py-2 rounded" required />
            </div>
            <div>
              <label className="block">Category</label>
              <input name="category" value={formData.category} onChange={handleChange} className="input w-full border px-3 py-2 rounded" />
            </div>
            <div>
              <label className="block">Brand</label>
              <input name="brand" value={formData.brand} onChange={handleChange} className="input w-full border px-3 py-2 rounded" />
            </div>
            <div>
              <label className="block">Discount %</label>
              <input name="discount_percentage" type="number" value={formData.discount_percentage} onChange={handleChange} className="input w-full border px-3 py-2 rounded" />
            </div>
            <div>
              <label className="block">Discount Start</label>
              <input name="discount_start_date" type="date" value={formData.discount_start_date} onChange={handleChange} className="input w-full border px-3 py-2 rounded" />
            </div>
            <div>
              <label className="block">Discount End</label>
              <input name="discount_end_date" type="date" value={formData.discount_end_date} onChange={handleChange} className="input w-full border px-3 py-2 rounded" />
            </div>
            <div>
              <label className="block">Images</label>
              <input name="images" type="file" multiple accept="image/*" onChange={handleChange} className="input w-full border px-3 py-2 rounded" />
            </div>
            <button type="submit" className="btn btn-primary w-full">
              {editMode ? 'Update Product' : 'Add Product'}
            </button>
          </form>
        </div>

        {/* Product List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">My Products</h2>
          {products?.length === 0 ? (
            <p>No products found.</p>
          ) : (
            <table className="w-full table-auto">
              <thead>
                <tr>
                  <th className="px-2 py-1">Title</th>
                  <th className="px-2 py-1">Price</th>
                  <th className="px-2 py-1">Stock</th>
                  <th className="px-2 py-1">Status</th>
                  <th className="px-2 py-1">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td className="px-2 py-1">{product.title}</td>
                    <td className="px-2 py-1">${product.price}</td>
                    <td className="px-2 py-1">{product.stock_quantity}</td>
                    <td className="px-2 py-1">{product.status}</td>
                    <td className="px-2 py-1">
                      <button onClick={() => handleEdit(product)} className="btn btn-sm btn-primary mr-2">Edit</button>
                      <button onClick={() => handleDelete(product.id)} className="btn btn-sm btn-danger">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;





