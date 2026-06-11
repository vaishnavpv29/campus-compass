"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Star, MapPin, CheckCircle, Calendar, Clock, MessageSquare,
  Loader2, ArrowLeft, Users, ChevronRight
} from "lucide-react";
import { cn, formatDate, getInitials } from "@/lib/utils";

const bookingSchema = z.object({
  date: z.string().min(1, "Please select a date"),
  timeSlot: z.string().min(1, "Please select a time slot"),
  duration: z.enum(["15", "30", "60"]),
  type: z.enum(["1on1", "group"]),
  message: z.string().min(20, "Please write at least 20 characters about your questions").max(500),
});

type BookingForm = z.infer<typeof bookingSchema>;

const TIME_SLOTS = ["09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM"];

export default function InsiderProfilePage() {
  const { insiderId } = useParams<{ insiderId: string }>();
  const router = useRouter();
  const { data: session } = useSession();
  const [insider, setInsider] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<BookingForm>({
    resolver: zodResolver(bookingSchema),
    defaultValues: { duration: "30", type: "1on1" },
  });

  useEffect(() => {
    const fetchInsider = async () => {
      try {
        // Get insider by ID from insiders API
        const res = await fetch(`/api/users/insiders?limit=100`);
        const data = await res.json();
        const found = data.insiders?.find((i: any) => i._id === insiderId);
        if (!found) { router.push("/meetings"); return; }
        setInsider(found);
      } catch {
        toast.error("Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    };
    fetchInsider();
  }, [insiderId, router]);

  const onSubmit = async (data: BookingForm) => {
    if (!session) { toast.error("Please sign in to book a session"); router.push("/login"); return; }
    if (session.user.role !== "student") { toast.error("Only students can book sessions"); return; }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/meetings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          insiderId,
          collegeId: insider.college?._id,
          date: new Date(data.date).toISOString(),
          timeSlot: data.timeSlot,
          duration: parseInt(data.duration),
          type: data.type,
          message: data.message,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        toast.error(err.message);
        return;
      }

      setBookingSuccess(true);
    } catch {
      toast.error("Failed to book session");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }
  if (!insider) return null;

  if (bookingSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center px-4">
        <div className="card p-10 text-center max-w-md">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-3xl flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="font-heading text-2xl font-bold mb-2">Booking Sent! 🎉</h2>
          <p className="text-muted-foreground mb-6">
            Your session request has been sent to <strong>{insider.name}</strong>. 
            They'll confirm or suggest a new time shortly.
          </p>
          <div className="flex gap-3">
            <button onClick={() => router.push("/meetings")} className="btn-outline flex-1">Browse More</button>
            <button onClick={() => router.push("/dashboard/student")} className="btn-primary flex-1">My Dashboard</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back */}
        <button onClick={() => router.back()} className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground mb-6 transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Insiders
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Insider Profile */}
          <div className="lg:col-span-2 space-y-4">
            <div className="card p-6">
              {/* Avatar */}
              <div className="text-center mb-4">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-blue-400 flex items-center justify-center text-white font-bold text-2xl mx-auto mb-3 overflow-hidden">
                  {insider.image ? (
                    <img src={insider.image} alt={insider.name} className="w-20 h-20 object-cover" />
                  ) : getInitials(insider.name)}
                </div>
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <h1 className="font-heading font-bold text-lg text-foreground">{insider.name}</h1>
                  {insider.isVerified && <CheckCircle className="w-4 h-4 text-blue-500" />}
                </div>
                {insider.college && (
                  <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {insider.college.name}
                  </p>
                )}
                {insider.course && (
                  <p className="text-sm text-primary font-medium mt-0.5">{insider.course}</p>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="text-center p-3 bg-muted/50 dark:bg-slate-800/50 rounded-xl">
                  <div className="flex items-center justify-center gap-1 font-bold text-lg">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    {insider.rating > 0 ? insider.rating.toFixed(1) : "New"}
                  </div>
                  <div className="text-xs text-muted-foreground">Rating</div>
                </div>
                <div className="text-center p-3 bg-muted/50 dark:bg-slate-800/50 rounded-xl">
                  <div className="font-bold text-lg">{insider.sessionCount}</div>
                  <div className="text-xs text-muted-foreground">Sessions</div>
                </div>
              </div>

              {/* Bio */}
              {insider.bio && (
                <p className="text-sm text-muted-foreground leading-relaxed">{insider.bio}</p>
              )}

              {/* Expertise */}
              {insider.expertise && insider.expertise.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs font-semibold text-foreground mb-2">Expertise</p>
                  <div className="flex flex-wrap gap-1.5">
                    {insider.expertise.map((tag: string, i: number) => (
                      <span key={i} className="badge-primary text-xs px-2.5 py-1">{tag}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-3">
            <div className="card p-6">
              <h2 className="font-heading font-bold text-xl mb-5 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Book a Session
              </h2>

              {!session ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">Sign in to book a session with {insider.name}</p>
                  <button onClick={() => router.push("/login")} className="btn-primary">Sign In</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  {/* Session Type */}
                  <div>
                    <label className="text-sm font-semibold mb-2 block">Session Type</label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { value: "1on1", label: "1-on-1 Chat", icon: MessageSquare },
                        { value: "group", label: "Group Q&A", icon: Users },
                      ].map((t) => (
                        <label key={t.value} className={cn(
                          "flex items-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all",
                          watch("type") === t.value ? "border-primary bg-primary/10" : "border-border hover:border-primary/40"
                        )}>
                          <input type="radio" value={t.value} {...register("type")} className="hidden" />
                          <t.icon className="w-4 h-4 text-primary" />
                          <span className="text-sm font-medium">{t.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Duration */}
                  <div>
                    <label className="text-sm font-semibold mb-2 block flex items-center gap-1">
                      <Clock className="w-4 h-4 text-primary" /> Duration
                    </label>
                    <div className="flex gap-2">
                      {[
                        { value: "15", label: "15 min" },
                        { value: "30", label: "30 min" },
                        { value: "60", label: "60 min" },
                      ].map((d) => (
                        <button
                          key={d.value}
                          type="button"
                          onClick={() => setValue("duration", d.value as "15" | "30" | "60")}
                          className={cn(
                            "flex-1 py-2 rounded-xl text-sm font-medium border-2 transition-all",
                            watch("duration") === d.value
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border hover:border-primary/40"
                          )}
                        >
                          {d.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Date */}
                  <div>
                    <label className="text-sm font-semibold mb-2 block">Preferred Date</label>
                    <input
                      type="date"
                      {...register("date")}
                      min={new Date().toISOString().split("T")[0]}
                      id="booking-date"
                      className={cn("input-field", errors.date && "border-red-500")}
                    />
                    {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>}
                  </div>

                  {/* Time Slot */}
                  <div>
                    <label className="text-sm font-semibold mb-2 block">Preferred Time</label>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                      {TIME_SLOTS.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setValue("timeSlot", slot)}
                          className={cn(
                            "py-2 rounded-lg text-xs font-medium border-2 transition-all",
                            watch("timeSlot") === slot
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border hover:border-primary/40"
                          )}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                    {errors.timeSlot && <p className="text-red-500 text-xs mt-1">{errors.timeSlot.message}</p>}
                  </div>

                  {/* Message */}
                  <div>
                    <label className="text-sm font-semibold mb-2 block">Your Questions / Message</label>
                    <textarea
                      {...register("message")}
                      rows={4}
                      placeholder="Tell the insider what you'd like to discuss — campus life, placements, specific courses, hostel experience..."
                      id="booking-message"
                      className={cn("input-field resize-none text-sm", errors.message && "border-red-500")}
                    />
                    {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    id="book-session-btn"
                    className="btn-primary w-full py-3.5 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>Send Booking Request <ChevronRight className="w-4 h-4" /></>
                    )}
                  </button>
                  <p className="text-center text-xs text-muted-foreground">
                    The insider will confirm your session within 24 hours.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
