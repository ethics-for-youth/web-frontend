import React, { useState, useEffect } from "react";
import {
    FaChevronDown,
    FaDownload,
    FaPlay,
    FaPause,
    FaShareAlt,
} from "react-icons/fa";
import { Loader2 } from "lucide-react";
import html2canvas from "html2canvas";
import icon from "/icon.png";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { duasApi, Dua } from '@/services/duaApi';

export default function DuaCard() {
    const [dua, setDua] = useState<Dua | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const [transLang, setTransLang] = useState<"None" | "English" | "Hindi">("None");
    const [tranLang, setTranLang] = useState<"English" | "Hindi" | "Urdu" | "RomanUrdu">("English");
    const [isPlaying, setIsPlaying] = useState(false);
    const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

    const optionsTrans: ("None" | "English" | "Hindi")[] = ["None", "English", "Hindi"];
    const optionsTran: ("English" | "Hindi" | "Urdu" | "RomanUrdu")[] = ["English", "Hindi", "Urdu", "RomanUrdu"];

    // Fetch current week's dua
    useEffect(() => {
        const fetchDua = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Get all duas
                const allDuas = await duasApi.getDuas();
                
                // Filter active duas
                const activeDuas = allDuas.filter(d => d.status === 'active');
                
                if (activeDuas.length === 0) {
                    setError('No active duas available');
                    return;
                }
                
                // Get current week number
                const now = new Date();
                const firstDay = new Date(now.getFullYear(), 0, 1);
                const pastDays = Math.floor((now.getTime() - firstDay.getTime()) / (24 * 60 * 60 * 1000));
                const currentWeek = Math.ceil((pastDays + firstDay.getDay() + 1) / 7);
                
                // Find dua for current week, or use the most recent one
                let currentDua = activeDuas.find(d => d.week === currentWeek);
                
                if (!currentDua) {
                    // Sort by createdAt and get the most recent
                    currentDua = activeDuas.sort((a, b) => 
                        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                    )[0];
                }
                
                setDua(currentDua);
                console.log("dd",currentDua.audioUrl)
                // Setup audio if available
                if (currentDua.audioUrl) {
                    const audioElement = new Audio(currentDua.audioUrl);
                    setAudio(audioElement);
                }
            } catch (err: any) {
                console.error('Error fetching dua:', err);
                setError(err.message || 'Failed to load dua');
            } finally {
                setLoading(false);
            }
        };

        fetchDua();

        // Cleanup audio on unmount
        return () => {
            if (audio) {
                audio.pause();
                audio.src = '';
            }
        };
    }, []);

    const togglePlay = () => {
        if (!audio) return;
        
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

    const sourceText = "Shared from Ethics For Youth: https://www.efy.org.in";

    const handleShare = async () => {
        if (!dua) return;
        const card = document.getElementById("dua-card-fixed");
        if (!card) return;

        try {
            const canvas = await html2canvas(card, { useCORS: true, logging: false, width: 1080, height: 1080 });
            canvas.toBlob(async (blob) => {
                if (!blob) return alert("Image generation failed!");
                const file = new File([blob], "dua-card.png", { type: "image/png" });

                const transcriptionText = transLang !== "None" && dua.transcription?.[tranLang.toLowerCase() as keyof typeof dua.transcription] 
                    ? `\n\n${dua.transcription[tranLang.toLowerCase() as keyof typeof dua.transcription]}` 
                    : "";
                
                const translationText = dua.translation?.[tranLang === "RomanUrdu" ? "romanUrdu" : tranLang.toLowerCase() as keyof typeof dua.translation] || "";

                const shareData = {
                    title: "Dua Card",
                    text: `${dua.arabic}${transcriptionText}\n\n${translationText}\n\n${sourceText}`,
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

    // Loading state
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-[#5E7839]" />
                    <p className="text-gray-600">Loading dua...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error || !dua) {
        return (
            <div className="flex items-center justify-center min-h-screen p-4">
                <div className="text-center max-w-md">
                    <p className="text-red-600 mb-4">{error || 'No dua available'}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-[#2E4A27] text-white rounded-lg hover:bg-green-800"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    // Get the text values safely
    const transcriptionText = transLang !== "None" && dua.transcription?.[transLang.toLowerCase() as keyof typeof dua.transcription]
        ? dua.transcription[transLang.toLowerCase() as keyof typeof dua.transcription]
        : "";

    const translationKey = tranLang === "RomanUrdu" ? "romanUrdu" : tranLang.toLowerCase();
    const translationText = dua.translation?.[translationKey as keyof typeof dua.translation] || "";

    return (
        <div className="relative flex flex-col p-4 sm:p-6">
            <div className="flex flex-col py-8 sm:py-4 lg:py-4">
                <div className="absolute top-0 left-4 sm:top-0 sm:left-4 md:top-0 md:left-8 flex flex-row gap-4 z-30">
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
                                            className={`${
                                                active ? "bg-green-100 text-gray-900" : "text-gray-700"
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
                                            className={`${
                                                active ? "bg-green-100 text-gray-900" : "text-gray-700"
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

                <div className="relative w-full max-w-7xl mx-auto">
                    <div className="absolute -inset-x-4 -inset-y-6 rounded-3xl opacity-30 blur-3xl bg-green-300"></div>

                    <div
                        id="dua-card"
                        className="relative flex flex-col justify-between p-6 bg-white rounded-2xl shadow-xl"
                    >
                        <p className="text-ms sm:text-base italic text-center mb-6 font-pj text-gray-600">
                            {dua.title}
                        </p>

                        {/* Arabic Dua */}
                        <p className="text-2xl sm:text-4xl font-bold text-center text-[#2E4A27] mb-6 font-[Amiri] leading-relaxed">
                            {dua.arabic}
                        </p>

                        {/* Transcription */}
                        {transcriptionText && (
                            <p className="text-md sm:text-base text-center text-gray-700 mb-2">
                                {transcriptionText}
                            </p>
                        )}

                        {/* Translation */}
                        {translationText && (
                            <p className="text-base sm:text-lg text-center text-gray-800 leading-relaxed mb-8">
                                {translationText}
                            </p>
                        )}
                    </div>

                    {/* Action Capsule */}
                    <div className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2 w-fit z-20 flex justify-center min-w-min px-2 sm:px-6">
                        <div className="flex flex-nowrap items-center gap-2 sm:gap-4 bg-white rounded-full px-2 sm:px-6 py-2 shadow-md">
                            {/* Download */}
                            <button
                                onClick={handleDownload}
                                className="flex items-center justify-center rounded-full w-10 h-10 bg-[#2E4A27] hover:bg-green-800 active:bg-green-900 shadow transition"
                                title="Download"
                            >
                                <FaDownload className="text-white w-4 h-4" />
                            </button>

                            {/* Play/Pause - Only show if audio exists */}
                            {audio && (
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
                            )}

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
                                    background: "linear-gradient(to top, #a7f3d0 0%, transparent 40%) white",
                                    borderRadius: "1rem",
                                    boxShadow: "0 10px 15px rgba(0,0,0,0.1)",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "center",
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
                                            color: "#1f2937",
                                            letterSpacing: "0.01em"
                                        }}
                                    >
                                        DU'AA
                                    </h2>
                                    <p
                                        className="text-4xl sm:text-3xl italic text-center"
                                        style={{
                                            fontFamily: '"Georgia", "Times New Roman", serif',
                                            color: "#4B5563",
                                            fontWeight: 400,
                                            marginTop: "5px"
                                        }}
                                    >
                                        {dua.title}
                                    </p>
                                </div>

                                <p
                                    style={{
                                        fontSize: "74px",
                                        fontWeight: 700,
                                        textAlign: "center",
                                        marginBottom: "2.75rem",
                                        lineHeight: 1.1,
                                        maxWidth: "90%",
                                        wordBreak: "break-word",
                                    }}
                                >
                                    {dua.arabic}
                                </p>
                                
                                {transcriptionText && (
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
                                        {transcriptionText}
                                    </p>
                                )}
                                
                                {translationText && (
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
                                        {translationText}
                                    </p>
                                )}

                                {/* Footer: Logo + Website */}
                                <div
                                    style={{
                                        position: "absolute",
                                        bottom: "30px",
                                        left: "40px",
                                        right: "40px",
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        background: "transparent",
                                        pointerEvents: "none",
                                    }}
                                >
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
                                        <span className="text-2xl font-semibold text-gradient-to-r from-[#4B703D] to-[#2E4A27] dark:from-[#F8FAFC] dark:to-[#94A3B8] mb-6">
                                            Ethics For Youth
                                        </span>
                                    </div>

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