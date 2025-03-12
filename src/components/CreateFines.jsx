import React, { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import InputField from "./InputField";
import CameraComponent from "./CameraComponent";
import { useNavigate } from "react-router-dom"; 
import fetchData from "../utils/fetchData";

const CreateFines = () => {
  const navigate = useNavigate(); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState([]);

  // States for photos
  const [vehicleImagePath, setVehicleImagePath] = useState(null);

  // Form data structure
  const [formData, setFormData] = useState({
    RulingDecisionNum: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const errors = [];
    if (!vehicleImagePath) {
      errors.push('صورة السيارة الأصلية مطلوبة');
    }
    if (!formData.RulingDecisionNum) {
      errors.push('رقم قرار الحكم مطلوب');
    }
    setFormErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      const formDataToSend = new FormData();

      if (vehicleImagePath) {
        formDataToSend.append('VehicleImagePath', vehicleImagePath, 'vehicleImagePath.png');
      }
      formDataToSend.append('RulingDecisionNum', formData.RulingDecisionNum);

      const result = await fetchData('user/create-new-fine', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!result.isSuccess) {
        const errorMessages = result.errors ? result.errors.map(error => error.message) : ['حدث خطأ غير متوقع'];
        setFormErrors(errorMessages);
        return;
      }

      navigate('/fines', { state: { success: true } }); 
    } catch (error) {
      console.error('Error:', error);
      setFormErrors(['فشل في الاتصال بالخادم: ' + error.message]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVehicleImage = ({ croppedImage }) => {
    setVehicleImagePath(croppedImage);
  };

  return (
    <div className="bg-white p-4 rounded-2xl shadow-xl" dir="rtl">
      <div className="border-b flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">إنشاء غرامة جديدة</h1>
        <button onClick={() => navigate("/fines")} className="p-2 hover:bg-gray-100 rounded-lg transition-all">
          <XMarkIcon className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      {/* Form content */}
      <div className="p-6 flex-1 overflow-y-auto">
        {formErrors.length > 0 && (
          <div className="mb-4 p-3 bg-red-100 text-red-600 rounded-lg">
            <ul className="list-disc pr-4">
              {formErrors.map((error, i) => (
                <li key={i}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="space-y-4">
          <div className="bg-blue-100 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-blue-700">صورة السيارة</h3>
            <CameraComponent setPhoto={handleVehicleImage} />
          </div>
          <div className="bg-blue-100 p-4 rounded-lg shadow-md">
            <label className="block text-sm font-medium text-blue-700 mb-1">
              رقم قرار الحكم
            </label>
            <InputField 
              name="RulingDecisionNum"
              value={formData.RulingDecisionNum}
              onChange={handleChange}
              required
              className="bg-yellow-200 text-black border-2 border-yellow-500 focus:ring-2 focus:ring-yellow-400 focus:bg-yellow-300 shadow-lg transition duration-200 ease-in-out w-full" 
              placeholder="أدخل رقم قرار الحكم هنا"
              style={{ padding: '10px', borderRadius: '5px' }}
            />
          </div>
        </div>
      </div>

      {/* Submit button */}
      <div className="p-6 border-t flex justify-end bg-white">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="px-4 py-2 bg-green-500 text-white rounded-lg disabled:opacity-50 hover:bg-green-600 transition-all"
        >
          {isSubmitting ? 'جاري الإرسال...' : 'تسجيل الغرامة'}
        </button>
      </div>
    </div>
  );
};

export default CreateFines;