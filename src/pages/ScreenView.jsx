import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Api from "../Api/Api";
import * as ActionCable from "@rails/actioncable";
import { motion, AnimatePresence, number } from "framer-motion";


// const cable = ActionCable.createConsumer("ws://localhost:3000/cable");
const cable = ActionCable.createConsumer("wss://backendafp.connectorcore.com/cable");

function ScreenView() {
  const { slug } = useParams();
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

  const [container, setContainer] = useState(null);
  const [screenName, setScreenName] = useState(null);
  const [containerLogo , setContainerLogo] = useState(null);







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
      // console.log("---------------data---------------------",data)
      setContents(data.contents || []);
      setBackground(data.background_url);
      setContainer(data.container_ids[0] || null);
      setScreenName(data.screen_name || "");
      setContainerLogo(data.container_files || null)
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

    const [logoAnimated, setLogoAnimated] = useState(false);
    useEffect(() => {
      setLogoAnimated(true);  // start animating
    }, []);

    // All images (main + gallery)
    const images = [
      selected.sub_contents?.[0]?.main_image,
      ...(selected.sub_contents?.[0]?.gallery_images || [])
    ];

    // ❗ Start with no image selected
    const [activeIndex, setActiveIndex] = useState(null);

    const nextImage = () => {
      if (activeIndex === null) return; // nothing selected yet
      setActiveIndex((prev) =>
        prev === images.length - 1 ? 0 : prev + 1
      );
    };

    const prevImage = () => {
      if (activeIndex === null) return;
      setActiveIndex((prev) =>
        prev === 0 ? images.length - 1 : prev - 1
      );
    };

    // Background always uses the first/main image
    const backgroundImage = selected.sub_contents?.[0].main_image;

    return (
      <div
        className={`relative w-full h-screen text-white flex items-center justify-center
          ${activeIndex !== null ? "backdrop-blur-sm brightness-70" : ""}
        `}
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >

        <div
          className="absolute top-4 left-6 cursor-pointer z-[9999]"
          style={{ perspective: "1200px" }}
          onClick={() => setMode("slide-view")}
        >
          <img
            src={containerLogo}
            alt="logo"
            className={`h-48 w-auto object-contain z-[9999] ${
              logoAnimated ? "logo-animate-sliderInner" : "block-hidden"
            }`}
          />
        </div>



        {/* OVERLAY */}
        <div className="absolute inset-0 pointer-events-none"></div>


        {/* MAIN TEXT CONTENT */}
        <div className="relative flex flex-col items-center z-20">
          <h1 className="text-5xl font-bold mb-8  text-center">
            {selected.title}
          </h1>

          <p className="w-[70%] text-2xl leading-relaxed text-center bg-black/30 p-3 rounded-2xl">
            {selected.sub_contents?.[0].description}
          </p>
        </div>

        {/* === CENTER LARGE IMAGE (ONLY WHEN CLICKED) === */}
        {activeIndex !== null && (
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                      rounded-xl shadow-2xl z-30 bg-black/70"
          >
            <img
              src={images[activeIndex]}
              className="w-[55vw] h-[65vh] object-cover rounded-xl"
            />
          </div>
        )}
        {activeIndex !== null && (
          <div
            onClick={() => setActiveIndex(null)}
            className="absolute l top-5 text-6xl cursor-pointer  hover:opacity-100 z-40"
          >
            <div className="text-white text-5xl font-bold drop-shadow">Back</div>
          </div>
        )}



        {/* LEFT ARROW */}
        {activeIndex !== null && (
          <div
            onClick={prevImage}
            className="absolute left-20 top-1/2 -translate-y-1/2 text-6xl cursor-pointer opacity-70 hover:opacity-100 z-40"
          >
            ❮
          </div>
        )}

        {/* RIGHT ARROW */}
        {activeIndex !== null && (
          <div
            onClick={nextImage}
            className="absolute right-20 top-1/2 -translate-y-1/2 text-6xl cursor-pointer opacity-70 hover:opacity-100 z-40"
          >
            ❯
          </div>
        )}

        {/* QR CODE */}
        {selected.qr_code_url && (
          <div className="absolute top-24 right-20 flex flex-col items-center z-40">
            <img
              src={selected.qr_code_url}
              className="w-40 h-40 bg-white p-2 rounded-xl shadow-xl"
            />
            <span className="mt-2 text-white font-semibold">Learn More</span>
          </div>
        )}

          <div
            className="
              absolute bottom-10 left-0 w-full 
              overflow-x-auto overflow-y-hidden 
              whitespace-nowrap 
              px-6 py-2 
              hide-scrollbar 
              z-40
            "
          >
            {images.map((img, i) => (
              <div key={i} className="inline-block mr-6">
                <img
                  src={img}
                  onClick={() => setActiveIndex(i)}
                  className={`
                    w-40 h-28 object-cover rounded-lg shadow-xl cursor-pointer 
                    transition-all duration-300
                    ${activeIndex === i ? "opacity-100 scale-110 border-4 border-white" : "opacity-60 hover:opacity-100"}
                  `}
                />
              </div>
            ))}
          </div>




        {/* BACK BUTTON */}
        {/* <div
          onClick={() => setMode("slide-view")}
          className="absolute top-10 left-10 cursor-pointer z-50"
        >
          <div className="text-white text-5xl font-bold drop-shadow">←</div>
        </div> */}
      </div>
    );
  };



  const renderSlideView = () => {
    const prev = () =>
      setActiveIndex((prev) => (prev === 0 ? contents.length - 1 : prev - 1));

    const next = () =>
      setActiveIndex((prev) =>
        prev === contents.length - 1 ? 0 : prev + 1
      );

    const getPosition = (index) => {
      if (index === activeIndex) return "center";
      if (index === activeIndex - 1) return "left";
      if (index === activeIndex + 1) return "right";
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
          className="absolute top-4 cursor-pointer z-50"
          onClick={() => navigate(`/container/${container}`)}
        >
          <img
            src={containerLogo}
            alt="logo"
            className="h-20 sm:h-24 md:h-32 lg:h-40 w-auto object-contain"
          />
        </div>

        {/* === RESPONSIVE SLIDER === */}
        <div className="relative w-full h-[60%] sm:h-[65%] md:h-[70%] flex items-center justify-center">
          {contents.map((c, index) => {
            const pos = getPosition(index);

            // RESPONSIVE SLIDE BASE STYLE
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
              filter: "grayscale(40%)",
            };

            // RESPONSIVE OFFSETS
            const mobileOffset = "42vw";
            const desktopOffset = "350px";

            // Choose offset depending on screen width
            const offset = window.innerWidth < 768 ? mobileOffset : desktopOffset;

            if (pos === "center") {
              style.transform = "scale(1)";
              style.opacity = 1;
              style.zIndex = 40;
              style.filter = "grayscale(0%)";
            } else if (pos === "left") {
              style.transform = `translateX(-${offset}) scale(0.85)`;
              style.opacity = 0.5;
              style.zIndex = 20;
            } else if (pos === "right") {
              style.transform = `translateX(${offset}) scale(0.85)`;
              style.opacity = 0.5;
              style.zIndex = 20;
            }

            const handleClick = () => {
              if (pos === "left") prev();
              else if (pos === "right") next();
              else if (pos === "center") {
                setSelected(c);
                if (c.has_subcontent) setMode("presentation-view");
              }
            };

            return (
              <motion.div key={index} style={style} onClick={handleClick}>
                {/* IMAGE FULLY VISIBLE – NO CROP */}
                {c.files?.[0] ? (
                  <img
                    src={c.files[0]}
                    className="w-full h-full object-contain bg-black/20"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full bg-black/50 text-white">
                    No Image
                  </div>
                )}

                {/* TITLE OVERLAY (Center only) */}
                {pos === "center" && (
                  <div className="absolute bottom-3 w-full text-center">
                    <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white drop-shadow-xl">
                      {c.title}
                    </h2>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* === RESPONSIVE DESCRIPTION AREA === */}
        <div className="absolute bottom-5 w-[90%] sm:w-[80%] text-center text-white 
                        text-sm sm:text-base md:text-lg lg:text-xl 
                        leading-relaxed bg-black/30 backdrop-blur-sm
                        p-3 sm:p-4 md:p-5 rounded-xl">
          {active?.content}
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
          onClick={() => navigate(`/container/${container}`)}
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
                ${
                  activeIndex === i
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
    const overlapVW = 15;
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
          onClick={() => {navigate(`/container/${container}`);}} 
        >
          <img
            src={containerLogo}
            alt="logo"
            className={`h-48 w-auto object-contain z-[9999] ${
              logoAnimated ? "logo-animate-diagonal" : ""
            }`}
          />
        </div>


        {/* LEFT EMPTY AREA */}
        <div className="w-[10%] h-full relative flex items-center justify-center shrink-0">

          {/* BACK BUTTON CENTERED */}
          <div
            onClick={() => {navigate(`/container/${container}`);}} 
            className="absolute cursor-pointer select-none flex items-center justify-center gap-3 m-4"
          >
            <span className="text-white text-6xl font-bold drop-shadow">←</span>
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
                inline-block h-full relative cursor-pointer group
                w-[80vw] sm:w-[60vw] md:w-[45vw] lg:w-[42vw]
              "
              style={{
                transform: `translateX(-${index * overlapVW}vw)`,
                clipPath: "polygon(30% 0, 100% 0, 70% 100%, 0% 100%)",
              }}
            >
              {/* Background */}
              <div
                className="absolute inset-0 bg-cover bg-center brightness-75 
                          group-hover:brightness-100 transition-all duration-700"
                style={{ backgroundImage: `url(${item.files?.[0]})` }}
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

    // READ MORE state
    // Slide-in animation (Right → Left)
    const slideIn = {
      initial: { x: 200, opacity: 0 },
      animate: { x: 0, opacity: 1 },
      transition: { duration: 0.8, ease: "easeOut" }
    };

    const text = selected.content || "";
    const words = text.split(" ");
    const isLong = words.length > 50;
    const previewText = words.slice(0, 50).join(" ") + "...";

    return (
      <div
        className="relative w-full h-screen text-white"
        style={{
          backgroundImage: `url(${background})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >

        {/* === LEFT SLANTED IMAGE PANEL (ANIMATED) === */}
        <motion.div
          className="absolute inset-y-0 left-0 w-1/3 ml-30"
          style={{
            backgroundImage: `url(${selected.files?.[0]})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            clipPath: "polygon(30% 0, 100% 0, 70% 100%, 0% 100%)",
          }}
          initial="initial"
          animate="animate"
          variants={slideIn}
        >
          {/* CENTER LOGO CLICKABLE */}
          {selected.logo && (
            <div
              className="absolute inset-0 flex items-center justify-center cursor-pointer"
              onClick={() => setMode("diagonal-split-view")}
            >
              <img
                src={selected.logo}
                className="w-22 h-42 md:w-25 md:h-45 drop-shadow-2xl"
                alt="Logo"
              />
            </div>
          )}
        </motion.div>

        {/* === RIGHT SIDE TEXT BLOCK === */}
        <motion.div
          className="
            absolute 
            top-1/2 
            right-10 
            -translate-y-1/2
            bg-black/55 
            p-10 
            rounded-xl 
            max-w-5xl 
            shadow-xl
          "
        >
          <h1 className="text-3xl font-bold mb-6">{selected.title}</h1>

          {/* === READ MORE / READ LESS === */}
          {!showFullText ? (
            <>
              <p className="text-xl leading-relaxed whitespace-pre-line">
                {isLong ? previewText : text}
              </p>

              {isLong && (
                <button
                  className="mt-3 text-yellow-300 underline font-semibold"
                  onClick={() => setShowFullText(true)}
                >
                  Read More
                </button>
              )}
            </>
          ) : (
            <>
              <div className="max-h-[400px] overflow-y-auto pr-2">
                <p className="text-xl leading-relaxed whitespace-pre-line">
                  {text}
                </p>
              </div>

              <button
                className="mt-3 text-yellow-300 underline font-semibold"
                onClick={() => setShowFullText(false)}
              >
                Read Less
              </button>
            </>
          )}
        </motion.div>

        {/* === QR CODE (BOTTOM RIGHT) === */}
        {selected.qr_code_url && (
          <div className="absolute bottom-10 right-10 text-center">
            <img
              src={selected.qr_code_url}
              className="w-40 h-40 bg-white p-3 rounded-xl shadow-xl"
              alt="QR"
            />
            <div className="mt-2 font-semibold text-white">Learn More</div>
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
          onClick={() => navigate(`/container/${container}`)}
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
        style={{ backgroundImage: `url(${background})` }}
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
          onClick={() => navigate(`/container/${container}`)}
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
                src={selected.files?.[0]}
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
            <div className="w-full md:w-[50%] text-base md:text-xl leading-relaxed">

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






  const PresentationShowcaseView = () => {
    const prev = () =>
      setActiveIndex((prev) => (prev === 0 ? contents.length - 1 : prev - 1));

    const next = () =>
      setActiveIndex((prev) =>
        prev === contents.length - 1 ? 0 : prev + 1
      );

    const getPosition = (index) => {
      if (index === activeIndex) return "center";
      if (index === activeIndex - 1) return "left";
      if (index === activeIndex + 1) return "right";
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
          className="absolute top-4 cursor-pointer z-50"
          onClick={() => navigate(`/container/${container}`)}
        >
          <img
            src={containerLogo}
            alt="logo"
            className="h-20 sm:h-24 md:h-40 lg:h-48 w-auto object-contain"
          />
        </div>

        {/* === RESPONSIVE SLIDER === */}
        <div className="relative w-full h-[60%] sm:h-[65%] md:h-[70%] flex items-center justify-center">
          {contents.map((c, index) => {
            const pos = getPosition(index);

            // RESPONSIVE SLIDE BASE STYLE
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
              filter: "grayscale(40%)",
            };

            // RESPONSIVE OFFSETS
            const mobileOffset = "42vw";
            const desktopOffset = "350px";

            // Choose offset depending on screen width
            const offset = window.innerWidth < 768 ? mobileOffset : desktopOffset;

            if (pos === "center") {
              style.transform = "scale(1)";
              style.opacity = 1;
              style.zIndex = 40;
              style.filter = "grayscale(0%)";
            } else if (pos === "left") {
              style.transform = `translateX(-${offset}) scale(0.85)`;
              style.opacity = 0.5;
              style.zIndex = 20;
            } else if (pos === "right") {
              style.transform = `translateX(${offset}) scale(0.85)`;
              style.opacity = 0.5;
              style.zIndex = 20;
            }

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
                {/* IMAGE FULLY VISIBLE – NO CROP */}
                {c.files?.[0] ? (
                  <img
                    src={c.files[0]}
                    className="w-full h-full object-contain bg-black/20"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full bg-black/50 text-white">
                    No Image
                  </div>
                )}

                {/* TITLE OVERLAY (Center only) */}
                {pos === "center" && (
                  <div className="absolute bottom-3 w-full text-center">
                    <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white drop-shadow-xl">
                      {c.title}
                    </h2>
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

    const images = [
      selected.sub_contents?.[0]?.main_image,
      ...(selected.sub_contents?.[0]?.gallery_images || [])
    ];

    const [activeIndex, setActiveIndex] = useState(0);
    const backgroundImage = images[activeIndex];

    return (
      <div
        className="relative w-full min-h-screen flex flex-col"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* DARK OVERLAY */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

        {/* ===== TOP RIGHT LOGO ===== */}
        <div
          className="absolute top-4 right-4 cursor-pointer z-[9999]"
          onClick={() => setMode("slider-thumbnail-view")}
        >
          <img
            src={containerLogo}
            alt="logo"
            className="h-20 md:h-40 w-auto object-contain"
          />
        </div>

        {/* ===== GRID AREA (Image Left + Text Right) ===== */}
        <div
          className="
            relative z-20
            flex-grow grid grid-cols-1 md:grid-cols-2
            gap-6 md:gap-10
            px-4 md:px-12
            pt-20 md:pt-28
          "
        >

          {/* === LEFT FULL IMAGE === */}
          <div
            className="
              w-full h-[40vh] md:h-[65vh]
              rounded-xl shadow-2xl
              border border-white/10
            "
            style={{
              backgroundImage: `url(${images[activeIndex]})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></div>

          {/* === RIGHT CONTENT === */}
          <div className="flex flex-col justify-start items-start">
            <div
              className="
                bg-black/35 backdrop-blur-sm
                p-5 md:p-10 lg:p-16
                rounded-xl shadow-xl
                w-full max-w-4xl
              "
            >
              <h1 className="text-2xl md:text-4xl font-bold mb-4 text-white">
                {selected.title}
              </h1>

              <p className="text-white text-lg md:text-2xl leading-relaxed whitespace-pre-line">
                {selected.sub_contents?.[0]?.description}
              </p>
            </div>
          </div>

          {/* === QR CODE (bottom-right) === */}
          {selected.qr_code_url && (
            <div className="absolute bottom-5 right-5 flex flex-col items-center z-30">
              <img
                src={selected.qr_code_url}
                className="w-24 h-24 md:w-40 md:h-40 bg-white p-2 rounded-xl shadow-xl"
                alt="QR Code"
              />
              <span className="text-white mt-2 font-semibold">Learn More</span>
            </div>
          )}
        </div>

        {/* === THUMBNAIL STRIP === */}
        <div
          className="
            relative z-30
            w-full p-3 md:p-4
            bg-black/50 backdrop-blur-md
            flex gap-3 md:gap-4
            overflow-x-auto
            border-t border-white/20
          "
        >
          {images.map((img, i) => (
            <img
              key={i}
              src={img}
              onClick={() => setActiveIndex(i)}
              className={`
                h-20 w-24 md:h-28 md:w-32 object-cover rounded-lg cursor-pointer
                border-2 md:border-4 transition-all duration-300
                ${
                  activeIndex === i
                    ? "border-yellow-400 scale-110 opacity-100"
                    : "border-transparent opacity-60 hover:opacity-100"
                }
              `}
            />
          ))}
        </div>
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

      {mode === "slider-thumbnail-view"  && <PresentationShowcaseView />}
      {mode === 'slider-thumb' && <SliderThumbnailGalleryView /> }

      {galleryOpen && renderGalleryView()}

    </>
  );


}

export default ScreenView;

