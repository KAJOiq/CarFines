import React, { useRef, useEffect, useState } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

const CameraComponent = ({ setPhoto }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const cropperRef = useRef(null);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [successMessage, setSuccessMessage] = useState(""); 
  const [croppedImage, setCroppedImage] = useState(null);

  const dataURLtoFile = (dataURL, filename) => {
    if (!dataURL || typeof dataURL !== 'string') {
      throw new Error('Invalid dataURL');
    }

    const arr = dataURL.split(',');
    if (arr.length < 2 || !arr[0].startsWith('data:image')) {
      throw new Error('Invalid dataURL format');
    }

    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const getCroppedImg = (imageSrc, cropper) => {
    return new Promise((resolve) => {
      const canvas = cropper.getCroppedCanvas();
      if (canvas) {
        const dataURL = canvas.toDataURL('image/png');
        resolve(dataURL);
      } else {
        resolve(null);
      }
    });
  };

  const startCamera = async () => {
    try {
      const constraints = {
        video: {
          facingMode: "environment" 
        }
      };
  
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      mediaStreamRef.current = stream;
  
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
  
      setCameraEnabled(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
      setCameraEnabled(false);
    }
  };  

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
  };

  const captureImage = () => {
    console.log(cameraEnabled);
    const canvas = canvasRef.current;
    const video = videoRef.current;
  
    if (canvas && video) {
      const context = canvas.getContext("2d");
      const width = video.videoWidth;
      const height = video.videoHeight;
      canvas.width = width;
      canvas.height = height;
      context.drawImage(video, 0, 0, width, height);
  
      const imageUrl = canvas.toDataURL("image/png");
      setImageSrc(imageUrl);
      setIsEditing(true);
    }
  };
  

  const saveCroppedPhoto = async () => {
    try {
      const cropper = cropperRef.current.cropper;
      const croppedImageDataURL = await getCroppedImg(imageSrc, cropper);

      if (!croppedImageDataURL) {
        throw new Error('Failed to crop image');
      }

      if (!croppedImageDataURL.startsWith('data:image')) {
        throw new Error('Invalid dataURL format');
      }

      const croppedImageFile = dataURLtoFile(croppedImageDataURL, 'croppedImage.png');
      const fullImageFile = dataURLtoFile(imageSrc, 'fullImage.png');

      setPhoto({
        fullImage: fullImageFile,
        croppedImage: croppedImageFile,
      });

      setCroppedImage(croppedImageDataURL);
      setIsEditing(false);
      setSuccessMessage("تم حفظ الصورة بنجاح!"); 
      setTimeout(() => setSuccessMessage(""), 3000); 
    } catch (error) {
      console.error('Error saving cropped photo:', error);
      alert('فشل في حفظ الصورة المقصوصة: ' + error.message);
    }
  };

  useEffect(() => {
    const handleDeviceChange = async () => {
      try {
        stopCamera();
        await startCamera();
      } catch (error) {
        console.error("Error handling device change:", error);
      }
    };

    navigator.mediaDevices.addEventListener("devicechange", handleDeviceChange);
    startCamera();

    return () => {
      navigator.mediaDevices.removeEventListener("devicechange", handleDeviceChange);
      stopCamera();
    };
  }, []);

  return (
    <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg shadow-md">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="border-2 border-gray-300 rounded-lg w-full max-w-md h-54 object-cover" 
      ></video>

      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>

      <button
        type="button"
        className={`px-4 py-1 rounded-lg mt-2 text-lg text-white font-extrabold transition-all ${
          cameraEnabled
            ? "bg-green-500 hover:bg-green-600"
            : "bg-gray-400 cursor-not-allowed"
        }`} 
        onClick={captureImage}
        disabled={!cameraEnabled}
      >
        التقاط الصورة
      </button>

      {isEditing && (
        <div className="w-full max-w-md mt-2">
          <div className="relative w-full h-[300px] bg-gray-200 rounded-lg overflow-hidden"> 
            <Cropper
              src={imageSrc}
              style={{ height: "100%", width: "100%" }}
              aspectRatio={4/3}
              guides={false}
              ref={cropperRef}
              viewMode={1}
              movable={false} 
              zoomable={false} 
              rotatable={false} 
              scalable={false} 
              background={false}
              cropBoxResizable={false}
              cropBoxMovable={true}
              dragMode={"none"} 
            />
          </div>
          <button
            type="button"
            className="w-full px-4 py-1 mt-2 bg-blue-500 text-lg text-white font-extrabold rounded-lg hover:bg-blue-600 transition-all" // تم تصغير حجم الزر
            onClick={saveCroppedPhoto}
          >
            حفظ الصورة الملتقطة
          </button>
        </div>
      )}

      {successMessage && (
        <div className="mt-2 text-sm text-green-600 font-semibold">
          {successMessage}
        </div>
      )}

      {croppedImage && (
        <div className="mt-2">
          <h2 className="text-sm font-semibold">الصورة المقتطعة:</h2> 
          <img src={croppedImage} alt="Cropped" className="mt-1 border-2 border-gray-300 rounded-lg w-26" />
        </div>
      )}
    </div>
  );
};

export default CameraComponent;