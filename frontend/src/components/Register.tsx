import React, { useState } from "react";
import { motion } from "framer-motion";
import bg from "../assets/5091624-hd_1920_1080_24fps.mp4"; // Path to your video

const RegistrationForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    dateOfBirth: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false); // Track form submission

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log("Form submitted:", formData);
      setIsSubmitted(true); // Trigger explosion animation on form submit
    } catch (err) {
      setError("Invalid credentials " + err);
    }
  };

  return (
    <div className="relative w-full min-h-screen">
      {/* Background Video */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        autoPlay
        loop
        muted
      >
        <source src={bg} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay to apply backdrop blur and gradient */}
      <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 backdrop-blur-sm z-10"></div>

      <div className="w-screen min-h-screen flex items-center justify-center bg-transparent backdrop-blur-sm relative z-20">
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 1, y: 0 }}
          animate={
            isSubmitted
              ? {
                  opacity: 0,
                  scale: 0,
                  transition: { duration: 1, ease: "easeInOut", delay: 0.1 },
                }
              : { opacity: 1, scale: 1 }
          }
          transition={{ duration: 0.5 }}
          className="max-w-sm mx-auto mt-10 p-6 rounded-lg bg-transparent border shadow-white backdrop-blur-xl overflow-hidden sm:max-w-md md:max-w-lg lg:max-w-xl"
        >
          <motion.h2
            className="text-2xl font-bold text-white mb-4"
            initial={{ scale: 0.8 }}
            animate={isSubmitted ? { x: [-50, 50], opacity: 0 } : { scale: 1 }}
            transition={{ duration: 0.5, ease: "easeInOut", delay: 0.1 }}
          >
            Register
          </motion.h2>
          {error && (
            <motion.div
              className="text-red-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeInOut", delay: 0.1 }}
            >
              {error}
            </motion.div>
          )}
          <motion.input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            className="w-full mb-4 p-2 border rounded"
            required
            animate={
              isSubmitted
                ? { x: [-100, 100], opacity: 0, scale: 1.5 }
                : { opacity: 1, scale: 1 }
            }
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
          />
          <motion.input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            placeholder="Date of Birth"
            className="w-full mb-4 p-2 border rounded"
            required
            animate={
              isSubmitted
                ? { x: [100, -100], opacity: 0, scale: 1.5 }
                : { opacity: 1, scale: 1 }
            }
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
          />
          <motion.input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full mb-4 p-2 border rounded"
            required
            animate={
              isSubmitted
                ? { x: [-100, 100], opacity: 0, scale: 1.5 }
                : { opacity: 1, scale: 1 }
            }
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
          />
          <motion.input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full mb-4 p-2 border rounded"
            required
            animate={
              isSubmitted
                ? { x: [100, -100], opacity: 0, scale: 1.5 }
                : { opacity: 1, scale: 1 }
            }
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
          />
          <motion.button
            type="submit"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-full bg-blue-500 text-white py-2 rounded"
            animate={
              isSubmitted
                ? { scale: 2, opacity: 0, rotate: 45 }
                : { opacity: 1, scale: 1 }
            }
            transition={{ duration: 0.5, ease: "easeInOut", delay: 0.2 }}
          >
            Register
          </motion.button>
        </motion.form>
      </div>
    </div>
  );
};

export default RegistrationForm;