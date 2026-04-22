import {  useState } from "react";
import { LoaderIcon } from "lucide-react";
import { useImageStore } from "@/store/imageStore";

const ImagePage = () => {
  const { uploadImage, isLoadingImages } = useImageStore();

  const [file,setFile]=useState(null)
  const[name,setName]=useState("")

  const handleUpload = async () => {
    if (!file || !name) {
      alert("Image name and file required");
      return;
    }

   

    await uploadImage({
      file,name
    });

    // Reset
   setFile(null)
   setName("")
  };

  return (
    <div className="p-4 border rounded-lg max-w-md space-y-3">
      <h2 className="text-lg font-semibold">Upload Image</h2>

      <input
        type="text"
        placeholder="Enter image name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full border p-2 rounded"
      />

       <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0])}
      />

      

      

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
