import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createProduct } from "../../redux/actions/product";

const CreateProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const seller = useSelector((state) => state.seller?.seller);
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    tags: "",
    originalPrice: "",
    discountPrice: "",
    stock: "",
  });
  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = ({ target }) => {
    setForm((current) => ({ ...current, [target.name]: target.value }));
  };

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files || []);

    if (files.length > 5) {
      toast.error("You can upload up to 5 images");
      return;
    }

    Promise.all(
      files.map(
        (file) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          })
      )
    )
      .then(setImages)
      .catch(() => toast.error("Could not read the selected images"));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.name.trim()) {
      toast.error("Product name is required");
      return;
    }
    if (images.length === 0) {
      toast.error("Please upload at least one product image");
      return;
    }
    if (!seller?._id) {
      toast.error("Seller information is still loading");
      return;
    }

    setIsSubmitting(true);
    try {
      const created = await dispatch(
        createProduct(
          form.name,
          form.description,
          form.category,
          form.tags,
          Number(form.originalPrice),
          Number(form.discountPrice),
          Number(form.stock),
          seller._id,
          images
        )
      );
      if (created) {
        toast.success("Product created successfully");
        navigate("/dashboard");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl space-y-4 p-6">
      <h1 className="text-2xl font-semibold">Create Product</h1>
      {[
        ["name", "Product name", "text"],
        ["category", "Category", "text"],
        ["tags", "Tags", "text"],
        ["originalPrice", "Original price", "number"],
        ["discountPrice", "Discount price", "number"],
        ["stock", "Stock", "number"],
      ].map(([name, label, type]) => (
        <label key={name} className="block text-sm font-medium text-gray-700">
          {label}
          <input
            name={name}
            type={type}
            value={form[name]}
            onChange={handleChange}
            required={name === "name"}
            className="mt-1 w-full rounded border border-gray-300 p-2"
          />
        </label>
      ))}
      <label className="block text-sm font-medium text-gray-700">
        Description
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="mt-1 min-h-24 w-full rounded border border-gray-300 p-2"
        />
      </label>
      <label className="block text-sm font-medium text-gray-700">
        Product images
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          className="mt-1 block w-full rounded border border-gray-300 p-2"
        />
        <span className="mt-1 block text-xs text-gray-500">
          Select up to 5 images.
        </span>
      </label>
      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {images.map((image, index) => (
            <img
              key={`${image.slice(0, 20)}-${index}`}
              src={image}
              alt={`Product preview ${index + 1}`}
              className="h-24 w-full rounded object-cover"
            />
          ))}
        </div>
      )}
      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded bg-black px-5 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? "Creating..." : "Create product"}
      </button>
    </form>
  );
};

export default CreateProduct;
