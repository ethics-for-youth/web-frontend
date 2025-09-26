import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, ToggleRight, ToggleLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Utility functions for week number and date formatting
function getWeekNumber(date) {
  const firstDay = new Date(date.getFullYear(), 0, 1);
  const pastDays = Math.floor((date.getTime() - firstDay.getTime()) / (24 * 60 * 60 * 1000));
  return Math.ceil((pastDays + firstDay.getDay() + 1) / 7);
}

function formatDateForInput(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "short", day: "numeric" });
}

function AdminDuaForm({ onSubmit, onSuccess, initialValues = null }) {
  const [timestamp, setTimestamp] = useState(initialValues?.createdAt ? new Date(initialValues.createdAt) : new Date());
  const [inputs, setInputs] = useState(
    initialValues || {
      title: "",
      arabic: "",
      transcriptionEng: "",
      transcriptionHindi: "",
      translationEng: "",
      translationUrdu: "",
      translationHindi: "",
      translationRoman: "",
    }
  );

  const [audio, setAudio] = useState(initialValues?.audio || null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => setInputs({ ...inputs, [e.target.name]: e.target.value });
  const handleAudio = (e) => setAudio(e.target.files[0] || null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const formData = {
        ...inputs,
        audio,
        createdAt: timestamp.toISOString(),
        week: getWeekNumber(timestamp),
      };
      await onSubmit(formData);
      setSuccessMsg("✅ Dua submitted successfully!");
      if (!initialValues) {
        setInputs({
          title: "",
          arabic: "",
          transcriptionEng: "",
          transcriptionHindi: "",
          translationEng: "",
          translationUrdu: "",
          translationHindi: "",
          translationRoman: "",
        });
        setAudio(null);
      }
      setTimeout(() => onSuccess(), 1200);
    } catch {
      setErrorMsg("❌ Failed to submit dua. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => setTimestamp(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const weekNum = getWeekNumber(timestamp);
  const formattedDate = formatDateForInput(timestamp);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          {/* <CardTitle>{initialValues ? "Edit Dua" : "Add New Dua"}</CardTitle> */}
          <CardDescription className="flex items-center space-x-3">
            {/* <span>{initialValues ? "Update the fields below" : "Fill out the fields below"}</span> */}
            <Badge className="ml-auto">Week {weekNum}</Badge>
            <span className="text-xs text-gray-500">{formattedDate}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {successMsg && (
            <div className="p-3 bg-green-50 border border-green-300 text-green-700 rounded">{successMsg}</div>
          )}
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-300 text-red-700 rounded">{errorMsg}</div>
          )}

          <div>
            <Label htmlFor="title" className="mb-2 block font-semibold">
              Title
            </Label>
            <Input
              id="title"
              name="title"
              placeholder="e.g. To say in Trouble & Distress"
              value={inputs.title}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="arabic" className="mb-2 block font-semibold">
              Arabic Text
            </Label>
            <Textarea
              id="arabic"
              name="arabic"
              placeholder="Enter Arabic text here..."
              rows={3}
              value={inputs.arabic}
              onChange={handleChange}
              required
              dir="rtl"
              style={{ fontFamily: "'Amiri', serif", fontSize: "1.4rem" }}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="transcriptionEng" className="mb-2 block font-semibold">
                Transcription (English)
              </Label>
              <Textarea
                id="transcriptionEng"
                name="transcriptionEng"
                rows={2}
                value={inputs.transcriptionEng}
                onChange={handleChange}
                placeholder="Hasbiyallaahu laa ilaaha illaa Huwa..."
              />
            </div>

            <div>
              <Label htmlFor="transcriptionHindi" className="mb-2 block font-semibold">
                Transcription (Hindi)
              </Label>
              <Textarea
                id="transcriptionHindi"
                name="transcriptionHindi"
                rows={2}
                value={inputs.transcriptionHindi}
                onChange={handleChange}
                placeholder="हसबियल्लाहु ला इलाहा इल्ला हुवा..."
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              { name: "translationEng", label: "Translation (English)" },
              { name: "translationUrdu", label: "Translation (Urdu)" },
              { name: "translationHindi", label: "Translation (Hindi)" },
              { name: "translationRoman", label: "Translation (Roman Urdu)" },
            ].map(({ name, label }) => (
              <div key={name}>
                <Label htmlFor={name} className="mb-2 block font-semibold">
                  {label}
                </Label>
                <Textarea
                  id={name}
                  name={name}
                  rows={2}
                  value={inputs[name]}
                  onChange={handleChange}
                  placeholder={`Enter ${label.toLowerCase()}...`}
                />
              </div>
            ))}
          </div>

          <div>
            <Label htmlFor="audio" className="mb-2 block font-semibold">
              Upload Audio
            </Label>
            <Input
              id="audio"
              type="file"
              accept="audio/*"
              onChange={handleAudio}
              className="file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
            />
          </div>


        </CardContent>
      </Card>
      <div className="flex justify-end">
        <Button type="submit" disabled={loading} className="h-10 px-6">
          {loading ? (initialValues ? "Updating..." : "Submitting...") : initialValues ? "Update Dua" : "Submit Dua"}
        </Button>
      </div>
    </form>
  );
}

export default function AdminDuaManagement() {
  const [duas, setDuas] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editDialog, setEditDialog] = useState({ open: false, dua: null });

  const handleFormSubmit = async (formData) => {
    const date = new Date();
    const newDua = {
      id: Date.now(),
      ...formData,
      createdAt: date.toISOString(),
      week: getWeekNumber(date),
      visible: true,
    };
    setDuas([newDua, ...duas]);
    setOpenDialog(false);
  };

  const handleToggleVisibility = (id) => {
    setDuas((prev) =>
      prev.map((dua) => (dua.id === id ? { ...dua, visible: !dua.visible } : dua))
    );
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this Dua?")) {
      setDuas((prev) => prev.filter((dua) => dua.id !== id));
    }
  };

  const handleEditOpen = (dua) => {
    setEditDialog({ open: true, dua });
  };

  const handleEditSubmit = async (values) => {
    setDuas((prev) =>
      prev.map((dua) => (dua.id === editDialog.dua.id ? { ...dua, ...values } : dua))
    );
    setEditDialog({ open: false, dua: null });
  };

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-8">
      {/* Header and Add Dua button */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dua Management</h1>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary hover:opacity-90">
              <Plus className="h-4 w-4 mr-2" />
              Add Dua
            </Button>
          </DialogTrigger>
          <DialogContent
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-4xl -translate-x-1/2 -translate-y-1/2
            rounded-lg bg-white p-8 shadow-lg overflow-y-auto max-h-[90vh]"
          >
            <DialogHeader>
              <DialogTitle>Add New Dua</DialogTitle>
              <DialogDescription>Fill out the fields below to add a new weekly dua.</DialogDescription>
            </DialogHeader>
            <AdminDuaForm onSubmit={handleFormSubmit} onSuccess={() => setOpenDialog(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Dua dialog */}
      <Dialog open={editDialog.open} onOpenChange={(open) => setEditDialog({ dua: null, open })}>
        <DialogContent
          className="fixed left-1/2 top-1/2 z-50 w-full max-w-4xl -translate-x-1/2 -translate-y-1/2
          rounded-lg bg-white p-8 shadow-lg overflow-y-auto max-h-[90vh]"
        >
          <DialogHeader>
            <DialogTitle>Edit Dua</DialogTitle>
          </DialogHeader>
          <AdminDuaForm
            onSubmit={handleEditSubmit}
            onSuccess={() => setEditDialog({ dua: null, open: false })}
            initialValues={editDialog.dua}
          />
        </DialogContent>
      </Dialog>

      {/* Dua list */}
      <div className="grid gap-6">
        {duas.length === 0 ? (
          <p className="text-gray-500 italic">No Duas yet. Click "Add Dua" to start.</p>
        ) : (
          duas.map((dua) => (
            <Card key={dua.id} className={dua.visible ? "" : "opacity-40 bg-gray-100"}>
              <CardHeader className="relative">
                {/* Buttons container */}
                <div className="absolute top-6 right-6 flex space-x-1.5">
                  <Button
                    size="sm"
                    variant="outline"
                    title={dua.visible ? "Hide (Soft Delete)" : "Show"}
                    onClick={() => handleToggleVisibility(dua.id)}
                  >
                    {dua.visible ? (
                      <ToggleRight className="h-5 w-5 text-green-600" />
                    ) : (
                      <ToggleLeft className="h-5 w-5 text-gray-400" />
                    )}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleEditOpen(dua)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(dua.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                {/* Title and Description */}
                <CardTitle>
                  Week {dua.week}: {dua.title}
                </CardTitle>
                <CardDescription>{new Date(dua.createdAt).toLocaleDateString()}</CardDescription>
              </CardHeader>


              <CardContent>
                <p dir="rtl" className="text-xl font-arabic text-gray-800 leading-relaxed mb-2">
                  {dua.arabic}
                </p>
                {dua.transcriptionEng && (
                  <p className="text-sm text-gray-600 italic mb-1">{dua.transcriptionEng}</p>
                )}
                {dua.translationEng && (
                  <p className="text-sm text-gray-800 mb-1">{dua.translationEng}</p>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
