// ============================================
// FILE: src/pages/admin/Products.jsx (or src/admin/Products.jsx)
// ============================================
import React, { useEffect, useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { db, admin } from "../../lib/supabase";
import toast from "react-hot-toast";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Modal from "../../components/common/Modal";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    original_price: "",
    weight: "",
    servings: "",
    stock: "",
    image_url: "",
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const { data } = await db.getProducts();
    setProducts(data || []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingProduct) {
        await admin.updateProduct(editingProduct.id, formData);
        toast.success("Product updated!");
      } else {
        await admin.createProduct(formData);
        toast.success("Product created!");
      }

      resetForm();
      loadProducts();
    } catch (error) {
      toast.error("Operation failed");
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this product?")) {
      const { error } = await admin.deleteProduct(id);
      if (error) {
        toast.error("Failed to delete product");
        console.error("Delete error:", error);
      } else {
        toast.success("Product deleted");
        loadProducts();
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      original_price: "",
      weight: "",
      servings: "",
      stock: "",
      image_url: "",
    });
    setEditingProduct(null);
    setShowModal(false);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || "",
      price: product.price,
      original_price: product.original_price || "",
      weight: product.weight || "",
      servings: product.servings || "",
      stock: product.stock || "",
      image_url: product.image_url || "",
    });
    setShowModal(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8 max-md:!mb-6">
        <h1 className="text-3xl font-bold max-md:!text-[20px]">Products</h1>
        <Button onClick={() => setShowModal(true)} className="max-md:!text-[12px] max-md:!px-[14px] max-md:!h-[36px] max-md:!rounded-[8px]">
          <Plus className="h-5 w-5 mr-2 inline max-md:!h-[16px] max-md:!w-[16px]" />
          Add Product
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden max-md:!bg-transparent max-md:!shadow-none max-md:!rounded-none">
        <table className="w-full max-md:!block max-md:!overflow-visible">
          <thead className="bg-gray-50 max-md:!hidden">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 max-md:!block max-md:!divide-y-0">
            {products.map((product) => (
              <tr key={product.id} className="max-md:!block max-md:!bg-white max-md:!mb-[10px] max-md:!rounded-[12px] max-md:!p-[12px] max-md:!shadow-sm max-md:!border-b-0">
                <td className="px-6 py-4 max-md:!p-0 max-md:!block">
                  <div className="flex items-center max-md:!gap-[12px]">
                    <img src={product.image_url || "https://via.placeholder.com/100"} alt={product.name} className="h-12 w-12 rounded object-cover mr-3 max-md:!h-[50px] max-md:!w-[50px] max-md:!rounded-[6px] max-md:!mr-0 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold max-md:!text-[12px] max-md:!leading-[1.4] max-md:!font-semibold truncate">{product.name}</div>
                      <div className="text-sm text-gray-600 max-md:!text-[11px] max-md:!text-gray-500">{product.weight}</div>
                      <div className="hidden max-md:!flex max-md:!items-center max-md:!gap-[10px] max-md:!mt-[4px]">
                        <span className="max-md:!text-[12px] max-md:!font-semibold max-md:!text-[#8B4513]">Rs.{product.price}</span>
                        <span className="max-md:!text-[11px] max-md:!text-gray-400">Stock: {product.stock}</span>
                      </div>
                    </div>
                    <div className="hidden max-md:!flex max-md:!items-center max-md:!gap-[8px]">
                      <button onClick={() => openEditModal(product)} className="text-blue-600 hover:text-blue-800 max-md:!p-[6px] max-md:!bg-blue-50 max-md:!rounded-[6px]">
                        <Edit className="h-5 w-5 max-md:!h-[16px] max-md:!w-[16px]" />
                      </button>
                      <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-800 max-md:!p-[6px] max-md:!bg-red-50 max-md:!rounded-[6px]">
                        <Trash2 className="h-5 w-5 max-md:!h-[16px] max-md:!w-[16px]" />
                      </button>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 max-md:!hidden">
                  <div className="font-semibold">${product.price}</div>
                  {product.original_price && <div className="text-sm text-gray-500 line-through">${product.original_price}</div>}
                </td>
                <td className="px-6 py-4 max-md:!hidden">{product.stock}</td>
                <td className="px-6 py-4 max-md:!hidden">
                  <div className="flex space-x-2">
                    <button onClick={() => openEditModal(product)} className="text-blue-600 hover:text-blue-800">
                      <Edit className="h-5 w-5" />
                    </button>
                    <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-800">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={showModal} onClose={resetForm} title={editingProduct ? "Edit Product" : "Add Product"}>
        <form onSubmit={handleSubmit}>
          <Input label="Product Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg" rows="4" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input label="Price ($)" type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required />

            <Input label="Original Price ($)" type="number" step="0.01" value={formData.original_price} onChange={(e) => setFormData({ ...formData, original_price: e.target.value })} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input label="Weight" value={formData.weight} onChange={(e) => setFormData({ ...formData, weight: e.target.value })} placeholder="e.g., 30g" />

            <Input label="Servings" type="number" value={formData.servings} onChange={(e) => setFormData({ ...formData, servings: e.target.value })} />
          </div>

          <Input label="Stock" type="number" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} required />

          <Input label="Image URL" value={formData.image_url} onChange={(e) => setFormData({ ...formData, image_url: e.target.value })} />

          <div className="flex space-x-4 mt-6">
            <Button type="submit" fullWidth>
              {editingProduct ? "Update" : "Create"}
            </Button>
            <Button type="button" variant="secondary" fullWidth onClick={resetForm}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
