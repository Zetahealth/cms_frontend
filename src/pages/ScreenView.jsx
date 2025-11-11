// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// // import api from "../lib/api";
// import Api from "../Api/Api";
// import * as ActionCable from "@rails/actioncable"; // ✅ Correct import

// // const cable = ActionCable.createConsumer("ws://localhost:3000/cable");
// const cable = ActionCable.createConsumer("ws://localhost:3000/cable");


// function ScreenView() {
//   const { slug } = useParams();
//   const [contents, setContents] = useState([]);
//   const token = sessionStorage.getItem("authToken");
//   console.log("-------00000000000000-----------------slug slug----",slug )
//   useEffect(() => {
//     fetchContents();
//     const subscription = cable.subscriptions.create(
//       { channel: "ScreenChannel", slug },
//       {
//         received: (data) => {
//           console.log("received", data);
//           if (data.action === "assignment_changed" || data.action === "refresh") {
//             fetchContents();
//           }
//         },
//       }
//     );
//     return () => {
//       subscription.unsubscribe();
//     };
//   }, [slug]);







  


//     async function fetchContents() {
//         try {
//             const res = await fetch(`${Api}/api/v1/screen_contents/${slug}`, {
//             method: "GET",
//             headers: {
//                 "Authorization": `Bearer ${token}`,
//                 "Content-Type": "application/json",
//             },
//             });

//             if (!res.ok) {
//             throw new Error(`Failed to fetch contents: ${res.status}`);
//             }

//             const data = await res.json();
//             console.log(data, "-----000000000000----------------0000000000--------------0000---")
//             setContents(data);
//         } catch (err) {
//             console.error("❌ Error fetching contents:", err);
//         }
//     }

//   return (
//     <div
//       style={{
//         background: "#0b1020",
//         color: "white",
//         minHeight: "100vh",
//         padding: 20,
//       }}
//     >
//       <h1>Screen: {slug}</h1>
//       <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
//         {contents.map((c) => (
//           <div
//             key={c.id}
//             style={{
//               width: 420,
//               background: "#111224",
//               padding: 10,
//               borderRadius: 8,
//             }}
//           >
//             <h3>{c.title}</h3>
//             {c.content_type === "image" &&
//               c.files.map((f, i) => <img key={i} src={f} style={{ maxWidth: "100%" }} />)}
//             {c.content_type === "video" &&
//               c.files.map((f, i) => (
//                 <video key={i} controls style={{ width: "100%" }}>
//                   <source src={f} />
//                 </video>
//               ))}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default ScreenView;
// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import Api from "../Api/Api";
// import * as ActionCable from "@rails/actioncable";



// const cable = ActionCable.createConsumer("ws://localhost:3000/cable");

// function ScreenView() {
//   const { slug } = useParams();
//   const navigate = useNavigate();
//   const [contents, setContents] = useState([]);
//   const [screens, setScreens] = useState([]);
//   const token = sessionStorage.getItem("authToken");
//   const [background, setBackground] = useState(null);

//   console.log("📺 Current Screen Slug:", slug);

//   const { id } = useParams();
//   const [containerScreens, setContainerScreens] = useState([]);
//   const [currentIndex, setCurrentIndex] = useState(0);


//   useEffect(() => {
//     fetch(`${Api}/api/v1/screen_containers/${id}`, {
//       headers: { Authorization: `Bearer ${token}` },
//     })
//       .then(res => res.json())
//       .then(data => {
//         setContainerScreens(data.screens);
//         if (data.screens.length > 0) {
//           navigate(`/screen/${data.screens[0].slug}`);
//         }
//       });
//   }, [id]);

//   // When Next button clicked
//   const handleNext = () => {
//     if (currentIndex < containerScreens.length - 1) {
//       const next = containerScreens[currentIndex + 1];
//       setCurrentIndex(currentIndex + 1);
//       navigate(`/screen/${next.slug}`);
//     } else {
//       alert("✅ You reached the last screen in this container!");
//     }
//   };

//   // 🔹 Fetch all screens (for navigation)
//   useEffect(() => {
//     fetch(`${Api}/api/v1/screens`, {
//       headers: { Authorization: `Bearer ${token}` },
//     })
//       .then(res => res.json())
//       .then(data => setScreens(data))
//       .catch(err => console.error("❌ Failed to load screens:", err));
//   }, []);

//   // 🔹 Fetch screen contents and setup ActionCable
//   useEffect(() => {
//     fetchContents();
//     const subscription = cable.subscriptions.create(
//       { channel: "ScreenChannel", slug },
//       {
//         received: (data) => {
//           console.log("📡 Received ActionCable update:", data);
//           if (data.action === "assignment_changed" || data.action === "refresh") {
//             fetchContents();
//           }
//         },
//       }
//     );
//     return () => {
//       subscription.unsubscribe();
//     };
//   }, [slug]);

//   // 🔹 Fetch contents for current screen
//   // async function fetchContents() {
//   //   try {
//   //     const res = await fetch(`${Api}/api/v1/screen_contents/${slug}`, {
//   //       headers: {
//   //         "Authorization": `Bearer ${token}`,
//   //         "Content-Type": "application/json",
//   //       },
//   //     });

//   //     if (!res.ok) throw new Error(`Failed to fetch contents: ${res.status}`);
//   //     const data = await res.json();
//   //     console.log("🧩 Loaded Contents:", data);
//   //     setContents(data);
//   //   } catch (err) {
//   //     console.error("❌ Error fetching contents:", err);
//   //   }
//   // }



//   async function fetchContents() {
//     try {
//       const res = await fetch(`${Api}/api/v1/screen_contents/${slug}`, {
//         headers: {
//           "Authorization": `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       if (!res.ok) throw new Error(`Failed to fetch contents: ${res.status}`);
//       const data = await res.json();
//       console.log("🧩 Loaded Screen Data:", data);
//       setContents(data.contents);
//       setBackground(data.background_url);
//     } catch (err) {
//       console.error("❌ Error fetching contents:", err);
//     }
//   }

//   const handlePrev = () => {
//     const currentIndex = screens.findIndex((s) => s.slug === slug);
//     const prev = screens[currentIndex - 1];
//     if (prev) navigate(`/screen/${prev.slug}`);
//     else alert("🚫 This is the first screen!");
//   };

//   // 🔹 Optional: Auto rotate every 15 seconds
//   // useEffect(() => {
//   //   const interval = setInterval(() => handleNext(), 15000);
//   //   return () => clearInterval(interval);
//   // }, [screens, slug]);

//   return (
//     // <div style={{ background: "#0b1020", color: "white", minHeight: "100vh", padding: 20 }}>

//     <div
//       style={{
//         backgroundImage: background ? `url(${background})` : "#0b1020",
//         backgroundSize: "cover",
//         backgroundPosition: "center",
//         color: "white",
//         minHeight: "100vh",
//         padding: 150
//       }}
//     >

//       {/* <h1>Screen: {slug}</h1> */}

//       <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
//         {contents.map((c) => (
//           <div
//             key={c.id}
//             style={{
//               width: 420,
//               background: "#111224",
//               padding: 30,
//               borderRadius: 8,
//             }}
//           >
//             <h3>{c.title}</h3>

//             {c.content_type === "image" &&
//               c.files.map((f, i) => <img key={i} src={f} alt="" style={{ maxWidth: "100%" }} />)}

//             {c.content || ''}


//             {c.content_type === "video" &&
//               c.files.map((f, i) => (
//                 <video key={i} controls style={{ width: "100%" }}>
//                   <source src={f} />
//                 </video>
//               ))}
//           </div>
//         ))}
//       </div>


//       <button
//         onClick={handlePrev}
//         style={{
//           position: "fixed",
//           top: "50%",
//           left: "20px",
//           transform: "translateY(-50%)",
//           background: "white",
//           border: "none",
//           color: "black",
//           fontSize: "2rem",
//           borderRadius: "50%",
//           width: "150px",
//           height: "100px",
//           cursor: "pointer",
//           opacity: 0.5,
//           transition: "opacity 0.3s, background 0.3s",
//         }}
//         onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
//         onMouseLeave={(e) => (e.currentTarget.style.opacity = 0.5)}
//       >
//         ◀
//       </button>

//       <button
//         onClick={handleNext}
//         style={{
//           position: "fixed",
//           top: "50%",
//           right: "20px",
//           transform: "translateY(-50%)",
//           background: "white",
//           border: "none",
//           color: "black",
//           fontSize: "2rem",
//           borderRadius: "50%",
//           width: "150px",
//           height: "100px",
//           cursor: "pointer",
//           opacity: 0.5,
//           transition: "opacity 0.3s, background 0.3s",
//         }}
//         onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
//         onMouseLeave={(e) => (e.currentTarget.style.opacity = 0.5)}
//       >
//         ▶
//       </button>

//     </div>
//   );
// }

// // export default ScreenView;
// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import Api from "../Api/Api";
// import * as ActionCable from "@rails/actioncable";

// const cable = ActionCable.createConsumer("ws://localhost:3000/cable");

// function ScreenView() {
//   const { slug } = useParams();
//   const navigate = useNavigate();
//   const token = sessionStorage.getItem("authToken");

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

//       setContents(data.contents);
//       setBackground(data.background_url);
//       console.log("-------------------------------",data)
//       if (data.contents.length > 0) {
//         const first = data.contents[0];
//         console.log(first, "==================first===============")
//         setNextScreenId(first.next_screen_id);
//         setPrevScreenId(first.prev_screen_id);
//       }
//     } catch (err) {
//       console.error("❌ Error fetching contents:", err);
//     }
//   }

//   const handleNext = async () => {
//     if (!nextScreenId) {
//       alert("✅ You reached the last screen!");
//       return;
//     }

//     try {
//       // Get next screen slug from backend
//       const res = await fetch(`${Api}/api/v1/screens/${nextScreenId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const next = await res.json();
//       navigate(`/screen/${nextScreenId}`);
//     } catch {
//       alert("❌ Could not load next screen");
//     }
//   };

//   const handlePrev = async () => {
//     if (!prevScreenId) {
//       alert("🚫 This is the first screen!");
//       return;
//     }

//     try {
//       const res = await fetch(`${Api}/api/v1/screens/${prevScreenId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const prev = await res.json();
//       navigate(`/screen/${prevScreenId}`);
//     } catch {
//       alert("❌ Could not load previous screen");
//     }
//   };

//   return (
//     <div
//       style={{
//         backgroundImage: background ? `url(${background})` : "#0b1020",
//         backgroundSize: "cover",
//         backgroundPosition: "center",
//         color: "white",
//         minHeight: "100vh",
//         padding: 150,
//       }}
//     >
//       <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
//         {contents.map((c) => (
//           <div
//             key={c.id}
//             style={{
//               width: 420,
//               background: "#111224",
//               padding: 30,
//               borderRadius: 8,
//             }}
//           >
//             <h3>{c.title}</h3>
//             {c.content_type === "image" &&
//               c.files.map((f, i) => (
//                 <img key={i} src={f} alt="" style={{ maxWidth: "100%" }} />
//               ))}
//             {c.content && <p>{c.content}</p>}
//             {c.content_type === "video" &&
//               c.files.map((f, i) => (
//                 <video key={i} controls style={{ width: "100%" }}>
//                   <source src={f} />
//                 </video>
//               ))}
//           </div>
//         ))}
//       </div>

//       {/* Prev button */}
//       <button
//         onClick={handlePrev}
//         style={{
//           position: "fixed",
//           top: "50%",
//           left: "20px",
//           transform: "translateY(-50%)",
//           background: "white",
//           border: "none",
//           color: "black",
//           fontSize: "2rem",
//           borderRadius: "50%",
//           width: "150px",
//           height: "100px",
//           cursor: "pointer",
//           opacity: 0.5,
//         }}
//       >
//         ◀
//       </button>

//       {/* Next button */}
//       <button
//         onClick={handleNext}
//         style={{
//           position: "fixed",
//           top: "50%",
//           right: "20px",
//           transform: "translateY(-50%)",
//           background: "white",
//           border: "none",
//           color: "black",
//           fontSize: "2rem",
//           borderRadius: "50%",
//           width: "150px",
//           height: "100px",
//           cursor: "pointer",
//           opacity: 0.5,
//         }}
//       >
//         ▶
//       </button>
//     </div>
//   );
// }

// export default ScreenView;



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

//       setContents(data.contents);
//       setBackground(data.background_url);

//       if (data.contents.length > 0) {
//         const first = data.contents[0];
//         setNextScreenId(first.next_screen_id);
//         setPrevScreenId(first.prev_screen_id);
//       }
//     } catch (err) {
//       console.error("❌ Error fetching contents:", err);
//     }
//   }

//   const handleNext = async () => {
//     if (!nextScreenId) {
//       alert("✅ You reached the last screen!");
//       return;
//     }

//     try {
//       const res = await fetch(`${Api}/api/v1/screens/${nextScreenId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const next = await res.json();
//       navigate(`/screen/${nextScreenId}`);
//     } catch {
//       alert("❌ Could not load next screen");
//     }
//   };

//   const handlePrev = async () => {
//     if (!prevScreenId) {
//       alert("🚫 This is the first screen!");
//       return;
//     }

//     try {
//       const res = await fetch(`${Api}/api/v1/screens/${prevScreenId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const prev = await res.json();
//       navigate(`/screen/${prevScreenId}`);
//     } catch {
//       alert("❌ Could not load previous screen");
//     }
//   };

//   return (
//     // <motion.div
//     //   initial={{ opacity: 0 }}
//     //   animate={{ opacity: 1 }}
//     //   transition={{ duration: 1.2 }}
//     //   style={{
//     //     backgroundImage: background ? `url(${background})` : "#0b1020",
//     //     backgroundSize: "cover",
//     //     backgroundPosition: "center",
//     //     color: "white",
//     //     minHeight: "100vh",
//     //     padding: 150,
//     //   }}
//     // >
//     //   {/* AnimatePresence gives smooth transitions when contents change */}
//     //   <AnimatePresence mode="wait">
//     //     <motion.div
//     //       key={slug}
//     //       initial={{ opacity: 0, y: 30 }}
//     //       animate={{ opacity: 1, y: 0 }}
//     //       exit={{ opacity: 0, y: -30 }}
//     //       transition={{ duration: 0.6 }}
//     //       style={{
//     //         display: "flex",
//     //         gap: 20,
//     //         flexWrap: "wrap",
//     //         justifyContent: "center",
//     //       }}
//     //     >
//     //       {contents.map((c, idx) => (
//     //         <motion.div
//     //           key={c.id}
//     //           initial={{ opacity: 0, y: 50, scale: 0.9 }}
//     //           animate={{ opacity: 1, y: 0, scale: 1 }}
//     //           transition={{ duration: 0.7, delay: idx * 0.2 }}
//     //           style={{
//     //             width: 420,
//     //             background: "rgba(17, 18, 36, 0.9)",
//     //             padding: 30,
//     //             borderRadius: 12,
//     //             boxShadow: "0 8px 20px rgba(0,0,0,0.4)",
//     //             overflow: "hidden",
//     //             backdropFilter: "blur(5px)",
//     //           }}
//     //         >
//     //           <motion.h3
//     //             initial={{ x: -30, opacity: 0 }}
//     //             animate={{ x: 0, opacity: 1 }}
//     //             transition={{ duration: 0.6 }}
//     //             style={{ fontSize: 22, marginBottom: 10 }}
//     //           >
//     //             {c.title}
//     //           </motion.h3>

//     //           {c.content_type === "image" &&
//     //             c.files.map((f, i) => (
//     //               <motion.img
//     //                 key={i}
//     //                 src={f}
//     //                 alt=""
//     //                 style={{
//     //                   maxWidth: "100%",
//     //                   borderRadius: 8,
//     //                   marginBottom: 10,
//     //                 }}
//     //                 initial={{ opacity: 0, scale: 0.9 }}
//     //                 animate={{ opacity: 1, scale: 1 }}
//     //                 transition={{ duration: 0.8, delay: 0.2 }}
//     //               />
//     //             ))}

//     //           {c.content && (
//     //             <motion.p
//     //               initial={{ opacity: 0, y: 20 }}
//     //               animate={{ opacity: 1, y: 0 }}
//     //               transition={{ duration: 0.6, delay: 0.3 }}
//     //               style={{
//     //                 fontSize: 16,
//     //                 color: "#ccc",
//     //                 lineHeight: 1.5,
//     //               }}
//     //             >
//     //               {c.content}
//     //             </motion.p>
//     //           )}

//     //           {c.content_type === "video" &&
//     //             c.files.map((f, i) => (
//     //               <motion.video
//     //                 key={i}
//     //                 controls
//     //                 style={{
//     //                   width: "100%",
//     //                   borderRadius: 10,
//     //                   marginTop: 10,
//     //                 }}
//     //                 initial={{ opacity: 0 }}
//     //                 animate={{ opacity: 1 }}
//     //                 transition={{ duration: 1 }}
//     //               >
//     //                 <source src={f} />
//     //               </motion.video>
//     //             ))}
//     //         </motion.div>
//     //       ))}
//     //     </motion.div>
//     //   </AnimatePresence>

//     //   {/* Navigation Buttons with hover animation */}
//     //   <motion.button
//     //     whileHover={{ scale: 1.1, backgroundColor: "#f0f0f0" }}
//     //     onClick={handlePrev}
//     //     style={{
//     //       position: "fixed",
//     //       top: "50%",
//     //       left: "20px",
//     //       transform: "translateY(-50%)",
//     //       background: "white",
//     //       border: "none",
//     //       color: "black",
//     //       fontSize: "2rem",
//     //       borderRadius: "50%",
//     //       width: "120px",
//     //       height: "100px",
//     //       cursor: "pointer",
//     //       opacity: 0.6,
//     //     }}
//     //   >
//     //     ◀
//     //   </motion.button>

//     //   <motion.button
//     //     whileHover={{ scale: 1.1, backgroundColor: "#f0f0f0" }}
//     //     onClick={handleNext}
//     //     style={{
//     //       position: "fixed",
//     //       top: "50%",
//     //       right: "20px",
//     //       transform: "translateY(-50%)",
//     //       background: "white",
//     //       border: "none",
//     //       color: "black",
//     //       fontSize: "2rem",
//     //       borderRadius: "50%",
//     //       width: "120px",
//     //       height: "100px",
//     //       cursor: "pointer",
//     //       opacity: 0.6,
//     //     }}
//     //   >
//     //     ▶
//     //   </motion.button>
//     // </motion.div>
//   //     <motion.div
//   //   initial={{ opacity: 0 }}
//   //   animate={{ opacity: 1 }}
//   //   transition={{ duration: 1.2 }}
//   //   style={{
//   //     position: "relative",
//   //     color: "white",
//   //     minHeight: "100vh",
//   //     overflow: "hidden",
//   //   }}
//   // >
//   //   {/* --- Background Layer --- */}
//   //   {background && background.endsWith(".mp4") ? (
//   //     // 🎥 If it's a video file
//   //     <video
//   //       autoPlay
//   //       loop
//   //       muted
//   //       playsInline
//   //       style={{
//   //         position: "absolute",
//   //         top: 0,
//   //         left: 0,
//   //         width: "100%",
//   //         height: "100%",
//   //         objectFit: "cover",
//   //         zIndex: 0,
//   //       }}
//   //     >
//   //       <source src={background} type="video/mp4" />
//   //     </video>
//   //   ) : (
//   //     // 🖼️ If it's an image or GIF
//   //     <div
//   //       style={{
//   //         backgroundImage: `url(${background})`,
//   //         backgroundSize: "cover",
//   //         backgroundPosition: "center",
//   //         position: "absolute",
//   //         top: 0,
//   //         left: 0,
//   //         width: "100%",
//   //         height: "100%",
//   //         zIndex: 0,
//   //       }}
//   //     />
//   //   )}

//   //   {/* --- Foreground Content --- */}
//   //   <div
//   //     style={{
//   //       position: "relative",
//   //       zIndex: 1,
//   //       padding: 150,
//   //       background: "rgba(0,0,0,0.4)", // Optional overlay for better text contrast
//   //     }}
//   //   >
//   //     <AnimatePresence mode="wait">
//   //       <motion.div
//   //         key={slug}
//   //         initial={{ opacity: 0, y: 30 }}
//   //         animate={{ opacity: 1, y: 0 }}
//   //         exit={{ opacity: 0, y: -30 }}
//   //         transition={{ duration: 0.6 }}
//   //         style={{
//   //           display: "flex",
//   //           gap: 20,
//   //           flexWrap: "wrap",
//   //           justifyContent: "center",
//   //         }}
//   //       >
//   //         {contents.map((c, idx) => (
//   //           <motion.div
//   //             key={c.id}
//   //             initial={{ opacity: 0, y: 50, scale: 0.9 }}
//   //             animate={{ opacity: 1, y: 0, scale: 1 }}
//   //             transition={{ duration: 0.7, delay: idx * 0.2 }}
//   //             style={{
//   //               width: 420,
//   //               background: "rgba(17, 18, 36, 0.9)",
//   //               padding: 30,
//   //               borderRadius: 12,
//   //               boxShadow: "0 8px 20px rgba(0,0,0,0.4)",
//   //               overflow: "hidden",
//   //               backdropFilter: "blur(5px)",
//   //             }}
//   //           >
//   //             <motion.h3
//   //               initial={{ x: -30, opacity: 0 }}
//   //               animate={{ x: 0, opacity: 1 }}
//   //               transition={{ duration: 0.6 }}
//   //               style={{ fontSize: 22, marginBottom: 10 }}
//   //             >
//   //               {c.title}
//   //             </motion.h3>

//   //             {/* Image content */}
//   //             {c.content_type === "image" &&
//   //               c.files.map((f, i) => (
//   //                 <motion.img
//   //                   key={i}
//   //                   src={f}
//   //                   alt=""
//   //                   style={{
//   //                     maxWidth: "100%",
//   //                     borderRadius: 8,
//   //                     marginBottom: 10,
//   //                   }}
//   //                   initial={{ opacity: 0, scale: 0.9 }}
//   //                   animate={{ opacity: 1, scale: 1 }}
//   //                   transition={{ duration: 0.8, delay: 0.2 }}
//   //                 />
//   //               ))}

//   //             {/* Text content */}
//   //             {c.content && (
//   //               <motion.p
//   //                 initial={{ opacity: 0, y: 20 }}
//   //                 animate={{ opacity: 1, y: 0 }}
//   //                 transition={{ duration: 0.6, delay: 0.3 }}
//   //                 style={{
//   //                   fontSize: 16,
//   //                   color: "#ccc",
//   //                   lineHeight: 1.5,
//   //                 }}
//   //               >
//   //                 {c.content}
//   //               </motion.p>
//   //             )}

//   //             {/* Video content */}
//   //             {c.content_type === "video" &&
//   //               c.files.map((f, i) => (
//   //                 <motion.video
//   //                   key={i}
//   //                   controls
//   //                   style={{
//   //                     width: "100%",
//   //                     borderRadius: 10,
//   //                     marginTop: 10,
//   //                   }}
//   //                   initial={{ opacity: 0 }}
//   //                   animate={{ opacity: 1 }}
//   //                   transition={{ duration: 1 }}
//   //                 >
//   //                   <source src={f} />
//   //                 </motion.video>
//   //               ))}
//   //           </motion.div>
//   //         ))}
//   //       </motion.div>
//   //     </AnimatePresence>

//   //     {/* Navigation Buttons */}
//   //     <motion.button
//   //       whileHover={{ scale: 1.1, backgroundColor: "#f0f0f0" }}
//   //       onClick={handlePrev}
//   //       style={{
//   //         position: "fixed",
//   //         top: "50%",
//   //         left: "20px",
//   //         transform: "translateY(-50%)",
//   //         background: "white",
//   //         border: "none",
//   //         color: "black",
//   //         fontSize: "2rem",
//   //         borderRadius: "50%",
//   //         width: "120px",
//   //         height: "100px",
//   //         cursor: "pointer",
//   //         opacity: 0.6,
//   //         zIndex: 2,
//   //       }}
//   //     >
//   //       ◀
//   //     </motion.button>

//   //     <motion.button
//   //       whileHover={{ scale: 1.1, backgroundColor: "#f0f0f0" }}
//   //       onClick={handleNext}
//   //       style={{
//   //         position: "fixed",
//   //         top: "50%",
//   //         right: "20px",
//   //         transform: "translateY(-50%)",
//   //         background: "white",
//   //         border: "none",
//   //         color: "black",
//   //         fontSize: "2rem",
//   //         borderRadius: "50%",
//   //         width: "120px",
//   //         height: "100px",
//   //         cursor: "pointer",
//   //         opacity: 0.6,
//   //         zIndex: 2,
//   //       }}
//   //     >
//   //       ▶
//   //     </motion.button>
//   //   </div>
//   // </motion.div>

//       <motion.div
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
//       {/* --- Background Layer --- */}
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

//       {/* --- Foreground Content --- */}
//       <div
//         style={{
//           position: "relative",
//           zIndex: 1,
//           padding: 150,
//           background: "none", // optional overlay
//         }}
//       >
//         <AnimatePresence mode="wait">
//           <motion.div
//             key={slug}
//             initial={{ opacity: 0, y: 30 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -30 }}
//             transition={{ duration: 0.6 }}
//             style={{
//               display: "flex",
//               flexDirection: "column",
//               gap: 50,
//               alignItems: "center",
//             }}
//           >
            
//             {contents.map((c, idx) => (
//               <React.Fragment key={c.id}>
//                 {/* --- Media + Text Side-by-Side Layout --- */}
//                 <motion.div
//                   initial={{ opacity: 0, y: 30 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.8, delay: idx * 0.2 }}
//                   style={{
//                     display: "flex",
//                     flexDirection: "row", // 👈 side-by-side
//                     alignItems: "center",
//                     justifyContent: "center",
//                     gap: 40,
//                     marginBottom: 60,
//                   }}
//                 >
                  
//                   {/* --- Media Section (Right Side) --- */}
//                   {(c.content_type === "image" || c.content_type === "video") && (
//                     <motion.div
//                       initial={{ opacity: 0, x: 20, scale: 0.95 }}
//                       animate={{ opacity: 1, x: 0, scale: 1 }}
//                       transition={{ duration: 0.7, delay: 0.3 }}
//                       style={{
//                         width: "50%",
//                         background: "none",
//                         padding: 0,
//                         borderRadius: 30,
//                         boxShadow: "0 8px 20px rgba(0,0,0,0.4)",
//                         overflow: "hidden",
//                         backdropFilter: "blur(5px)",
//                       }}
//                     >
//                       {c.content_type === "image" &&
//                         c.files.map((f, i) => (
//                           <motion.img
//                             key={i}
//                             src={f}
//                             alt=""
//                             style={{
//                               maxWidth: "100%",
//                               borderRadius: 8,
//                             }}
//                             initial={{ opacity: 0, scale: 0.9 }}
//                             animate={{ opacity: 1, scale: 1 }}
//                             transition={{ duration: 0.8, delay: 0.2 }}
//                           />
//                         ))}

//                       {c.content_type === "video" &&
//                         c.files.map((f, i) => (
//                           <motion.video
//                             key={i}
//                             autoPlay
//                             loop
//                             muted
//                             playsInline
//                             style={{
//                               width: "100%",
//                               borderRadius: 10,
//                               outline: "none",
//                             }}
//                             initial={{ opacity: 0 }}
//                             animate={{ opacity: 1 }}
//                             transition={{ duration: 1 }}
//                           >
//                             <source src={f} type="video/mp4" />
//                           </motion.video>
//                         ))}

                        
//                     </motion.div>
//                   )}


//                   {/* --- Text Section (Left Side) --- */}
//                   {c.content && (
//                     <motion.div
//                       initial={{ opacity: 0, x: -20 }}
//                       animate={{ opacity: 1, x: 0 }}
//                       transition={{ duration: 0.6, delay: 0.3 }}
//                       style={{
//                         width: "35%",
//                         background: "rgba(17, 18, 36, 0.85)",
//                         padding: 30,
//                         borderRadius: 12,
//                         boxShadow: "0 6px 16px rgba(0,0,0,0.3)",
//                         backdropFilter: "blur(5px)",
//                       }}
//                     >
//                       <p
//                         style={{
//                           fontSize: 16,
//                           color: "#ccc",
//                           lineHeight: 1.6,
//                         }}
//                       >
//                         {c.content}
//                       </p>
//                     </motion.div>
//                   )}



//                 </motion.div>
//               </React.Fragment>
//             ))}



//           </motion.div>
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
//             width: "120px",
//             height: "100px",
//             cursor: "pointer",
//             opacity: 0.6,
//             zIndex: 2,
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
//             width: "120px",
//             height: "100px",
//             cursor: "pointer",
//             opacity: 0.6,
//             zIndex: 2,
//           }}
//         >
//           ▶
//         </motion.button>
//       </div>
//     </motion.div>




//   );
// }

// export default ScreenView;

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

//       setContents(data.contents);
//       setBackground(data.background_url);

//       console.log(data.contents, "data.contents")

//       if (data.contents.length > 0) {
//         const first = data.contents[0];
//         setNextScreenId(first.next_screen_id);
//         setPrevScreenId(first.prev_screen_id);
//       }
//     } catch (err) {
//       console.error("❌ Error fetching contents:", err);
//     }
//   }

//   const handleNext = async () => {
//     if (!nextScreenId) {
//       alert("✅ You reached the last screen!");
//       return;
//     }
//     try {
//       navigate(`/screen/${nextScreenId}`);
//     } catch {
//       alert("❌ Could not load next screen");
//     }
//   };

//   const handlePrev = async () => {
//     if (!prevScreenId) {
//       alert("🚫 This is the first screen!");
//       return;
//     }
//     try {
//       navigate(`/screen/${prevScreenId}`);
//     } catch {
//       alert("❌ Could not load previous screen");
//     }
//   };

//   const getPositionStyle = (position) => {
//     switch (position) {
//       case "Top-Left":
//         return { position: "absolute", top: "5%", left: "5%" };
//       case "Top-Right":
//         return { position: "absolute", top: "5%", right: "5%" };
//       case "Bottom-Left":
//         return { position: "absolute", bottom: "5%", left: "5%" };
//       case "Bottom-Right":
//         return { position: "absolute", bottom: "5%", right: "5%" };
//       case "Center":
//         return {
//           position: "absolute",
//           top: "50%",
//           left: "50%",
//           transform: "translate(-50%, -50%)",
//         };
//       default:
//         return { position: "absolute", top: "10%", left: "10%" };
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
//       {/* --- Background Layer --- */}
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

//       {/* --- Foreground Overlay Contents --- */}
//       <div style={{ position: "relative", zIndex: 1, width: "100%", height: "100%" }}>
//         <AnimatePresence mode="wait">
//           {contents.map((c, idx) => (
//             <motion.div
//               key={c.id}
//               initial={{ opacity: 0, scale: 0.9 }}
//               animate={{ opacity: 1, scale: 1 }}
//               exit={{ opacity: 0 }}
//               transition={{ duration: 0.8, delay: idx * 0.2 }}
//               style={{
//                 ...getPositionStyle(c.position),
//                 background: "rgba(0, 0, 0, 0.6)",
//                 padding: "20px",
//                 borderRadius: "12px",
//                 maxWidth: "45%",
//                 color: "white",
//                 textAlign: "center",
//               }}
//             >
//               {c.content_type === "image" &&
//                 c.files.map((f, i) => (
//                   <motion.img
//                     key={i}
//                     src={f}
//                     alt=""
//                     style={{
//                       width: "100%",
//                       borderRadius: 8,
//                       marginBottom: 10,
//                     }}
//                     initial={{ opacity: 0, scale: 0.9 }}
//                     animate={{ opacity: 1, scale: 1 }}
//                     transition={{ duration: 0.8, delay: 0.2 }}
//                   />
//                 ))}

//               {c.content_type === "video" &&
//                 c.files.map((f, i) => (
//                   <motion.video
//                     key={i}
//                     autoPlay
//                     loop
//                     muted
//                     playsInline
//                     style={{
//                       width: "100%",
//                       borderRadius: 10,
//                       marginBottom: 10,
//                     }}
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     transition={{ duration: 1 }}
//                   >
//                     <source src={f} type="video/mp4" />
//                   </motion.video>
//                 ))}

//               {c.content && (
//                 <motion.p
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.6, delay: 0.3 }}
//                   style={{
//                     fontSize: 16,
//                     color: "#fff",
//                     lineHeight: 1.5,
//                   }}
//                 >
//                   {c.content}
//                 </motion.p>
//               )}
//             </motion.div>
//           ))}
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
//             width: "100px",
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
//             width: "100px",
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

//       setContents(data.contents);
//       setBackground(data.background_url);

//       console.log("✅ data.contents:", data.contents);

//       if (data.contents.length > 0) {
//         const first = data.contents[0];
//         setNextScreenId(first.next_screen_id);
//         setPrevScreenId(first.prev_screen_id);
//       }
//     } catch (err) {
//       console.error("❌ Error fetching contents:", err);
//     }
//   }

//   const handleNext = async () => {
//     if (!nextScreenId) {
//       alert("✅ You reached the last screen!");
//       return;
//     }
//     try {
//       navigate(`/screen/${nextScreenId}`);
//     } catch {
//       alert("❌ Could not load next screen");
//     }
//   };

//   const handlePrev = async () => {
//     if (!prevScreenId) {
//       alert("🚫 This is the first screen!");
//       return;
//     }
//     try {
//       navigate(`/screen/${prevScreenId}`);
//     } catch {
//       alert("❌ Could not load previous screen");
//     }
//   };

//   // ✅ Safe, visible position logic
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
//         return { ...base, top: "50%", left: "50%", transform: "translate(-50%, -50%)" };
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
//       {/* --- Background Layer --- */}
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

//       {/* --- Foreground Overlay Contents --- */}
//       <div
//         style={{
//           position: "relative",
//           zIndex: 1,
//           width: "100%",
//           height: "100vh", // ✅ fix: ensures overlay is visible for positioned elements
//           overflow: "hidden",
//         }}
//       >
        

//         <AnimatePresence mode="wait">
//           {contents.map((c, idx) => (
//             <motion.div
//               key={c.id}
//               drag
//               dragConstraints={{ top: 0, left: 0, right: 1920, bottom: 1080 }} // ✅ keep within screen
//               dragElastic={0.1}
//               initial={{ opacity: 0, scale: 0.9 }}
//               animate={{ opacity: 1, scale: 1 }}
//               exit={{ opacity: 0 }}
//               transition={{ duration: 0.8, delay: idx * 0.2 }}
//               style={{
//                 position: "absolute",
//                 top: c.top || "10%",
//                 left: c.left || "10%",
//                 background: "rgba(0, 0, 0, 0.6)",
//                 padding: "12px",
//                 borderRadius: "10px",
//                 color: "white",
//                 textAlign: "center",
//                 width: c.width || "300px",
//                 height: c.height || "auto",
//                 resize: "both",
//                 overflow: "auto",
//                 cursor: "grab",
//                 zIndex: 5,
//               }}
//               onDragEnd={(event, info) => {
//                 console.log("Moved:", info.point);
//                 // ✅ you can save new position to DB if needed
//               }}
//             >
//               {/* --- Image --- */}
//               {c.content_type === "image" &&
//                 c.files.map((f, i) => (
//                   <img
//                     key={i}
//                     src={f}
//                     alt=""
//                     style={{
//                       width: "100%",
//                       height: "auto",
//                       maxHeight: "250px",
//                       objectFit: "contain",
//                       borderRadius: 8,
//                       marginBottom: 8,
//                     }}
//                   />
//                 ))}

//               {/* --- Video --- */}
//               {c.content_type === "video" &&
//                 c.files.map((f, i) => (
//                   <video
//                     key={i}
//                     autoPlay
//                     loop
//                     muted
//                     playsInline
//                     style={{
//                       width: "100%",
//                       height: "auto",
//                       maxHeight: "250px",
//                       borderRadius: 8,
//                       marginBottom: 8,
//                       objectFit: "contain",
//                     }}
//                   >
//                     <source src={f} type="video/mp4" />
//                   </video>
//                 ))}

//               {/* --- Text --- */}
//               {c.content && (
//                 <p
//                   style={{
//                     fontSize: "clamp(12px, 1.5vw, 18px)",
//                     color: "#fff",
//                     lineHeight: 1.4,
//                     wordBreak: "break-word",
//                   }}
//                 >
//                   {c.content}
//                 </p>
//               )}
//             </motion.div>
//           ))}
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
//             width: "100px",
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
//             width: "100px",
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
//       console.log("✅ data.contents:", data.contents);
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

//   // ✅ Define preset positions for backend-provided zones
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
//             // ✅ If backend sends Top/Left → use them
//             // ✅ Else use named position fallback
//             const customStyle =
//               c.top || c.left
//                 ? {
//                     top:
//                       typeof c.top === "number"
//                         ? `${c.top}px`
//                         : c.top || "10%",
//                     left:
//                       typeof c.left === "number"
//                         ? `${c.left}px`
//                         : c.left || "10%",
//                     position: "absolute",
//                   }
//                 : getPositionStyle(c.position);

//             return (
//               <motion.div
//                 key={c.id}
//                 drag
//                 dragConstraints={false}
//                 dragElastic={0.1}
//                 initial={{ opacity: 0, scale: 0.9 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 exit={{ opacity: 0 }}
//                 transition={{ duration: 0.8, delay: idx * 0.2 }}
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
//                 onDragEnd={(event, info) => {
//                   console.log("Moved:", info.point);
//                   // TODO: Optional - save new top/left to backend
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
//                 {c.qr_code_url && (
//                   <img src={c.qr_code_url} alt="QR Code" className="w-32 h-32 mt-4" />
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

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Api from "../Api/Api";
import * as ActionCable from "@rails/actioncable";
import { motion, AnimatePresence } from "framer-motion";

const cable = ActionCable.createConsumer("ws://localhost:3000/cable");

function ScreenView() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const token = sessionStorage.getItem("authToken");

  const [contents, setContents] = useState([]);
  const [background, setBackground] = useState(null);
  const [nextScreenId, setNextScreenId] = useState(null);
  const [prevScreenId, setPrevScreenId] = useState(null);

  // 🎬 Transition styles mapping
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

      setContents(data.contents || []);
      setBackground(data.background_url);
      console.log("✅ data.contents:", data.contents);

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

  // 🧩 Preset position styles
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
      transition={{ duration: 1.2 }}
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

      {/* --- Foreground Overlay --- */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        <AnimatePresence mode="wait">
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

            // 💫 Pick the animation variant (default: fade)
            const variant = transitionVariants[c.transition_effect || "fade"];

            return (
              <motion.div
                key={c.id}
                variants={variant}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.8, delay: idx * 0.3 }}
                drag
                dragConstraints={false}
                dragElastic={0.1}
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
          whileHover={{ scale: 1.1, backgroundColor: "#f0f0f0" }}
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
          whileHover={{ scale: 1.1, backgroundColor: "#f0f0f0" }}
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
