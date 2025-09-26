import React, { useState } from "react";
import {
    FaChevronDown,
    FaDownload,
    FaPlay,
    FaPause,
    FaShareAlt,
} from "react-icons/fa";
import html2canvas from "html2canvas";
import duaAudio from "@/assets/dua.mp3";
import icon from "/icon.png";
// import bgImage from "@/assets/dua-card-2.jpg";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

const duaData = {
    title: "to say in Trouble & Distress",
    arabic:
        "حَسْبِيَ اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ",
    transcription: {
        None: "",
        English: "Hasbiyallaahu laa ilaaha illaa Huwa alayhi tawakkaltu wa Huwa Rabbul-Arshil-Adheem",
        Hindi: "हसबियल्लाहु ला इलाहा इल्ला हुवा, अलैहि तवक्कलतु व हुवा रब्बुल अर्शिल अज़ीम",
        // Urdu: "حَسبِیَ اللّٰہُ لَا اِلٰہَ اِلَّا ھُوَ عَلَیہِ تَوَکَّلْتُ وَھُوَ رَبُّ الْعَرشِ الْعَظِیمِ",
    },
    translation: {
        English: "Sufficient for me is Allah there is nothing worthy of worship except for Him, I place my trust in Him, He is the Lord of the mighty throne.",
        Hindi: "अल्लाह मेरे लिए काफी है, उसके सिवा कोई इबादत के लायक नहीं, उसी पर मैंने भरोसा किया, और वही अर्श-ए-अज़ीम का रब है।",
        Urdu: "اللہ میرے لیے کافی ہے؛ اس کے سوا کوئی عبادت کے لائق نہیں۔ میں نے اسی پر بھروسہ کیا اور وہی عرشِ عظیم کا رب ہے۔",
        RomanUrdu: "Allah mere liye kaafi hai, uske siwa koi ibadat ke layaq nahin, usi par maine bharosa kiya, aur wahi Arsh-e-Azeem ka Rab hai.",
    },
};

export default function DuaCard() {
    const [transLang, setTransLang] = useState("None");
    const [tranLang, setTranLang] = useState("English");
    const [isPlaying, setIsPlaying] = useState(false);
    const [audio] = useState(new Audio(duaAudio));

    const optionsTrans = ["None", "English", "Hindi" /*, "Urdu"*/];
    const optionsTran = ["English", "Hindi", "Urdu", "RomanUrdu"];


    const togglePlay = () => {
        if (isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleDownload = () => {
        const card = document.getElementById("dua-card-fixed");
        if (!card) return;

        html2canvas(card, { useCORS: true, logging: false, width: 1080, height: 1080 })
            .then((canvas) => {
                const link = document.createElement("a");
                link.download = `dua-card-${tranLang.toLowerCase()}.png`;
                link.href = canvas.toDataURL("image/png");
                link.click();
            })
            .catch((err) => {
                console.error("Image download failed:", err);
                alert("Failed to download image. Please try again.");
            });
    };

    const sourceText = "Shared from Ethics For Youth: https://myduaapp.example.com";

    const handleShare = async () => {
        const card = document.getElementById("dua-card-fixed");
        if (!card) return;

        try {
            const canvas = await html2canvas(card, { useCORS: true, logging: false, width: 1080, height: 1080 });
            canvas.toBlob(async (blob) => {
                if (!blob) return alert("Image generation failed!");
                const file = new File([blob], "dua-card.png", { type: "image/png" });

                const shareData = {
                    title: "Dua Card",
                    text: `${duaData.arabic}\n\n${duaData.transcription[transLang] ?? ""}\n\n${duaData.translation[tranLang]}\n\n${sourceText}`,
                    files: [file],
                };

                if (navigator.canShare && navigator.canShare({ files: [file] })) {
                    try {
                        await navigator.share(shareData);
                    } catch (error) {
                        console.error("Share failed:", error);
                    }
                } else {
                    alert("Sharing not supported. You can download the image instead.");
                }
            }, "image/png");
        } catch (err) {
            console.error("Image capture/share failed:", err);
            alert("Failed to share card. Please try again.");
        }
    };



    return (
        <div className="flex flex-col p-4 sm:p-6">
            <div className="top-3 left-4 flex sm:flex-row gap-4">
                {/* Transcription */}
                <Menu as="div" className="relative text-left">
                    <MenuButton className="inline-flex justify-between items-center rounded-lg px-3 py-1.5 bg-gradient-primary hover:opacity-90 transition-opacity text-white text-xs font-medium shadow-sm focus:outline-none">
                        <span>Transcription: {transLang}</span>
                        <FaChevronDown className="ml-2 h-3 w-3 text-gray-300 ui-open:rotate-180 transition-transform" />
                    </MenuButton>
                    <MenuItems className="absolute left-0 mt-1 w-36 origin-top-left rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-10 focus:outline-none">
                        {optionsTrans.map((opt) => (
                            <MenuItem key={opt}>
                                {({ active }) => (
                                    <div
                                        onClick={() => setTransLang(opt)}
                                        className={`${active ? "bg-green-100 text-gray-900" : "text-gray-700"
                                            } px-3 py-1 text-xs cursor-pointer rounded-md`}
                                    >
                                        {opt}
                                    </div>
                                )}
                            </MenuItem>
                        ))}
                    </MenuItems>
                </Menu>

                {/* Translation */}
                <Menu as="div" className="relative text-left">
                    <MenuButton className="inline-flex justify-between items-center rounded-lg px-3 py-1.5 bg-gradient-primary hover:opacity-90 text-white text-xs font-medium shadow-sm hover:bg-gray-700 focus:outline-none">
                        <span>Translation: {tranLang}</span>
                        <FaChevronDown className="ml-2 h-3 w-3 text-gray-300 ui-open:rotate-180 transition-transform" />
                    </MenuButton>
                    <MenuItems className="absolute left-0 mt-1 w-36 origin-top-left rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-10 focus:outline-none">
                        {optionsTran.map((opt) => (
                            <MenuItem key={opt}>
                                {({ active }) => (
                                    <div
                                        onClick={() => setTranLang(opt)}
                                        className={`${active ? "bg-green-100 text-gray-900" : "text-gray-700"
                                            } px-3 py-1 text-xs cursor-pointer rounded-md`}
                                    >
                                        {opt}
                                    </div>
                                )}
                            </MenuItem>
                        ))}
                    </MenuItems>
                </Menu>
            </div>

            <div className="flex flex-col pt-4 pb-4 sm:pt-6 sm:pb-6">
  <div className="relative w-full max-w-7xl mx-auto"> 
    <div
      id="dua-card"
      className="
        relative 
        w-full        /* fixed full width */
        h-auto        /* only height grows */
        rounded-2xl
        shadow-xl
        p-4 sm:p-10
        bg-gradient-to-br from-[#fdfcfb] to-[#e2d1c3]
        flex flex-col justify-between
      "
    >


                        <p
                            className="text-ms sm:text-base italic text-center mb-6"
                            style={{
                                fontFamily: '"Georgia", "Times New Roman", serif',
                                color: "#4B5563",
                                fontWeight: 500
                            }}
                        >
                            {duaData.title}
                        </p>


                        {/* Arabic Dua */}
                        <p className="text-2xl sm:text-4xl font-bold text-center text-[#2E4A27] mb-6 font-[Amiri] leading-relaxed">
                            {duaData.arabic}
                        </p>

                        {/* Transcription */}
                        {transLang !== "None" && (
                            <p className="text-md sm:text-base text-center text-gray-700 mb-2">
                                {duaData.transcription[transLang]}
                            </p>
                        )}

                        {/* Translation */}
                        <p className="text-base sm:text-lg text-center text-gray-800 leading-relaxed mb-8">
                            {duaData.translation[tranLang]}
                        </p>
                    </div>

                    {/* Action Capsule */}
                    <div
                        className="
                        absolute 
                        left-1/2 
                        bottom-0 
                        -translate-x-1/2 
                        translate-y-1/2
                        w-fit 
                        z-20 
                        flex 
                        justify-center
                        min-w-min
                        px-2 sm:px-6
                    "
                    >
                        <div className="flex flex-nowrap items-center gap-2 sm:gap-4 bg-white rounded-full px-2 sm:px-6 py-2 shadow-md">

                            {/* Download */}
                            <button
                                onClick={handleDownload}
                                className="flex items-center justify-center rounded-full w-10 h-10 bg-[#2E4A27] hover:bg-green-800 active:bg-green-900 shadow transition"
                                title="Download"
                            >
                                <FaDownload className="text-white w-4 h-4" />
                            </button>

                            {/* Play/Pause */}
                            <button
                                onClick={togglePlay}
                                className="flex items-center justify-center rounded-full w-12 h-12 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 shadow transition"
                                title="Play/Pause"
                            >
                                {isPlaying ? (
                                    <FaPause className="text-[#2E4A27] w-5 h-5" />
                                ) : (
                                    <FaPlay className="text-[#2E4A27] w-5 h-5" />
                                )}
                            </button>

                            {/* Share */}

                            <button
                                onClick={handleShare}
                                className="flex items-center justify-center rounded-full w-10 h-10 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 shadow transition"
                                title="Share"
                            >
                                <FaShareAlt className="text-white w-4 h-4" />
                            </button>

                            {/* Hidden fixed-size card for image/share capture */}
                            <div
                                id="dua-card-fixed"
                                style={{
                                    position: "absolute",
                                    top: "-9999px",
                                    left: "-9999px",
                                    width: "1080px",
                                    height: "1080px",
                                    padding: "40px 30px",
                                    backgroundImage: "linear-gradient(to bottom right, #fdfcfb, #e2d1c3)",
                                    borderRadius: "1rem",
                                    boxShadow: "0 10px 15px rgba(0,0,0,0.1)",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",         // <-- Center text vertically!
                                    alignItems: "center",             // <-- Center horizontally
                                    overflowY: "auto",
                                    color: "#2E4A27",
                                    fontFamily: "'Amiri', serif",
                                    boxSizing: "border-box",


                                }}
                            >

                                <div className="flex flex-col items-center mb-6">
                                    <h2
                                        className="text-6xl sm:text-5xl font-bold text-center mb-22"
                                        style={{
                                            fontFamily: '"Playfair Display", "Merriweather", serif',
                                            color: "#1f2937", // Use dark color for strong heading
                                            letterSpacing: "0.01em"
                                        }}
                                    >
                                        DU'AA
                                    </h2>
                                    <p
                                        className="text-4xl sm:text-3xl italic text-center"
                                        style={{
                                            fontFamily: '"Georgia", "Times New Roman", serif',
                                            color: "#4B5563",    // Subtle gray like sample image
                                            fontWeight: 400,
                                            marginTop: "5px"
                                        }}
                                    >
                                        {duaData.title}
                                    </p>
                                </div>


                                {/* Clone of the card content */}
                                <p
                                    style={{
                                        fontSize: "74px",          // bigger for short text
                                        fontWeight: 700,
                                        textAlign: "center",
                                        marginBottom: "2.75rem",
                                        lineHeight: 1.1,
                                        maxWidth: "90%",
                                        wordBreak: "break-word",
                                    }}
                                >
                                    {duaData.arabic}
                                </p>
                                {transLang !== "None" && (
                                    <p
                                        style={{
                                            fontSize: "38px",
                                            fontStyle: "italic",
                                            textAlign: "center",
                                            color: "#4B5563",
                                            marginBottom: "2.75rem",
                                            maxWidth: "90%",
                                            wordBreak: "break-word",
                                        }}
                                    >
                                        {duaData.transcription[transLang]}
                                    </p>
                                )}
                                <p
                                    style={{
                                        fontSize: "38px",
                                        textAlign: "center",
                                        color: "#1F2937",
                                        lineHeight: 1.3,
                                        marginBottom: 0,
                                        maxWidth: "90%",
                                        wordBreak: "break-word",
                                    }}
                                >
                                    {duaData.translation[tranLang]}
                                </p>

                                {/* Footer: Logo (left) + Website (right) */}
                                <div
                                    style={{
                                        position: "absolute",
                                        bottom: "30px",
                                        left: "40px",
                                        right: "40px",
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        background: "transparent",   // ✅ no white patch
                                        pointerEvents: "none",
                                    }}
                                >
                                    {/* Logo */}
                                    <div className="flex items-center space-x-3">
                                        <img
                                            src={icon}
                                            alt="Logo"
                                            style={{
                                                width: "80px",
                                                height: "auto",
                                                objectFit: "contain",
                                            }}
                                        />
                                        <span className="text-2xl font-semibold text-gradient-to-r from-[#4B703D] to-[#2E4A27] 
                                        dark:from-[#F8FAFC] dark:to-[#94A3B8] mb-6">
                                            Ethics For Youth
                                        </span>
                                    </div>

                                    {/* Website */}
                                    <span
                                        style={{
                                            fontSize: "28px",
                                            color: "#374151",
                                            fontFamily: '"Nunito", sans-serif',
                                        }}
                                    >
                                        www.efy.org.in
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
