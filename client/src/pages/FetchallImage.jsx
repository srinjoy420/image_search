import {useEffect} from "react"
import { useImageStore } from "@/store/imageStore";

const FetchallImage = () => {
    const {images,isFetchingImages,fetchingallImages}=useImageStore()

    useEffect(() => {
    fetchingallImages();
  }, []);

    if(isFetchingImages){
        return <p className="text-center">LOading  Images</p>
    }
    if(images.length===0){
        return <p className="text-center">no images</p>
    }
  return (
     <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
      {images.map((img) => (
        <div key={img._id} className="border rounded overflow-hidden">
          <img
            src={img.url}
            alt={img.name}
            className="w-full h-48 object-cover"
          />
          <div className="p-2">
            <p className="text-sm font-medium truncate">{img.name}</p>
            <p className="text-xs text-gray-500">
              by {img.addedby?.name}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default FetchallImage