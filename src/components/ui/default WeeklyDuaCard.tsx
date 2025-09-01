import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Share2, Play } from "lucide-react";
import html2canvas from "html2canvas";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import surahFatiha from "@/assets/Surah Fatiha.mp3";

const duaArabic = "ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَـٰلَمِينَ";
const duaRoman = "Alhamdulillahi rabbil 'aalameen";

// Translations 
const translations: Record<string, string> = {
    urdu: "سب تعریفیں اللہ کے لیے ہیں جو تمام جہانوں کا رب ہے",
    hindi: "सब प्रशंसा अल्लाह के लिए है जो सारे जहानों का पालनहार है",
    roman: "Tamam tareefen Allah ki hai jo tamam jahaanon ka perwerdigar hai",
};

// Transcriptions
const transcriptions: Record<string, string> = {
    urdu: "الـحمدُ للہِ ربِ العالمین",
    hindi: "अलहम्दु लिल्लाहि रब्बिल आलमीन",
    roman: "Alhamdulillahi rabbil 'aalameen",
};

const WeeklyDuaCard = () => {
    const [activeTab, setActiveTab] = useState<"translation" | "transcription">("translation");
    const [language, setLanguage] = useState<"urdu" | "hindi" | "roman">("urdu");
    const contentRef = useRef<HTMLDivElement>(null);


    const handleDownload = async () => {
        if (!contentRef.current) return;
        const canvas = await html2canvas(contentRef.current);
        const dataUrl = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = "weekly-dua.png";
        link.click();
    };

    //  Share Card as Image
    const handleShare = async () => {
        if (!contentRef.current) return;
        const canvas = await html2canvas(contentRef.current);
        const dataUrl = canvas.toDataURL("image/png");
        const res = await fetch(dataUrl);
        const blob = await res.blob();
        const file = new File([blob], "weekly-dua.png", { type: "image/png" });

        try {
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    files: [file],
                    title: "Weekly Dua",
                    text: "Check out this week's dua!",
                });
            } else {
                // fallback → download
                const link = document.createElement("a");
                link.href = dataUrl;
                link.download = "weekly-dua.png";
                link.click();
            }
        } catch (err) {
            console.error("Share failed", err);
        }
    };

    
    const handlePlay = () => {
        const audio = new Audio(surahFatiha);
        audio.play();
    };

    return (
        <section className="py-12 ">
            <div className="max-w-3xl mx-auto px-4">
                <Card className="shadow-card hover:shadow-lg transition-shadow bg-gradient-card p-6 text-center">
                    <CardHeader>
                        <CardTitle className="text-3xl font-bold text-primary">
                            Weekly Dua
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Tabs */}
                        <div className="flex justify-center gap-4">
                            <Button
                                variant={activeTab === "translation" ? "default" : "outline"}
                                onClick={() => setActiveTab("translation")}
                            >
                                Translation
                            </Button>
                            <Button
                                variant={activeTab === "transcription" ? "default" : "outline"}
                                onClick={() => setActiveTab("transcription")}
                            >
                                Transcription
                            </Button>
                        </div>

                        {/*  Content to capture */}
                        <div ref={contentRef} className="space-y-6 py-4">
                            {/* Arabic + Roman Dua */}
                            <div className="space-y-3">
                                <p
                                    style={{ fontFamily: "'Amiri', serif" }}
                                    className="text-4xl md:text-5xl text-primary leading-relaxed"
                                >
                                    {duaArabic}
                                </p>
                                <p className="text-lg text-gray-600 italic">{duaRoman}</p>
                            </div>

                            {/* Translation/Transcription text  */}
                            <p className="mt-3 text-gray-700 text-lg">
                                {activeTab === "translation"
                                    ? translations[language]
                                    : transcriptions[language]}
                            </p>
                        </div>

                        {/* Action Buttons  */}
                        <div className="flex justify-center gap-6 flex-wrap">
                            {/* Language selector stays here */}

                            <Select value={language} onValueChange={(val) => setLanguage(val as any)}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select language" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="urdu">Urdu</SelectItem>
                                    <SelectItem value="hindi">Hindi</SelectItem>
                                    <SelectItem value="roman">Roman English</SelectItem>
                                </SelectContent>
                            </Select>


                            <Button
                                onClick={handlePlay}
                                variant="outline"
                                className="flex items-center gap-2"
                            >
                                <Play className="w-4 h-4" /> Play
                            </Button>
                            <Button
                                onClick={handleShare}
                                variant="outline"
                                className="flex items-center gap-2"
                            >
                                <Share2 className="w-4 h-4" /> Share
                            </Button>
                            <Button
                                onClick={handleDownload}
                                variant="outline"
                                className="flex items-center gap-2"
                            >
                                <Download className="w-4 h-4" /> Download
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </section>
    );
};

export default WeeklyDuaCard;