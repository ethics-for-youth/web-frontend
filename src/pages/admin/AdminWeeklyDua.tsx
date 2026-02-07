import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, ToggleRight, ToggleLeft, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { duasApi, Dua, CreateDuaRequest, UpdateDuaRequest } from '@/services/duaApi';
import apiClient from '@/lib/apiClient';
import { API_ENDPOINTS } from '@/config/api';

// Utility functions
function getWeekNumber(date: Date): number {
  const firstDay = new Date(date.getFullYear(), 0, 1);
  const pastDays = Math.floor((date.getTime() - firstDay.getTime()) / (24 * 60 * 60 * 1000));
  return Math.ceil((pastDays + firstDay.getDay() + 1) / 7);
}

function formatDateForInput(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

interface FormInputs {
  id: string;
  title: string;
  arabicText: string;
  transcriptionEng: string;
  transcriptionHindi: string;
  translationEng: string;
  translationUrdu: string;
  translationHindi: string;
  translationRoman: string;
}

interface AdminDuaFormProps {
  onSubmit: (data: CreateDuaRequest | UpdateDuaRequest) => Promise<void>;
  onSuccess: () => void;
  initialValues?: Dua | null;
  editingDua: boolean;
}

// Dua Form Component
function AdminDuaForm({ onSubmit, onSuccess, initialValues = null, editingDua }: AdminDuaFormProps) {
  const [timestamp, setTimestamp] = useState(
    initialValues?.createdAt ? new Date(initialValues.createdAt) : new Date()
  );

  const [inputs, setInputs] = useState<FormInputs>({
    id: initialValues?.id ?? "",
    title: initialValues?.title ?? "",
    arabicText: initialValues?.arabicText ?? "",
    transcriptionEng: initialValues?.transcription?.english ?? "",
    transcriptionHindi: initialValues?.transcription?.hindi ?? "",
    translationEng: initialValues?.translation?.english ?? "",
    translationUrdu: initialValues?.translation?.urdu ?? "",
    translationHindi: initialValues?.translation?.hindi ?? "",
    translationRoman: initialValues?.translation?.romanUrdu ?? "",
  });

  const [audio, setAudio] = useState<File | null>(null);
  const [currentAudioUrl, setCurrentAudioUrl] = useState<string | null>(initialValues?.audioUrl || null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setInputs({ ...inputs, [e.target.name]: e.target.value });


  // Update handleAudio (disable in edit)
const handleAudio = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        // Validate file
        if (file.size > 5 * 1024 * 1024) {
            alert("Audio must be ≤5MB");
            e.target.value = "";
            return;
        }
        if (!file.type.startsWith("audio/")) {
          alert("Only audio files are allowed");
          e.target.value = "";
          return;
        }
        setAudio(file);
        setCurrentAudioUrl(null); // Will be replaced
    }
};
  // Update handleSubmit
 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setSuccessMsg("");
  setErrorMsg("");

  try {
    // 1️⃣ Build transcription object (only if has values)
    const transcription = {
      english: inputs.transcriptionEng || undefined,
      hindi: inputs.transcriptionHindi || undefined,
      // urdu: inputs.transcriptionUrdu || undefined, // ✅ ADDED
    };
    const hasTranscription = Object.values(transcription).some(v => v);

    // 2️⃣ Build translation object (only if has values)
    const translation = {
      english: inputs.translationEng || undefined,
      urdu: inputs.translationUrdu || undefined,
      hindi: inputs.translationHindi || undefined,
      romanUrdu: inputs.translationRoman || undefined,
    };
    const hasTranslation = Object.values(translation).some(v => v);

    // 3️⃣ Build payload based on mode (create vs update)
    let duaData: CreateDuaRequest | UpdateDuaRequest;

    if (editingDua && initialValues?.id) {
      // 🔧 UPDATE MODE
      duaData = {
        id: initialValues.id,
        title: inputs.title,
        arabicText: inputs.arabicText,
        week: getWeekNumber(timestamp),
        ...(hasTranscription && { transcription }),
        ...(hasTranslation && { translation }),
        // Audio update: currently disabled, but structure is ready
        // ...(audio && { audioKey: audio }), // Use when backend supports it
      } as UpdateDuaRequest;
    } else {
      // ✨ CREATE MODE
      duaData = {
        title: inputs.title,
        arabicText: inputs.arabicText,
        week: getWeekNumber(timestamp),
        ...(hasTranscription && { transcription }),
        ...(hasTranslation && { translation }),
        ...(audio && { audio }), // ✅ Include audio for create
      } as CreateDuaRequest;
    }

    console.log('📤 Submitting Dua Data:', duaData);
    console.log('📋 Mode:', editingDua ? 'UPDATE' : 'CREATE');

    // 4️⃣ Submit to API
    await onSubmit(duaData);

    // 5️⃣ Success handling
    setSuccessMsg("✅ Dua submitted successfully!");
    
    // Reset form if creating new
    if (!editingDua) {
      setInputs({
        id: "",
        title: "",
        arabicText: "",
        transcriptionEng: "",
        transcriptionHindi: "",
        // transcriptionUrdu: "", // ✅ Reset urdu too
        translationEng: "",
        translationUrdu: "",
        translationHindi: "",
        translationRoman: "",
      });
      setAudio(null);
    }

    // Close dialog/form after short delay
    setTimeout(() => onSuccess(), 1200);

  } catch (error: any) {
    // 6️⃣ Enhanced error handling
    console.error('❌ Full Submit Error:', error);
    
    // Extract meaningful error message
    const errorMessage = 
      error.response?.data?.message || 
      error.message || 
      'An unexpected error occurred. Please check your input and try again.';
    
    // Show specific errors for common issues
    if (error.response?.status === 400) {
      setErrorMsg(`❌ Invalid input: ${errorMessage}`);
    } else if (error.response?.status === 413) {
      setErrorMsg(`❌ File too large. Audio must be under 5MB.`);
    } else {
      setErrorMsg(`❌ Failed to submit dua: ${errorMessage}`);
    }
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    const interval = setInterval(() => setTimestamp(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const weekNum = getWeekNumber(timestamp);
  const formattedDate = formatDateForInput(timestamp.toISOString());

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Display Success/Error messages */}
        <div className="col-span-full space-y-2">
          {successMsg && (
            <div className="p-3 bg-green-50 border border-green-300 text-green-700 rounded">
              {successMsg}
            </div>
          )}
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-300 text-red-700 rounded">
              {errorMsg}
            </div>
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
            Title <span className="text-red-500">*</span>
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
          <Label htmlFor="arabicText" className="font-semibold">
            Arabic Text <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="arabicText"
            name="arabicText"
            value={inputs.arabicText}
            onChange={handleChange}
            placeholder="اكتب النص العربي هنا..."
            rows={3}
            required
            dir="rtl"
            lang="ar"
            style={{
              fontFamily: "'Amiri', 'Traditional Arabic', 'Arabic Typesetting', serif",
              fontSize: "1.5rem",
              lineHeight: "2",
              textAlign: "right",
            }}
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
              value={inputs[name as keyof FormInputs]}
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

          {currentAudioUrl && !audio && (
            <div className="mb-2 text-sm text-gray-600">
              Current audio:{" "}
              <a
                href={currentAudioUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                View
              </a>
            </div>
          )}

          <Input
            id="audio"
            type="file"
            accept="audio/*"
            onChange={handleAudio}
            value=""
            className="shadow-none bg-transparent file:bg-white file:text-green-700 focus:ring-0 focus:outline-none mt-1"
          />

          {audio && (
            <p className="text-sm text-gray-600 mt-1">Selected: {audio.name}</p>
          )}
        </div>

        {/* Buttons */}
        <div className="md:col-span-2 flex justify-end space-x-2 mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onSuccess()}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            className="bg-gradient-to-r from-[#5E7839] to-[#4a5f2e] hover:opacity-90"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {editingDua ? "Updating..." : "Submitting..."}
              </>
            ) : editingDua ? (
              "Update Dua"
            ) : (
              "Submit Dua"
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}


// Main Admin Dua Management component
export default function AdminDuaManagement() {
  const [duas, setDuas] = useState<Dua[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editDialog, setEditDialog] = useState<{ open: boolean; dua: Dua | null }>({ open: false, dua: null });
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load duas on mount
  useEffect(() => {
    loadDuas();
  }, []);

  const loadDuas = async () => {
    try {
      setInitialLoading(true);
      setError(null);
      console.log('🔍 Fetching duas from API...');
      const fetchedDuas = await duasApi.getDuas();
      console.log('✅ Fetched duas:', fetchedDuas);
      // Sort by createdAt descending (newest first)
      const sortedDuas = fetchedDuas.sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setDuas(sortedDuas);
    } catch (err: any) {
      console.error('❌ Error loading duas:', err);
      console.error('Error details:', {
        message: err.message,
        response: err.response,
        request: err.request
      });
      setError(err.message || 'Failed to load duas. Check console for details.');
    } finally {
      setInitialLoading(false);
    }
  };

  // Handle create new dua
  const handleCreateDua = async (formData: CreateDuaRequest) => {
    try {
      const newDua = await duasApi.createDua(formData);
      setDuas((prev) => [newDua, ...prev]);
      setOpenDialog(false);
    } catch (err: any) {
      throw new Error(err.message || 'Failed to create dua');
    }
  };

  // Handle update existing dua
  const handleUpdateDua = async (formData: UpdateDuaRequest) => {
    if (!editDialog.dua) return;

    try {
      const updatedDua = await duasApi.updateDua({ ...formData, id: editDialog.dua.id });
      setDuas((prev) =>
        prev.map((dua) => (dua.id === editDialog.dua!.id ? updatedDua : dua))
      );
      setEditDialog({ open: false, dua: null });
    } catch (err: any) {
      throw new Error(err.message || 'Failed to update dua');
    }
  };

  // Handle form submission (routes to create or update)
  const handleFormSubmit = async (formData: CreateDuaRequest | UpdateDuaRequest) => {
    if (editDialog.open && editDialog.dua) {
      await handleUpdateDua(formData as UpdateDuaRequest);
    } else {
      await handleCreateDua(formData as CreateDuaRequest);
    }
  };

  // Toggle visibility (status change) using PATCH endpoint
const handleToggleVisibility = async (dua: Dua) => {
    try {
        const newStatus = dua.status === 'active' ? 'inactive' : 'active';

        if (newStatus === 'inactive' && 
        !window.confirm('Deactivate this dua? Users won\'t see it anymore.')) {
        return;
    }
        
        // Send ONLY changed fields
        const updateData: UpdateDuaRequest = {
            id: dua.id,
            status: newStatus,
            // Backend should handle partial updates
        };
        
        await duasApi.updateDua(updateData);
        setDuas(prev =>
            prev.map(d => (d.id === dua.id ? { ...d, status: newStatus } : d))
        );
    } catch (err: any) {
        alert(`Failed to toggle status: ${err.message}`);
    }
};

  // Updated handleDelete (better logging)
  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this Dua?")) {
      try {
        await duasApi.deleteDua(id);
        setDuas((prev) => prev.filter((dua) => dua.id !== id));
      } catch (err: any) {
        if (API_ENDPOINTS.enableLogging) {
          console.error('❌ Delete Error Details:', err.response?.data || err.message);
        }
        alert(`Failed to delete dua: ${err.message}`);
      } 
    }
  };

  // Open edit dialog with selected dua
  const handleEditOpen = (dua: Dua) => {
    setEditDialog({ open: true, dua });
  };

  if (initialLoading) {
    return (
      <div className="max-w-6xl mx-auto p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-[#5E7839]" />
          <p className="text-gray-600">Loading duas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-8">
      {/* Header and Add Dua button */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dua Management</h1>
          <p className="text-muted-foreground">Manage all duas</p>
        </div>

        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-[#5E7839] to-[#4a5f2e] hover:opacity-90">
              <Plus className="h-4 w-4 mr-2" />
              Add Dua
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0 bg-white shadow-xl rounded-lg overflow-hidden">
            <div className="sticky top-0 z-10 bg-white px-6 pt-6 pb-2 flex items-center justify-between border-b">
              <div>
                <DialogTitle className="text-xl font-semibold">Add New Dua</DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                  Fill out the fields below to add a new weekly dua.
                </DialogDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none h-4 w-4 active:bg-transparent hover:bg-transparent"
                onClick={() => setOpenDialog(false)}
                tabIndex={0}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <AdminDuaForm
                onSubmit={handleFormSubmit}
                onSuccess={() => setOpenDialog(false)}
                editingDua={false}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Dua dialog */}
      <Dialog open={editDialog.open} onOpenChange={(open) => setEditDialog({ dua: null, open })}>
        <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0 bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="sticky top-0 z-10 bg-white px-6 pt-6 pb-2 border-b flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-semibold">Edit Dua</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                Update the dua details below.
              </DialogDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none h-4 w-4 active:bg-transparent hover:bg-transparent"
              onClick={() => setEditDialog({ dua: null, open: false })}
              tabIndex={0}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {editDialog.dua && (
              <AdminDuaForm
                onSubmit={handleFormSubmit}
                onSuccess={() => setEditDialog({ dua: null, open: false })}
                initialValues={editDialog.dua}
                editingDua={true}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Error display */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-300 text-red-700 rounded flex items-center justify-between">
          <span>{error}</span>
          <Button
            variant="link"
            className="text-red-700 hover:text-red-800"
            onClick={loadDuas}
          >
            Retry
          </Button>
        </div>
      )}

      {/* Dua list */}
      <div className="grid gap-6">
        {duas.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 italic">No Duas yet. Click "Add Dua" to start.</p>
          </div>
        ) : (
          duas.map((dua) => (
            <Card key={dua.id} className={dua.status === 'inactive' ? "opacity-40 bg-gray-100" : ""}>
              <CardHeader className="relative">
                <div className="absolute top-6 right-6 flex space-x-1.5">
                  <Button
                    size="sm"
                    variant="outline"
                    title={dua.status === 'active' ? "Deactivate" : "Activate"}
                    onClick={() => handleToggleVisibility(dua)}
                  >
                    {dua.status === 'active' ? (
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

                <CardTitle>
                  Week {dua.week}: {dua.title}
                </CardTitle>
                <CardDescription>
                  {new Date(dua.createdAt).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                  {dua.status === 'inactive' && <Badge className="ml-2 bg-gray-500">Inactive</Badge>}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-3">
                <p dir="rtl" className="text-xl text-gray-800 leading-relaxed" style={{ fontFamily: "'Amiri', serif" }}>
                  {dua.arabicText}
                </p>
                {dua.transcription?.english && (
                  <p className="text-sm text-gray-600 italic">{dua.transcription.english}</p>
                )}
                {dua.translation?.english && (
                  <p className="text-sm text-gray-800">{dua.translation.english}</p>
                )}
                {dua.audioUrl && (
                  <div className="mt-3">
                    <audio controls className="w-full max-w-md">
                      <source src={dua.audioUrl} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}