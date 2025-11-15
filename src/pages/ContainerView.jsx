import React, { use, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
// import {  } from "react-router-dom";
import { NavLink, useNavigate ,useParams } from "react-router-dom";
import Api from "../Api/Api";

function ContainerView() {
  const { slug } = useParams();
  const token = sessionStorage.getItem("authToken");
  const [container, setContainer] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  const [showContantContainer , setShowContantContainer] = useState(false);
  const [currentView , setCurrentView] = useState(null);

  const [screenId , setScreenId] = useState(null);

  useEffect(() => {
    fetchContainer();
  }, [slug]);

  async function fetchContainer() {
    try {
      const res = await fetch(`${Api}/api/v1/screen_containers/${slug}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Failed to fetch container: ${res.status}`);
      const data = await res.json();
      console.log("✅ Fetched container:", data);
      setContainer(data);
    } catch (err) {
      console.error("❌ Error fetching container:", err);
    }
  }

  if (!container) return <p className="text-white text-center mt-10">Loading...</p>;

  const screens = container.screens || [];
  const total = screens.length;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  };

  const getPosition = (index) => {
    const diff = (index - currentIndex + total) % total;
    if (diff === 0) return "center";
    if (diff === 1) return "right";
    if (diff === total - 1) return "left";
    return "hidden";
  };

  const transition = { duration: 0.8, ease: "easeInOut" };

  const handleDirect = (e,id) => {
    console.log("Clicked on container with id:", id);
    e.preventDefault();
    navigate(`/container/${id}`); // redirect to login page
  };


  const handleScreenView = (id,view) => {
    // console.log("Navigating to screen view for screen index:", id);
    // if (view == "normal-view") {
    //   navigate(`/screen/${id}`);
    // }else {
      setScreenId(id);
      setShowContantContainer(true);
      setCurrentView(view);
    // }


  };

  return (
    <div
      className="relative flex items-center justify-center h-screen overflow-hidden bg-black"
      style={{
        backgroundImage: `url(${container.background_url})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
        <div className="absolute mr-15 top-4 right-4  px-4 py-2 rounded-md z-40 flex items-center justify-center"
          onClick={(e)=>{handleDirect(e,container.id) ,setShowContantContainer(false)}}
        >
          <img
              src={container.files?.[0]}
              alt={container.name}
              className="h-40 w-auto object-contain"
          />
        </div>
        {!showContantContainer ? (
            <>
              {/* --- Screens --- */}
              <div className="relative w-full h-full flex items-center justify-center mt-4">
                
                {screens.map((screen, index) => {
                  const position = getPosition(index);

                  let style = {
                    position: "absolute",
                    width: "45%",
                    height: "55%",
                    borderRadius: "12px",
                    overflow: "hidden",
                    boxShadow: "0px 0px 40px rgba(0,0,0,0.4)",
                    transition: "all 0.8s ease",
                  };

                  if (position === "center") {
                    style.transform = "translateX(0) scale(1)";
                    style.zIndex = 30;
                    style.opacity = 1;
                  } else if (position === "left") {
                    style.transform = "translateX(-280px) scale(0.85)";
                    style.opacity = 0.5;
                    style.zIndex = 20;
                  } else if (position === "right") {
                    style.transform = "translateX(280px) scale(0.85)";
                    style.opacity = 0.5;
                    style.zIndex = 20;
                  } else {
                    style.transform = "translateX(0px) scale(0.7)";
                    style.opacity = 0;
                    style.zIndex = 10;
                  }

                  return (
                    <motion.div
                      key={screen.id}
                      style={style}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: style.opacity }}
                      transition={transition}
                    >
                      {screen.card_image_url ? (
                        <img
                          src={screen.card_image_url}
                          alt={screen.name}
                          className="w-full h-full object-cover bg-black/30 "
                        
                        />
                      ) : (
                        <div className="bg-gray-800 w-full h-full flex items-center justify-center text-gray-300">
                          No Background
                        </div>
                      )}

                      {/* Centered Overlay Name */}
                        <div className="absolute inset-0 flex items-center justify-center"
                        
                        onClick={() => handleScreenView(screen.id , screen.display_mode)}
                        >
                        <div className="bg-black/50 px-6 py-3 rounded-md"
                          
                        >
                            <h2 className="text-3xl font-bold text-white text-center drop-shadow-lg">
                            {screen.title}
                            </h2>
                        </div>
                        </div>

                    </motion.div>
                  );
                })}
              </div>

              {/* --- Arrows --- */}
              <button
                onClick={prevSlide}
                className="absolute left-10 text-white text-5xl bg-white/20 hover:bg-white/40 rounded-full w-20 h-20 flex items-center justify-center"
              >
                ◀
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-10 text-white text-5xl bg-white/20 hover:bg-white/40 rounded-full w-16 h-16 flex items-center justify-center"
              >
                ▶
              </button>

              {/* --- Dots Indicator --- */}
              {/* <div className="absolute bottom-8 flex gap-3">
                {screens.map((_, i) => (
                  <div
                    key={i}
                    className={`w-4 h-4 rounded-full ${
                      i === currentIndex ? "bg-white" : "bg-gray-500"
                    }`}
                  ></div>
                ))}
              </div> */}
            </>
        ) : null}
        {showContantContainer && (
          <div className="absolute inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center p-6">
            {screenId && (
            <iframe
              src={`/screen/${screenId}`}
              title="Content Container"
              className="w-full h-full rounded-lg shadow-lg border-0 border-white"
            ></iframe>
            )}
          </div>
        )}

    </div>
  );
}

export default ContainerView;
