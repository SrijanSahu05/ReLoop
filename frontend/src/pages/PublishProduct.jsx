import axios from 'axios';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import BASE_URL from '../config/api';

const PublishProduct = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const accessToken = localStorage.getItem("accessToken");

    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [images, setImages] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);

    const [form, setForm] = useState({
        productName: "",
        productDescription: "",
        category: "",
        productPrice: "",
        brand: "",
    });

    // Handle Image Upload
    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);

        if(images.length + files.length > 5) {
            toast.error("Maximum 5 images allowed");
            return;
        }

        setImages((prev) => [...prev, ...files]);

        const previews = files.map((file) => URL.createObjectURL(file));
        setPreviewImages((prev) => [...prev, ...previews]);
    };

    // Handle Remove Images
    const removeImages = (idx) => {
        const newImages = [...images];
        const newPreviews = [...previewImages];

        newImages.splice(idx, 1);
        newPreviews.splice(idx, 1);

        setImages(newImages);
        setPreviewImages(newPreviews);
    };

    // Handle Form change
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Handle Publish product
    const handlePublish = async (e) => {
        e.preventDefault();

        try {
          setLoading(true);
          const formData = new FormData();

          images.forEach((img) => {
              formData.append("files", img);
          });

          Object.entries(form).forEach(([key, value]) => {
              formData.append(key, value);
          });

          //attach user location automatically
          if(!user?.city || !user?.state){
            toast.error("Please update your profile, then publish your product.");
            return;
          }

          formData.append("city", user?.city);
          formData.append("state", user?.state);

          const res = await axios.post(`${BASE_URL}/product/add`, formData, {
              headers: {
                  Authorization: `Bearer ${accessToken}`,
              },
          });

          if(res.data.success){
              toast.success("Product published successfully");
              setStep(1);
              setImages([]);
              setPreviewImages([]);
              setForm({
                  productName: "",
                  productDescription: "",
                  category: "",
                  productPrice: "",
                  brand: ""
              });
          }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Publish failed");
        } finally {
          setLoading(false);
        }
    };

  return (
    <div className="bg-white mx-auto rounded-2xl shadow-md border p-6 max-w-5xl">
      {/* Step 1 for product publishing */}
      {step === 1 && (
        <div>
            <h2 className='text-lg font-semibold mb-4'>Upload Images</h2>

            {/* Upload Images */}
            <input type="file" multiple accept='image/*' className='mb-4 border p-2' onChange={handleImageUpload}/>
            {/* Preview Images */}
            <div className='grid grid-cols-3 md:grid-cols-5 gap-3'>
                {previewImages.map((img, idx) => (
                    <div key={idx} className='relative'>
                        <img src={img} alt="preview" className='w-full h-60 object-cover rounded-lg'/>
                        <button type='button' onClick={() => removeImages(idx)} className='absolute top-1 right-1 bg-black/60 text-white text-xs px-1 rounded'>
                            ✕
                        </button>
                    </div>
                ))}
            </div>

            <button onClick={() => setStep(2)} disabled={images.length === 0}
            className='mt-6 bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg'>
                Next
            </button>
        </div>
      )}

      {/* Step 2 for product publication*/}
      {step === 2 && (
        <form onSubmit={handlePublish}>
          <h2 className="text-lg font-semibold mb-4">Product Details</h2>

          <input
            name="productName"
            placeholder="Product Name"
            value={form.productName}
            onChange={handleChange}
            className="input mb-3 w-full"
          />

          <textarea
            name="productDescription"
            placeholder="Description"
            value={form.productDescription}
            onChange={handleChange}
            className="input mb-3 w-full"
          />

          <input
            name="category"
            placeholder="Category"
            value={form.category}
            onChange={handleChange}
            className="input mb-3 w-full"
          />

          <input
            name="brand"
            placeholder="Brand"
            value={form.brand}
            onChange={handleChange}
            className="input mb-3 w-full"
          />

          <input
            name="productPrice"
            type="number"
            placeholder="Price"
            value={form.productPrice}
            onChange={handleChange}
            className="input mb-3 w-full"
          />

          <div className="flex gap-3 mt-4">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-6 py-2 border rounded-lg hover:bg-black hover:text-white transition"
            >
              Back
            </button>

            <button
              type="submit"
              className="bg-teal-600 hover:bg-teal-800 text-white px-6 py-2 rounded-lg"
            >
              {loading ? "Publishing..." : "Publish"}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

export default PublishProduct
