import { useRef, useState } from "react";
import { LoaderIcon } from "lucide-react";
import { useImageStore } from "@/store/imageStore";

const ImagePage = () => {
  const { uploadImage, isLoadingImages } = useImageStore();

  const fileInputRef = useRef(null);
  const [imageName, setImageName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState("");

  // ✅ FIXED compression
  const compressImage = (file, maxWidth = 800, quality = 0.8) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target.result;

        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          if (width > height && width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          } else if (height > maxWidth) {
            width = (width * maxWidth) / height;
            height = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          const base64 = canvas.toDataURL("image/jpeg", quality);
          resolve(base64);
        };
      };
    });
  };

  // Select file only
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  // Upload button click
  const handleUpload = async () => {
    if (!selectedFile || !imageName) {
      alert("Image name and file required");
      return;
    }

    const compressedImage = await compressImage(selectedFile);

    await uploadImage({
      imageBase64: compressedImage,
      name: imageName,
    });

    // Reset
    setImageName("");
    setSelectedFile(null);
    setPreview("");
  };

  return (
    <div className="p-4 border rounded-lg max-w-md space-y-3">
      <h2 className="text-lg font-semibold">Upload Image</h2>

      <input
        type="text"
        placeholder="Enter image name"
        value={imageName}
        onChange={(e) => setImageName(e.target.value)}
        className="w-full border p-2 rounded"
      />

      <button
        onClick={() => fileInputRef.current.click()}
        className="w-full bg-gray-800 text-white py-2 rounded"
      >
        Choose Image
      </button>

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileSelect}
        className="hidden"
      />

      {preview && (
        <img
          src={preview}
          alt="preview"
          className="w-full h-48 object-cover rounded"
        />
      )}

      {/* ✅ UPLOAD BUTTON */}
      <button
        onClick={handleUpload}
        disabled={isLoadingImages}
        className="w-full bg-black text-white py-2 rounded flex justify-center items-center"
      >
        {isLoadingImages ? (
          <LoaderIcon className="animate-spin size-5" />
        ) : (
          "Upload Image"
        )}
      </button>
    </div>
  );
};

export default ImagePage;
