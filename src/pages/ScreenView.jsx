import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Api from "../Api/Api";
import * as ActionCable from "@rails/actioncable";
import { motion, AnimatePresence, number } from "framer-motion";
import smoke from ".././../public/smoke.gif";

// const cable = ActionCable.createConsumer("ws://localhost:3000/cable");
const cable = ActionCable.createConsumer("wss://backendafp.connectorcore.com/cable");

function ScreenView() {
  const { slug } = useParams();
  const [container, setContainer] = useState(null);
  // const containerId = new URLSearchParams(window.location.search).get("container");
  // setContainer(containerId);


  const navigate = useNavigate();
  const token = sessionStorage.getItem("authToken");

  const [contents, setContents] = useState([]);
  const [background, setBackground] = useState(null);
  const [displayMode, setDisplayMode] = useState("normal-view");

  const [activeIndex, setActiveIndex] = useState(0);

  const containerRef = useRef(null);
  const [showFullText, setShowFullText] = useState(false);

  const [mode, setMode] = useState("diagonal-split-view");
  const [selected, setSelected] = useState(null);

  const [subselected, setSubselected] = useState(null)


  const [screenName, setScreenName] = useState(null);
  const [containerLogo, setContainerLogo] = useState(null);
  const [containerId, setContainerId] = useState(null);

  const [subgalleryOpen, SetSubgalleryOpen] = useState(null)

  const morepage = sessionStorage.getItem("moresection") === "true";





  const trimWords = (text, limit = 50) => {
    const words = text.split(" ");
    if (words.length <= limit) return text;
    return words.slice(0, limit).join(" ") + "...";
  };


  const [galleryOpen, setGalleryOpen] = useState(false);



  useEffect(() => {
    fetchContents();
    const subscription = cable.subscriptions.create(
      { channel: "ScreenChannel", slug: slug },
      {
        received: (data) => {
          if (data.action === "refresh") {
            fetchContents();
          }
        }
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

      const data = await res.json();
      console.log("---------------data-----sssssss----------------", data)
      setContents(data.contents || []);
      setBackground(data.background_url);

      setContainer(containerId || null);
      setScreenName(data.screen_name || "");
      setContainerLogo(data.container_files || null)
      setContainerId(data.container_ids || null)
      // console.log("aaaaaaaaaaaaaaaaaaaaaaaa-----------",data)
      setMode(data.display_mode)


    } catch (err) {
      console.error("❌ Error:", err);
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


  const limitWords = (text, limit = 40) => {
    if (!text) return "";
    const words = text.split(" ");
    if (words.length <= limit) return text;
    return words.slice(0, limit).join(" ") + "...";
  };



  /* ----------------------------------------------------------------------------------------
     🔵 NORMAL VIEW (your default view)
  -----------------------------------------------------------------------------------------*/
  const renderNormalView = () => (
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
      </div>
    </motion.div>
  );


  const PresentationView = () => {
    if (!selected) return null;

    console.log("----selected-------------0000---------selected-------", selected);

    const [logoAnimated, setLogoAnimated] = useState(false);
    useEffect(() => {
      setLogoAnimated(true);
    }, []);

    // 🔥 FIXED IMAGES ARRAY — includes sub_image + individual_contents
    const images =
      selected.sub_contents?.map((d) => ({
        individual_contents: d.individual_contents,
        sub_image: d.sub_image,
      })) || [];

    // ❗ Start with no image selected
    const [activeIndex, setActiveIndex] = useState(null);

    const nextImage = () => {
      if (activeIndex === null) return;
      setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    const prevImage = () => {
      if (activeIndex === null) return;
      setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    // Background always uses the first/main image
    const backgroundImage = selected.sub_contents?.[0].main_image;

    return (
      <div
        className={`relative w-full h-screen text-white flex items-center justify-center
          ${activeIndex !== null ? "backdrop-blur-md brightness-70" : ""}
        `}
        style={{
          backgroundImage: `url(${selected.background_url || backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >

        {/* ---------- TOP LEFT LOGO ---------- */}
        <div
          className="absolute top-4 left-6 cursor-pointer z-[9999]"
          style={{ perspective: "1200px" }}
          onClick={() => setMode("slide-view")}
        >
          <img
            src={containerLogo}
            alt="logo"
            className={`h-48 w-auto object-contain z-[9999] ${logoAnimated ? "logo-animate-sliderInner" : "block-hidden"
              }`}
          />
        </div>

        {/* ---------- MAIN TEXT ---------- */}
        <div className="relative flex flex-col items-center z-20">
          <h1 className="text-5xl font-bold mb-8 text-center">
            {selected.title}
          </h1>

          <div
            className="user-content w-[70%] text-2xl leading-relaxed text-center bg-black/30 p-3 rounded-2xl"
            dangerouslySetInnerHTML={{ __html: selected.sub_contents?.[0].description }}
          />



        </div>

        {/* ---------- CENTER LARGE IMAGE ---------- */}
        {activeIndex !== null && (
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                      rounded-xl shadow-2xl z-30  p-4"
          >
            <img
              src={images[activeIndex]?.sub_image}
              className="w-[90vw] max-w-[1150px] h-[60vh] object-cover rounded-xl"

            />

            {/* 🔥 SHOW individual_contents BELOW IMAGE */}
            <p className="text-white text-xl text-center mt-4 w-[55vw] mx-auto p-2 bg-black/30 rounded-xl">
              {images[activeIndex]?.individual_contents}
            </p>
          </div>
        )}

        {/* ---------- CLOSE BUTTON ---------- */}
        {activeIndex !== null && (
          <div
            onClick={() => setActiveIndex(null)}
            className="absolute top-5 cursor-pointer z-40"
          >
            <div className="text-white text-5xl font-bold drop-shadow">Back</div>
          </div>
        )}

        {/* ---------- LEFT ARROW ---------- */}
        {activeIndex !== null && (
          <div
            onClick={prevImage}
            className="absolute left-20 top-1/2 -translate-y-1/2 text-6xl cursor-pointer opacity-70 hover:opacity-100 z-40"
          >
            ❮
          </div>
        )}

        {/* ---------- RIGHT ARROW ---------- */}
        {activeIndex !== null && (
          <div
            onClick={nextImage}
            className="absolute right-20 top-1/2 -translate-y-1/2 text-6xl cursor-pointer opacity-70 hover:opacity-100 z-40"
          >
            ❯
          </div>
        )}

        {/* ---------- QR CODE ---------- */}
        {selected.qr_code_url && (
          <div className="absolute top-24 right-20 flex flex-col items-center z-40">
            <div className="w-24 h-24 overflow-hidden ">
              <img
                src={selected.qr_code_url}
                className="w-full h-full object-cover scale-[1.5]" // zoom into QR
                alt="QR"
              />
            </div>

            <span className="mt-2 text-white font-semibold">Learn More</span>
          </div>
        )}


        {/* ---------- BOTTOM THUMBNAILS ---------- */}
        {activeIndex == null && (
          <div
            className="
              absolute bottom-10 left-0 w-full 
              overflow-x-auto whitespace-nowrap 
              px-6 py-2 hide-scrollbar z-40
            "
          >
            {images.map((item, i) => (
              <div key={i} className="inline-block mr-6 text-center">
                <img
                  src={item.sub_image}
                  onClick={() => setActiveIndex(i)}
                  className={`
                    w-40 h-28 object-cover rounded-lg shadow-xl cursor-pointer 
                    transition-all duration-300
                    ${activeIndex === i
                      ? "opacity-100 scale-110 border-4 border-white"
                      : "opacity-60 hover:opacity-100"
                    }
                  `}
                />

                {/* 🔥 TEXT UNDER EACH THUMBNAIL */}
                {/* <p className="text-white text-sm mt-2 w-40">
                  {item.individual_contents}
                </p> */}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };


  // Replace your existing renderSlideView with this version
  const renderSlideView = () => {
    // handle empty
    if (!contents || contents.length === 0) {
      return (
        <div className="flex items-center justify-center h-screen text-white">
          No contents
        </div>
      );
    }

    const prev = () =>
      setActiveIndex((prev) => (prev === 0 ? contents.length - 1 : prev - 1));

    const next = () =>
      setActiveIndex((prev) => (prev === contents.length - 1 ? 0 : prev + 1));

    // Return one of: left2, left1, center, right1, right2, hidden
    const getPosition = (index) => {
      const total = contents.length;
      const diff = (index - activeIndex + total) % total;

      if (diff === 0) return "center";
      if (diff === 1) return "right1";
      if (diff === 2) return "right2";
      if (diff === total - 1) return "left1";
      if (diff === total - 2) return "left2";
      return "hidden";
    };

    return (
      <div
        className="relative flex flex-col items-center justify-center h-screen overflow-hidden"
        style={{
          backgroundImage: `url(${background})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* TOP LOGO */}
        <div
          className="absolute top-4 cursor-pointer z-50"
          onClick={() => navigate(`/container/${container}`)}
        >
          <img
            src={containerLogo}
            alt="logo"
            className="h-20 sm:h-24 md:h-32 lg:h-32 w-auto object-contain"
          />
        </div>

        {/* SLIDER */}
        <div className="relative w-full h-[60%] sm:h-[65%] md:h-[80%] flex items-center justify-center">
          {contents.map((c, index) => {
            const pos = getPosition(index);

            // base style
            let style = {
              position: "absolute",
              width: "78vw",
              maxWidth: "500px",
              height: "50vh",
              maxHeight: "300px",
              borderRadius: "12px",
              overflow: "hidden",
              transition: "all 0.6s ease",
              opacity: 0,
              zIndex: 5,
              filter: "grayscale(60%)",
              cursor: "pointer",
              display: "none",
              willChange: "transform, opacity",
              backgroundColor: "rgba(0,0,0,0.12)",
            };

            // offsets for mobile/desktop (two steps)
            const mobileOffset1 = "42vw";
            const mobileOffset2 = "80vw";
            const desktopOffset1 = "250px";
            const desktopOffset2 = "400px";
            const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
            const off1 = isMobile ? mobileOffset1 : desktopOffset1;
            const off2 = isMobile ? mobileOffset2 : desktopOffset2;

            // vertical offsets
            const centerY = "-60px"; // center moves up
            const sideY = "10px"; // first-side moves down
            const farSideY = "80px"; // second-side moves more down (optional)

            // apply position-specific transforms/styles
            if (pos === "center") {
              style.display = "block";
              style.transform = `translateY(${centerY}) scale(1)`;
              style.opacity = 1;
              style.zIndex = 80;
              style.filter = "grayscale(0%)";
              style.width = isMobile ? "86vw" : style.width;
              style.maxWidth = isMobile ? "86vw" : style.maxWidth;
            } else if (pos === "left1") {
              style.display = "block";
              style.transform = `translateX(-${off1}) translateY(${sideY}) scale(0.88)`;
              style.opacity = 0.75;
              style.zIndex = 60;
              style.filter = "grayscale(10%)";
            } else if (pos === "right1") {
              style.display = "block";
              style.transform = `translateX(${off1}) translateY(${sideY}) scale(0.88)`;
              style.opacity = 0.75;
              style.zIndex = 60;
              style.filter = "grayscale(10%)";
            } else if (pos === "left2") {
              style.display = "block";
              style.transform = `translateX(-${off2}) translateY(${farSideY}) scale(0.72)`;
              style.opacity = 0.45;
              style.zIndex = 40;
              style.filter = "grayscale(30%)";
            } else if (pos === "right2") {
              style.display = "block";
              style.transform = `translateX(${off2}) translateY(${farSideY}) scale(0.72)`;
              style.opacity = 0.45;
              style.zIndex = 40;
              style.filter = "grayscale(30%)";
            }

            const handleClick = () => {
              if (pos === "left1" || pos === "left2") prev();
              else if (pos === "right1" || pos === "right2") next();
              else if (pos === "center") {
                setSelected(c);
                if (c.has_subcontent) setMode("presentation-view");
                else setMode("detail");
              }
            };

            return (
              <motion.div
                key={c.id ?? index}
                style={style}
                onClick={handleClick}
                initial={{ opacity: 0 }}
                animate={{ opacity: style.opacity }}
                transition={{ duration: 0.6 }}
              >
                {/* media: use object-cover for consistent fill */}
                {c.files?.[0] ? (
                  <img
                    src={c.files[0]}
                    className="w-full h-full object-cover"
                    alt={c.title}
                    style={{
                      objectPosition: "center center",
                      display: "block",
                      height: "100%",
                      width: "100%",
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full bg-black/50 text-white">
                    No Image
                  </div>
                )}

                {/* center title overlay */}
                {pos === "center" && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white drop-shadow-xl text-center px-4">
                      {c.title}
                    </h2>
                  </div>
                )}

                {/* clickable hot area for center */}
                {pos === "center" && (
                  <div
                    className="absolute inset-0 cursor-pointer pointer-events-auto"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelected(c);
                      if (c.has_subcontent) setMode("presentation-view");
                      else setMode("detail");
                    }}
                  />
                )}
              </motion.div>
            );
          })}
        </div>

        {/* BOTTOM DESCRIPTION (single) */}
        <div
          className="absolute bottom-6 w-[90%] sm:w-[80%] text-center text-white
                        text-sm sm:text-base md:text-lg lg:text-xl
                        leading-relaxed
                        p-3 sm:p-4 md:p-5 rounded-xl"
        >
          <div
            className="prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: contents[activeIndex]?.content || "" }}
          />
        </div>

      </div>
    );
  };



  /* ----------------------------------------------------------------------------------------
     🟣 THUMBNAIL GALLERY VIEW (bottom images → click to show big view)
  -----------------------------------------------------------------------------------------*/


  const renderThumbnailGalleryView = () => {
    const active = contents[activeIndex];

    return (
      <div
        className="relative w-full min-h-screen flex flex-col"
        style={{
          backgroundImage: `url(${background})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >

        {/* ===== TOP RIGHT LOGO (Responsive size) ===== */}
        <div
          className="absolute top-3 right-3 cursor-pointer z-[9999]"
          onClick={() => {
            if (morepage) {
              navigate(`/container/${container}/more`);
            } else {
              navigate(`/container/${container}`);
            }

          }}
        >
          <img
            src={containerLogo}
            alt="logo"
            className="h-20 w-auto md:h-40 object-contain animate-thumb-view"
          />
        </div>

        {/* ===== MAIN LAYOUT GRID ===== */}
        <div className="
          flex-grow 
          grid grid-cols-1 md:grid-cols-2 
          gap-6 md:gap-10 
          px-4 md:px-12 
          pt-20 md:pt-28
        ">

          {/* ===== LEFT FULL IMAGE ===== */}
          <div
            className="
              w-full 
              h-[40vh] md:h-[65vh] 
              rounded-xl shadow-2xl 
              border border-white/10
            "
            style={{
              backgroundImage: `url(${active.files[0]})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></div>

          {/* ===== RIGHT TEXT BLOCK ===== */}
          <div className="flex flex-col justify-start items-start">

            <div className="
              bg-black/35 backdrop-blur-sm 
              p-5 md:p-10 lg:p-16 
              rounded-xl 
              w-full max-w-4xl 
              shadow-xl
            ">

              {!showFullText ? (
                <>
                  <p className="text-white text-xl md:text-2xl lg:text-3xl leading-relaxed">
                    {limitWords(active?.content, 100)}
                  </p>

                  {active?.content?.split(" ").length > 100 && (
                    <button
                      onClick={() => setShowFullText(true)}
                      className="mt-3 text-yellow-300 font-semibold underline"
                    >
                      Read More
                    </button>
                  )}
                </>
              ) : (
                <>
                  <div className="max-h-[300px] md:max-h-[400px] overflow-y-auto pr-2">
                    <p className="text-white text-xl md:text-2xl lg:text-3xl leading-relaxed">
                      {active?.content}
                    </p>
                  </div>

                  <button
                    onClick={() => setShowFullText(false)}
                    className="mt-3 text-yellow-300 font-semibold underline"
                  >
                    Read Less
                  </button>
                </>
              )}

            </div>
          </div>

          {/* ===== QR CODE (Right-Bottom, Responsive) ===== */}
          {active?.qr_code_url && (
            <div className="absolute bottom-5 right-5 flex flex-col items-center">
              <img
                src={active.qr_code_url}
                className="w-24 h-24 md:w-36 md:h-36 lg:w-40 lg:h-40 bg-white p-2 rounded-xl shadow-2xl"
                alt="QR Code"
              />
              <span className="mt-2 text-white font-semibold text-xs md:text-base">
                Learn More
              </span>
            </div>
          )}

        </div>

        {/* ===== THUMBNAILS ROW (Responsive scroll) ===== */}
        <div className="
          w-full p-3 md:p-4 
          bg-black/40 
          flex gap-2 md:gap-4 
          overflow-x-auto 
          border-t border-white/30
        ">
          {contents.map((c, i) => (
            <img
              key={i}
              src={c.files?.[0]}
              alt=""
              onClick={() => setActiveIndex(i)}
              className={`
                h-20 w-24 md:h-28 md:w-32 
                object-cover rounded-lg cursor-pointer 
                border-2 md:border-4 transition-all duration-300 
                ${activeIndex === i
                  ? "border-yellow-400 scale-105"
                  : "border-transparent opacity-60 hover:opacity-100"
                }
              `}
            />
          ))}
        </div>

      </div>
    );
  };

  const DiagonalHomeView = () => {
    const navigate = useNavigate();
    const overlapVW = 11;
    const [logoAnimated, setLogoAnimated] = useState(false);
    useEffect(() => {
      setLogoAnimated(true);  // start animating
    }, []);


    return (
      <div
        className="relative w-full h-screen overflow-hidden flex"
        style={{
          backgroundImage: `url(${background})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >

        <div
          className="absolute top-4 left-6 cursor-pointer z-[9999]"
          style={{ perspective: "1200px" }}
          onClick={() => navigate(`/container/${containerId}`)}

        >
          <img
            src={containerLogo}
            alt="logo"
            className={`h-48 w-auto object-contain z-[9999] ${logoAnimated ? "logo-animate-diagonal" : ""
              }`}
          />
        </div>


        {/* LEFT EMPTY AREA */}
        <div className="w-[14%] h-full relative flex items-center justify-center shrink-0">
          <div
            onClick={() => navigate(`/container/${containerId}`)}

            className="absolute bottom-4 cursor-pointer select-none justify-center gap-3"
          >
            <p className="text-3xl font-bold tracking-wide text-white drop-shadow mt-1">
              BACK
            </p>
          </div>
        </div>




        {/* RIGHT SIDE */}
        <div className="w-[90%] h-full overflow-x-auto overflow-y-hidden whitespace-nowrap hide-scrollbar relative">

          {contents.map((item, index) => (
            <div
              key={index}
              onClick={() => {
                setSelected(item);
                setMode("detail");
              }}
              className="
                      inline-block relative cursor-pointer group
                    w-[80vw] sm:w-[60vw] md:w-[45vw] lg:w-[36vw]

                    h-screen
                    "
              style={{
                transform: `translateX(-${index * overlapVW}vw)`,
                clipPath: "polygon(30% 0, 100% 0, 70% 100%, 0% 100%)",
              }}
            >

              {/* Background */}
              <div
                className="absolute inset-0 bg-cover bg-center brightness-140 
                          group-hover:brightness-100 transition-all duration-700"
                style={{ backgroundSize: "100% auto", backgroundImage: `url(${item.files?.[0]})` }}
              />

              {/* CENTERED LOGO + TITLE */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-full flex flex-col items-center justify-center text-center translate-x-[2%] -translate-y-[5%]">

                  {item.logo && (
                    <img
                      src={item.logo}
                      className="w-24 h-24 md:w-32 md:h-32 object-contain drop-shadow-xl 
                                group-hover:scale-110 transition-transform duration-500"
                      alt=""
                    />
                  )}

                  <p className="text-white text-xl md:text-3xl font-bold mt-4 
                                drop-shadow-2xl tracking-wide uppercase text-center">
                    {item.title}
                  </p>

                </div>
              </div>

              {/* Dark overlay */}
              <div className="absolute inset-0 bg-black/15"></div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const DetailView = () => {
    if (!selected) return null;
    console.log("-----------------selected---------------", selected)
    // READ MORE state
    // Slide-in animation (Right → Left)
    const slideIn = {
      initial: { x: 200, opacity: 0 },
      animate: { x: 0, opacity: 1 },
      transition: { duration: 0.8, ease: "easeOut" }
    };

    // const text = selected.content || "";
    // const words = text.split(" ");
    // const isLong = words.length > 50;
    // const previewText = words.slice(0, 50).join(" ") + "...";


    function stripHtml(html) {
      const temp = document.createElement("div");
      temp.innerHTML = html;
      return temp.textContent || temp.innerText || "";
    }


    const fullHtml = selected.content || "";
    const plainText = stripHtml(fullHtml);

    const words = plainText.split(" ");
    const isLong = words.length > 50;
    const previewText = words.slice(0, 50).join(" ") + "...";



    return (
      <div
        className="relative w-full h-screen text-white"
        style={{
          backgroundImage: `url(${selected.background_url || background})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
      >
        {/* Dark overlay (adjust opacity as needed) */}
        <div className="absolute inset-0 bg-black/30" />

        {/* === LEFT SLANTED IMAGE PANEL (ANIMATED) === */}
        <motion.div
          className="absolute inset-y-0 left-0 w-1/3 ml-10 shadow-4xl brightness-140"
          style={{
            backgroundImage: `url(${selected.files?.[0] || bgUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            clipPath: "polygon(26% 0, 100% 0, 74% 100%, 0% 100%)"
          }}
          initial="initial"
          animate="animate"
          variants={slideIn}
        >
          {selected.logo && (
            <div
              className="absolute inset-0 flex items-center justify-center cursor-pointer"
              onClick={() => setMode("diagonal-split-view")}
            >
              <div className="grid">
                <img
                  src={selected.logo}
                  className="w-32 h-32 md:w-42 md:h-42 drop-shadow-2xl"
                  alt="Logo"
                />
                <h1 className="text-3xl font-bold mb-6">{selected.title}</h1>
              </div>
            </div>
          )}
        </motion.div>

        {/* === RIGHT SIDE TEXT BLOCK === */}
        <motion.div
          className="
    absolute 
    top-1/2 
    right-40 
    -translate-y-1/2
    bg-black/30
    p-8 
    border-3 border-black
    max-w-3xl
  "
        >
          {/* Fixed-height scrollable content (always show full HTML) */}
          <div className="h-[300px] overflow-y-auto pr-2 user-content">
            <div
              className="text-xl leading-relaxed whitespace-pre-line text-justify text-white"
              dangerouslySetInnerHTML={{ __html: fullHtml }}
            />
          </div>
        </motion.div>


        {/* === QR CODE (BOTTOM RIGHT) === */}
        {selected.qr_code_url && (
          <div className="absolute bottom-10 right-10 text-center">
            <div className="mt-2 text-xl font-semibold text-white">Learn More</div>
          </div>
        )}
      </div>
    );
  };



  const renderCardCarouselView = () => {
    return (
      <div
        className="w-full min-h-screen bg-cover bg-center relative p-4 md:p-10"
        style={{ backgroundImage: `url(${background})` }}
      >
        {/* BACK BUTTON */}
        {/* <div
          onClick={() => navigate(`/container/${container}`)}
          className="absolute left-4 md:left-10 top-4 md:top-10 cursor-pointer select-none flex items-center gap-2 md:gap-3 z-50"
        >
          <span className="text-white text-3xl md:text-5xl font-bold drop-shadow">←</span>

          <p className="text-white text-lg md:text-2xl font-bold tracking-wide drop-shadow mt-1">
            BACK
          </p>
        </div> */}

        {/* TITLE */}
        <h1 className="text-center text-3xl md:text-6xl font-bold text-white drop-shadow mb-8 md:mb-16 px-4">
          {screenName || "CONTENT LIST"}
        </h1>

        {/* LOGO */}
        <div
          className="absolute top-2 md:top-4 right-2 md:right-4 cursor-pointer"
          onClick={() => {
            if (morepage) {
              navigate(`/container/${container}/more`);
            } else {
              navigate(`/container/${container}`);
            }

          }}
        >
          <img
            src={containerLogo}
            alt="logo"
            className="h-16 md:h-36 w-auto object-contain"
          />
        </div>

        {/* HORIZONTAL SCROLL CARDS */}
        <div className="w-full overflow-x-auto overflow-y-hidden pb-5 no-scrollbar">
          <div className="flex gap-6 md:gap-10 flex-nowrap px-4 md:px-10 w-fit">

            {contents.map((item, index) => (
              <div
                key={index}
                onClick={() => {
                  setSelected(item);
                  setMode("card-detail");
                }}
                className="
                  relative
                  min-w-[220px] sm:min-w-[260px] md:min-w-[340px] lg:min-w-[380px]
                  h-[380px] sm:h-[460px] md:h-[620px] lg:h-[720px]
                  rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden
                  cursor-pointer transition-transform hover:scale-105
                  bg-cover bg-center
                "
                style={{
                  backgroundImage: `url(${item.files?.[0]})`,
                }}
              >

                {/* Overlay for readability */}
                <div className="absolute inset-0 bg-black/30"></div>

                {/* TITLE */}
                <div className="
                  absolute inset-0 flex items-center justify-center 
                  text-center p-2 sm:p-4
                ">
                  <p className="text-white text-xl sm:text-2xl md:text-4xl font-bold drop-shadow-lg px-2">
                    {item.title}
                  </p>
                </div>

              </div>
            ))}

          </div>
        </div>
      </div>
    );
  };


  const renderCardDetailView = () => {
    if (!selected) return null;

    return (
      <div
        className="w-full min-h-screen bg-cover bg-center relative p-4 md:p-10 text-white"
        style={{ backgroundImage: `url(${selected.background_url || background})` }}
      >

        {/* BACK BUTTON */}
        <div
          onClick={() => setMode("card-carousel")}
          className="absolute left-4 md:left-10 top-4 md:top-10 cursor-pointer select-none flex items-center gap-2 md:gap-3 z-50"
        >
          <span className="text-white text-3xl md:text-5xl font-bold drop-shadow">←</span>
          <p className="text-lg md:text-2xl font-bold tracking-wide drop-shadow mt-1">
            BACK
          </p>
        </div>

        {/* TITLE */}
        <div className="flex justify-center mb-6 md:mb-10 px-2 slide-up z-[9999]">
          <div className="bg-yellow-400 text-black px-6 md:px-10 py-3 md:py-4 rounded-xl shadow-xl 
                          text-xl md:text-3xl font-bold text-center">
            {selected.title}
          </div>
        </div>

        {/* LOGO */}
        <div
          className="absolute top-2 md:top-4 right-2 md:right-4 cursor-pointer"
          onClick={() => {
            if (morepage) {
              navigate(`/container/${container}/more`);
            } else {
              navigate(`/container/${container}`);
            }

          }}
        >
          <img
            src={containerLogo}
            alt="logo"
            className="h-20 w-auto md:h-40 object-contain"
          />
        </div>

        {/* CENTER PANEL */}
        <div
          className="
            absolute left-1/2 w-[95%] sm:w-[90%] md:w-[80%] max-w-7xl
            bg-white/20 backdrop-blur-xl p-6 md:p-12 rounded-3xl shadow-2xl
            transform -translate-x-1/2
            top-[22%] sm:top-[20%] md:top-[15%]   /* ✅ FIX: added more spacing */
            z-[50]
          "
        >


          {/* MAIN CONTENT BLOCK */}
          <div className="flex flex-col md:flex-row gap-6 md:gap-12 pb-16 md:pb-24 px-2 md:px-6">

            {/* LEFT IMAGE */}
            <div className="w-full md:w-[60%] flex flex-col items-center gap-4 md:gap-6">

              <img
                src={selected.sub_contents?.[0].sub_image}
                className="w-full max-w-2xl md:max-w-3xl rounded-2xl shadow-xl"
                alt=""
              />

              {/* View Gallery */}
              {selected.has_subcontent && (
                <button
                  onClick={() => setGalleryOpen(true)}
                  className="w-full max-w-2xl bg-white/30 backdrop-blur-lg text-white
                              font-semibold text-lg md:text-xl py-3 md:py-4 
                              rounded-xl shadow-lg border border-white/40"
                >
                  View Gallery
                </button>
              )}

            </div>

            {/* RIGHT TEXT */}
            {/* <div className="w-full md:w-[50%] text-base md:text-xl leading-relaxed">

              {showFullText ? (
                <>
                  {selected.content}
                  <button
                    onClick={() => setShowFullText(false)}
                    className="text-yellow-300 font-bold ml-2 underline"
                  >
                    Show less
                  </button>
                </>
              ) : (
                <>
                  {trimWords(selected.content, 60)}
                  <button
                    onClick={() => setShowFullText(true)}
                    className="text-yellow-300 font-bold ml-2 underline"
                  >
                    Show more
                  </button>
                </>
              )}

            </div> */}

            <div className="w-full md:w-[50%] text-base md:text-xl leading-relaxed">

              {showFullText ? (
                <>
                  {/* FULL HTML CONTENT */}
                  <div
                    className="user-content"
                    dangerouslySetInnerHTML={{ __html: selected.content }}
                  />

                  <button
                    onClick={() => setShowFullText(false)}
                    className="text-yellow-300 font-bold ml-2 underline"
                  >
                    Show less
                  </button>
                </>
              ) : (
                <>
                  {/* TRIMMED HTML CONTENT */}
                  <div
                    className="user-content"
                    dangerouslySetInnerHTML={{
                      __html: trimWords(selected.content, 60),
                    }}
                  />

                  <button
                    onClick={() => setShowFullText(true)}
                    className="text-yellow-300 font-bold ml-2 underline"
                  >
                    Show more
                  </button>
                </>
              )}

            </div>











          </div>


          {/* QR CODE */}
          {selected.qr_code_url && (
            <div className="absolute bottom-4 md:bottom-8 right-4 md:right-8 flex flex-col items-center">
              <img
                src={selected.qr_code_url}
                className="w-28 h-28 md:w-44 md:h-44 bg-white p-2 md:p-3 rounded-xl shadow-xl"
                alt="QR"
              />
              <span className="mt-2 text-white font-semibold text-sm md:text-base">
                Learn More
              </span>
            </div>
          )}

        </div>
      </div>
    );
  };


  const renderGalleryView = () => {
    const mediaFiles = selected.sub_contents?.[0].gallery_images || [];

    const isVideo = (url) => {
      return url.match(/\.(mp4|mov|webm)$/i); // Detect video formats
    };

    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-xl z-[9999] flex flex-col items-center pt-10 px-4 text-white">

        {/* CARD CONTAINER */}
        <div
          className="
            w-full max-w-6xl 
            bg-black/70 border border-white/10 
            rounded-3xl shadow-2xl
            p-10
            mt-10
            flex flex-col
            items-center
          "
        >
          {/* BACK BUTTON */}
          <div
            onClick={() => setGalleryOpen(false)}
            className="cursor-pointer flex items-center gap-3 mb-4 self-start"
          >
            <span className="text-white text-2xl font-bold drop-shadow">←</span>
            <p className="text-xl font-bold drop-shadow">BACK</p>
          </div>

          {/* TITLE */}
          <h1 className="text-2xl md:text-2xl font-bold text-center mb-8">
            View Gallery
          </h1>

          {/* SCROLLABLE GRID */}
          <div
            className="
              grid 
              grid-cols-1 
              sm:grid-cols-2 
              md:grid-cols-3 
              gap-8
              w-full
              overflow-y-auto
              pr-3
            "
            style={{ maxHeight: "65vh" }}
          >
            {mediaFiles.map((file, i) => (
              <div key={i} className="w-full h-60 md:h-64 rounded-xl shadow-xl overflow-hidden border border-white/20">

                {/* If video → render video */}
                {isVideo(file) ? (
                  <video
                    controls
                    className="w-full h-full object-cover rounded-xl"
                  >
                    <source src={file} type="video/mp4" />
                    Your browser does not support video playback.
                  </video>
                ) : (
                  /* Else show image */
                  <img
                    src={file}
                    className="w-full h-full object-cover rounded-xl"
                    alt=""
                  />
                )}

              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };


  // =============================================================

  const PresentationShowcaseView = () => {

    // SLIDE NAVIGATION
    const prev = () =>
      setActiveIndex((prev) => (prev === 0 ? contents.length - 1 : prev - 1));

    const next = () =>
      setActiveIndex((prev) =>
        prev === contents.length - 1 ? 0 : prev + 1
      );

    // FIXED: Circular Position Logic
    const getPosition = (index) => {
      const last = contents.length - 1;

      if (index === activeIndex) return "center";

      // LEFT (previous)
      if (
        index === activeIndex - 1 ||
        (activeIndex === 0 && index === last)
      ) {
        return "left";
      }

      // RIGHT (next)
      if (
        index === activeIndex + 1 ||
        (activeIndex === last && index === 0)
      ) {
        return "right";
      }

      return "hidden";
    };

    const active = contents[activeIndex];

    return (
      <div
        className="relative flex flex-col items-center justify-center h-screen overflow-hidden"
        style={{
          backgroundImage: `url(${background})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* LOGO */}
        <div
          className="absolute top-4 right-8 cursor-pointer z-50"
          onClick={() => {
            if (morepage) navigate(`/container/${container}/more`);
            else navigate(`/container/${container}`);
          }}
        >
          <img
            src={active.logo || containerLogo}
            alt="logo"
            className="h-20 sm:h-24 md:h-38 lg:h-48 w-auto object-contain"
          />
        </div>

        {/* SLIDER */}
        <div className="relative w-full h-[60%] sm:h-[65%] md:h-[70%] flex items-center justify-center">

          {contents.map((c, index) => {
            const pos = getPosition(index);

            // BASE STYLE
            let style = {
              position: "absolute",
              width: "80vw",
              maxWidth: "400px",
              height: "55vh",
              maxHeight: "680px",
              borderRadius: "12px",
              overflow: "hidden",
              transition: "all 0.6s ease",
              opacity: 0.3,
              zIndex: 10,
              filter: "grayscale(40%)",
            };

            const mobileOffset = "42vw";
            const desktopOffset = "460px";
            const offset = window.innerWidth < 768 ? mobileOffset : desktopOffset;

            // ACTIVE SLIDE
            if (pos === "center") {
              style.transform = "scale(1)";
              style.opacity = 1;
              style.zIndex = 40;
              style.filter = "grayscale(0%)";
            }

            // LEFT SLIDE
            if (pos === "left") {
              style.transform = `translateX(-${offset}) scale(0.85)`;
              style.opacity = 0.5;
              style.zIndex = 20;
            }

            // RIGHT SLIDE
            if (pos === "right") {
              style.transform = `translateX(${offset}) scale(0.85)`;
              style.opacity = 0.5;
              style.zIndex = 20;
            }

            // HIDDEN SLIDE
            if (pos === "hidden") {
              style.opacity = 0;
              style.zIndex = 5;
            }

            // CLICK HANDLER
            const handleClick = () => {
              if (pos === "left") prev();
              else if (pos === "right") next();
              else if (pos === "center") {
                setSelected(c);
                if (c.has_subcontent) setMode("slider-thumb");
              }
            };

            return (
              <motion.div key={index} style={style} onClick={handleClick}>
                {c.files?.[0] ? (
                  <img
                    src={c.files[0]}
                    className="w-full h-full object-cover bg-black/5"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full bg-black/70 text-white">
                    No Image
                  </div>
                )}

                {/* TITLE ONLY FOR CENTER SLIDE */}
                {pos === "center" && (
                  <div className="absolute bottom-3 w-full text-center">
                    <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white drop-shadow-xl">
                      {c.title}
                    </h2>
                    <h4 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white drop-shadow-xl">
                      {c.dob}
                    </h4>
                  </div>
                )}

              </motion.div>
            );
          })}

        </div>
      </div>
    );
  };



  const SliderThumbnailGalleryView = () => {
    if (!selected) return null;
    console.log("=====================", selected)
    const images = [
      selected.files?.[0],
      ...(selected.sub_contents?.[0]?.gallery_images || [])
    ];

    const [activeIndex, setActiveIndex] = useState(0);
    const activeImage = images[activeIndex];

    return (
      <div
        className="relative w-full min-h-screen flex flex-col"
        style={{
          backgroundImage: `url(${background})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* DARK BACKGROUND OVERLAY */}
        <div className="absolute inset-0 bg-black/35 backdrop-blur-[3px]"></div>

        {/* TOP RIGHT LOGO */}
        <div
          className="absolute top-4 right-4 cursor-pointer z-[999]"
          onClick={() => setMode("slider-thumbnail-view")}
        >
          <img
            src={selected.logo || containerLogo}
            className="h-16 md:h-32 object-contain drop-shadow-xl"
            alt="logo"
          />
        </div>

        {/* MAIN CONTENT WRAPPER */}
        <div
          className="
            relative z-20
            grid grid-cols-1 md:grid-cols-2
            gap-10 md:gap-16
            px-6 md:px-16 lg:px-24
            pt-24 md:pt-32
            pb-10
          "
        >
          {/* LEFT LARGE IMAGE (with nice border and shadow) */}
          <div
            className="
              w-full 
              h-[55vh] md:h-[65vh]
              rounded-xl shadow-2xl 
              border-[6px] border-white/20
              overflow-hidden
              bg-black/40
              flex items-center justify-center
            "
          >
            <img
              src={activeImage}
              alt="Portrait"
              className="max-h-full max-w-full object-contain rounded-md"
            />
          </div>


          {/* RIGHT TEXT BOX */}
          <div
            className="
              bg-black/45 backdrop-blur-md
              p-6 md:p-10 lg:p-14
              rounded-xl shadow-2xl 
              text-white 
              flex flex-col justify-start
            "
          >
            {/* NAME */}
            <h1 className="text-2xl md:text-3xl font-bold leading-tight mb-3">
              {selected.title} ({selected.dob})
            </h1>

            {/* SECOND LINE (subtitle or role) */}
            <h2 className="text-lg md:text-xl opacity-90 mb-6">
              {selected.sub_contents?.[0]?.individual_contents ||
                " "}
            </h2>


            {/* FULL DESCRIPTION */}
            {/* <p className="text-md md:text-xl leading-relaxed opacity-95 whitespace-pre-line">
              {selected.sub_contents?.[0]?.description}
            </p> */}
            <div
              className="user-content"
              dangerouslySetInnerHTML={{ __html: selected.sub_contents?.[0]?.description }}
            ></div>
          </div>

          {/* QR CODE – FIXED BOTTOM RIGHT */}
          {selected.qr_code_url && (
            <div className="absolute bottom-6 right-6 flex flex-col items-center z-30">
              <img
                src={selected.qr_code_url}
                className="w-24 h-24 md:w-40 md:h-40 bg-white p-2 rounded-xl shadow-xl"
                alt="QR Code"
              />
              <span className="text-white mt-2 text-lg font-semibold drop-shadow">
                Learn More
              </span>
            </div>
          )}
        </div>



        {/* ==== THUMBNAILS ==== */}
        <div
          className="
            relative z-30
            w-full
            bg-black/60 backdrop-blur-lg
            border-t border-white/20
            py-3 md:py-4 px-4
            flex gap-4 overflow-x-auto
          "
        >
          {images.map((img, i) => (
            <img
              key={i}
              src={img}
              onClick={() => setActiveIndex(i)}
              className={`
                h-20 w-24 md:h-28 md:w-32 rounded-lg cursor-pointer object-cover
                border-2 transition-all duration-200
                ${activeIndex === i
                  ? "border-yellow-400 scale-110 shadow-xl opacity-100"
                  : "border-white/20 opacity-60 hover:opacity-100"
                }
              `}
              alt="Thumbnail"
            />
          ))}
        </div>
      </div>
    );
  };



  const ArticleShowcaseView = () => {
    if (!contents || contents.length === 0) return null;

    const [activeIndex, setActiveIndex] = useState(0);

    const currentpage = contents[activeIndex]
    return (
      <div
        className="relative w-full h-screen flex flex-col items-center justify-center text-white bg-black/30"
        style={{
          backgroundImage: `url(${currentpage.background_url || background})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: "10px"

        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div
          className="absolute top-4 right-4 cursor-pointer z-[9999]"
          onClick={() => {
            if (morepage) {
              navigate(`/container/${container}/more`);
            } else {
              navigate(`/container/${container}`);
            }

          }}
        >
          <img
            src={containerLogo}
            alt="logo"
            className="h-20 md:h-40 w-auto object-contain"
          />
        </div>

        {/* MAIN CONTAINER */}
        <div className="relative z-20 w-[80%] flex flex-col items-left mt-10 overflow-y-auto pb-20 gap-10">
          {/* TITLE */}
          <h1 className="text-2xl md:text-4xl font-bold mb-3 drop-shadow-lg text-left">
            Articles and News/Blogs
          </h1>

          <div

            className="
                w-[90%] md:w-[85%] lg:w-[75%]
                bg-black/30 backdrop-blur-md 
                rounded-3xl shadow-2xl p-6 md:p-10
                flex flex-col md:flex-row gap-8
              "
          >

            {/* RIGHT CONTENT AREA */}
            <div className="w-full flex flex-col justify-between">
              {/* SUB TITLE */}
              <h2 className="text-lg md:text-2xl font-semibold mb-4 opacity-90 text-left">
                {currentpage.title || ""}
              </h2>

              {/* DESCRIPTION */}
              {/* <p className="w-full text-base md:text-lg leading-relaxed opacity-90  flex-grow">
                  {currentpage.content || "No Description"}
                </p> */}
              <div
                className="user-content"
                dangerouslySetInnerHTML={{ __html: currentpage.content }}
              ></div>


            </div>
          </div>

          {/* BUTTON BOTTOM LEFT */}
          <div className="mt-6 text-left align-start">
            <button
              onClick={() => {

                console.log("888888888-------currentpage-------------8888888888888", currentpage)
                setMode("detail-article-view");
                setSelected(currentpage);
              }}
              className="
                  px-8 py-3
                  bg-green-800/80 
                  hover:bg-green-900 
                  text-white 
                  text-lg md:text-xl 
                  rounded-xl 
                  shadow-lg 
                  transition-all
                "
            >
              LEARN MORE
            </button>
          </div>


        </div>

        {/* PAGE INDICATOR */}
        <div className="absolute bottom-6 flex items-center gap-6 text-white opacity-90 z-30">

          {/* LEFT ARROW */}
          <div
            className="text-3xl cursor-pointer hover:scale-110"
            onClick={() =>
              setActiveIndex((prev) =>
                prev === 0 ? contents.length - 1 : prev - 1
              )
            }
          >
            ❮
          </div>

          {/* PAGE NUMBER */}
          <div
            className="
              bg-white text-black
              px-6 py-2 rounded-xl 
              shadow-lg
            "
          >
            Page {activeIndex + 1}
          </div>

          {/* RIGHT ARROW */}
          <div
            className="text-3xl cursor-pointer hover:scale-110"
            onClick={() =>
              setActiveIndex((prev) =>
                prev === contents.length - 1 ? 0 : prev + 1
              )
            }
          >
            ❯
          </div>
        </div>

      </div>
    );
  };


  const DetailArticleView = () => {
    if (!selected) return null;
    console.log("0000000000--------------entered-----selected-----", selected)
    const sub = selected.sub_contents?.[0] || {}; // main subcontent
    // const image = sub.gallery_images || null;
    const image = sub.gallery_images?.[0] || null;


    return (
      <div
        className="relative w-full h-screen flex items-center justify-center text-white px-6 md:px-16"
        style={{
          background: "linear-gradient(to bottom, #C3B79B, #A79A7D, #584C3F)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* DARK OVERLAY */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

        {/* TOP RIGHT LOGO */}
        <div
          className="absolute top-4 right-4 cursor-pointer z-[999]"
          onClick={() => setMode("article-view")}
        >
          <img
            src={containerLogo}
            className="h-16 md:h-40 w-auto object-contain"
            alt="logo"
          />
        </div>

        {/* MAIN CONTENT WRAPPER */}


        {/* MAIN CONTENT WRAPPER */}
        <div className="relative z-20 w-full max-w-[1400px] flex flex-col md:flex-row gap-10 items-stretch">

          {/* LEFT SIDE */}
          <div className="w-full md:w-1/2 flex flex-col bg-black/5 backdrop-blur-md rounded-xl shadow-2xl">
            <h1 className="text-2xl md:text-4xl font-bold mb-4 leading-tight">
              {sub.title || ''}
            </h1>

            <div
              className="w-full h-[40vh] md:h-[60vh] rounded-xl shadow-2xl"
              style={{
                backgroundImage: image ? `url(${image})` : "none",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            ></div>
          </div>

          {/* RIGHT SIDE CONTENT BOX */}
          <div
            className="
              w-full md:w-[55%]
              bg-black/5 backdrop-blur-md
              p-6 md:p-10
              rounded-xl shadow-2xl
              flex flex-col justify-between
            "
          >
            <div
              className="user-content"
              dangerouslySetInnerHTML={{ __html: sub.description }}
            ></div>

            <div className="flex flex-col items-center md:items-end mt-8 gap-2">
              {selected.qr_code_url && (
                <img
                  src={selected.qr_code_url}
                  className="w-32 h-32 md:w-40 md:h-40 bg-white rounded-xl shadow-xl"
                  alt="QR"
                />
              )}
            </div>
          </div>

        </div>

      </div>
    );
  };


  // const WeaponsView = () => {
  //   if (!contents || contents.length === 0) return null;

  //   const [currentIndex, setCurrentIndex] = useState(0);
  //   const currentpage = contents[currentIndex];

  //   if (!currentpage) return null;

  //   return (
  //     <div
  //       className="relative w-full h-screen text-white overflow-hidden"
  //       style={{
  //         backgroundImage: `url(${background})`,
  //         backgroundSize: "cover",
  //         backgroundPosition: "center",
  //       }}
  //     >
  //       {/* DARK OVERLAY */}
  //       <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

  //       {/* LOGO TOP LEFT – WITH SPACING */}
  //       <div
  //         className="absolute top-8 left-10 cursor-pointer z-50"
  //         // onClick={() => setMode("article")}
  //         onClick={() => navigate(`/container/${container}`)}
  //       >
  //         <img
  //           src={containerLogo}
  //           className="h-20 md:h-30 w-auto object-contain drop-shadow-2xl"
  //           alt="logo"
  //         />
  //       </div>

  //       {/* MAIN CONTENT GRID */}
  //       <div
  //         className="
  //           absolute inset-0 z-30 
  //           grid grid-cols-1 md:grid-cols-2 
  //           gap-12 
  //           px-10 md:px-24 
  //           py-24 md:py-28
  //           mt-15
  //           items-start
  //         "
  //       >
  //         {/* LEFT IMAGE */}
  //         <div className="flex justify-center md:justify-center">
  //           <img
  //             src={currentpage.files?.[0]}
  //             className="
  //               w-[80%] md:w-[70%] 
  //               h-[10%]
  //               object-contain 
  //               rounded-2xl shadow-2xl
  //             "
  //             alt="Weapon"
  //           />
  //         </div>

  //         {/* RIGHT TEXT AREA */}
  //         <div
  //           className="
  //             bg-black/35 backdrop-blur-md
  //             rounded-xl shadow-xl 
  //             p-6 md:p-10
  //             w-full
  //           "
  //         >
  //           <h1 className="text-3xl md:text-4xl font-bold mb-6">
  //             {currentpage.title}
  //           </h1>

  //           <p className="text-base md:text-lg leading-relaxed whitespace-pre-line">
  //             {currentpage.content}
  //           </p>
  //         </div>
  //       </div>

  //       {/* QR CODE + LEARN MORE — SPACED FROM NAV BUTTONS */}
  //       <div className="absolute bottom-32 left-16 flex flex-col items-center z-40">
  //         {currentpage.qr_code_url && (
  //           <img
  //             src={currentpage.qr_code_url}
  //             className="w-32 h-32 md:w-40 md:h-40 bg-white rounded-xl shadow-xl"
  //             alt="QR"
  //           />
  //         )}
  //         <p className="text-white font-semibold text-center mt-3 text-lg">
  //           Learn More
  //         </p>
  //       </div>

  //       {/* LEFT NAV ARROW — WITH CLEAN SPACING */}
  //       <div className="absolute bottom-12 left-12 text-5xl cursor-pointer z-40">
  //         <span
  //           onClick={() =>
  //             setCurrentIndex((prev) =>
  //               prev === 0 ? contents.length - 1 : prev - 1
  //             )
  //           }
  //           className="hover:scale-110 transition"
  //         >
  //           ❮
  //         </span>
  //       </div>

  //       {/* RIGHT NAV ARROW — WITH CLEAN SPACING */}
  //       <div className="absolute bottom-12 right-12 text-5xl cursor-pointer z-40">
  //         <span
  //           onClick={() =>
  //             setCurrentIndex((prev) =>
  //               prev === contents.length - 1 ? 0 : prev + 1
  //             )
  //           }
  //           className="hover:scale-110 transition"
  //         >
  //           ❯
  //         </span>
  //       </div>
  //     </div>
  //   );
  // };


  const WeaponsView = () => {
    if (!contents || contents.length === 0) return null;

    const [currentIndex, setCurrentIndex] = useState(0);
    const currentpage = contents[currentIndex];

    if (!currentpage) return null;

    return (
      <div
        className="relative w-full h-screen text-white overflow-hidden"
        style={{
          backgroundImage: `url(${background})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* DARK OVERLAY */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

        {/* LOGO TOP LEFT – MOBILE RESPONSIVE */}
        <div
          className="absolute top-4 left-4 md:top-8 md:left-10 cursor-pointer z-50"
          onClick={() => {
            console.log("morepage:", morepage);
            if (morepage) {
              navigate(`/container/${container}/more`);
            } else {
              navigate(`/container/${container}`);
            }


          }}
        >
          <img
            src={containerLogo}
            className="h-14 md:h-30 w-auto object-contain drop-shadow-2xl"
            alt="logo"
          />
        </div>

        {/* MAIN CONTENT GRID */}
        <div
          className="
            absolute inset-0 z-30 
            grid grid-cols-1 md:grid-cols-2 
            gap-6 md:gap-12 
            px-4 md:px-20 
            py-20 md:py-28
          "
        >
          {/* LEFT IMAGE */}
          <div className="flex justify-center items-start mt-10 md:mt-0">
            <img
              src={currentpage.files?.[0]}
              className="
                w-[85%] md:w-[75%] 
                max-h-[280px] md:max-h-[500px]
                object-contain 
                rounded-2xl shadow-2xl
              "
              alt="Weapon"
            />
          </div>

          {/* RIGHT TEXT AREA */}
          <div
            className="
              bg-black/40 backdrop-blur-md
              rounded-xl shadow-xl 
              p-5 md:p-10
              w-full
            "
          >
            <h1 className="text-2xl md:text-4xl font-bold mb-4 md:mb-6">
              {currentpage.title}
            </h1>

            {/* <p className="text-sm md:text-lg leading-relaxed whitespace-pre-line">
              {currentpage.content}
            </p> */}
            {/* <div
              className="text-sm md:text-lg leading-relaxed"
              dangerouslySetInnerHTML={{ __html: currentpage.content }}
            ></div> */}
            <div
              className="user-content"
              dangerouslySetInnerHTML={{ __html: currentpage.content }}
            ></div>





          </div>
        </div>

        {/* QR CODE + LEARN MORE — MOBILE RESPONSIVE */}
        <div className="absolute bottom-28 left-1/2 md:left-16 -translate-x-1/2 md:translate-x-0 flex flex-col items-center z-40">
          {currentpage.qr_code_url && (
            <img
              src={currentpage.qr_code_url}
              className="w-28 h-28 md:w-40 md:h-40 bg-white rounded-xl shadow-xl"
              alt="QR"
            />
          )}
          <p className="text-white font-semibold text-center mt-2 md:mt-3 text-base md:text-lg">
            Learn More
          </p>
        </div>

        {/* LEFT NAV ARROW */}
        <div className="absolute bottom-6 left-6 md:left-16 text-4xl md:text-5xl cursor-pointer z-40">
          <span
            onClick={() =>
              setCurrentIndex((prev) =>
                prev === 0 ? contents.length - 1 : prev - 1
              )
            }
            className="hover:scale-110 transition"
          >
            ❮
          </span>
        </div>

        {/* RIGHT NAV ARROW */}
        <div className="absolute bottom-6 right-6 md:right-16 text-4xl md:text-5xl cursor-pointer z-40">
          <span
            onClick={() =>
              setCurrentIndex((prev) =>
                prev === contents.length - 1 ? 0 : prev + 1
              )
            }
            className="hover:scale-110 transition"
          >
            ❯
          </span>
        </div>
      </div>
    );
  };


  // -------------------------------TriBranchShowcaseView------------------------------------------------

  const BranchesShowcaseView = () => {
    if (!contents || contents.length === 0) return null;


    return (
      <div
        className="relative w-full h-screen flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `url(${background})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* LOGO TOP LEFT */}
        <div
          className="absolute top-4 left-6 cursor-pointer z-[9999]"
          onClick={() => {
            if (morepage) {
              navigate(`/container/${container}/more`);
            } else {
              navigate(`/container/${container}`);
            }


          }}
        >
          <img
            src={containerLogo}
            alt="logo"
            className="h-20 md:h-32 w-auto object-contain drop-shadow-2xl"
          />
        </div>

        {/* MAIN 3-COLUMN GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 w-full h-full text-white">

          {contents.map((item, index) => (
            <div
              key={index}
              onClick={() => {
                setSelected(item);
                // setMode("detail");
                setMode("subcontent-view")
              }}
              className="
                  relative flex flex-col items-center justify-center 
                  cursor-pointer group overflow-hidden
                "
            >
              {/* Background */}
              <div
                className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-all duration-700"
                style={{
                  backgroundImage: `url(${item.files?.[0]})`,
                }}
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/25 group-hover:bg-black/10 transition-all duration-700"></div>

              {/* CONTENT */}
              <div className="relative z-20 flex flex-col items-center justify-center text-center px-4">

                {/* Branch Logo */}
                {item.logo && (
                  <img
                    src={item.logo}
                    className="w-24 h-24 md:w-32 md:h-32 object-contain drop-shadow-xl 
                                group-hover:scale-110 transition-transform duration-500"
                  />
                )}

                {/* Branch Title */}
                <h2 className="
                    mt-4 text-2xl md:text-3xl lg:text-4xl font-bold uppercase
                    drop-shadow-2xl tracking-wide
                  ">
                  {item.title}
                </h2>
              </div>
            </div>
          ))}

        </div>
      </div>
    );
  };


  const SubContentShowcaseView = () => {
    if (!selected?.sub_contents || selected.sub_contents.length === 0) return null;

    const items = selected.sub_contents;

    return (
      <div className="relative w-full h-screen flex text-white overflow-hidden">

        {/* LOGO TOP LEFT */}
        <div
          className="
            absolute top-6 left-1/2 -translate-x-1/2 
            flex items-center justify-center 
            cursor-pointer z-50
          "
          onClick={() => setMode("TriBranchShowcaseView")}
        >
          <img
            src={selected.logo}
            alt="logo"
            className="h-16 md:h-28 w-auto object-contain drop-shadow-2xl"
          />
        </div>

        {/* 3-COLUMN LAYOUT */}
        <div className="grid grid-cols-1 md:grid-cols-3 w-full h-full">

          {items.map((item, index) => (
            <div
              key={index}
              onClick={() => {
                setSubselected(item);
                setMode("sub-gallary-detail");
              }}
              className="
                relative flex flex-col items-center justify-end 
                cursor-pointer group overflow-hidden
              "
            >
              {/* Background image */}
              <div
                className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-all duration-700"
                style={{
                  backgroundImage: `url(${item.main_image})`,
                }}
              />

              {/* Dark gradient bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

              {/* Title Bottom Center */}
              <h2 className="
                relative z-20 px-4 text-center 
                text-xl md:text-2xl font-bold tracking-wide 
                mb-10 drop-shadow-2xl
              ">
                {item.title}
              </h2>
            </div>
          ))}

        </div>
      </div>
    );
  };


  const SubContantDetailView = () => {
    if (!selected) return null;

    return (
      <div
        className="w-full min-h-screen bg-cover bg-center relative p-4 md:p-10 text-white"
        style={{ backgroundImage: `url(${selected.files[0]})` }}
      >

        {/* BACK IMAGE BUTTON */}
        <div
          onClick={() => setMode("subcontent-view")}
          className="
            absolute left-4 md:left-10 top-4 md:top-10 
            cursor-pointer z-50
          "
        >
          <img
            src={selected.logo}
            alt="Back"
            className="
              h-12 w-12 md:h-30 md:w-30
              object-contain drop-shadow-xl
              hover:scale-110 transition-all duration-300
            "
          />
        </div>


        {/* TITLE */}
        <div className="flex justify-center mb-6 md:mb-10 px-2 slide-up z-[9999]">
          <div className="bg-yellow-400 text-black px-6 md:px-10 py-3 md:py-4 rounded-xl shadow-xl 
                          text-xl md:text-3xl font-bold text-center">
            {subselected.title}
          </div>
        </div>

        {/* LOGO */}
        <div
          className="absolute top-2 md:top-4 right-2 md:right-4 cursor-pointer"
          onClick={() => {
            console.log("morepage:", morepage);
            if (morepage) {
              navigate(`/container/${container}/more`);
            } else {
              navigate(`/container/${container}`);
            }


          }}
        >
          <img
            src={containerLogo}
            alt="logo"
            className="h-20 w-auto md:h-40 object-contain"
          />
        </div>

        {/* CENTER PANEL */}
        <div
          className="
            absolute left-1/2 w-[95%] sm:w-[90%] md:w-[80%] max-w-7xl
            bg-white/20 backdrop-blur-xl p-6 md:p-12 rounded-3xl shadow-2xl
            transform -translate-x-1/2
            top-[22%] sm:top-[20%] md:top-[15%]   /* ✅ FIX: added more spacing */
            z-[50]
          "
        >


          {/* MAIN CONTENT BLOCK */}
          <div className="flex flex-col md:flex-row gap-6 md:gap-12 pb-16 md:pb-24 px-2 md:px-6">

            {/* LEFT IMAGE */}
            <div className="w-full md:w-[60%] flex flex-col items-center gap-4 md:gap-6">

              <img
                src={subselected.gallery_images[0]}
                className="w-full max-w-2xl md:max-w-1/2 rounded-2xl shadow-xl"
                alt=""
              />

              {/* View Gallery */}

              <button
                onClick={() =>
                  SetSubgalleryOpen(true)

                }
                className="w-full max-w-2xl bg-white/30 backdrop-blur-lg text-white
                            font-semibold text-lg md:text-xl py-3 md:py-4 
                            rounded-xl shadow-lg border border-white/40"
              >
                View Gallery
              </button>


            </div>

            {/* RIGHT TEXT */}
            <div className="w-full md:w-[50%] text-base md:text-xl leading-relaxed">

              {showFullText ? (
                <>
                  {subselected.description}
                  <button
                    onClick={() => setShowFullText(false)}
                    className="text-yellow-300 font-bold ml-2 underline"
                  >
                    Show less
                  </button>
                </>
              ) : (
                <>
                  {trimWords(subselected.description, 60)}
                  <button
                    onClick={() => setShowFullText(true)}
                    className="text-yellow-300 font-bold ml-2 underline"
                  >
                    Show more
                  </button>
                </>
              )}

            </div>

          </div>


          {/* QR CODE */}
          {selected.qr_code_url && (
            <div className="absolute bottom-4 md:bottom-8 right-4 md:right-8 flex flex-col items-center">
              <img
                src={selected.qr_code_url}
                className="w-28 h-28 md:w-44 md:h-44 bg-white p-2 md:p-3 rounded-xl shadow-xl"
                alt="QR"
              />
              <span className="mt-2 text-white font-semibold text-sm md:text-base">
                Learn More
              </span>
            </div>
          )}

        </div>
      </div>
    );
  };


  const SubrenderGalleryView = () => {
    const mediaFiles = subselected.gallery_images || [];

    const isVideo = (url) => {
      return url.match(/\.(mp4|mov|webm)$/i); // Detect video formats
    };

    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-xl z-[9999] flex flex-col items-center pt-10 px-4 text-white">

        {/* CARD CONTAINER */}
        <div
          className="
            w-full max-w-6xl 
            bg-black/70 border border-white/10 
            rounded-3xl shadow-2xl
            p-10
            mt-10
            flex flex-col
            items-center
          "
        >
          {/* BACK BUTTON */}
          <div
            onClick={() => SetSubgalleryOpen(false)}
            className="cursor-pointer flex items-center gap-3 mb-4 self-start"
          >
            <span className="text-white text-2xl font-bold drop-shadow">←</span>
            <p className="text-xl font-bold drop-shadow">BACK</p>
          </div>

          {/* TITLE */}
          <h1 className="text-2xl md:text-2xl font-bold text-center mb-8">
            View Gallery
          </h1>

          {/* SCROLLABLE GRID */}
          <div
            className="
              grid 
              grid-cols-1 
              sm:grid-cols-2 
              md:grid-cols-3 
              gap-8
              w-full
              overflow-y-auto
              pr-3
            "
            style={{ maxHeight: "65vh" }}
          >
            {mediaFiles.map((file, i) => (
              <div key={i} className="w-full h-60 md:h-64 rounded-xl shadow-xl overflow-hidden border border-white/20">

                {/* If video → render video */}
                {isVideo(file) ? (
                  <video
                    controls
                    className="w-full h-full object-cover rounded-xl"
                  >
                    <source src={file} type="video/mp4" />
                    Your browser does not support video playback.
                  </video>
                ) : (
                  /* Else show image */
                  <img
                    src={file}
                    className="w-full h-full object-cover rounded-xl"
                    alt=""
                  />
                )}

              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // ------------------------------------------------------------------------------------------

  const CardDetailView = () => {
    if (!contents[0]) return null;
    const fuldata = contents[0]
    return (
      <div
        className="w-full min-h-screen bg-cover bg-center relative p-4 md:p-10 text-white"
        style={{ backgroundImage: `url(${fuldata.background_url})` }}
      >

        {/* BACK BUTTON */}
        <div
          onClick={() => {
            console.log("----------------------", container)
            if (morepage) {
              navigate(`/container/${container}/more`);
            } else {
              navigate(`/container/${container}`);
            }

          }}
          className="absolute left-4 md:left-10 top-4 md:top-10 cursor-pointer select-none flex items-center gap-2 md:gap-3 z-50"
        >
          <span className="text-white text-3xl md:text-5xl font-bold drop-shadow">←</span>
          <p className="text-lg md:text-2xl font-bold tracking-wide drop-shadow mt-1">
            BACK
          </p>
        </div>

        {/* TITLE */}
        <div className="flex justify-center mb-6 md:mb-10 px-2 slide-up z-[9999]">
          <div className="bg-yellow-400 text-black px-6 md:px-10 py-3 md:py-4 rounded-xl shadow-xl 
                          text-xl md:text-3xl font-bold text-center">
            {fuldata.title}
          </div>
        </div>

        {/* LOGO */}
        <div
          className="absolute top-2 md:top-4 right-2 md:right-4 cursor-pointer"
          onClick={() => {
            if (morepage) {
              navigate(`/container/${container}/more`);
            } else {
              navigate(`/container/${container}`);
            }

          }}
        >
          <img
            src={containerLogo}
            alt="logo"
            className="h-20 w-auto md:h-40 object-contain"
          />
        </div>

        {/* CENTER PANEL */}
        <div
          className="
            absolute left-1/2 w-[75%] sm:w-[90%] md:w-[50%] max-w-7xl
            bg-white/20 backdrop-blur-xl p-6 md:p-12 rounded-3xl shadow-2xl
            transform -translate-x-1/2
            top-[22%] sm:top-[20%] md:top-[15%]   /* ✅ FIX: added more spacing */
            z-[50]
          "
        >


          {/* MAIN CONTENT BLOCK */}
          <div className="flex flex-col md:flex-row gap-6 md:gap-12 pb-6 md:pb-4 px-2 md:px-6">

            {/* LEFT IMAGE */}
            <div className="w-full md:w-[40%] flex flex-col items-center gap-4 md:gap-6">

              <img
                src={fuldata.files[0]}
                className="w-full max-w-xl md:max-w-md rounded-2xl shadow-xl"
                alt=""
              />

              {/* View Gallery */}
              {fuldata && (
                <button
                  onClick={() => setGalleryOpen(true)}
                  className="w-full max-w-2xl bg-white/30 backdrop-blur-lg text-white
                              font-semibold text-lg md:text-xl py-3 md:py-4 
                              rounded-xl shadow-lg border border-white/40"
                >
                  View Gallery
                </button>
              )}

            </div>

            {/* RIGHT TEXT */}
            <div className="w-full md:w-[50%] text-base md:text-xl leading-relaxed">

              {showFullText ? (
                <>
                  {fuldata.content}
                  <button
                    onClick={() => setShowFullText(false)}
                    className="text-yellow-300 font-bold ml-2 underline"
                  >
                    Show less
                  </button>
                </>
              ) : (
                <>
                  {trimWords(fuldata.content, 60)}
                  <button
                    onClick={() => setShowFullText(true)}
                    className="text-yellow-300 font-bold ml-2 underline"
                  >
                    Show more
                  </button>
                </>
              )}

            </div>

          </div>


          {/* QR CODE */}
          {fuldata.qr_code_url && (
            <div className="absolute bottom-4 md:bottom-8 right-4 md:right-8 flex flex-col items-center">
              <img
                src={fuldata.qr_code_url}
                className="w-28 h-28 md:w-44 md:h-44 bg-white p-2 md:p-3 rounded-xl shadow-xl"
                alt="QR"
              />
              <span className="mt-2 text-white font-semibold text-sm md:text-base">
                Learn More
              </span>
            </div>
          )}

        </div>
      </div>
    );
  };

  const SpecialOpsShowcaseView = () => {
    if (!selected) return null;
    // console.log("iiiiiiiiiiiiiiiiii--------------------",selected)

    return (
      <div
        className="relative w-full h-screen overflow-hidden text-white"
        style={{
          backgroundImage: `url(${selected.background || background})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* DARK OVERLAY */}
        <div className="absolute inset-0 bg-black/40"></div>

        {/* === LEFT SIDE CONTENT === */}
        <div className="absolute left-10 top-20 md:top-28 z-40 flex flex-col gap-6 max-w-[45%]">

          {/* LOGO */}
          <img
            src={selected.logo}
            alt="Special Ops Logo"
            className="h-20 md:h-32 w-auto drop-shadow-2xl"
          />

          {/* TITLE */}
          <h1 className="text-2xl md:text-4xl font-bold leading-snug drop-shadow-2xl">
            Armed Forces of the Philippines
          </h1>

          {/* SUBTITLE */}
          <h2 className="text-xl md:text-3xl font-bold text-yellow-400 tracking-wider drop-shadow-2xl">
            SPECIAL OPERATIONS COMMAND
          </h2>

        </div>

        {/* === RIGHT SIDE GIF / IMAGE === */}
        <div className="absolute right-10 bottom-10 md:bottom-0 flex items-end z-30">
          <img
            src={selected.gif || selected.right_image}
            className="h-[55vh] md:h-[70vh] object-contain drop-shadow-2xl"
            alt="Special Ops GIF"
          />
        </div>

        {/* === BOTTOM BACK BUTTON === */}
        <div
          onClick={() => setMode("TriBranchShowcaseView")}
          className="
            absolute bottom-12 left-12
            z-50 cursor-pointer
            text-2xl md:text-3xl font-bold
            drop-shadow-2xl
            hover:scale-110 transition-all
          "
        >
          BACK
        </div>
      </div>
    );
  };


  const AfpMenuOverlay = () => {

    return (
      <div
        className="relative w-full h-screen flex flex-col items-center justify-center text-white"
        style={{
          backgroundImage: `url(${background})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* TOP BLUR OVERLAY */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

        {/* CENTER LOGO */}
        <img
          src={containerLogo}
          alt="AFP Logo"
          className="relative z-20 w-44 h-auto drop-shadow-2xl mb-10"
          onClick={() => {
            console.log("morepage:", morepage);
            if (morepage) {
              navigate(`/container/${container}/more`);
            } else {
              navigate(`/container/${container}`);
            }

          }}

        />

        {/* MENU BAR */}
        <div
          className="
            relative z-30
            bg-black/40 backdrop-blur-md 
            px-10 py-6 rounded-xl
            flex gap-12 text-2xl font-semibold tracking-widest
          "
        >
          {contents.map((item, index) => (
            <button
              key={index}
              onClick={() => { setSubselected(item); setMode(item.view_mode); console.log("------item-----", item) }}
              className="
                hover:text-yellow-300 transition 
                hover:scale-105 tracking-widest border-r-2 pr-10
              "
            >
              {item.title}
            </button>
          ))}
        </div>
      </div>
    );
  }


  const AfpPresentationView = () => {
    const [screen, setScreen] = useState("overview");
    // overview | mission | coat
    return (
      <div
        className="w-full h-screen text-white relative flex items-center justify-center"
        style={{
          backgroundImage: `url(${background})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >

        {/* ========== OVERVIEW SCREEN ========== */}
        {screen === "overview" && (
          <div className="text-center px-6 max-w-full h-[90%] backdrop-blur-sm bg-black/40">

            <img
              src={containerLogo}
              onClick={() => { setMode("asf"); }}
              className="
                absolute 
                top-10 
                left-1/2 
                -translate-x-1/2 
                w-40 md:w-48 
                drop-shadow-xl
              "
            />

            <div className="flex justify-center items-center w-full h-full">
              <div className="text-center px-6 max-w-[75%] h-[90%] flex flex-col justify-center items-center mx-auto">

                <p className="text-2xl md:text-3xl leading-relaxed font-semibold p-6 rounded-2xl">
                  {subselected.content}
                </p>


                {/* <div
                    className="user-content text-2xl md:text-xl leading-relaxed font-semibold p-6 rounded-2xl"
                    dangerouslySetInnerHTML={{ __html: subselected.content }}
                  ></div> */}




                {/* MENU */}
                <div className="flex justify-between gap-80 text-4xl font-bold mt-16">
                  <button
                    onClick={() => setScreen("mission")}
                    className="hover:text-yellow-300 tracking-widest"
                  >
                    MISSION
                  </button>

                  <button
                    onClick={() => setScreen("coat")}
                    className="hover:text-yellow-300 tracking-widest"
                  >
                    COAT OF ARMS
                  </button>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* ========== MISSION SCREEN ========== */}
        {screen === "mission" && (
          <div className="text-center px-8 max-w-6xl">
            <h1 className="text-5xl font-bold mb-10 tracking-widest"
              onClick={() => setScreen("overview")}
            >MISSION</h1>

            <p className="text-2xl md:text-3xl leading-relaxed bg-black/40 p-6 rounded-2xl backdrop-blur-sm">
              To enhance professionalism, promote honesty and integrity in the
              military service, instill ethical standards and inculcate a strong
              sense of public accountability among military and civilian personnel
              in the pursuit of a common commitment against graft and corruption in
              the Armed Forces of the Philippines.
            </p>
          </div>
        )}

        {/* ========== COAT OF ARMS SCREEN ========== */}
        {screen === "coat" && (
          <div className="w-full flex flex-col items-center px-8">
            <h1 className="text-5xl font-bold mb-10 tracking-widest">
              COAT OF ARMS
            </h1>

            <div className="relative flex flex-col items-center">

              {/* Main Coat of Arms Image */}
              <img src={containerLogo}
                className="w-80 md:w-96 drop-shadow-2xl"
                onClick={() => setScreen("overview")}

              />

              {/* Text Lines (Left / Right Descriptions) */}
              <div className="absolute -left-32 top-10 text-xl">Three Stars</div>
              <div className="absolute -right-32 top-10 text-lg">Sun</div>

              <div className="absolute -left-40 top-40 text-lg">Sampaguita Garland</div>
              <div className="absolute -right-40 top-40 text-lg">Three Pointed Stars</div>

              <div className="absolute -left-32 top-64 text-lg">Baybayin "KA"</div>
            </div>

            {/* Bottom Description */}
            <div className="text-center mt-16 text-2xl font-semibold leading-relaxed">
              <p>LOGO SYMBOLISM</p>
              <p className="mt-4 text-lg opacity-80">
                Sampaguita Garland & Three Pointed Stars
              </p>

              <div className="flex justify-center gap-24 mt-10 text-xl">
                <p className="w-56">Field Grade Officers and Flag Officers</p>
                <p className="w-56">Company Grade Officers</p>
                <p className="w-56">Kalayaan</p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  const AfpOverviewScreen = () => {
    return (
      <div
        className="relative w-full h-screen text-white flex items-center justify-center"
        style={{
          backgroundImage: `url(${background})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Dark Blur Overlay */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

        {/* Center Logo */}
        <img
          src={containerLogo}
          onClick={() => { setMode("asf"); }}
          className="absolute top-10 left-1/2 -translate-x-1/2 w-40 md:w-48 drop-shadow-xl z-20"
          alt="AFP Logo"
        />

        {/* MAIN TEXT BOX */}
        <div className="relative z-30 w-[75%] max-w-4xl text-center mt-32  rounded-2xl">
          <div
            className="text-2xl md:text-3xl leading-relaxed font-semibold p-6 rounded-xl"
            dangerouslySetInnerHTML={{ __html: subselected.content }}
          ></div>
        </div>

        {/* QR CODE BOTTOM RIGHT */}
        <div className="absolute bottom-10 right-10 flex flex-col items-center z-30">
          <img
            src={subselected.qr_code_url}
            className="w-32 h-32 object-contain bg-white p-2 rounded-xl shadow-xl"
            alt="QR Code"
          />
          <span className="mt-2 text-white text-lg font-semibold">Learn More</span>
        </div>
      </div>
    );
  };


  const IntroReel = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const contents = subselected.sub_contents || [];
    const currentData = contents[activeIndex] || {};

    // Detect media type (video or image)
    const isVideo = (url) => {
      if (!url) return false;
      return url.endsWith(".mp4") || url.endsWith(".mov") || url.endsWith(".webm");
    };

    // Navigation Controls
    const onPrev = () => {
      setActiveIndex((prev) =>
        prev === 0 ? contents.length - 1 : prev - 1
      );
    };

    const onNext = () => {
      setActiveIndex((prev) =>
        prev === contents.length - 1 ? 0 : prev + 1
      );
    };

    return (
      <div
        className="relative w-full h-screen flex items-center justify-center text-white"
        style={{
          backgroundImage: `url(${background})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* BACKDROP */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

        {/* LOGO */}
        <img
          src={containerLogo}
          alt="AFP Logo"
          className="absolute top-10 left-10 w-32 md:w-40 drop-shadow-2xl z-30"
          onClick={() => { setMode("asf"); }}
        />


        {/* MAIN CARD */}
        <div className="relative z-30 bg-black/30 rounded-2xl shadow-2xl p-4 w-[75%] max-w-4xl
                        flex flex-col items-center justify-center">

          {/* MEDIA WRAPPER */}
          <div className="w-full flex justify-center">
            {isVideo(currentData.sub_image) ? (
              <video
                src={currentData.sub_image}
                className="max-h-[80vh] w-auto rounded-xl"
                autoPlay
                muted
                loop
                controls={false}
              />
            ) : (
              <img
                src={currentData.sub_image}
                className="max-h-[80vh] w-auto rounded-xl object-contain"
                alt="media"
              />
            )}
          </div>

          {/* TITLE BAR */}
          <div className="mt-4 w-full bg-black/50 py-3 text-center rounded-xl text-xl font-bold tracking-widest">
            {currentData.title || ""}
          </div>

          {/* NAVIGATION */}
          <div className="flex justify-between items-center mt-6 px-2 pb-2 w-full">

            {/* PREV */}
            {activeIndex != 0 ? (
              <div
                className="flex flex-col items-center cursor-pointer opacity-80 hover:opacity-100"
                onClick={onPrev}
              >
                <svg width="60" height="60" viewBox="0 0 24 24" className="opacity-50">
                  <path d="M15 6l-6 6 6 6" stroke="white" strokeWidth="2" fill="none" />
                </svg>
                <span className="text-sm text-gray-300">Prev</span>
              </div>
            )
              :
              <div></div>


            }

            {/* NEXT */}
            <div
              className="flex flex-col items-center cursor-pointer opacity-80 hover:opacity-100"
              onClick={onNext}
            >
              <svg width="60" height="60" viewBox="0 0 24 24" className="opacity-80">
                <path d="M9 6l6 6-6 6" stroke="white" strokeWidth="2" fill="none" />
              </svg>
              <span className="text-sm text-gray-300">Next</span>
            </div>

          </div>
        </div>
      </div>
    );
  };



  const UniformEvolution = () => {
    const [activeIndex, setActiveIndex] = useState(1);

    const items = subselected?.sub_contents || [];

    // 🔥 Avoid crashes when empty
    if (!items.length) return <div className="text-white">No Items Found</div>;

    const safeIndex = (i) => (items.length === 0 ? 0 : (i + items.length) % items.length);

    const centerItem = items[safeIndex(activeIndex)];
    const leftItem = items[safeIndex(activeIndex - 1)];
    const rightItem = items[safeIndex(activeIndex + 1)];

    const prev = () => setActiveIndex((i) => safeIndex(i - 1));
    const next = () => setActiveIndex((i) => safeIndex(i + 1));

    return (
      <div
        className="relative w-full h-screen text-white flex items-center justify-center"
        style={{
          backgroundImage: `url(${background})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* BACKDROP */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

        {/* TITLE */}
        <h1 className="absolute top-14 text-5xl font-bold tracking-widest z-30">
          Evolution of AFP Uniforms
        </h1>

        {/* MAIN WRAPPER */}
        <div className="flex items-center justify-center w-[85%] z-30 mt-20">

          {/* LEFT ITEM */}
          <div className="flex flex-col items-center w-1/3 opacity-60">
            <img
              src={leftItem?.sub_image}
              className="h-[45vh] object-contain drop-shadow-2xl"
            />
            <p className="text-center mt-4 text-lg font-medium">
              {leftItem?.title}
              <br />
              <span className="text-sm opacity-90">{leftItem?.individual_contents}</span>
            </p>
          </div>

          {/* CENTER ITEM */}
          <div className="relative w-1/3 flex flex-col items-center">
            <div className="bg-black/30 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl">
              <img
                src={centerItem?.sub_image}
                className="h-[55vh] object-contain drop-shadow-xl"
              />
            </div>
            <p className="text-center mt-6 text-xl font-semibold">
              {centerItem?.title}
              <br />
              <span className="text-lg opacity-90">{centerItem?.individual_contents}</span>
            </p>
          </div>

          {/* RIGHT ITEM */}
          <div className="flex flex-col items-center w-1/3 opacity-60">
            <img
              src={rightItem?.sub_image}
              className="h-[45vh] object-contain drop-shadow-2xl"
            />
            <p className="text-center mt-4 text-lg font-medium">
              {rightItem?.title}
              <br />
              <span className="text-sm opacity-90">{rightItem?.individual_contents}</span>
            </p>
          </div>
        </div>

        {/* ARROWS */}
        <div
          onClick={prev}
          className="absolute left-[22%] top-1/2 -translate-y-1/2 cursor-pointer opacity-80 hover:opacity-100 z-40"
        >
          <svg width="60" height="60" viewBox="0 0 24 24" fill="white">
            <path d="M15 6l-6 6 6 6" stroke="white" strokeWidth="2" fill="none" />
          </svg>
        </div>

        <div
          onClick={next}
          className="absolute right-[22%] top-1/2 -translate-y-1/2 cursor-pointer opacity-80 hover:opacity-100 z-40"
        >
          <svg width="60" height="60" viewBox="0 0 24 24" fill="white">
            <path d="M9 6l6 6-6 6" stroke="white" strokeWidth="2" fill="none" />
          </svg>
        </div>

        {/* BACK BUTTON */}
        <div
          onClick={() => { setMode("asf"); }}
          className="absolute bottom-10 left-20 cursor-pointer text-4xl font-bold tracking-widest opacity-80 hover:opacity-100 z-50"
        >
          BACK
        </div>
      </div>
    );
  };


  // const SpecialOpsScreen = () => {
  //   if (!contents) return null;


  //   const data = contents?.[0] || {};
  //   const logoImg = data.logo|| containerLogo || null;

  //   const helicopterImg = data.files?.[0] || null;
  //   const soldiersImg = data.background_url || null;
  //   const title = data.title || "";
  //   const subtitleHTML = data.content || "";

  //   // 👉 Add your smoke GIF here
  //   const smokeGif = "/smoke.gif";   // <-- replace with your actual GIF URL

  //   return (
  //     <div className="relative w-full h-screen text-white overflow-hidden">

  //       {/* BACKGROUND IMAGE */}
  //       <img
  //         src={background}
  //         alt="background"
  //         className="absolute inset-0 w-full h-full object-cover opacity-80 -z-20"
  //       />

  //       {/* DARK OVERLAY */}
  //       <div className="absolute inset-0 bg-black/40 backdrop-blur-sm -z-10"></div>

  //       {/* HELICOPTER IMAGE */}
  //       {helicopterImg && (
  //         <img
  //           src={helicopterImg}
  //           className="absolute top-15 left-[20%] w-[750px] drop-shadow-2xl z-30"
  //           alt="helicopter"
  //         />
  //       )}

  //       {/* LEFT SIDE LOGO + TEXT */}
  //       <div className="absolute left-50 top-[38%] -translate-y-1/2 max-w-md z-30">

  //         {logoImg && (
  //           <img
  //             src={logoImg}
  //             className="w-40 drop-shadow-2xl mb-6 align-center"
  //             alt="logo"
  //           />
  //         )}

  //         <h2 className="text-3xl font-semibold leading-snug">{title}</h2>

  //         <div
  //           className="text-3xl font-bold mt-2 tracking-wider text-yellow-400"
  //           dangerouslySetInnerHTML={{ __html: subtitleHTML }}
  //         ></div>
  //       </div>

  //       {/* ✨ SMOKE GIF BEHIND SOLDIERS (NOT ABOVE THEM) */}
  //       {soldiersImg && smoke && (
  //         <img
  //           src={smoke}
  //           alt="smoke"
  //           className="
  //             absolute right-0 bottom-0 
  //             h-[95%] w-[98%]
  //             object-cover opacity-60 
  //             z-20 pointer-events-none
  //           "

  //         />
  //       )}

  //       {/* SOLDIERS IMAGE (FRONT) */}
  //       {soldiersImg && (
  //         <img
  //           src={soldiersImg}
  //           className="absolute right-0 bottom-0 h-[88%] object-contain drop-shadow-2xl z-30"
  //           alt="soldiers"
  //         />
  //       )}

  //       {/* BACK BUTTON */}
  //       <button
  //         className="absolute bottom-10 left-20 text-4xl font-bold tracking-widest opacity-90 hover:opacity-100 z-30"

  //         onClick={() => 
  //         {
  //           console.log("morepage:", morepage);
  //           if (morepage) {
  //             navigate(`/container/${container}/more`);
  //           } else {
  //             navigate(`/container/${container}`);
  //           }


  //         }}

  //       >
  //         BACK
  //       </button>
  //     </div>
  //   );
  // };

  const SpecialOpsScreen = () => {
    const [showFullScreen, setShowFullScreen] = useState(false);

    if (!contents) return null;

    const data = contents?.[0] || {};
    const logoImg = data.logo || containerLogo || null;

    const helicopterImg = data.files?.[0] || null;
    const soldiersImg = data.background_url || null;
    const title = data.title || "";
    const subtitleHTML = data.content || "";

    const smoke = "/smoke.gif";

    return (
      <div className="relative w-full h-screen text-white overflow-hidden">

        {/* ========================================================== */}
        {/*  FULL SCREEN (AFTER CLICK) - THE ATTACHED SOCom SCREEN    */}
        {/* ========================================================== */}
        {showFullScreen && (
          <div className="absolute inset-0 bg-black w-full h-full z-[999] flex items-center justify-center"
            onClick={() => { setMode("elite-groups-ranger"); }}
          >

            {/* Background Image like video screenshot */}
            <img
              src={soldiersImg}
              className="absolute inset-0 w-full h-full object-cover opacity-70"
            />

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/60"></div>

            {/* CENTER TEXT */}
            <div className="relative z-10 text-center px-4">
              <h1 className="text-4xl font-bold">Armed Forces of the Philippines</h1>
              <h2 className="text-5xl font-bold text-yellow-400 mt-4 tracking-wider">
                SPECIAL OPERATIONS COMMAND
              </h2>
            </div>

            {/* BACK BUTTON */}
            <button
              onClick={() => setShowFullScreen(false)}
              className="absolute bottom-10 left-10 text-3xl font-bold"
            >
              BACK
            </button>
          </div>
        )}

        {/* ========================================================== */}
        {/*  ORIGINAL SCREEN (BEFORE CLICK)                           */}
        {/* ========================================================== */}

        {/* BACKGROUND IMAGE */}
        <img
          src={background}
          alt="background"
          className="absolute inset-0 w-full h-full object-cover opacity-80 -z-20"
        />

        {/* DARK OVERLAY */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm -z-10"></div>

        {/* HELICOPTER IMAGE */}
        {helicopterImg && (
          <img
            src={helicopterImg}
            className="absolute top-15 left-[20%] w-[750px] drop-shadow-2xl z-30"
            alt="helicopter"
          />
        )}

        {/* LEFT SIDE LOGO + TEXT */}
        <div className="absolute left-50 top-[38%] -translate-y-1/2 max-w-md z-30">

          {logoImg && (
            <img
              src={logoImg}
              className="w-40 drop-shadow-2xl mb-6 align-center"
              alt="logo"
            />
          )}

          <h2 className="text-3xl font-semibold leading-snug">{title}</h2>

          <div
            className="text-3xl font-bold mt-2 tracking-wider text-yellow-400"
            dangerouslySetInnerHTML={{ __html: subtitleHTML }}
          ></div>
        </div>

        {/* SMOKE GIF */}
        {soldiersImg && smoke && (
          <img
            src={smoke}
            alt="smoke"
            className="absolute right-0 bottom-0 h-[95%] w-[98%] object-cover opacity-60 z-20 pointer-events-none"
          />
        )}

        {/* SOLDIERS IMAGE (CLICK TO OPEN FULLSCREEN) */}
        {soldiersImg && (
          <img
            src={soldiersImg}
            className="absolute right-0 bottom-0 h-[88%] object-contain drop-shadow-2xl z-30 cursor-pointer"
            alt="soldiers"
            onClick={() => setShowFullScreen(true)}  // 👈 OPEN FULLSCREEN
          />
        )}

        {/* BACK BUTTON */}
        <button
          className="absolute bottom-10 left-20 text-4xl font-bold tracking-widest opacity-90 hover:opacity-100 z-30"
          onClick={() => {
            if (morepage) {
              navigate(`/container/${container}/more`);
            } else {
              navigate(`/container/${container}`);
            }
          }}
        >
          BACK
        </button>
      </div>
    );
  };


  // const ScoutRangerScreen = () => {
  //   const [showInfo, setShowInfo] = useState(false);
  //   if (!contents) return null;
  //   const data = contents?.[0].sub_contents || {};
  //   const [currentIndex, setCurrentIndex] = useState(0);
  //   const currentpage = data[currentIndex];


  //   // 👉 Replace these with your actual API / DB values
  //   const regimentLogo = currentpage.sub_image2 || null;
  //   const centerLogo = currentpage.sub_image || null;

  //   const afpLogo = contents?.[0].logo || containerLogo || null;

  //   const soldierImage = currentpage.gallery_images || null;

  //   const bgImage = currentpage.main_image;

  //   const qrCode = contents[0].qr_code_url || null;

  //   return (
  //     <div className="relative w-full h-screen text-white overflow-hidden">

  //       {/* ---------------------------------------------------- */}
  //       {/*  FIRST SCREEN (MATCHES IMAGE 1 EXACTLY)              */}
  //       {/* ---------------------------------------------------- */}
  //       {!showInfo && (
  //         <div className="relative w-full h-full">

  //           {/* BACKGROUND */}
  //           <img
  //             src={bgImage}
  //             className="absolute inset-0 w-full h-full object-cover brightness-[0.40] blur-[1px]"
  //           />

  //           {/* LEFT DARK OVERLAY */}
  //           <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent z-10"></div>

  //           {/* AFP LOGO (TOP-LEFT) */}
  //           {afpLogo && (
  //             <img
  //               src={afpLogo}
  //               className="absolute top-10 left-10 w-24 drop-shadow-2xl z-30"
  //               alt="AFP"
  //             />
  //           )}

  //           {/* CENTER EMBLEM LOGO */}
  //           {centerLogo && (
  //             <img
  //               src={centerLogo}
  //               className="absolute top-[22%] left-[8%] w-[260px] drop-shadow-2xl z-30"
  //               alt="Regiment Emblem"
  //             />
  //           )}

  //           {/* TITLE + SUBTITLE BELOW EMBLEM */}
  //           <div className="absolute top-[42%] left-[8%] z-30">
  //             <h1 className="text-5xl font-semibold drop-shadow-2xl">
  //               {currentpage.title}
  //             </h1>

  //             <h2 className="text-6xl font-bold text-yellow-300 mt-4 drop-shadow-2xl tracking-wide">
  //               {currentpage.individual_contents}
  //             </h2>
  //           </div>

  //           {/* RIGHT SIDE ROUND LOGO */}
  //           {regimentLogo && (
  //             <img
  //               src={regimentLogo}
  //               className="absolute top-10 right-10 w-32 drop-shadow-2xl z-30"
  //               alt="Regiment Logo"
  //             />
  //           )}

  //           {/* SOLDIER IMAGE */}
  //           {soldierImage && (
  //             <img
  //               src={soldierImage}
  //               className="absolute bottom-0 right-0 h-[92%] drop-shadow-2xl z-40 cursor-pointer"
  //               alt="Soldier"
  //               onClick={() => setShowInfo(true)}
  //             />
  //           )}

  //           {/* BACK BUTTON */}
  //           <button
  //             className="absolute bottom-10 left-10 text-3xl font-bold z-50"
  //             onClick={() => setMode("elite-groups")}
  //           >
  //             BACK
  //           </button>
  //         </div>
  //       )}



  //       {/* ---------------------------------------------------- */}
  //       {/*  SECOND SCREEN (IMAGE 2)                             */}
  //       {/* ---------------------------------------------------- */}
  //       {showInfo && (
  //         <div className="absolute inset-0 w-full h-full overflow-hidden text-white"
  //           onClick={()=>{setCurrentIndex((pre)=> pre +1);setShowInfo(false)}}
  //         >

  //           {/* BACKGROUND IMAGE */}
  //           <img
  //             src={bgImage}
  //             className="absolute inset-0 w-full h-full object-cover brightness-[0.30] blur-[1px] -z-20"
  //           />

  //           {/* DARK OVERLAY */}
  //           <div className="absolute inset-0 bg-black/40 -z-10"></div>

  //           {/* TOP LEFT AFP LOGO */}
  //           <img
  //             src={afpLogo}
  //             className="absolute top-10 left-10 w-28 drop-shadow-2xl z-30"
  //             alt="AFP"
  //           />

  //           {/* TOP RIGHT UNIT LOGO */}
  //           <img
  //             src={regimentLogo}
  //             className="absolute top-10 right-10 w-32 drop-shadow-2xl z-30"
  //             alt="Regiment Logo"
  //           />

  //           {/* CENTER EMBLEM + TITLE (LEFT SIDE) */}
  //           <div className="absolute top-[28%] left-[8%] w-[30%] z-30">
  //             {/* CENTER LOGO */}
  //             <img
  //               src={centerLogo}
  //               className="w-[240px] drop-shadow-2xl mb-4"
  //               alt="Emblem"
  //             />

  //             {/* TITLE */}
  //             <h1 className="text-4xl font-bold drop-shadow-lg">
  //               {currentpage.title}
  //             </h1>

  //             {/* SUBTITLE */}
  //             <h2 className="text-5xl font-bold text-yellow-300 mt-2 drop-shadow-lg">
  //               {currentpage.individual_contents}
  //             </h2>
  //           </div>

  //           {/* RIGHT SIDE PARAGRAPH */}
  //           <p className="absolute top-[26%] right-[8%] w-[38%] text-2xl leading-relaxed drop-shadow-lg z-30">
  //             {currentpage.description}
  //           </p>

  //           {/* QR CODE SECTION */}
  //           <div className="absolute bottom-20 right-10 text-center z-30">
  //             {qrCode && <img src={qrCode} className="w-36 mb-3" />}
  //             <p className="text-xl font-semibold">Learn More</p>
  //           </div>

  //           {/* BACK BUTTON */}
  //           <button
  //             onClick={() => setShowInfo(false)}
  //             className="absolute bottom-10 left-10 text-3xl font-bold z-30"
  //           >
  //             BACK
  //           </button>

  //         </div>
  //       )}

  //     </div>
  //   );
  // };



  const ScoutRangerScreen = () => {
    const [showInfo, setShowInfo] = useState(false);
    if (!contents) return null;

    const data = contents?.[0].sub_contents || [];
    const [currentIndex, setCurrentIndex] = useState(0);
    const currentpage = data[currentIndex];

    // IMAGES
    const regimentLogo = currentpage?.sub_image2 || null;
    const centerLogo = currentpage?.sub_image || null;
    const afpLogo = contents?.[0].logo || containerLogo || null;
    const soldierImage = currentpage?.gallery_images || null;
    const bgImage = currentpage?.main_image;
    const qrCode = contents?.[0].qr_code_url || null;

    // ---------------------------------------------
    // NEXT FUNCTION (SAFE INDEX UPDATE)
    // ---------------------------------------------
    const goNext = () => {
      setCurrentIndex((prev) =>
        prev + 1 < data.length ? prev + 1 : 0 // loop back to 0
      );
      setShowInfo(false);
    };

    return (
      <div className="relative w-full h-screen text-white overflow-hidden">

        {/* ---------------------------------------------------- */}
        {/*  FIRST SCREEN                                         */}
        {/* ---------------------------------------------------- */}
        {!showInfo && (
          <div className="relative w-full h-full">

            {/* BACKGROUND */}
            <img
              src={bgImage}
              className="absolute inset-0 w-full h-full object-cover brightness-[0.40] blur-[1px]"
            />

            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent z-10"></div>

            {/* AFP LOGO */}
            {afpLogo && (
              <img
                src={afpLogo}
                className="absolute top-10 left-10 w-24 drop-shadow-2xl z-30"
              />
            )}

            {/* CENTER LOGO */}
            {centerLogo && (
              <img
                src={centerLogo}
                className="absolute top-[22%] left-[8%] w-[260px] drop-shadow-2xl z-30"
              />
            )}

            {/* TITLES */}
            <div className="absolute top-[42%] left-[8%] z-30">
              <h1 className="text-5xl font-semibold drop-shadow-2xl">
                {currentpage?.title}
              </h1>

              <h2 className="text-6xl font-bold text-yellow-300 mt-4 drop-shadow-2xl tracking-wide">
                {currentpage?.individual_contents}
              </h2>
            </div>

            {/* RIGHT LOGO */}
            {regimentLogo && (
              <img
                src={regimentLogo}
                className="absolute top-10 right-10 w-32 drop-shadow-2xl z-30"
              />
            )}

            {/* SOLDIER */}
            {soldierImage && (
              <img
                src={soldierImage}
                className="absolute bottom-0 right-0 h-[92%] drop-shadow-2xl z-40 cursor-pointer"
                onClick={() => setShowInfo(true)}
              />
            )}

            {/* BACK BUTTON */}
            <button
              className="absolute bottom-10 left-10 text-3xl font-bold z-50"
              onClick={() => setMode("elite-groups")}
            >
              BACK
            </button>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/*  SECOND SCREEN                                        */}
        {/* ---------------------------------------------------- */}
        {showInfo && (
          <div
            className="absolute inset-0 w-full h-full overflow-hidden text-white"
            onClick={goNext}   // 👈 CLICK TO GO NEXT
          >
            {/* BG */}
            <img
              src={bgImage}
              className="absolute inset-0 w-full h-full object-cover brightness-[0.30] blur-[1px] -z-20"
            />

            <div className="absolute inset-0 bg-black/40 -z-10"></div>

            {/* TOP LEFT */}
            <img
              src={afpLogo}
              className="absolute top-10 left-10 w-28 drop-shadow-2xl z-30"
            />

            {/* TOP RIGHT */}
            <img
              src={regimentLogo}
              className="absolute top-10 right-10 w-32 drop-shadow-2xl z-30"
            />

            {/* LEFT SIDE CONTENT */}
            <div className="absolute top-[28%] left-[8%] w-[30%] z-30">
              <img src={centerLogo} className="w-[240px] drop-shadow-2xl mb-4" />

              <h1 className="text-4xl font-bold drop-shadow-lg">
                {currentpage?.title}
              </h1>

              <h2 className="text-5xl font-bold text-yellow-300 mt-2 drop-shadow-lg">
                {currentpage?.individual_contents}
              </h2>
            </div>

            {/* DESCRIPTION */}
            <p className="absolute top-[26%] right-[8%] w-[38%] text-2xl leading-relaxed drop-shadow-lg z-30">
              {currentpage?.description}
            </p>

            {/* QR */}
            <div className="absolute bottom-20 right-10 text-center z-30">
              {qrCode && <img src={qrCode} className="w-36 mb-3" />}
              <p className="text-xl font-semibold">Learn More</p>
            </div>

            {/* BACK BUTTON */}
            <button
              onClick={() => setShowInfo(false)}
              className="absolute bottom-10 left-10 text-3xl font-bold z-30"
            >
              BACK
            </button>
          </div>
        )}
      </div>
    );
  };




  /* ----------------------------------------------------------------------------------------
     🔥 FINAL OUTPUT (SELECT DISPLAY MODE)
  -----------------------------------------------------------------------------------------*/
  return (
    <>
      {/* Presentation view must override all */}
      {mode === "presentation-view" && <PresentationView />}

      {mode === "normal-view" && renderNormalView()}
      {mode === "slide-view" && renderSlideView()}
      {mode === "thumbnail-gallery" && renderThumbnailGalleryView()}

      {mode === "card-carousel" && renderCardCarouselView()}
      {mode === "card-detail" && renderCardDetailView()}

      {mode === "diagonal-split-view" && <DiagonalHomeView />}
      {mode === "detail" && <DetailView />}

      {mode === "slider-thumbnail-view" && <PresentationShowcaseView />}
      {mode === 'slider-thumb' && <SliderThumbnailGalleryView />}
      {mode === 'article-view' && <ArticleShowcaseView />}
      {mode === 'detail-article-view' && <DetailArticleView />}
      {mode === 'weapons-view' && <WeaponsView />}

      {mode === "TriBranchShowcaseView" && <BranchesShowcaseView />}
      {mode === "subcontent-view" && <SubContentShowcaseView />}
      {mode === "sub-gallary-detail" && <SubContantDetailView />}
      {mode === "gallary-detail-view" && <SubrenderGalleryView />}
      {subgalleryOpen && SubrenderGalleryView()}


      {mode === "gallary-detail-view" && <SpecialOpsShowcaseView />}

      {mode === "CardDetailView" && <CardDetailView />}

      {mode === "asf" && <AfpMenuOverlay />}

      {mode === "overview" && <AfpPresentationView />}

      {mode === "history" && <AfpOverviewScreen />}

      {mode === "visual-reels" && <IntroReel />}

      {mode === 'uniforms' && <UniformEvolution />}

      {mode === 'elite-groups' && <SpecialOpsScreen />}
      {mode === 'elite-groups-ranger' && <ScoutRangerScreen />}


      {galleryOpen && renderGalleryView()}

    </>
  );


}

export default ScreenView;

