const fetchData = async (url, options = {}, headers = {}) => {
    const token = localStorage.getItem("accessToken");
    const isFormData = options.body instanceof FormData;
    const defaultHeaders = {
      Authorization: `Bearer ${token}`,
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...headers,
    };
    
   const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  // console.log("API Base URL:", apiBaseUrl); // Debugging: Log the API base URL

  const response = await fetch(`${apiBaseUrl}${url}`, {
    ...options,
      headers: defaultHeaders,
    });

/*     if (response.status === 401) {
      localStorage.setItem("sessionExpired", "انتهت صلاحية الجلسة، يرجى تسجيل الدخول");

      localStorage.removeItem("accessToken");
      localStorage.removeItem("role");
      localStorage.removeItem("userName");
      window.location.href = "/login";
  
        return { isSuccess: false, message: "انتهت صلاحية الجلسة، سيتم إعادة التوجيه..." };
    }  */

    const text = await response.text();
    return text ? JSON.parse(text) : {};
  };
  
  export default fetchData;
  