"use client";
import Image from "next/image";
import Link from "next/link";
import Logo from "../../public/cat.jpeg";
import { useState, useEffect, useRef } from "react"; // เพิ่ม useEffect

export default function Home() {
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState([]);
  const [showPopup, setShowPopup] = useState(false); // State สำหรับควบคุมการแสดง Pop-up
  const [username, setUsername] = useState("");
  const passwordRef = useRef(null); // สร้าง ref สำหรับช่อง password

  // ใช้ useEffect เพื่อซ่อน Pop-up หลังจาก 5 วินาที
  useEffect(() => {
    const savedUsername = localStorage.getItem("savedUsername");
    if (savedUsername) {
      setUsername(savedUsername);
      localStorage.removeItem("savedUsername");
    }

    // โฟกัสที่ช่อง password ทุกครั้ง
    const focusTimer = setTimeout(() => {
      if (passwordRef.current) {
        passwordRef.current.focus();
        if (savedUsername) {
          passwordRef.current.select();
        }
      }
    }, 150);

    // จัดการ popup timer
    if (showPopup) {
      const popupTimer = setTimeout(() => {
        setShowPopup(false);
      }, 5000);
      return () => {
        clearTimeout(focusTimer);
        clearTimeout(popupTimer);
      };
    }

    return () => clearTimeout(focusTimer);
  }, [showPopup]);

  function ValidateName(name) {
    let errors = [];
    if (!/^[a-z]/.test(name)) {
      errors.push("Username must start with a lowercase letter.");
      return errors; // หยุดการทำงานทันที
    }
    if (name.length < 10 || name.length > 24) {
      errors.push("Username must be 10-24 characters long.");
      return errors; // หยุดการทำงานทันที
    }
    if (!/^[a-zA-Z0-9]+$/.test(name)) {
      errors.push("Username must contain only English letters and numbers.");
      return errors; // หยุดการทำงานทันที
    }
    if (/[^\x00-\x7F]/.test(name)) {
      errors.push(
        "Username must contain only English characters (no other languages)."
      );
      return errors; // หยุดการทำงานทันที
    }
    if (/[!@#$%^&*]/.test(name)) {
      errors.push("Username must not contain any special characters.");
      return errors; // หยุดการทำงานทันที
    }
    return errors;
  }

  function ValidatePassword(password) {
    let errors = [];
    if (!/(?=.*[a-z])/.test(password)) {
      errors.push("Password must include at least one lowercase letter.");
      return errors; // หยุดการทำงานทันที
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push("Password must include at least one uppercase letter.");
      return errors; // หยุดการทำงานทันที
    }
    if (!/(?=.*[0-9])/.test(password)) {
      errors.push("Password must include at least one number.");
      return errors; // หยุดการทำงานทันที
    }
    if (!/(?=.*[!@#$%^&*])/.test(password)) {
      errors.push("Password must include at least one special character.");
      return errors; // หยุดการทำงานทันที
    }
    if (password.length < 16 || password.length > 32) {
      errors.push("Password must be 16-32 characters long.");
      return errors; // หยุดการทำงานทันที
    }
    if (/[^\x00-\x7F]/.test(password)) {
      errors.push(
        "Password must contain only English characters (no other languages)."
      );
      return errors; // หยุดการทำงานทันที
    }
    return errors;
  }

  function handleSubmit(e) {
    e.preventDefault();
    setErrors([]); // เคลียร์ errors ก่อนตรวจสอบ

    const name = e.target.name.value;
    const password = e.target.password.value;

    // ตรวจสอบว่าฟิลด์ว่างหรือไม่
    if (!name.trim() || !password.trim()) {
      setErrors(["Please fill out all fields."]);
      setShowPopup(true); // แสดง Pop-up
      return; // หยุดการทำงานทันทีหากพบข้อผิดพลาด
    }

    const nameErrors = ValidateName(name);
    const passwordErrors = ValidatePassword(password);

    if (nameErrors.length > 0 || passwordErrors.length > 0) {
      setErrors([...nameErrors, ...passwordErrors]);
      setShowPopup(true); // แสดง Pop-up
      return; // หยุดการทำงานทันทีหากพบข้อผิดพลาด
    }

    alert("You have successfully signed in!");
    window.location.href =
      "https://shopee.co.th/lg_officialstore?is_from_login=true";
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      {/* Pop-up สำหรับแสดงข้อผิดพลาด */}
      {showPopup && (
        <div
          style={{
            position: "fixed",
            top: "20px", // เปลี่ยนจาก bottom เป็น top
            right: "20px", // ยังคงอยู่ด้านขวา
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
        <Image
          className="mx-auto rounded-2xl"
          src={Logo}
          alt="Your Company"
          width={200}
          height={200}
        />
        <h2 className="mt-5 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
          Sign in to your account
        </h2>

        <form
          className="space-y-6"
          action="#"
          method="POST"
          onSubmit={handleSubmit}
        >
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
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)} // อัปเดต state เมื่อมีการเปลี่ยนแปลง
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Password
              </label>
              <div className="text-xs">
                <Link
                  href="https://shopee.co.th/buyer/reset"
                  id="button-forget-password"
                  className="font-semibold text-indigo-600 hover:text-indigo-500"
                >
                  Forget password?
                </Link>
              </div>
            </div>
            <div className="mt-2 relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                ref={passwordRef} // กำหนด ref ให้กับช่อง password
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

          <div>
            <button
              type="submit"
              id="button-login"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Sign in
            </button>
          </div>
        </form>
        <div className="mt-6 text-center text-sm text-gray-600">
          Don&apos;t have an account?
          <Link
            href="/sign-up"
            className="text-indigo-600 hover:text-indigo-500 font-medium"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
