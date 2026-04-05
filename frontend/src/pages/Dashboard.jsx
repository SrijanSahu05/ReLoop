import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import DashboardSidebar from "../components/DashboardSidebar";
import ProductCards from "../components/ProductCards";
import ProfileForm from "../components/ProfileForm";
import { PanelLeft } from "lucide-react";
import PublishProduct from "./PublishProduct";
import SavedProducts from "./SavedProducts";
import MessagesPage from "./MessagesPage";

const Dashboard = () => {
  const { userId } = useParams();
  const [active, setActive] = useState("details");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userProducts, setUserProducts] = useState([]);
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  const [updateUser, setUpdateUser] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phoneNo: user?.phoneNo || "",
    address: user?.address || "",
    state: user?.state || "",
    city: user?.city || "",
    pinCode: user?.pinCode || "",
    profilePic: user?.profilePic || "",
    role: user?.role || "",
  });

  const getUserProducts = async () => {
    const accessToken = localStorage.getItem("accessToken");
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:8000/product/myProducts/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if(res.data.success){
        setUserProducts(res.data.userProducts);
      }
    } catch (error) {
      if(error?.response?.data?.message == "TokenExpired"){
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        navigate("/");
        window.location.reload();
      }
      
      toast.error(error?.response?.data?.message || "Unable to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserProducts();
  }, []);
  
  useEffect(() => {
    let preview = updateUser.profilePic;

    return () => {
      if(preview?.startsWith("blob:")){
        URL.revokeObjectURL(preview);
      }
    };
  }, [updateUser.profilePic]);

  const handleChange = (e) => {
    setUpdateUser({ ...updateUser, [e.target.name]: e.target.value });
  };

  const [file, setFile] = useState(null);
  const handleImageChange = (e) => {
    const selectedfile = e.target.files[0];
    if (!selectedfile) return;

    setFile(selectedfile);
    const preview = URL.createObjectURL(selectedfile);

    setUpdateUser((prev) => ({
      ...prev,
      profilePic: preview,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const accessToken = localStorage.getItem("accessToken");

    try {
      const formData = new FormData();
      Object.entries(updateUser).forEach(([key, value]) => {
        if (key !== "profilePic") {
          formData.append(key, value);
        }
      });

      if (file) {
        formData.append("file", file);
      }

      const res = await axios.put(
        `http://localhost:8000/user/update/${userId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (res.data.success) {
        toast.success(res.data.message);
        setUser(res.data.user);
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  return (
    <div className="min-h-screen bg-[#ffffff] flex">
      {/* ================= SIDEBAR ================= */}
      <DashboardSidebar 
        updateUser={updateUser}
        mobileMenu={mobileMenu}
        active={active}
        setActive={setActive}
        setMobileMenu={setMobileMenu}
      />

      {/* ================= RIGHT SIDE ================= */}
      <div className="flex-1 p-4 sm:p-6 lg:p-10">
        {/* MOBILE TOP BAR */}
        <div className="md:hidden flex justify-between items-center mb-4">
          <button
            onClick={() => setMobileMenu(!mobileMenu)}
            className="text-2xl"
          >
            <PanelLeft className="w-6 h-6"/>
          </button>
        </div>

        {/* ===== USER DETAILS FORM ===== */}
        {active === "details" && (
          <ProfileForm
            updateUser={updateUser}
            handleSubmit={handleSubmit}
            handleChange={handleChange}
            handleImageChange={handleImageChange}
            loading={loading}
          />
        )}

        {/* ===== MY ITEMS LIST ===== */}
        {active === "items" && (
          <>
          {!loading && userProducts?.length === 0 ? (
            <div className="flex items-center justify-center w-full py-24">
              <p className="text-gray-500 text-lg font-medium">
                No products yet
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-7">
            {userProducts?.map((product) => (
              <ProductCards key={product._id} product={product} loading={loading} mode="owner"/>
            ))}
          </div>
          )}
          </>
        )}

        {/* Publish Product */}
        {active === "publish" && (
          <PublishProduct/>
        )}

        {active === "savedItems" && (
          <SavedProducts />
        )}

        {active === "messages" && (
          <MessagesPage/>
        )}

      </div>

    </div>
  );
};

export default Dashboard;