import { Product } from "../models/productModel.js";
import cloudinary from "../utils/Cloudinary.js";
import getDataUri from "../utils/dataUri.js";


export const addProduct = async (req, res) => {
    try {
        const {productName, productPrice, productDescription, category, brand, state, city } = req.body;
        const userId = req.id;

        if(!productName || !productPrice || !productDescription || !category || !brand || !state || !city) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            })
        }

        //Handle multiple image uploads
        let productImg = [];

        if(req.files && req.files.length > 0) {
            for (let file of req.files) {
                const fileUri = getDataUri(file);
                const result = await cloudinary.uploader.upload(fileUri, { folder: "Store4U_products"});

                productImg.push({
                    url: result.secure_url,
                    public_id: result.public_id
                })
            }
        }

        //Create new product in the database
        const newProduct = await Product.create({
            userId,
            productName,
            productDescription,
            productPrice,
            category,
            brand,
            state,
            city,
            productImg
        })

        return res.status(201).json({
            success: true,
            message: "Product added successfully",
            Store4U_product: newProduct
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

export const getAllProducts = async (_, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });

        if(!products) {
            return res.status(404).json({
                success: false,
                message: "No products found",
                products: []
            })
        }

        return res.status(200).json({
            success: true,
            products
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const {productId} = req.params;
        const product = await Product.findById(productId);

        if(!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            })
        }

        //Delete images from cloudinary
        if(product.productImg && product.productImg.length > 0) {
            for (let img of product.productImg) {
                const result = await cloudinary.uploader.destroy(img.public_id);
            }
        }

        //Delete img from database
        await Product.findByIdAndDelete(productId);

        return res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const updateProduct = async (req, res) => {
    try {
        const {productId} = req.params;
        const {productName, productPrice, productDescription, category, brand, existingImg } = req.body;
        const product = await Product.findById(productId);

        if(!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            })
        }

        let updatedImages = [];

        // keep selected old images
        if(existingImg){
            const keepIds = JSON.parse(existingImg);
            updatedImages = product.productImg.filter((img) => keepIds.includes(img.public_id)); // ye line ka matlab h unn products ko save krna jisko user delete nahi krna chahata.

            //Delete only removed images (kon sa img removed h ye fronted se milega usko cloudinary aur DB se delete krna h)
            const removedImages = product.productImg.filter((img) => !keepIds.includes(img.public_id));

            for(let img of removedImages) {
                await cloudinary.uploader.destroy(img.public_id);
            }
        }
        else {
            updatedImages = product.productImg; // keep all if nothing is changed
        }

        //upload new images if any
        if(req.files && req.files.length > 0) {
            for(let file of req.files){
                const fileUri = getDataUri(file);
                const result = await cloudinary.uploader.upload(fileUri, {folder: "Store4U_products"});

                updatedImages.push({
                    url: result.secure_url,
                    public_id: result.public_id
                })
            }
        }

        //update product
        product.productName = productName || product.productName;
        product.productDescription = productDescription || product.productDescription;
        product.productPrice = productPrice || product.productPrice;
        product.category = category || product.category;
        product.brand = brand || product.brand;
        product.productImg = updatedImages;

        await product.save();

        return res.status(200).json({
            success: true,
            message: "Product updated successfully",
            product
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const getUserProducts = async (req, res) => {
    try {
        const { userId } = req.params;

        const userProducts = await Product.find({ userId: userId}).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            userProducts
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export const viewProductById = async (req, res) => {
    try {
        const { productId } = req.params;
        const viewSingleProduct = await Product.findById(productId);
        if(!viewSingleProduct){
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        return res.status(200).json({
            success: true,
            viewSingleProduct,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error in view product",
        });
    }
}