import Link from "next/link";
import { GraduationCap, Twitter, Linkedin, Instagram, Youtube, Mail, MapPin, Phone } from "lucide-react";

const footerLinks = {
  "Explore": [
    { label: "Browse Colleges", href: "/colleges" },
    { label: "Compare Colleges", href: "/compare" },
    { label: "College Match Quiz", href: "/quiz" },
    { label: "Meet Insiders", href: "/meetings" },
  ],
  "Streams": [
    { label: "Engineering", href: "/colleges?stream=Engineering" },
    { label: "Medical", href: "/colleges?stream=Medical" },
    { label: "Management", href: "/colleges?stream=Management" },
    { label: "Arts & Humanities", href: "/colleges?stream=Arts" },
  ],
  "For Insiders": [
    { label: "Become an Insider", href: "/register?role=insider" },
    { label: "Insider Dashboard", href: "/dashboard/insider" },
    { label: "Write a Review", href: "/reviews/new" },
    { label: "Set Availability", href: "/dashboard/insider/availability" },
  ],
  "Company": [
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};

const socialLinks = [
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Youtube, href: "#", label: "YouTube" },
];

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-primary to-blue-500 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="font-heading font-bold text-xl text-white">
                Campus<span className="text-amber-400">Compass</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-xs">
              Helping students make informed college decisions through peer insights, 
              expert guidance, and comprehensive data.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-primary flex items-center justify-center transition-colors duration-200"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
            <div className="mt-6 space-y-2 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 flex-shrink-0" />
                hello@campuscompass.in
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0" />
                Bengaluru, Karnataka, India
              </div>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-heading font-semibold text-white text-sm mb-4">
                {category}
              </h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 hover:text-white transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} CampusCompass. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm">
            <span className="text-slate-500">
              🇮🇳 Made in India for Indian Students
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
