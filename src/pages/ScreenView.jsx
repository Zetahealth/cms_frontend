// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import Api from "../Api/Api";
// import * as ActionCable from "@rails/actioncable";
// import { motion, AnimatePresence } from "framer-motion";

// const cable = ActionCable.createConsumer("ws://localhost:3000/cable");

// function ScreenView() {
//   const { slug } = useParams();
//   const navigate = useNavigate();
//   const token = sessionStorage.getItem("authToken");

//   const [contents, setContents] = useState([]);
//   const [background, setBackground] = useState(null);
//   const [nextScreenId, setNextScreenId] = useState(null);
//   const [prevScreenId, setPrevScreenId] = useState(null);

//   // 🎬 Transition styles mapping
  // const transitionVariants = {
  //   fade: {
  //     initial: { opacity: 0 },
  //     animate: { opacity: 1 },
  //     exit: { opacity: 0 },
  //   },
  //   zoom: {
  //     initial: { opacity: 0, scale: 0.8 },
  //     animate: { opacity: 1, scale: 1 },
  //     exit: { opacity: 0, scale: 0.8 },
  //   },
  //   "slide-left": {
  //     initial: { opacity: 0, x: -100 },
  //     animate: { opacity: 1, x: 0 },
  //     exit: { opacity: 0, x: -100 },
  //   },
  //   "slide-right": {
  //     initial: { opacity: 0, x: 100 },
  //     animate: { opacity: 1, x: 0 },
  //     exit: { opacity: 0, x: 100 },
  //   },
  //   "slide-up": {
  //     initial: { opacity: 0, y: 100 },
  //     animate: { opacity: 1, y: 0 },
  //     exit: { opacity: 0, y: 100 },
  //   },
  //   rotate: {
  //     initial: { opacity: 0, rotate: -45, scale: 0.8 },
  //     animate: { opacity: 1, rotate: 0, scale: 1 },
  //     exit: { opacity: 0, rotate: 45, scale: 0.8 },
  //   },
  // };

//   useEffect(() => {
//     fetchContents();
//     const subscription = cable.subscriptions.create(
//       { channel: "ScreenChannel", slug },
//       {
//         received: (data) => {
//           if (["assignment_changed", "refresh"].includes(data.action)) {
//             fetchContents();
//           }
//         },
//       }
//     );
//     return () => subscription.unsubscribe();
//   }, [slug]);

//   async function fetchContents() {
//     try {
//       const res = await fetch(`${Api}/api/v1/screen_contents/${slug}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       if (!res.ok) throw new Error(`Failed to fetch contents: ${res.status}`);
//       const data = await res.json();

//       setContents(data.contents || []);
//       setBackground(data.background_url);
//       console.log("✅ data.contents:", data.contents);

//       if (data.contents?.length > 0) {
//         const first = data.contents[0];
//         setNextScreenId(first.next_screen_id);
//         setPrevScreenId(first.prev_screen_id);
//       }
//     } catch (err) {
//       console.error("❌ Error fetching contents:", err);
//     }
//   }

//   const handleNext = () => {
//     if (!nextScreenId) {
//       alert("✅ You reached the last screen!");
//       return;
//     }
//     navigate(`/screen/${nextScreenId}`);
//   };

//   const handlePrev = () => {
//     if (!prevScreenId) {
//       alert("🚫 This is the first screen!");
//       return;
//     }
//     navigate(`/screen/${prevScreenId}`);
//   };

//   // 🧩 Preset position styles
//   const getPositionStyle = (position) => {
//     const base = {
//       position: "absolute",
//       display: "flex",
//       flexDirection: "column",
//       alignItems: "center",
//       justifyContent: "center",
//       zIndex: 2,
//     };

//     switch (position) {
//       case "Top-Left":
//         return { ...base, top: "5%", left: "5%" };
//       case "Top-Right":
//         return { ...base, top: "5%", right: "5%" };
//       case "Bottom-Left":
//         return { ...base, bottom: "5%", left: "5%" };
//       case "Bottom-Right":
//         return { ...base, bottom: "5%", right: "5%" };
//       case "Center":
//         return {
//           ...base,
//           top: "50%",
//           left: "50%",
//           transform: "translate(-50%, -50%)",
//         };
//       default:
//         return { ...base, top: "10%", left: "10%" };
//     }
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 1.2 }}
//       style={{
//         position: "relative",
//         color: "white",
//         minHeight: "100vh",
//         overflow: "hidden",
//       }}
//     >
//       {/* --- Background --- */}
//       {background && background.endsWith(".mp4") ? (
//         <video
//           autoPlay
//           loop
//           muted
//           playsInline
//           style={{
//             position: "absolute",
//             top: 0,
//             left: 0,
//             width: "100%",
//             height: "100%",
//             objectFit: "cover",
//             zIndex: 0,
//           }}
//         >
//           <source src={background} type="video/mp4" />
//         </video>
//       ) : (
//         <div
//           style={{
//             backgroundImage: `url(${background})`,
//             backgroundSize: "cover",
//             backgroundPosition: "center",
//             position: "absolute",
//             top: 0,
//             left: 0,
//             width: "100%",
//             height: "100%",
//             zIndex: 0,
//           }}
//         />
//       )}

//       {/* --- Foreground Overlay --- */}
//       <div
//         style={{
//           position: "relative",
//           zIndex: 1,
//           width: "100%",
//           height: "100vh",
//           overflow: "hidden",
//         }}
//       >
//         <AnimatePresence mode="wait">
//           {contents.map((c, idx) => {
//             const customStyle =
//               c.top || c.left
//                 ? {
//                     top: typeof c.top === "number" ? `${c.top}px` : c.top || "10%",
//                     left:
//                       typeof c.left === "number" ? `${c.left}px` : c.left || "10%",
//                     position: "absolute",
//                   }
//                 : getPositionStyle(c.position);

//             // 💫 Pick the animation variant (default: fade)
//             const variant = transitionVariants[c.transition_effect || "fade"];

//             return (
//               <motion.div
//                 key={c.id}
//                 variants={variant}
//                 initial="initial"
//                 animate="animate"
//                 exit="exit"
//                 transition={{ duration: 0.8, delay: idx * 0.3 }}
//                 drag
//                 dragConstraints={false}
//                 dragElastic={0.1}
//                 style={{
//                   ...customStyle,
//                   background: "rgba(0, 0, 0, 0.6)",
//                   padding: "12px",
//                   borderRadius: "10px",
//                   color: "white",
//                   textAlign: "center",
//                   width:
//                     c.width && typeof c.width === "number"
//                       ? `${c.width}px`
//                       : c.width || "300px",
//                   height:
//                     c.height && typeof c.height === "number"
//                       ? `${c.height}px`
//                       : c.height || "auto",
//                   resize: "both",
//                   overflow: "auto",
//                   cursor: "grab",
//                   zIndex: 5,
//                 }}
//               >
//                 {/* --- Image --- */}
//                 {c.content_type === "image" &&
//                   c.files.map((f, i) => (
//                     <img
//                       key={i}
//                       src={f}
//                       alt=""
//                       style={{
//                         width: "100%",
//                         height: "auto",
//                         maxHeight: "250px",
//                         objectFit: "contain",
//                         borderRadius: 8,
//                         marginBottom: 8,
//                       }}
//                     />
//                   ))}

//                 {/* --- Video --- */}
//                 {c.content_type === "video" &&
//                   c.files.map((f, i) => (
//                     <video
//                       key={i}
//                       autoPlay
//                       loop
//                       muted
//                       playsInline
//                       style={{
//                         width: "100%",
//                         height: "auto",
//                         maxHeight: "250px",
//                         borderRadius: 8,
//                         marginBottom: 8,
//                         objectFit: "contain",
//                       }}
//                     >
//                       <source src={f} type="video/mp4" />
//                     </video>
//                   ))}

//                 {/* --- Text --- */}
//                 {c.content && (
//                   <p
//                     style={{
//                       fontSize: "clamp(12px, 1.5vw, 18px)",
//                       color: "#fff",
//                       lineHeight: 1.4,
//                       wordBreak: "break-word",
//                     }}
//                   >
//                     {c.content}
//                   </p>
//                 )}

//                 {/* --- QR Code --- */}
//                 {c.qr_code_url && (
//                   <img
//                     src={c.qr_code_url}
//                     alt="QR Code"
//                     style={{
//                       width: "120px",
//                       height: "120px",
//                       marginTop: "12px",
//                       borderRadius: "10px",
//                       background: "#fff",
//                       padding: "5px",
//                     }}
//                   />
//                 )}
//               </motion.div>
//             );
//           })}
//         </AnimatePresence>

//         {/* --- Navigation Buttons --- */}
//         <motion.button
//           whileHover={{ scale: 1.1, backgroundColor: "#f0f0f0" }}
//           onClick={handlePrev}
//           style={{
//             position: "fixed",
//             top: "50%",
//             left: "20px",
//             transform: "translateY(-50%)",
//             background: "white",
//             border: "none",
//             color: "black",
//             fontSize: "2rem",
//             borderRadius: "50%",
//             width: "80px",
//             height: "80px",
//             cursor: "pointer",
//             opacity: 0.6,
//             zIndex: 3,
//           }}
//         >
//           ◀
//         </motion.button>

//         <motion.button
//           whileHover={{ scale: 1.1, backgroundColor: "#f0f0f0" }}
//           onClick={handleNext}
//           style={{
//             position: "fixed",
//             top: "50%",
//             right: "20px",
//             transform: "translateY(-50%)",
//             background: "white",
//             border: "none",
//             color: "black",
//             fontSize: "2rem",
//             borderRadius: "50%",
//             width: "80px",
//             height: "80px",
//             cursor: "pointer",
//             opacity: 0.6,
//             zIndex: 3,
//           }}
//         >
//           ▶
//         </motion.button>
//       </div>
//     </motion.div>
//   );
// }

// export default ScreenView;
// import React, { useEffect, useState, useRef } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import Api from "../Api/Api";
// import * as ActionCable from "@rails/actioncable";
// import { motion, AnimatePresence } from "framer-motion";

// const cable = ActionCable.createConsumer("ws://localhost:3000/cable");

// function ScreenView() {
//   const { slug } = useParams();
//   const navigate = useNavigate();
//   const token = sessionStorage.getItem("authToken");
//   const containerRef = useRef(null); // keep contents within the screen

//   const [contents, setContents] = useState([]);
//   const [background, setBackground] = useState(null);
//   const [nextScreenId, setNextScreenId] = useState(null);
//   const [prevScreenId, setPrevScreenId] = useState(null);

//   useEffect(() => {
//     fetchContents();
//     const subscription = cable.subscriptions.create(
//       { channel: "ScreenChannel", slug },
//       {
//         received: (data) => {
//           if (["assignment_changed", "refresh"].includes(data.action)) {
//             fetchContents();
//           }
//         },
//       }
//     );
//     return () => subscription.unsubscribe();
//   }, [slug]);

//   async function fetchContents() {
//     try {
//       const res = await fetch(`${Api}/api/v1/screen_contents/${slug}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       if (!res.ok) throw new Error(`Failed to fetch contents: ${res.status}`);
//       const data = await res.json();

//       setContents(data.contents || []);
//       setBackground(data.background_url);

//       if (data.contents?.length > 0) {
//         const first = data.contents[0];
//         setNextScreenId(first.next_screen_id);
//         setPrevScreenId(first.prev_screen_id);
//       }
//     } catch (err) {
//       console.error("❌ Error fetching contents:", err);
//     }
//   }

//   const handleNext = () => {
//     if (!nextScreenId) {
//       alert("✅ You reached the last screen!");
//       return;
//     }
//     navigate(`/screen/${nextScreenId}`);
//   };

//   const handlePrev = () => {
//     if (!prevScreenId) {
//       alert("🚫 This is the first screen!");
//       return;
//     }
//     navigate(`/screen/${prevScreenId}`);
//   };

//   const getPositionStyle = (position) => {
//     const base = {
//       position: "absolute",
//       display: "flex",
//       flexDirection: "column",
//       alignItems: "center",
//       justifyContent: "center",
//       zIndex: 2,
//     };

//     switch (position) {
//       case "Top-Left":
//         return { ...base, top: "5%", left: "5%" };
//       case "Top-Right":
//         return { ...base, top: "5%", right: "5%" };
//       case "Bottom-Left":
//         return { ...base, bottom: "5%", left: "5%" };
//       case "Bottom-Right":
//         return { ...base, bottom: "5%", right: "5%" };
//       case "Center":
//         return {
//           ...base,
//           top: "50%",
//           left: "50%",
//           transform: "translate(-50%, -50%)",
//         };
//       default:
//         return { ...base, top: "10%", left: "10%" };
//     }
//   };

//   return (
//     <motion.div
//       initial={false}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 0 }}
//       style={{
//         position: "relative",
//         color: "white",
//         minHeight: "100vh",
//         overflow: "hidden",
//       }}
//     >
//       {/* --- Background --- */}
//       {background && background.endsWith(".mp4") ? (
//         <video
//           autoPlay
//           loop
//           muted
//           playsInline
//           style={{
//             position: "absolute",
//             top: 0,
//             left: 0,
//             width: "100%",
//             height: "100%",
//             objectFit: "cover",
//             zIndex: 0,
//           }}
//         >
//           <source src={background} type="video/mp4" />
//         </video>
//       ) : (
//         <div
//           style={{
//             backgroundImage: `url(${background})`,
//             backgroundSize: "cover",
//             backgroundPosition: "center",
//             position: "absolute",
//             top: 0,
//             left: 0,
//             width: "100%",
//             height: "100%",
//             zIndex: 0,
//           }}
//         />
//       )}

//       {/* --- Foreground (Content) --- */}
//       <div
//         ref={containerRef}
//         style={{
//           position: "relative",
//           zIndex: 1,
//           width: "100%",
//           height: "100vh",
//           overflow: "hidden", // prevent outer movement
//         }}
//       >
//         <AnimatePresence>
//           {contents.map((c) => {
//             const customStyle =
//               c.top || c.left
//                 ? {
//                     top: typeof c.top === "number" ? `${c.top}px` : c.top || "10%",
//                     left:
//                       typeof c.left === "number" ? `${c.left}px` : c.left || "10%",
//                     position: "absolute",
//                   }
//                 : getPositionStyle(c.position);

//             return (
//               <motion.div
//                 key={c.id}
//                 initial={false}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 1 }}
//                 transition={{ duration: 0 }}
//                 drag
//                 dragConstraints={containerRef} // restrict movement inside container
//                 dragElastic={0} // no smooth sliding or float
//                 dragMomentum={false} // disable floating effect after release
//                 style={{
//                   ...customStyle,
//                   background: "rgba(0, 0, 0, 0.6)",
//                   padding: "12px",
//                   borderRadius: "10px",
//                   color: "white",
//                   textAlign: "center",
//                   width:
//                     c.width && typeof c.width === "number"
//                       ? `${c.width}px`
//                       : c.width || "300px",
//                   height:
//                     c.height && typeof c.height === "number"
//                       ? `${c.height}px`
//                       : c.height || "auto",
//                   resize: "both",
//                   overflow: "auto",
//                   cursor: "grab",
//                   zIndex: 5,
//                   userSelect: "none",
//                 }}
//               >
//                 {/* --- Image --- */}
//                 {c.content_type === "image" &&
//                   c.files.map((f, i) => (
//                     <img
//                       key={i}
//                       src={f}
//                       alt=""
//                       style={{
//                         width: "100%",
//                         height: "auto",
//                         maxHeight: "250px",
//                         objectFit: "contain",
//                         borderRadius: 8,
//                         marginBottom: 8,
//                       }}
//                     />
//                   ))}

//                 {/* --- Video --- */}
//                 {c.content_type === "video" &&
//                   c.files.map((f, i) => (
//                     <video
//                       key={i}
//                       autoPlay
//                       loop
//                       muted
//                       playsInline
//                       style={{
//                         width: "100%",
//                         height: "auto",
//                         maxHeight: "250px",
//                         borderRadius: 8,
//                         marginBottom: 8,
//                         objectFit: "contain",
//                       }}
//                     >
//                       <source src={f} type="video/mp4" />
//                     </video>
//                   ))}

//                 {/* --- Text --- */}
//                 {c.content && (
//                   <p
//                     style={{
//                       fontSize: "clamp(12px, 1.5vw, 18px)",
//                       color: "#fff",
//                       lineHeight: 1.4,
//                       wordBreak: "break-word",
//                     }}
//                   >
//                     {c.content}
//                   </p>
//                 )}

//                 {/* --- QR Code --- */}
//                 {c.qr_code_url && (
//                   <img
//                     src={c.qr_code_url}
//                     alt="QR Code"
//                     style={{
//                       width: "120px",
//                       height: "120px",
//                       marginTop: "12px",
//                       borderRadius: "10px",
//                       background: "#fff",
//                       padding: "5px",
//                     }}
//                   />
//                 )}
//               </motion.div>
//             );
//           })}
//         </AnimatePresence>

//         {/* --- Navigation Buttons --- */}
//         <motion.button
//           whileHover={{ scale: 1.05 }}
//           onClick={handlePrev}
//           style={{
//             position: "fixed",
//             top: "50%",
//             left: "20px",
//             transform: "translateY(-50%)",
//             background: "white",
//             border: "none",
//             color: "black",
//             fontSize: "2rem",
//             borderRadius: "50%",
//             width: "80px",
//             height: "80px",
//             cursor: "pointer",
//             opacity: 0.6,
//             zIndex: 3,
//           }}
//         >
//           ◀
//         </motion.button>

//         <motion.button
//           whileHover={{ scale: 1.05 }}
//           onClick={handleNext}
//           style={{
//             position: "fixed",
//             top: "50%",
//             right: "20px",
//             transform: "translateY(-50%)",
//             background: "white",
//             border: "none",
//             color: "black",
//             fontSize: "2rem",
//             borderRadius: "50%",
//             width: "80px",
//             height: "80px",
//             cursor: "pointer",
//             opacity: 0.6,
//             zIndex: 3,
//           }}
//         >
//           ▶
//         </motion.button>
//       </div>
//     </motion.div>
//   );
// }

// export default ScreenView;
import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Api from "../Api/Api";
import * as ActionCable from "@rails/actioncable";
import { motion, AnimatePresence } from "framer-motion";

const cable = ActionCable.createConsumer("ws://localhost:3000/cable");

function ScreenView() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const token = sessionStorage.getItem("authToken");
  const containerRef = useRef(null);

  const [contents, setContents] = useState([]);
  const [background, setBackground] = useState(null);
  const [nextScreenId, setNextScreenId] = useState(null);
  const [prevScreenId, setPrevScreenId] = useState(null);

  // 🌀 Define all transition variants
  const transitionVariants = {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    },
    zoom: {
      initial: { opacity: 0, scale: 0.8 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.8 },
    },
    "slide-left": {
      initial: { opacity: 0, x: -100 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -100 },
    },
    "slide-right": {
      initial: { opacity: 0, x: 100 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: 100 },
    },
    "slide-up": {
      initial: { opacity: 0, y: 100 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 100 },
    },
    rotate: {
      initial: { opacity: 0, rotate: -45, scale: 0.8 },
      animate: { opacity: 1, rotate: 0, scale: 1 },
      exit: { opacity: 0, rotate: 45, scale: 0.8 },
    },
  };

  useEffect(() => {
    fetchContents();
    const subscription = cable.subscriptions.create(
      { channel: "ScreenChannel", slug },
      {
        received: (data) => {
          if (["assignment_changed", "refresh"].includes(data.action)) {
            fetchContents();
          }
        },
      }
    );
    return () => subscription.unsubscribe();
  }, [slug]);

  async function fetchContents() {
    try {
      const res = await fetch(`${Api}/api/v1/screen_contents/${slug}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error(`Failed to fetch contents: ${res.status}`);
      const data = await res.json();
      console.log("✅ Fetched contents:", data.contents);
      setContents(data.contents || []);
      setBackground(data.background_url);

      if (data.contents?.length > 0) {
        const first = data.contents[0];
        setNextScreenId(first.next_screen_id);
        setPrevScreenId(first.prev_screen_id);
      }
    } catch (err) {
      console.error("❌ Error fetching contents:", err);
    }
  }

  const handleNext = () => {
    if (!nextScreenId) {
      alert("✅ You reached the last screen!");
      return;
    }
    navigate(`/screen/${nextScreenId}`);
  };

  const handlePrev = () => {
    if (!prevScreenId) {
      alert("🚫 This is the first screen!");
      return;
    }
    navigate(`/screen/${prevScreenId}`);
  };

  const getPositionStyle = (position) => {
    const base = {
      position: "absolute",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 2,
    };

    switch (position) {
      case "Top-Left":
        return { ...base, top: "5%", left: "5%" };
      case "Top-Right":
        return { ...base, top: "5%", right: "5%" };
      case "Bottom-Left":
        return { ...base, bottom: "5%", left: "5%" };
      case "Bottom-Right":
        return { ...base, bottom: "5%", right: "5%" };
      case "Center":
        return {
          ...base,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        };
      default:
        return { ...base, top: "10%", left: "10%" };
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      style={{
        position: "relative",
        color: "white",
        minHeight: "100vh",
        overflow: "hidden",
      }}
    >
      {/* --- Background --- */}
      {background && background.endsWith(".mp4") ? (
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: 0,
          }}
        >
          <source src={background} type="video/mp4" />
        </video>
      ) : (
        <div
          style={{
            backgroundImage: `url(${background})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 0,
          }}
        />
      )}

      {/* --- Foreground (Content) --- */}
      <div
        ref={containerRef}
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        <AnimatePresence>
          {contents.map((c, idx) => {
            const customStyle =
              c.top || c.left
                ? {
                    top: typeof c.top === "number" ? `${c.top}px` : c.top || "10%",
                    left:
                      typeof c.left === "number" ? `${c.left}px` : c.left || "10%",
                    position: "absolute",
                  }
                : getPositionStyle(c.position);

            // 🌀 Pick variant from backend (fallback: fade)
            const variant =
              transitionVariants[c.transition_effect] || transitionVariants.fade;

            return (
              <motion.div
                key={c.id}
                variants={variant}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.8, delay: idx * 0.1 }}
                drag
                dragConstraints={containerRef}
                dragElastic={0}
                dragMomentum={false}
                style={{
                  ...customStyle,
                  background: "rgba(0, 0, 0, 0.6)",
                  padding: "12px",
                  borderRadius: "10px",
                  color: "white",
                  textAlign: "center",
                  width:
                    c.width && typeof c.width === "number"
                      ? `${c.width}px`
                      : c.width || "300px",
                  height:
                    c.height && typeof c.height === "number"
                      ? `${c.height}px`
                      : c.height || "auto",
                  resize: "both",
                  overflow: "auto",
                  cursor: "grab",
                  zIndex: 5,
                  userSelect: "none",
                }}
              >
                {/* --- Image --- */}
                {c.content_type === "image" &&
                  c.files.map((f, i) => (
                    <img
                      key={i}
                      src={f}
                      alt=""
                      style={{
                        width: "100%",
                        height: "auto",
                        maxHeight: "250px",
                        objectFit: "contain",
                        borderRadius: 8,
                        marginBottom: 8,
                      }}
                    />
                  ))}

                {/* --- Video --- */}
                {c.content_type === "video" &&
                  c.files.map((f, i) => (
                    <video
                      key={i}
                      autoPlay
                      loop
                      muted
                      playsInline
                      style={{
                        width: "100%",
                        height: "auto",
                        maxHeight: "250px",
                        borderRadius: 8,
                        marginBottom: 8,
                        objectFit: "contain",
                      }}
                    >
                      <source src={f} type="video/mp4" />
                    </video>
                  ))}

                {/* --- Text --- */}
                {c.content && (
                  <p
                    style={{
                      fontSize: "clamp(12px, 1.5vw, 18px)",
                      color: "#fff",
                      lineHeight: 1.4,
                      wordBreak: "break-word",
                    }}
                  >
                    {c.content}
                  </p>
                )}

                {/* --- QR Code --- */}
                {c.qr_code_url && (
                  <img
                    src={c.qr_code_url}
                    alt="QR Code"
                    style={{
                      width: "120px",
                      height: "120px",
                      marginTop: "12px",
                      borderRadius: "10px",
                      background: "#fff",
                      padding: "5px",
                    }}
                  />
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* --- Navigation Buttons --- */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={handlePrev}
          style={{
            position: "fixed",
            top: "50%",
            left: "20px",
            transform: "translateY(-50%)",
            background: "white",
            border: "none",
            color: "black",
            fontSize: "2rem",
            borderRadius: "50%",
            width: "80px",
            height: "80px",
            cursor: "pointer",
            opacity: 0.6,
            zIndex: 3,
          }}
        >
          ◀
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={handleNext}
          style={{
            position: "fixed",
            top: "50%",
            right: "20px",
            transform: "translateY(-50%)",
            background: "white",
            border: "none",
            color: "black",
            fontSize: "2rem",
            borderRadius: "50%",
            width: "80px",
            height: "80px",
            cursor: "pointer",
            opacity: 0.6,
            zIndex: 3,
          }}
        >
          ▶
        </motion.button>
      </div>
    </motion.div>
  );
}

export default ScreenView;
