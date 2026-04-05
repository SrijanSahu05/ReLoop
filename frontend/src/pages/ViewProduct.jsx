import axios from "axios";
import { ArrowLeft, Bookmark, BookmarkCheck } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import ShowAuthPopUp from "../components/ShowAuthPopUp";
import ChatBox from "../components/Chatbox";

const ViewProduct = () => {
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const accessToken = localStorage.getItem("accessToken");
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [current, setCurrent] = useState(0);
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showChatBox, setShowChatBox] = useState(false);

  const isOwnerView =
    currentUser &&
    product &&
    (product?.userId?._id === currentUser._id ||
      product?.userId === currentUser._id);

  const handleDeleteProduct = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");

      const res = await axios.delete(
        `http://localhost:8000/product/delete/${product._id}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );

      if (res.data.success) {
        toast.success("Product deleted");
        navigate("/");
      }
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  const handleSaveProduct = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        setShowAuthPopup(true);
        return;
      }

      if (!saved) {
        await axios.post(
          `http://localhost:8000/user/saveProduct/${productId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        toast.success("Product saved");
      } else {
        await axios.delete(
          `http://localhost:8000/user/UnsaveProduct/${productId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        toast.success("Product removed");
      }

      const res = await axios.get(
        `http://localhost:8000/user/isSaved/${productId}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );

      setSaved(res.data.isSaved);
    } catch (error) {
      console.log("Saved status:", saved);
      toast.error("Error in saving product");
    }
  };

  const handleContactSeller = () => {
    if (!accessToken) {
      setShowAuthPopup(true);
      return;
    }

    setShowChatBox(true);
  };

  // view products
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:8000/product/${productId}`,
        );

        if (data.success) {
          setProduct(data.viewSingleProduct);
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to view product");
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  //Check saved items
  useEffect(() => {
    const checkSavedStatus = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");

        const res = await axios.get(
          `http://localhost:8000/user/isSaved/${productId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        setSaved(res.data.isSaved);
      } catch (error) {
        console.log(error);
      }
    };

    if (productId) {
      checkSavedStatus();
    }
  }, [productId]);

  const images = product?.productImg || [];

  const nextImage = () => {
    setCurrent((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };
 
  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] w-full">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-teal-600 shadow-sm mb-4" />
        <p className="text-sm text-gray-500 font-medium tracking-wide">
          Loading product...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="md:block sm:hidden mb-5">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center justify-center w-10 h-10 rounded-xl bg-teal-500 text-white 
        hover:bg-teal-600 active:scale-95 transition-all duration-200 shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Image Section */}
        <div className="md:w-1/2 w-full">
          <div className="relative border w-full h-[350px] md:h-[500px] bg-gray-100 rounded-xl overflow-hidden">
            <img
              src={images[current]?.url}
              alt="product"
              className="w-full h-full object-cover"
            />

            {/* SLIDER BUTTONS */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-white px-3 py-1 rounded-full shadow"
                >
                  ◀
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-white px-3 py-1 rounded-full shadow"
                >
                  ▶
                </button>
              </>
            )}
          </div>

          {/* THUMBNAILS */}
          {images.length > 1 && (
            <div className="flex gap-2 mt-3 overflow-x-auto">
              {images.map((img, i) => (
                <img
                  key={i}
                  src={img.url}
                  onClick={() => setCurrent(i)}
                  className={`w-20 h-20 object-cover rounded cursor-pointer border-2 ${
                    current === i ? "border-teal-600" : "border-transparent"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="md:w-1/2 w-full flex flex-col gap-4">
          <h1 className="text-3xl font-bold">{product.productName}</h1>

          <p className="text-gray-500">{product.brand}</p>

          <h2 className="text-2xl font-semibold text-teal-600">
            <span className="text-black font-bold">Price:</span> ₹
            {product.productPrice}
          </h2>

          <p className="text-gray-700 leading-relaxed">
            {product.productDescription}
          </p>

          {isOwnerView ? (
            <div className="flex gap-4 mt-3">
              <button
                onClick={() => navigate(`/user/myitems/update/${product._id}`)}
                className="bg-teal-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-teal-700"
              >
                Update
              </button>

              <button
                onClick={() => setShowDeletePopup(true)}
                className="bg-red-400 hover:bg-red-500 text-white px-6 py-2 rounded-lg font-semibold"
              >
                Delete
              </button>
            </div>
          ) : (
            <div className="flex gap-4 mt-3">
              <button
                onClick={handleContactSeller}
                className="bg-teal-600 text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-teal-700"
              >
                Contact Seller
              </button>

              <button
                onClick={handleSaveProduct}
                className="flex items-center gap-2 border border-gray-300 px-6 py-2 rounded-lg cursor-pointer"
              >
                {saved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
                {saved ? "Saved" : "Save"}
              </button>
            </div>
          )}

          {/* EXTRA INFO */}
          <div className="mt-6 text-sm text-gray-600 space-y-1">
            <p>
              📍 {product.city}, {product.state}
            </p>
            <p>📦 Category: {product.category}</p>
          </div>
        </div>

        {showDeletePopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-[90%] max-w-md p-6 animate-scaleIn">
              <h2 className="text-lg font-semibold text-gray-800">
                Delete Product?
              </h2>

              <p className="text-sm text-gray-500 mt-2">
                This action cannot be undone. Are you sure you want to delete
                this item?
              </p>

              <div className="flex justify-end gap-3 mt-6">
                {/* Cancel */}
                <button
                  onClick={() => setShowDeletePopup(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
                >
                  Cancel
                </button>

                {/* Confirm Delete */}
                <button
                  onClick={handleDeleteProduct}
                  className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {showAuthPopup && <ShowAuthPopUp setShowAuthPopup={setShowAuthPopup} />}

      {/* Chat Box */}
      {showChatBox && (
        <ChatBox
          productId={product._id}
          sellerId={product.userId}
          onClose={() => setShowChatBox(false)}
        />
      )}
    </div>
  );
};

export default ViewProduct;