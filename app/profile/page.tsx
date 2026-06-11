"use client";

import { useState, useEffect, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  User, Mail, Globe, Linkedin, BookOpen, GraduationCap,
  Calendar, Award, Save, Loader2, Plus, Trash2, ShieldCheck, MapPin
} from "lucide-react";
import { cn } from "@/lib/utils";

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function ProfileContent() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  
  const [profile, setProfile] = useState<any>(null);
  const [colleges, setColleges] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Form states
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [image, setImage] = useState("");
  const [linkedIn, setLinkedIn] = useState("");
  const [website, setWebsite] = useState("");
  const [collegeId, setCollegeId] = useState("");
  const [course, setCourse] = useState("");
  const [yearOfStudy, setYearOfStudy] = useState(1);
  const [graduationYear, setGraduationYear] = useState(2026);
  const [expertiseInput, setExpertiseInput] = useState("");
  const [availabilitySlots, setAvailabilitySlots] = useState<any[]>([]);
  
  // Availability creator states
  const [newDay, setNewDay] = useState("Monday");
  const [newStart, setNewStart] = useState("10:00");
  const [newEnd, setNewEnd] = useState("11:00");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (status === "authenticated") {
      fetchProfileData();
    }
  }, [status]);

  const fetchProfileData = async () => {
    try {
      const [userRes, collegesRes] = await Promise.all([
        fetch("/api/users/me"),
        fetch("/api/colleges?limit=100")
      ]);
      
      const userData = await userRes.json();
      const collegesData = await collegesRes.json();
      
      setProfile(userData);
      setColleges(collegesData.colleges || []);
      
      // Populate form fields
      setName(userData.name || "");
      setBio(userData.bio || "");
      setImage(userData.image || "");
      setLinkedIn(userData.linkedIn || "");
      setWebsite(userData.website || "");
      setCollegeId(userData.college?._id || userData.college || "");
      setCourse(userData.course || "");
      setYearOfStudy(userData.yearOfStudy || 1);
      setGraduationYear(userData.graduationYear || new Date().getFullYear() + 2);
      setExpertiseInput(userData.expertise?.join(", ") || "");
      setAvailabilitySlots(userData.availabilitySlots || []);
    } catch {
      toast.error("Failed to load profile details");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const expertise = expertiseInput
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0);
        
      const res = await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          bio,
          image,
          linkedIn,
          website,
          college: collegeId || undefined,
          course,
          yearOfStudy: Number(yearOfStudy),
          graduationYear: Number(graduationYear),
          expertise,
          availabilitySlots
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to save changes");
      }
      
      const updatedUser = await res.json();
      setProfile(updatedUser);
      
      // Update nextauth session
      await update({ name });
      
      toast.success("Profile saved successfully! 🎉");
    } catch (error: any) {
      toast.error(error.message || "Failed to save profile");
    } finally {
      setIsSaving(false);
    }
  };

  const addSlot = () => {
    const isOverlap = availabilitySlots.some(
      (slot) => slot.day === newDay && slot.startTime === newStart && slot.endTime === newEnd
    );
    
    if (isOverlap) {
      toast.error("This slot is already added");
      return;
    }

    setAvailabilitySlots([
      ...availabilitySlots,
      { day: newDay, startTime: newStart, endTime: newEnd, isBooked: false }
    ]);
    toast.success("Availability slot added");
  };

  const removeSlot = (index: number) => {
    setAvailabilitySlots(availabilitySlots.filter((_, i) => i !== index));
    toast.success("Slot removed");
  };

  if (isLoading || status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const isInsider = profile?.role === "insider";
  const isAdmin = profile?.role === "admin";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Banner Card */}
        <div className="card p-6 mb-6 bg-gradient-to-r from-primary to-blue-700 text-white relative overflow-hidden">
          <div className="absolute inset-0 hero-pattern opacity-25" />
          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-3xl font-bold font-heading">
              {image ? (
                <img src={image} alt="" className="w-full h-full rounded-2xl object-cover" />
              ) : (
                name.charAt(0).toUpperCase()
              )}
            </div>
            <div className="text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                <h1 className="text-2xl font-bold font-heading leading-none">{name}</h1>
                <span className={cn(
                  "badge text-[10px] bg-white/20 text-white uppercase font-bold",
                  isInsider && "bg-amber/90",
                  isAdmin && "bg-green-500/90"
                )}>
                  {profile?.role}
                </span>
                {profile?.isVerified && (
                  <span className="badge-primary bg-white/10 text-white flex items-center gap-0.5 py-0 px-2 text-[10px]">
                    <ShieldCheck className="w-3 h-3 text-blue-300 fill-blue-300" /> Verified
                  </span>
                )}
              </div>
              <p className="text-blue-100 text-sm">{profile?.email}</p>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSave} className="space-y-6">
          {/* General Section */}
          <div className="card p-6 space-y-4">
            <h2 className="font-heading font-bold text-lg text-foreground flex items-center gap-2 border-b border-border pb-3">
              <User className="w-5 h-5 text-primary" />
              Personal Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block" htmlFor="prof-name">
                  Full Name
                </label>
                <input
                  id="prof-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block" htmlFor="prof-image">
                  Avatar Image URL
                </label>
                <input
                  id="prof-image"
                  type="url"
                  placeholder="https://example.com/avatar.jpg"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="input-field text-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block" htmlFor="prof-bio">
                Short Bio
              </label>
              <textarea
                id="prof-bio"
                rows={3}
                placeholder="Tell us a little bit about yourself, interests, or studies..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="input-field text-sm resize-none"
              />
            </div>
          </div>

          {/* Socials Section */}
          <div className="card p-6 space-y-4">
            <h2 className="font-heading font-bold text-lg text-foreground flex items-center gap-2 border-b border-border pb-3">
              <Globe className="w-5 h-5 text-primary" />
              Social & Online Profiles
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block" htmlFor="prof-linkedin">
                  LinkedIn URL
                </label>
                <div className="relative">
                  <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    id="prof-linkedin"
                    type="url"
                    placeholder="https://linkedin.com/in/username"
                    value={linkedIn}
                    onChange={(e) => setLinkedIn(e.target.value)}
                    className="input-field pl-10 text-sm"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block" htmlFor="prof-website">
                  Website / Github URL
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    id="prof-website"
                    type="url"
                    placeholder="https://github.com/username"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="input-field pl-10 text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Role Specific Section */}
          {!isAdmin && (
            <div className="card p-6 space-y-4">
              <h2 className="font-heading font-bold text-lg text-foreground flex items-center gap-2 border-b border-border pb-3">
                <GraduationCap className="w-5 h-5 text-primary" />
                Academic Details ({isInsider ? "College Insider" : "Student"})
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {isInsider && (
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block" htmlFor="prof-college">
                      Affiliated College
                    </label>
                    <select
                      id="prof-college"
                      value={collegeId}
                      onChange={(e) => setCollegeId(e.target.value)}
                      className="input-field text-sm cursor-pointer pr-8"
                    >
                      <option value="">Select your college</option>
                      {colleges.map((c) => (
                        <option key={c._id} value={c._id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block" htmlFor="prof-course">
                    Course / Stream
                  </label>
                  <input
                    id="prof-course"
                    type="text"
                    placeholder="e.g. B.Tech Computer Science"
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    className="input-field text-sm"
                  />
                </div>

                {!isInsider && (
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block" htmlFor="prof-year">
                      Current Year of Study
                    </label>
                    <select
                      id="prof-year"
                      value={yearOfStudy}
                      onChange={(e) => setYearOfStudy(Number(e.target.value))}
                      className="input-field text-sm cursor-pointer pr-8"
                    >
                      {[1, 2, 3, 4, 5, 6].map((yr) => (
                        <option key={yr} value={yr}>Year {yr}</option>
                      ))}
                    </select>
                  </div>
                )}

                {isInsider && (
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block" htmlFor="prof-grad">
                      Expected Graduation Year
                    </label>
                    <input
                      id="prof-grad"
                      type="number"
                      value={graduationYear}
                      onChange={(e) => setGraduationYear(Number(e.target.value))}
                      className="input-field text-sm"
                    />
                  </div>
                )}
              </div>

              {isInsider && (
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block" htmlFor="prof-expertise">
                    Expertise Areas (comma separated)
                  </label>
                  <input
                    id="prof-expertise"
                    type="text"
                    placeholder="JEE Prep, College Life, Placements, Internships"
                    value={expertiseInput}
                    onChange={(e) => setExpertiseInput(e.target.value)}
                    className="input-field text-sm"
                  />
                </div>
              )}
            </div>
          )}

          {/* Availability Slots (Insiders Only) */}
          {isInsider && (
            <div className="card p-6 space-y-4">
              <h2 className="font-heading font-bold text-lg text-foreground flex items-center gap-2 border-b border-border pb-3">
                <Calendar className="w-5 h-5 text-primary" />
                Manage Availability Slots
              </h2>

              <p className="text-xs text-muted-foreground leading-relaxed">
                Add standard weekly time slots when students can book 1-on-1 discovery calls with you.
              </p>

              {/* Slot Creator */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end p-4 rounded-xl bg-muted/40 dark:bg-slate-800/40 border border-border">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block" htmlFor="slot-day">
                    Day
                  </label>
                  <select
                    id="slot-day"
                    value={newDay}
                    onChange={(e) => setNewDay(e.target.value)}
                    className="input-field py-2 text-sm pr-8 cursor-pointer"
                  >
                    {DAYS_OF_WEEK.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block" htmlFor="slot-start">
                    Start Time
                  </label>
                  <input
                    id="slot-start"
                    type="time"
                    value={newStart}
                    onChange={(e) => setNewStart(e.target.value)}
                    className="input-field py-2 text-sm cursor-pointer"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block" htmlFor="slot-end">
                    End Time
                  </label>
                  <input
                    id="slot-end"
                    type="time"
                    value={newEnd}
                    onChange={(e) => setNewEnd(e.target.value)}
                    className="input-field py-2 text-sm cursor-pointer"
                  />
                </div>
                <button
                  type="button"
                  onClick={addSlot}
                  className="btn-outline flex items-center justify-center gap-1.5 py-2 px-4 text-sm font-semibold h-11"
                >
                  <Plus className="w-4 h-4" /> Add Slot
                </button>
              </div>

              {/* Slots List */}
              <div className="space-y-2 max-h-60 overflow-y-auto no-scrollbar pt-2">
                {availabilitySlots.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No availability slots configured yet.</p>
                ) : (
                  availabilitySlots.map((slot, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-muted/20 border border-border">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium text-foreground">{slot.day}</span>
                        <span className="text-xs bg-primary/10 text-primary px-2.5 py-0.5 rounded-full font-semibold">
                          {slot.startTime} - {slot.endTime}
                        </span>
                        {slot.isBooked && (
                          <span className="badge badge-amber text-[9px] py-0 px-2">Booked</span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeSlot(index)}
                        disabled={slot.isBooked}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 p-2 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Action Bar */}
          <div className="flex items-center justify-end">
            <button
              type="submit"
              disabled={isSaving}
              id="prof-save-btn"
              className="btn-primary flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" /> Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    }>
      <ProfileContent />
    </Suspense>
  );
}
