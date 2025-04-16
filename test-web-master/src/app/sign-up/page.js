"use client";
import { useState, useEffect, useRef } from "react"; // เพิ่ม useRef
import { useRouter } from "next/navigation";

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [countryCode, setCountryCode] = useState("+66"); // รหัสประเทศเริ่มต้น
  const [phoneNumber, setPhoneNumber] = useState(""); // เบอร์โทรศัพท์
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State สำหรับควบคุมการเปิด-ปิด Dropdown
  const dropdownRef = useRef(null); // Ref สำหรับ Dropdown
  const router = useRouter();

  // ใช้ useEffect เพื่อซ่อน Pop-up หลังจาก 5 วินาที
  useEffect(() => {
    if (showPopup) {
      const timer = setTimeout(() => {
        setShowPopup(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showPopup]);

  // ตรวจสอบการคลิกนอกพื้นที่ Dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false); // ปิด Dropdown เมื่อคลิกนอกพื้นที่
      }
    };

    // เพิ่ม Event Listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // ลบ Event Listener เมื่อคอมโพเนนต์ถูกทำลาย
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // ตรวจสอบเบอร์โทรศัพท์
  function validatePhoneNumber(phone) {
    const errors = [];
    if (!phone.trim()) {
      errors.push("Phone number is required.");
    } else if (!/^\d+$/.test(phone)) {
      errors.push("Phone number must contain only numbers.");
    } else if (phone.length < 9 || phone.length > 12) {
      errors.push("Phone number must be 9-12 digits long.");
    }
    return errors;
  }

  function ValidateName(name) {
    let errors = [];
    if (!/^[a-z]/.test(name)) {
      errors.push("Username must start with a lowercase letter.");
      return errors;
    }
    if (name.length < 10 || name.length > 24) {
      errors.push("Username must be 10-24 characters long.");
      return errors;
    }
    if (!/^[a-zA-Z0-9]+$/.test(name)) {
      errors.push("Username must contain only English letters and numbers.");
      return errors;
    }
    if (/[^\x00-\x7F]/.test(name)) {
      errors.push(
        "Username must contain only English characters (no other languages)."
      );
      return errors;
    }
    if (/[!@#$%^&*]/.test(name)) {
      errors.push("Username must not contain any special characters.");
      return errors;
    }
    return errors;
  }

  function ValidatePassword(password) {
    let errors = [];
    if (!/(?=.*[a-z])/.test(password)) {
      errors.push("Password must include at least one lowercase letter.");
      return errors;
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push("Password must include at least one uppercase letter.");
      return errors;
    }
    if (!/(?=.*[0-9])/.test(password)) {
      errors.push("Password must include at least one number.");
      return errors;
    }
    if (!/(?=.*[!@#$%^&*])/.test(password)) {
      errors.push("Password must include at least one special character.");
      return errors;
    }
    if (password.length < 16 || password.length > 32) {
      errors.push("Password must be 16-32 characters long.");
      return errors;
    }
    if (/[^\x00-\x7F]/.test(password)) {
      errors.push(
        "Password must contain only English characters (no other languages)."
      );
      return errors;
    }
    return errors;
  }

  function handleSubmit(e) {
    e.preventDefault();
    setErrors([]); // เคลียร์ errors ก่อนตรวจสอบ

    const name = e.target.name.value;
    const password = e.target.password.value;
    const confirm_password = e.target.confirm_password.value;
    const phone = e.target.phone.value;

    // ตรวจสอบว่าฟิลด์ว่างหรือไม่
    if (
      !name.trim() ||
      !password.trim() ||
      !confirm_password.trim() ||
      !phone.trim()
    ) {
      setErrors(["Please fill out all fields."]);
      setShowPopup(true);
      return;
    }

    const nameErrors = ValidateName(name);
    const passwordErrors = ValidatePassword(password);
    const phoneErrors = validatePhoneNumber(phone);

    if (
      nameErrors.length > 0 ||
      passwordErrors.length > 0 ||
      phoneErrors.length > 0
    ) {
      setErrors([...nameErrors, ...passwordErrors, ...phoneErrors]);
      setShowPopup(true);
      return;
    }

    if (password !== confirm_password) {
      setErrors(["Password and Confirm Password do not match."]);
      setShowPopup(true);
      return;
    }

    // บันทึก username ลงใน localStorage ก่อน redirect
    localStorage.setItem("savedUsername", name);

    alert("You have successfully signed up!");
    router.push("/?focusField=password");
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      {/* Pop-up สำหรับแสดงข้อผิดพลาด */}
      {showPopup && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            backgroundColor: "#f8d7da",
            color: "#721c24",
            padding: "16px",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            zIndex: 1000,
            animation: "slideIn 0.5s ease-out",
          }}
        >
          <ul>
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <button
          className="flex items-center justify-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
          onClick={() => router.push("/")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Back
        </button>
        <h2 className="mt-5 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
          Sign Up to your account
        </h2>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Username Field */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm/6 font-medium text-gray-900"
            >
              Username
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="name"
                id="username"
                autoComplete="name"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Password
              </label>
            </div>
            <div className="mt-2 relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                autoComplete="current-password"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.98 8.223A10.477 10.477 0 001.934 12c1.292 4.338 5.31 7.5 10.066 7.5.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.774 3.162 10.066 7.5a10.523 10.523 0 01-4.064 5.066M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="confirm_password"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Confirm Password
              </label>
            </div>
            <div className="mt-2 relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirm_password"
                id="confirm_password"
                autoComplete="current-password"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
              >
                {showConfirmPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.98 8.223A10.477 10.477 0 001.934 12c1.292 4.338 5.31 7.5 10.066 7.5.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.774 3.162 10.066 7.5a10.523 10.523 0 01-4.064 5.066M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Phone Number Field */}
          <div>
            <label
              htmlFor="phone"
              className="block text-sm/6 font-medium text-gray-900"
            >
              Phone Number
            </label>
            <div className="mt-2 flex">
              {/* Dropdown สำหรับเลือกรหัสประเทศ */}
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  className="inline-flex justify-center items-center w-24 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-l-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)} // เปิด-ปิด Dropdown
                >
                  {countryCode}
                  <svg
                    className="w-5 h-5 ml-2 -mr-1"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-                      1.414z"
                    />
                  </svg>
                </button>
                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute z-10 mt-1 w-56 origin-top-right bg-white border border-gray-200 rounded-md shadow-lg">
                    <div className="py-1">
                      <button
                        type="button"
                        className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          setCountryCode("+66"); // เลือกรหัสประเทศไทย
                          setIsDropdownOpen(false); // ปิด Dropdown
                        }}
                      >
                        +66 (Thailand)
                      </button>
                      <button
                        type="button"
                        className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          setCountryCode("+1"); // เลือกรหัสสหรัฐอเมริกา
                          setIsDropdownOpen(false); // ปิด Dropdown
                        }}
                      >
                        +1 (United States)
                      </button>
                      <button
                        type="button"
                        className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          setCountryCode("+44"); // เลือกรหัสสหราชอาณาจักร
                          setIsDropdownOpen(false); // ปิด Dropdown
                        }}
                      >
                        +44 (United Kingdom)
                      </button>
                      {/* เพิ่มรหัสประเทศอื่น ๆ ตามต้องการ */}
                    </div>
                  </div>
                )}
              </div>

              {/* ช่องกรอกเบอร์โทรศัพท์ */}
              <input
                type="tel"
                name="phone"
                id="phone"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                autoComplete="tel"
                className="flex-1 block w-full rounded-r-md border border-gray-300 px-3 py-2 text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="123-456-7890"
              />
            </div>
          </div>

          {/* ปุ่ม Sign Up */}
          <div>
            <button
              type="submit"
              id="button-login"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
