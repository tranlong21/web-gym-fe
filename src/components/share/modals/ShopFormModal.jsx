import React, { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import ShopService from "../../../services/ShopService";

const ShopFormModal = ({ isOpen = false, onClose, editingProduct, onSuccess }) => {
  const [formData, setFormData] = useState({ name: "", price: "", description: "", category_id: "" });
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [images, setImages] = useState([]); // ảnh mới
  const [existingImages, setExistingImages] = useState([]); // ảnh cũ
  const [deletedImageIds, setDeletedImageIds] = useState([]);

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name || "",
        price: editingProduct.price || "",
        description: editingProduct.description || "",
        category_id: editingProduct.category_id || "",
      });
      setExistingImages(editingProduct.images || []);
    } else {
      setFormData({ name: "", price: "", description: "", category_id: "" });
      setThumbnailFile(null);
      setImages([]);
      setExistingImages([]);
      setDeletedImageIds([]);
    }
  }, [editingProduct]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 5) {
      alert("Chỉ được phép thêm tối đa 5 ảnh chi tiết.");
      return;
    }
    setImages((prev) => [...prev, ...files]);
  };

  const handleRemoveImage = (id) => {
    setExistingImages((prev) => prev.filter((img) => img.id !== id));
    setDeletedImageIds((prev) => [...prev, id]);
  };

  const handleRemoveNewImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();

    const productData = {
      ...formData,
      deleted_image_ids: deletedImageIds,
    };

    form.append("product", new Blob([JSON.stringify(productData)], { type: "application/json" }));

    if (thumbnailFile instanceof File) {
      form.append("thumbnailFile", thumbnailFile);
    }

    images.forEach((file) => {
      form.append("files", file);
    });

    try {
      if (editingProduct) {
        await ShopService.updateProduct(editingProduct.id, form);
      } else {
        await ShopService.createProduct(form);
      }
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Lỗi khi gửi sản phẩm:", err);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50">
      <div className="flex items-center justify-center min-h-screen bg-black bg-opacity-30">
        <Dialog.Panel className="bg-white p-6 rounded shadow-md w-full max-w-5xl">
          <Dialog.Title className="text-lg font-bold mb-4">
            {editingProduct ? "Sửa sản phẩm" : "Thêm sản phẩm mới"}
          </Dialog.Title>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
            <div>
              <label className="block font-medium mb-1">Tên sản phẩm:</label>
              <input
                name="name"
                placeholder="Tên sản phẩm"
                value={formData.name}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />
              <label className="block font-medium mt-4 mb-1">Giá:</label>
              <input
                name="price"
                type="number"
                placeholder="Giá"
                value={formData.price}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />
              <label className="block font-medium mt-4 mb-1">Mô tả:</label>
              <textarea
                name="description"
                placeholder="Mô tả"
                value={formData.description}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                rows={4}
              />
              <label className="block font-medium mt-4 mb-1">ID danh mục:</label>
              <input
                name="category_id"
                placeholder="ID danh mục"
                value={formData.category_id}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Ảnh đại diện (thumbnail):</label>
              {editingProduct && editingProduct.thumbnail && (
                <img
                  src={editingProduct.thumbnail}
                  alt="Thumbnail cũ"
                  className="w-32 h-32 object-cover rounded border mb-2"
                />
              )}
              <p className="text-sm text-red-600 mb-1">*Chọn ảnh mới nếu muốn thay thế</p>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setThumbnailFile(e.target.files[0])}
                className="mt-1"
              />
              {thumbnailFile && (
                <div className="mt-2">
                  <img
                    src={URL.createObjectURL(thumbnailFile)}
                    alt="Thumbnail preview"
                    className="w-24 h-24 object-cover border rounded"
                  />
                </div>
              )}

              <label className="block font-medium mt-4 mb-1">Ảnh chi tiết (tối đa 5):</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="mt-1"
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {existingImages.map((img) => (
                  <div key={img.id} className="relative w-20 h-20">
                    <img
                      src={img.url || img.path}
                      alt=""
                      className="w-full h-full object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(img.id)}
                      className="absolute top-0 right-0 bg-red-600 text-white text-xs px-1 rounded"
                    >
                      X
                    </button>
                  </div>
                ))}
                {images.map((file, idx) => (
                  <div key={idx} className="relative w-20 h-20">
                    <img
                      src={URL.createObjectURL(file)}
                      alt=""
                      className="w-full h-full object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveNewImage(idx)}
                      className="absolute top-0 right-0 bg-red-600 text-white text-xs px-1 rounded"
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-span-2 text-right">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
              >
                {editingProduct ? "Cập nhật" : "Thêm mới"}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default ShopFormModal;
