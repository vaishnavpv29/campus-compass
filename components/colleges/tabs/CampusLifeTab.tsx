import { Wifi, Dumbbell, BookOpen, Home, UtensilsCrossed, Stethoscope, Trophy, Music, Code, CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const FACILITY_CONFIG = [
  { key: "hostelBoys", label: "Boys Hostel", icon: Home },
  { key: "hostelGirls", label: "Girls Hostel", icon: Home },
  { key: "mess", label: "Mess/Cafeteria", icon: UtensilsCrossed },
  { key: "gym", label: "Gym & Fitness", icon: Dumbbell },
  { key: "library", label: "Library", icon: BookOpen },
  { key: "sportsComplex", label: "Sports Complex", icon: Trophy },
  { key: "medicalCenter", label: "Medical Center", icon: Stethoscope },
  { key: "wifi", label: "Wi-Fi Campus", icon: Wifi },
];

export default function CampusLifeTab({ college }: { college: any }) {
  return (
    <div className="space-y-6">
      {/* Facilities Grid */}
      <div className="card p-6">
        <h2 className="font-heading font-bold text-lg mb-4">Campus Facilities</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {FACILITY_CONFIG.map(({ key, label, icon: Icon }) => {
            const available = college.facilities?.[key];
            return (
              <div
                key={key}
                className={cn(
                  "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all",
                  available
                    ? "border-green-200 bg-green-50 dark:border-green-800/40 dark:bg-green-950/20"
                    : "border-border bg-muted/30 dark:bg-slate-800/30 opacity-60"
                )}
              >
                <Icon className={cn("w-6 h-6", available ? "text-green-600 dark:text-green-400" : "text-muted-foreground")} />
                <span className="text-xs font-medium text-center">{label}</span>
                {available ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <XCircle className="w-4 h-4 text-muted-foreground/50" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Clubs & Societies */}
      {college.clubs && college.clubs.length > 0 && (
        <div className="card p-6">
          <h2 className="font-heading font-bold text-lg mb-4">Clubs & Societies</h2>
          <div className="flex flex-wrap gap-2">
            {college.clubs.map((club: string, i: number) => (
              <span key={i} className="badge badge-primary px-3 py-1 text-xs">{club}</span>
            ))}
          </div>
        </div>
      )}

      {/* Fests */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {college.culturalFests && college.culturalFests.length > 0 && (
          <div className="card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Music className="w-5 h-5 text-purple-500" />
              <h2 className="font-heading font-bold text-base">Cultural Fests</h2>
            </div>
            <div className="space-y-2">
              {college.culturalFests.map((fest: string, i: number) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 rounded-full bg-purple-400 flex-shrink-0" />
                  {fest}
                </div>
              ))}
            </div>
          </div>
        )}
        {college.techFests && college.techFests.length > 0 && (
          <div className="card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Code className="w-5 h-5 text-blue-500" />
              <h2 className="font-heading font-bold text-base">Tech Fests</h2>
            </div>
            <div className="space-y-2">
              {college.techFests.map((fest: string, i: number) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" />
                  {fest}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Gallery */}
      {college.gallery && college.gallery.length > 0 && (
        <div className="card p-6">
          <h2 className="font-heading font-bold text-lg mb-4">Campus Gallery</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {college.gallery.map((img: string, i: number) => (
              <div key={i} className="aspect-video rounded-xl overflow-hidden bg-muted">
                <img src={img} alt={`Campus ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
