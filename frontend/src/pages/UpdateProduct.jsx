import axios from 'axios';
import { ArrowLeft, Plus, X } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import BASE_URL from '../config/api';

const UpdateProduct = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [current, setCurrent] = useState(0);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        productName: "",
        productPrice: "",
        productDescription: "",
        brand: "",
        category: ""
    });

    const [existingImages, setExistingImages] = useState([]);
    const [newImages, setNewImages] = useState([]);

    // Fetch product
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const {data} = await axios.get(`${BASE_URL}/product/${productId}`);

                if(data.success){
                    const p = data.viewSingleProduct;
                    setProduct(p);
                    setExistingImages(p.productImg);

                    setFormData({
                        productName: p.productName,
                        productPrice: p.productPrice,
                        productDescription: p.productDescription,
                        brand: p.brand,
                        category: p.category,
                    });
                }
            } catch (error) {
                toast.error("Failed to load product");
            }
        };

        fetchProduct();
    }, [productId]);


    //Image Remove
    const removeExistingImage = (public_id) => {
        setExistingImages(prev => prev.filter(img => img.public_id !== public_id));
    };

    const removeNewImage = (index) => {
        setNewImages(prev => prev.filter((_, i) => i !== index));
    };

    //Add image
    const handleAddImages = (e) => {
        const files = Array.from(e.target.files);

        if(existingImages.length + newImages.length + files.length > 5){
            toast.error("Maximum 5 images allowed");
            return;
        }

        setNewImages(prev => [...prev, ...files]);
    };

    //Update product handler
    const handleUpdate = async () => {
        try {
            setLoading(true);
            const accessToken = localStorage.getItem("accessToken");
            const data = new FormData();

            data.append("productName", formData.productName);
            data.append("productPrice", formData.productPrice);
            data.append("productDescription", formData.productDescription);
            data.append("brand", formData.brand);
            data.append("category", formData.category);

            // existing images public_id
            data.append("existingImg", JSON.stringify(existingImages.map(img => img.public_id)));

            // new images
            newImages.forEach(file => {
                data.append("files", file);
            });

            const res = await axios.put(`${BASE_URL}/product/update/${productId}`, data, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if(res.data.success){
                toast.success("Product updated");
                navigate(-1);
            }

        } catch (error) {
            toast.error("Update failed");
        } finally {
            setLoading(false);
        }
    }

    if(!product) {
        return (
            <div className='flex justify-center items-center min-h-screen'>
                <h1 className='text-2xl text-gray-500 md:text-5xl'>Loading...</h1>
            </div>
        )
    }

    const allImages = [
        ...existingImages,
        ...newImages.map(file => ({url: URL.createObjectURL(file), isNew: true }))
    ];

  return (
    <div className='max-w-7xl mx-auto p-4'>
      
      {/* BACK BUTTON */}
      <button onClick={() => navigate(-1)}
        className="mb-5 flex items-center justify-center w-10 h-10 rounded-xl bg-teal-500 text-white">
        <ArrowLeft className="w-5 h-5"/>
      </button>

      <div className="flex flex-col md:flex-row gap-8">

        {/* Left Image section */}
        <div className="md:w-1/2 w-full">
            <div className="relative border h-[400px] rounded-xl overflow-hidden">
                <img src={allImages[current]?.url} alt='product image' className='w-full h-full object-cover'/> 
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2 mt-3 flex-wrap">
                {/* Existing images */}
                {existingImages.map((img, i) => (
                    <div key={img.public_id} className='relative'>
                        <img src={img.url} onClick={() => setCurrent(i)} 
                        className='w-20 h-20 object-cover rounded border' />
                        <button onClick={() => removeExistingImage(img.public_id)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1">
                            <X size={14}/>
                        </button>
                    </div>
                ))}

                {/* New Images */}
                {newImages.map((file, i) => (
                    <div key={i} className="relative">
                        <img src={URL.createObjectURL(file)}
                        className='w-20 h-20 object-cover rounded border'
                        />
                        <button onClick={() => removeNewImage(i)}
                            className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1'>
                            <X size={14}/>
                        </button>
                    </div>
                ))}

                {/* Add button */}
                {(existingImages.length + newImages.length) < 5 && (
                    <label className="w-20 h-20 border-2 border-dashed rounded flex items-center justify-center cursor-pointer">
                        <Plus/>
                        <input type="file" multiple hidden onChange={handleAddImages}/>
                    </label>
                )}
            </div>
        </div>

        {/* Right form section */}
        <div className="md:w-1/2 w-full flex flex-col gap-4">
            <input value={formData.productName} 
            onChange={(e) => setFormData({...formData, productName:e.target.value})}
            className='border p-2 rounded' placeholder='Product Name'/>

            <input value={formData.brand} 
            onChange={(e) => setFormData({...formData, brand:e.target.value})}
            className='border p-2 rounded' placeholder='Product Name'/>

            <input value={formData.productPrice} 
            onChange={(e) => setFormData({...formData, productPrice:e.target.value})}
            className='border p-2 rounded' placeholder='Product Name'/>

            <input value={formData.category} 
            onChange={(e) => setFormData({...formData, category:e.target.value})}
            className='border p-2 rounded' placeholder='Product Name'/>

            <textarea value={formData.productDescription} 
            onChange={(e) => setFormData({...formData, productDescription:e.target.value})}
            className='border p-2 rounded' placeholder='Product Name'/>

            <button
            onClick={handleUpdate}
            className="bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg font-semibold">
            {loading ? "Updating..." : "Update Product"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default UpdateProduct
