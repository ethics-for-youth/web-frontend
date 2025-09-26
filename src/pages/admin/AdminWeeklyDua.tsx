import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, ToggleRight, ToggleLeft, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Utility functions
function getWeekNumber(date) {
  const firstDay = new Date(date.getFullYear(), 0, 1);
  const pastDays = Math.floor((date.getTime() - firstDay.getTime()) / (24 * 60 * 60 * 1000));
  return Math.ceil((pastDays + firstDay.getDay() + 1) / 7);
}

function formatDateForInput(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// Dua Form Component
function AdminDuaForm({ onSubmit, onSuccess, initialValues = null, editingDua, resetForm }) {
  const [timestamp, setTimestamp] = useState(
    initialValues?.createdAt ? new Date(initialValues.createdAt) : new Date()
  );
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
    <form id="dua-form" onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {/* Display Success/Error messages */}
      <div className="col-span-full space-y-2">
        {successMsg && (
          <div className="p-3 bg-green-50 border border-green-300 text-green-700 rounded">{successMsg}</div>
        )}
        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-300 text-red-700 rounded">{errorMsg}</div>
        )}
      </div>

      {/* Week info */}
      <div className="md:col-span-2 flex justify-end items-center space-x-2 text-sm text-gray-500 mt-0">
        <Badge className="bg-[#5E7839] text-white">Week {weekNum}</Badge>
        <span>{formattedDate}</span>
      </div>


      {/* Title Field */}
      <div className="md:col-span-2">
        <Label htmlFor="title" className="font-semibold">
          Title
        </Label>
        <Input
          id="title"
          name="title"
          value={inputs.title}
          onChange={handleChange}
          placeholder="e.g. To say in Trouble & Distress"
          required
          className="shadow-none bg-transparent focus:ring-0 focus:outline-none mt-1"
        />
      </div>

      {/* Arabic Text */}
      <div className="md:col-span-2">
        <Label htmlFor="arabic" className="font-semibold">
          Arabic Text
        </Label>
        <Textarea
          id="arabic"
          name="arabic"
          value={inputs.arabic}
          onChange={handleChange}
          placeholder="Enter Arabic text here..."
          rows={3}
          required
          dir="rtl"
          style={{ fontFamily: "'Amiri', serif", fontSize: "1.3rem" }}
          className="shadow-none bg-transparent focus:ring-0 focus:outline-none mt-1"
        />
      </div>

      {/* Transcriptions */}
      <div>
        <Label htmlFor="transcriptionEng" className="font-semibold">
          Transcription (English)
        </Label>
        <Textarea
          id="transcriptionEng"
          name="transcriptionEng"
          rows={2}
          value={inputs.transcriptionEng}
          onChange={handleChange}
          placeholder="Hasbiyallaahu laa ilaaha illaa Huwa..."
          className="shadow-none bg-transparent focus:ring-0 focus:outline-none mt-1"
        />
      </div>
      <div>
        <Label htmlFor="transcriptionHindi" className="font-semibold">
          Transcription (Hindi)
        </Label>
        <Textarea
          id="transcriptionHindi"
          name="transcriptionHindi"
          rows={2}
          value={inputs.transcriptionHindi}
          onChange={handleChange}
          placeholder="हसबियल्लाहु ला इलाहा इल्ला हुवा..."
          className="shadow-none bg-transparent focus:ring-0 focus:outline-none mt-1"
        />
      </div>

      {/* Translations */}
      {[
        { name: "translationEng", label: "Translation (English)" },
        { name: "translationUrdu", label: "Translation (Urdu)" },
        { name: "translationHindi", label: "Translation (Hindi)" },
        { name: "translationRoman", label: "Translation (Roman Urdu)" },
      ].map(({ name, label }) => (
        <div key={name}>
          <Label htmlFor={name} className="font-semibold">
            {label}
          </Label>
          <Textarea
            id={name}
            name={name}
            rows={2}
            value={inputs[name]}
            onChange={handleChange}
            placeholder={`Enter ${label.toLowerCase()}...`}
            className="shadow-none bg-transparent focus:ring-0 focus:outline-none mt-1"
          />
        </div>
      ))}

      {/* Audio Upload */}
      <div className="md:col-span-2">
        <Label htmlFor="audio" className="font-semibold">
          Upload Audio
        </Label>
        <Input
          id="audio"
          type="file"
          accept="audio/*"
          onChange={handleAudio}
          className="shadow-none bg-transparent file:bg-white file:text-green-700 focus:ring-0 focus:outline-none mt-1"
        />
      </div>

    </form>
  );
}

// Main Admin Dua Management component rendering the dialog and the dua list
export default function AdminDuaManagement() {
  const [duas, setDuas] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editDialog, setEditDialog] = useState({ open: false, dua: null });
  const [loading, setLoading] = useState(false);

  // Reset form logic for dialogs
  const resetForm = () => {
    setEditDialog({ open: false, dua: null });
    setOpenDialog(false);
  };

  // Handle form submissions (new and edits)
  const handleFormSubmit = async (formData) => {
    setLoading(true);
    try {
      const date = new Date();
      if (editDialog.open && editDialog.dua) {
        // Edit existing dua
        setDuas((prev) =>
          prev.map((dua) =>
            dua.id === editDialog.dua.id ? { ...dua, ...formData } : dua
          )
        );
        setEditDialog({ open: false, dua: null });
      } else {
        // Add new dua
        const newDua = {
          id: Date.now(),
          ...formData,
          createdAt: date.toISOString(),
          week: getWeekNumber(date),
          visible: true,
        };
        setDuas((prev) => [newDua, ...prev]);
        setOpenDialog(false);
      }
    } catch {
      // Handle error as needed
    } finally {
      setLoading(false);
    }
  };

  // Toggle visibility (soft delete)
  const handleToggleVisibility = (id) => {
    setDuas((prev) =>
      prev.map((dua) => (dua.id === id ? { ...dua, visible: !dua.visible } : dua))
    );
  };

  // Delete dua after confirmation
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this Dua?")) {
      setDuas((prev) => prev.filter((dua) => dua.id !== id));
    }
  };

  // Open edit dialog with selected dua
  const handleEditOpen = (dua) => {
    setEditDialog({ open: true, dua });
  };

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-8">
      {/* Header and Add Dua button */}
      <div className="flex justify-between items-center mb-8">
        <div> <h1 className="text-3xl font-bold text-foreground">Dua Management</h1>
          <p className="text-muted-foreground">Manage all duas</p>
        </div>

        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary hover:opacity-90">
              <Plus className="h-4 w-4 mr-2" />
              Add Dua
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl h-[90vh] flex flex-col p-0 bg-white shadow-xl rounded-lg">
            {/* Sticky header */}
            <div className="sticky top-0 z-10 bg-white px-6 pt-6 pb-2 flex items-center justify-between">
              <div>
                <DialogTitle className="text-xl font-semibold">Add New Dua</DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                  Fill out the fields below to add a new weekly dua.
                </DialogDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="ml-auto rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 h-8 w-8 active:bg-transparent hover:bg-transparent"
                onClick={() => setOpenDialog(false)}
                tabIndex={0}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </div>
            {/* Scrollable form container */}
            <div className="flex-1 overflow-y-auto px-6 pb-4">
              <AdminDuaForm
                onSubmit={handleFormSubmit}
                onSuccess={() => setOpenDialog(false)}
                editingDua={false}
                resetForm={() => setOpenDialog(false)}
              />
            </div>
            {/* Sticky footer */}
            <div className="bottom-0 z-10 bg-white px-6 py-4 flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpenDialog(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                form="dua-form"
                type="submit"
                className="bg-gradient-primary hover:opacity-90"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit Dua"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Dua dialog */}
      <Dialog open={editDialog.open} onOpenChange={(open) => setEditDialog({ dua: null, open })}>
        <DialogContent className="max-w-2xl h-[90vh] flex flex-col p-0 bg-white shadow-xl rounded-lg">
          {/* Sticky header */}
          <div className="top-0 z-10 bg-white px-6 pt-6 pb-2 border-b flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-semibold">Edit Dua</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                Update the dua details below.
              </DialogDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 h-8 w-8 active:bg-transparent hover:bg-transparent"
              onClick={() => setEditDialog({ dua: null, open: false })}
              tabIndex={0}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
          {/* Scrollable form container */}
          <div className="flex-1 overflow-y-auto px-6 pb-4">
            <AdminDuaForm
              onSubmit={handleFormSubmit}
              onSuccess={() => setEditDialog({ dua: null, open: false })}
              initialValues={editDialog.dua}
              editingDua={true}
              resetForm={() => setEditDialog({ dua: null, open: false })}
            />
          </div>
          {/* Sticky footer */}
          <div className="bottom-0 z-10 bg-white px-6 py-4 border-t flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setEditDialog({ dua: null, open: false })}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              form="dua-form"
              type="submit"
              className="bg-gradient-primary hover:opacity-90"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Dua"}
            </Button>
          </div>
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
