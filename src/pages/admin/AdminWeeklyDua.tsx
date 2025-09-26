import React, { useState, useEffect } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Trash2, ToggleRight, ToggleLeft, Edit2 } from "lucide-react";

const XIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogClose = DialogPrimitive.Close;
const DialogOverlay = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={`fixed inset-0 z-50 bg-black/60 ${className}`}
    {...props}
  />
));
DialogOverlay.displayName = "DialogOverlay";

const DialogContent = React.forwardRef(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={`fixed left-1/2 top-1/2 z-50 w-full max-w-3xl -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg overflow-y-auto max-h-[90vh] ${className}`}
      {...props}
    >
      {children}
      <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100">
        <XIcon className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogClose>
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = "DialogContent";

// Utility: Week number
function getWeekNumber(date) {
  const firstDay = new Date(date.getFullYear(), 0, 1);
  const pastDays = Math.floor(
    (date.getTime() - firstDay.getTime()) / (24 * 60 * 60 * 1000)
  );
  return Math.ceil((pastDays + firstDay.getDay() + 1) / 7);
}

// --- AdminDuaForm component ---
function AdminDuaForm({ onSubmit, onSuccess, initialValues = null }) {
  const [timestamp, setTimestamp] = useState(new Date());
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
      // week
    }
  );
  const [audio, setAudio] = useState(initialValues?.audio || null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) =>
    setInputs({ ...inputs, [e.target.name]: e.target.value });

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
    } catch (err) {
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

  const formattedDate = timestamp.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {initialValues ? "Edit Dua" : "Add New Dua"}
          </h1>
          <p className="text-gray-500">
            {initialValues
              ? "Update the fields below"
              : "Fill out the fields below"}
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">{formattedDate}</div>
          <div className="text-xs font-semibold text-green-700">
            Week {weekNum}
          </div>
        </div>
      </div>
      {successMsg && (
        <div className="p-3 bg-green-100 border border-green-300 text-green-800 rounded">
          {successMsg}
        </div>
      )}
      {errorMsg && (
        <div className="p-3 bg-red-100 border border-red-300 text-red-800 rounded">
          {errorMsg}
        </div>
      )}
      <div>
        <label className="block text-gray-800 font-medium mb-2">Title</label>
        <input
          name="title"
          placeholder="e.g. To say in Trouble & Distress"
          value={inputs.title}
          onChange={handleChange}
          required
          className="w-full border rounded-lg px-4 py-2 text-lg placeholder:text-gray-500 focus:ring-2 focus:ring-green-200 focus:border-green-500 outline-none"
        />
      </div>
      <div>
        <label className="block text-gray-800 font-medium mb-2">
          Arabic Text
        </label>
        <textarea
          name="arabic"
          placeholder="Enter Arabic text here..."
          rows={3}
          value={inputs.arabic}
          onChange={handleChange}
          required
          dir="rtl"
          style={{ fontFamily: "'Amiri', serif", fontSize: "1.4rem" }}
          className="w-full border rounded-lg px-4 py-3 text-xl placeholder:text-gray-500 focus:ring-2 focus:ring-green-200 focus:border-green-500 outline-none"
        />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium text-gray-800 mb-2">
            Transcription (English)
          </label>
          <textarea
            name="transcriptionEng"
            rows={2}
            value={inputs.transcriptionEng}
            onChange={handleChange}
            placeholder="Hasbiyallaahu laa ilaaha illaa Huwa..."
            className="w-full border rounded-lg px-4 py-2 placeholder:text-gray-500 focus:ring-2 focus:ring-green-200 focus:border-green-500 outline-none"
          />
        </div>
        <div>
          <label className="block font-medium text-gray-800 mb-2">
            Transcription (Hindi)
          </label>
          <textarea
            name="transcriptionHindi"
            rows={2}
            value={inputs.transcriptionHindi}
            onChange={handleChange}
            placeholder="हसबियल्लाहु ला इलाहा इल्ला हुवा..."
            className="w-full border rounded-lg px-4 py-2 placeholder:text-gray-500 focus:ring-2 focus:ring-green-200 focus:border-green-500 outline-none"
          />
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {[
          { name: "translationEng", label: "Translation (English)" },
          { name: "translationUrdu", label: "Translation (Urdu)" },
          { name: "translationHindi", label: "Translation (Hindi)" },
          { name: "translationRoman", label: "Translation (Roman Urdu)" },
        ].map(({ name, label }) => (
          <div key={name}>
            <label className="block font-medium text-gray-800 mb-2">
              {label}
            </label>
            <textarea
              name={name}
              rows={2}
              value={inputs[name]}
              onChange={handleChange}
              placeholder={`Enter ${label.toLowerCase()}...`}
              className="w-full border rounded-lg px-4 py-2 placeholder:text-gray-500 focus:ring-2 focus:ring-green-200 focus:border-green-500 outline-none"
            />
          </div>
        ))}
      </div>
      <div>
        <label className="block font-medium text-gray-800 mb-2">
          Upload Audio
        </label>
        <input
          type="file"
          accept="audio/*"
          onChange={handleAudio}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
        />
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="bg-gray-900 hover:bg-gray-700 text-white px-4 py-2 rounded-md h-10"
        >
          {loading ? "Submitting..." : initialValues ? "Update Dua" : "Submit Dua"}
        </button>
      </div>
    </form>
  );
}

// --- Main Management Page ---
export default function AdminDuaManagement() {
  const [duas, setDuas] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editDialog, setEditDialog] = useState({ open: false, dua: null });

  // Add New Dua
  const handleFormSubmit = async (formData) => {
    const date = new Date();
    const newDua = {
      id: Date.now(), // unique id (for demo)
      ...formData,
      createdAt: date.toISOString(),
      week: getWeekNumber(date),
      visible: true,
    };
    setDuas([newDua, ...duas]);
    setOpenDialog(false);
  };

  // Toggle Visibility (Soft Delete)
  const handleToggleVisibility = (id) => {
    setDuas((prev) =>
      prev.map((dua) =>
        dua.id === id ? { ...dua, visible: !dua.visible } : dua
      )
    );
  };

  // Delete Dua (Hard Delete)
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this Dua?")) {
      setDuas((prev) => prev.filter((dua) => dua.id !== id));
    }
  };

  // Edit Dua (Open Dialog)
  const handleEditOpen = (dua) => {
    setEditDialog({ open: true, dua });
  };
  // Edit Dua (Update)
  const handleEditSubmit = async (values) => {
    setDuas((prev) =>
      prev.map((dua) =>
        dua.id === editDialog.dua.id
          ? { ...dua, ...values }
          : dua
      )
    );
    setEditDialog({ open: false, dua: null });
  };

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-8">
      {/* Header + Add button */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Dua Management</h1>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md shadow-lg">
              + Add New Dua
            </button>
          </DialogTrigger>
          <DialogContent>
            <AdminDuaForm
              onSubmit={handleFormSubmit}
              onSuccess={() => setOpenDialog(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Dua Dialog */}
      <Dialog open={editDialog.open} onOpenChange={(v) => setEditDialog({ dua: null, open: v })}>
        <DialogContent>
          <AdminDuaForm
            onSubmit={handleEditSubmit}
            onSuccess={() => setEditDialog({ dua: null, open: false })}
            initialValues={editDialog.dua}
          />
        </DialogContent>
      </Dialog>

      {/* Dua List */}
      {duas.length === 0 ? (
        <p className="text-gray-500 italic">
          No Duas yet. Click "Add New Dua" to start.
        </p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {duas.map((dua) => (
            <div
              key={dua.id}
              className={`border rounded-lg p-4 shadow hover:shadow-lg transition ${
                dua.visible ? "" : "opacity-40 bg-gray-100"
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h2 className="font-semibold text-lg">
                  Week {dua.week}: {dua.title}
                </h2>
                <span className="text-sm text-gray-500">
                  {new Date(dua.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p
                dir="rtl"
                className="text-xl font-arabic text-gray-800 leading-relaxed mb-2"
              >
                {dua.arabic}
              </p>
              {dua.transcriptionEng && (
                <p className="text-sm text-gray-600 italic">
                  {dua.transcriptionEng}
                </p>
              )}
              {dua.translationEng && (
                <p className="text-sm text-gray-800">{dua.translationEng}</p>
              )}
              {/* Button Controls */}
              <div className="flex space-x-2 mt-3">
                {/* Toggle visibility */}
                <button
                  className="p-2 rounded border"
                  title={dua.visible ? "Hide (Soft Delete)" : "Show"}
                  onClick={() => handleToggleVisibility(dua.id)}
                >
                  {dua.visible ? (
                    <ToggleRight className="h-5 w-5 text-green-600" />
                  ) : (
                    <ToggleLeft className="h-5 w-5 text-gray-400" />
                  )}
                </button>
                {/* Edit */}
                <button
                  className="p-2 rounded border"
                  onClick={() => handleEditOpen(dua)}
                >
                  <Edit2 className="h-5 w-5" />
                </button>
                {/* Delete */}
                <button
                  className="p-2 rounded border"
                  onClick={() => handleDelete(dua.id)}
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
