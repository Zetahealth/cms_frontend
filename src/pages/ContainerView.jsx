// import React, { use, useEffect, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// // import {  } from "react-router-dom";
// import { NavLink, useNavigate ,useParams } from "react-router-dom";
// import Api from "../Api/Api";

// function ContainerView() {
//   const { slug } = useParams();
//   const token = sessionStorage.getItem("authToken");
//   const [container, setContainer] = useState(null);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const navigate = useNavigate();

//   const [showContantContainer , setShowContantContainer] = useState(false);
//   const [currentView , setCurrentView] = useState(null);

//   const [screenId , setScreenId] = useState(null);

//   useEffect(() => {
//     fetchContainer();
//   }, [slug]);

//   async function fetchContainer() {
//     try {
//       const res = await fetch(`${Api}/api/v1/screen_containers/${slug}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!res.ok) throw new Error(`Failed to fetch container: ${res.status}`);
//       const data = await res.json();
//       console.log("✅ Fetched container:", data);
//       setContainer(data);
//     } catch (err) {
//       console.error("❌ Error fetching container:", err);
//     }
//   }

//   if (!container) return <p className="text-white text-center mt-10">Loading...</p>;

//   const screens = container.screens || [];
//   const total = screens.length;

//   const nextSlide = () => {
//     setCurrentIndex((prev) => (prev + 1) % total);
//   };

//   const prevSlide = () => {
//     setCurrentIndex((prev) => (prev - 1 + total) % total);
//   };

//   const getPosition = (index) => {
//     const diff = (index - currentIndex + total) % total;
//     if (diff === 0) return "center";
//     if (diff === 1) return "right";
//     if (diff === total - 1) return "left";
//     return "hidden";
//   };

//   const transition = { duration: 0.8, ease: "easeInOut" };

//   const handleDirect = (e,id) => {
//     console.log("Clicked on container with id:", id);
//     e.preventDefault();
//     navigate(`/container/${id}`); // redirect to login page
//   };


//   const handleScreenView = (id,view) => {
//     // console.log("Navigating to screen view for screen index:", id);
//     // if (view == "normal-view") {
//     //   navigate(`/screen/${id}`);
//     // }else {
//       setScreenId(id);
//       setShowContantContainer(true);
//       setCurrentView(view);
//     // }


//   };

//   return (
//     <div
//       className="relative flex items-center justify-center h-screen overflow-hidden bg-black"
//       style={{
//         backgroundImage: `url(${container.background_url})`,
//         backgroundSize: "cover",
//         backgroundPosition: "center",
//       }}
//     >
//         <div className="absolute mr-15 top-4 right-4  px-4 py-2 rounded-md z-40 flex items-center justify-center"
//           onClick={(e)=>{handleDirect(e,container.id) ,setShowContantContainer(false)}}
//         >
//           <img
//               src={container.files?.[0]}
//               alt={container.name}
//               className="h-40 w-auto object-contain"
//           />
//         </div>
//         {!showContantContainer ? (
//             <>
//               {/* --- Screens --- */}
//               <div className="relative w-full h-full flex items-center justify-center mt-4">
                
//                 {screens.map((screen, index) => {
//                   const position = getPosition(index);

//                   let style = {
//                     position: "absolute",
//                     width: "45%",
//                     height: "55%",
//                     borderRadius: "12px",
//                     overflow: "hidden",
//                     boxShadow: "0px 0px 40px rgba(0,0,0,0.4)",
//                     transition: "all 0.8s ease",
//                   };

//                   if (position === "center") {
//                     style.transform = "translateX(0) scale(1)";
//                     style.zIndex = 30;
//                     style.opacity = 1;
//                   } else if (position === "left") {
//                     style.transform = "translateX(-280px) scale(0.85)";
//                     style.opacity = 0.5;
//                     style.zIndex = 20;
//                   } else if (position === "right") {
//                     style.transform = "translateX(280px) scale(0.85)";
//                     style.opacity = 0.5;
//                     style.zIndex = 20;
//                   } else {
//                     style.transform = "translateX(0px) scale(0.7)";
//                     style.opacity = 0;
//                     style.zIndex = 10;
//                   }

//                   return (
//                     <motion.div
//                       key={screen.id}
//                       style={style}
//                       initial={{ opacity: 0 }}
//                       animate={{ opacity: style.opacity }}
//                       transition={transition}
//                     >
//                       {screen.card_image_url ? (
//                         <img
//                           src={screen.card_image_url}
//                           alt={screen.name}
//                           className="w-full h-full object-cover bg-black/30 "
                        
//                         />
//                       ) : (
//                         <div className="bg-gray-800 w-full h-full flex items-center justify-center text-gray-300">
//                           No Background
//                         </div>
//                       )}

//                       {/* Centered Overlay Name */}
//                         <div className="absolute inset-0 flex items-center justify-center"
                        
//                         onClick={() => handleScreenView(screen.id , screen.display_mode)}
//                         >
//                         <div className="bg-black/50 px-6 py-3 rounded-md"
                          
//                         >
//                             <h2 className="text-3xl font-bold text-white text-center drop-shadow-lg">
//                             {screen.title}
//                             </h2>
//                         </div>
//                         </div>

//                     </motion.div>
//                   );
//                 })}
//               </div>

//               {/* --- Arrows --- */}
//               <button
//                 onClick={prevSlide}
//                 className="absolute left-10 text-white text-5xl bg-white/20 hover:bg-white/40 rounded-full w-20 h-20 flex items-center justify-center"
//               >
//                 ◀
//               </button>
//               <button
//                 onClick={nextSlide}
//                 className="absolute right-10 text-white text-5xl bg-white/20 hover:bg-white/40 rounded-full w-16 h-16 flex items-center justify-center"
//               >
//                 ▶
//               </button>

//               {/* --- Dots Indicator --- */}
//               {/* <div className="absolute bottom-8 flex gap-3">
//                 {screens.map((_, i) => (
//                   <div
//                     key={i}
//                     className={`w-4 h-4 rounded-full ${
//                       i === currentIndex ? "bg-white" : "bg-gray-500"
//                     }`}
//                   ></div>
//                 ))}
//               </div> */}
//             </>
//         ) : null}
//         {showContantContainer && (
//           <div className="absolute inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center p-6">
//             {screenId && (
//             <iframe
//               src={`/screen/${screenId}`}
//               title="Content Container"
//               className="w-full h-full rounded-lg shadow-lg border-0 border-white"
//             ></iframe>
//             )}
//           </div>
//         )}

//     </div>
//   );
// }

// export default ContainerView;

// import React, { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import { useNavigate, useParams } from "react-router-dom";
// import Api from "../Api/Api";
// import * as ActionCable from "@rails/actioncable";
// // const cable = ActionCable.createConsumer("ws://localhost:3000/cable");
// const cable = ActionCable.createConsumer("wss://backendafp.connectorcore.com/cable");


// function ContainerView() {
//   const { slug } = useParams();
//   const token = sessionStorage.getItem("authToken");
//   const [container, setContainer] = useState(null);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const navigate = useNavigate();

//   const [showContentContainer, setShowContentContainer] = useState(false);
//   const [screenId, setScreenId] = useState(null);
//   const [logoAnimated, setLogoAnimated] = useState(false);


//     useEffect(() => {
//       fetchContainer();
//       const subscription = cable.subscriptions.create(
//         { channel: "ContainerChannel", slug: slug },
//         {
//           received: (data) => {
//             if (data.action === "refresh") {
//               fetchContainer();
//             }
//           }
//         }
//       );
  
//       return () => subscription.unsubscribe();
//     }, [slug]);
  



//   async function fetchContainer() {
//     try {
//       const res = await fetch(`${Api}/api/v1/screen_containers/${slug}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const data = await res.json();
//       console.log("✅ Fetched container-----------------:", data);
//       setContainer(data);
//     } catch (err) {
//       console.error("❌ Error:", err);
//     }
//   }

//   if (!container) return <p className="text-white text-center mt-10">Loading...</p>;

//   const screens = container.screens || [];
//   const total = screens.length;

//   const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % total);
//   const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + total) % total);

//   const getPosition = (index) => {
//     const diff = (index - currentIndex + total) % total;
//     if (diff === 0) return "center";
//     if (diff === 1) return "right";
//     if (diff === total - 1) return "left";
//     return "hidden";
//   };

//   const transition = { duration: 0.7, ease: "easeInOut" };

//   const handleScreenView = (id, view) => {
//     setScreenId(id);
//     setShowContentContainer(true);
//   };

//   return (
//     <div
//       className="relative flex items-center justify-center h-screen overflow-hidden "
//       style={{
//         backgroundImage: `url(${container.background_url})`,
//         backgroundSize: "cover",
//         backgroundPosition: "center",
//       }}
//     >
//       {/* TOP RIGHT LOGO */}
      

//       {/* === SLIDER VIEW === */}
//       {!showContentContainer && (
//         <>
          // <div
          //   className={`absolute top-4 cursor-pointer ${logoAnimated ? "" : "logo-animate"}`}
          //   onAnimationEnd={() => setLogoAnimated(true)}
          //   onClick={() => {
          //     navigate(`/container/${container.id}`);
          //     setShowContentContainer(false);
          //   }}
          // >
          //   <img
          //     src={container.files?.[0]}
          //     alt={container.name}
          //     className="h-48 w-auto object-contain"
          //   />
          // </div>



//           <div className="relative w-full h-full flex items-center justify-center">

//             {screens.map((screen, index) => {
//               const position = getPosition(index);

//               // Container size
//               let style = {
//                 position: "absolute",
//                 width: "50vw",
//                 height: "55vh",
//                 borderRadius: "18px",
//                 overflow: "hidden",
//                 // background: "rgba(0,0,0,0.4)",
//                 // boxShadow: "0 0 40px rgba(0,0,0,0.5)",
//                 transform: "scale(0.7)",
//                 opacity: 0.4,
//                 zIndex: 10,
//                 transition: "all 0.7s",
//                 cursor: "pointer",
//               };

//               if (position === "center") {
//                 style.transform = "scale(1)";
//                 style.opacity = 1;
//                 style.zIndex = 40;
//               } else if (position === "left") {
//                 style.transform = "translateX(-320px) scale(0.85)";
//                 style.opacity = 0.6;
//                 style.zIndex = 20;
//               } else if (position === "right") {
//                 style.transform = "translateX(320px) scale(0.85)";
//                 style.opacity = 0.6;
//                 style.zIndex = 20;
//               }

//               const handleClick = () => {
//                 if (position === "left") prevSlide();
//                 if (position === "right") nextSlide();
//               };

//               return (
//                 <motion.div
//                   key={screen.id}
//                   style={style}
//                   onClick={handleClick}
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: style.opacity }}
//                   transition={transition}
//                 >
//                   {screen.card_image_url ? (
//                     <img
//                       src={screen.card_image_url}
//                       alt={screen.name}
//                       className="w-full h-full object-contain"
//                       style={{
//                         imageRendering: "high-quality",
//                       }}
//                     />
//                   ) : (
//                     <div className="bg-gray-600 w-full h-full flex items-center justify-center text-white">
//                       No Image
//                     </div>
//                   )}

//                   {/* --- Overlay Title --- */}
//                   <div
//                     className="absolute inset-0 flex items-center justify-center "
//                     onClick={() => handleScreenView(screen.id, screen.display_mode)}
//                   >
//                     <h2 className="text-3xl font-bold text-white drop-shadow-lg px-6 py-2 rounded-lg">
//                       {screen.title}
//                     </h2>
//                   </div>
//                 </motion.div>
//               );
//             })}
//           </div>

//           {/* ARROWS */}
//           <button
//             onClick={prevSlide}
//             className="absolute left-10 text-white text-5xl bg-black/50  rounded-full w-16 h-16 flex items-center justify-center"
//           >
//             ◀
//           </button>
//           <button
//             onClick={nextSlide}
//             className="absolute right-10 text-white text-5xl bg-black/50 rounded-full w-16 h-16 flex items-center justify-center"
//           >
//             ▶
//           </button>
//         </>
//       )}

//       {/* === CONTENT SHOW === */}
//       {showContentContainer && (
//         <div className="absolute inset-0 bg-black/90 flex items-center justify-center">
//           <iframe
//             src={`/screen/${screenId}`}
//             className="w-full h-full border-none"
//             title="Content"
//           ></iframe>
//         </div>
//       )}
//     </div>
//   );
// }

// export default ContainerView;

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import Api from "../Api/Api";
import * as ActionCable from "@rails/actioncable";

// WSS cable for production
// const cable = ActionCable.createConsumer("ws://localhost:3000/cable");
const cable = ActionCable.createConsumer("wss://backendafp.connectorcore.com/cable");

function ContainerView() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const token = sessionStorage.getItem("authToken");

  // -------------------------
  // HOOKS (fixed order)
  // -------------------------
  const [container, setContainer] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showContentContainer, setShowContentContainer] = useState(false);
  const [screenId, setScreenId] = useState(null);

  const [logoAnimated, setLogoAnimated] = useState(false);

  // -------------------------
  // DATA FETCH
  // -------------------------
  const fetchContainer = async () => {
    try {
      const res = await fetch(`${Api}/api/v1/screen_containers/${slug}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      console.log("✅ Fetched container:", data);
      setContainer(data);
    } catch (err) {
      console.error("❌ Error fetching container:", err);
    }
  };

  // Initial load + ActionCable subscription
  useEffect(() => {
    fetchContainer();

    const subscription = cable.subscriptions.create(
      { channel: "ContainerChannel", slug },
      {
        received: (data) => {
          if (data.action === "refresh") {
            fetchContainer();
          }
        },
      }
    );

    return () => subscription.unsubscribe();
  }, [slug]);

  if (!container) {
    return <p className="text-white text-center mt-10">Loading...</p>;
  }

  const screens = container.screens || [];
  const total = screens.length;

  // -------------------------
  // SLIDER LOGIC
  // -------------------------
  const nextSlide = () => {
    if (total <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  const prevSlide = () => {
    if (total <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  };

  const getPosition = (index) => {
    if (total === 0) return "hidden";
    const diff = (index - currentIndex + total) % total;
    if (diff === 0) return "center";
    if (diff === 1) return "right";
    if (diff === total - 1) return "left";
    return "hidden";
  };

  const transition = { duration: 0.7, ease: "easeInOut" };

  const handleScreenView = (id) => {
    setScreenId(id);
    setShowContentContainer(true);
  };

  // -------------------------
  // RENDER
  // -------------------------
  return (
    <div
      className="relative flex items-center justify-center h-screen overflow-hidden"
      style={{
        backgroundImage: `url(${container.background_url})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >


      {/* LOGO – centered at top, above slider */}
      {!showContentContainer && (
        // <div
        //   className="absolute top-4 md:top-6 w-full flex justify-center z-[200] cursor-pointer"
        //   onClick={() => navigate(`/container/${container.id}`)}
        // >
        //   <img
        //     src={container.files?.[0]}
        //     alt={container.name}
        //     className="h-24 md:h-32 lg:h-40 w-auto object-cover drop-shadow-2xl"
        //   />
        // </div>

         <div
            className={`absolute top-4 md:top-6 w-full flex justify-center z-[200] cursor-pointer ${logoAnimated ? "" : "logo-animate"}`}
            onAnimationEnd={() => setLogoAnimated(true)}
            onClick={() => {
              navigate(`/container/${container.id}`);
              setShowContentContainer(false);
            }}
          >
            <img
              src={container.files?.[0]}
              alt={container.name}
              className="h-24 md:h-32 lg:h-40 w-auto object-cover drop-shadow-2xl"
            />
          </div>


      )}





      {/* SLIDER VIEW */}
      {!showContentContainer && (
        <div className="relative w-full h-full flex items-center justify-center">
          {screens.map((screen, index) => {
            const position = getPosition(index);

            if (position === "hidden") return null;

            let style = {
              position: "absolute",
              width: "80vw",
              maxWidth: "600px",
              height: "45vh",
              maxHeight: "380px",
              borderRadius: "12px",
              overflow: "hidden",
              transition: "all 0.6s ease",
              opacity: 0.4,
              zIndex: 10,
              filter: "grayscale(10%)",
            };
            
            if (position === "center") {
              style.transform = "scale(1)";
              style.opacity = 1;
              style.zIndex = 40;
            } else if (position === "left") {
              style.transform = "translateX(-32vw) scale(0.85)";
              style.opacity = 0.6;
              style.zIndex = 20;
            } else if (position === "right") {
              style.transform = "translateX(32vw) scale(0.85)";
              style.opacity = 0.6;
              style.zIndex = 20;
            }

            const handleSlideClick = () => {
              if (position === "left") prevSlide();
              else if (position === "right") nextSlide();
              // if center → we don't change slide here (only title overlay opens view)
            };

            return (
              <motion.div
                key={screen.id}
                style={style}
                onClick={handleSlideClick}
                initial={{ opacity: 0 }}
                animate={{ opacity: style.opacity }}
                transition={transition}
              >
                {screen.card_image_url ? (
                  <img
                    src={screen.card_image_url}
                    alt={screen.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-black/70 flex items-center justify-center text-white">
                    No Image
                  </div>
                )}

                {/* Title overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <h2 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg text-center px-4">
                    {screen.title}
                  </h2>

                  {/* Clickable only on CENTER slide to open content */}
                  {position === "center" && (
                    <div
                      className="absolute inset-0 cursor-pointer pointer-events-auto"
                      onClick={(e) => {
                        e.stopPropagation(); // don't trigger slide change
                        handleScreenView(screen.id);
                      }}
                    />
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* CONTENT VIEW (IFRAME) */}
      {showContentContainer && (
        <div className="absolute inset-0 bg-black/90 flex items-center justify-center">
          <iframe
            src={`/screen/${screenId}`}
            className="w-full h-full border-none"
            title="Content"
          ></iframe>
        </div>
      )}
    </div>
  );
}

export default ContainerView;
