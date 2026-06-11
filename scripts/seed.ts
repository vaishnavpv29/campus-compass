import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { loadEnvConfig } from "@next/env";

// Load environment variables from .env.local
loadEnvConfig(process.cwd());

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/campus-compass";

// Schema Models (import using relative paths for script execution)
import College from "../models/College";
import User from "../models/User";
import Course from "../models/Course";
import Review from "../models/Review";
import Meeting from "../models/Meeting";
import Notification from "../models/Notification";
import QuizResult from "../models/QuizResult";

const COLLEGES_DATA = [
  {
    name: "Indian Institute of Technology Bombay",
    slug: "iit-bombay",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/1/1d/IIT_Bombay_Logo.svg/300px-IIT_Bombay_Logo.svg.png",
    bannerImage: "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800&auto=format&fit=crop"
    ],
    location: {
      city: "Mumbai",
      state: "Maharashtra",
      address: "Main Gate Rd, IIT Area, Powai",
      pincode: "400076",
      coordinates: { lat: 19.1334, lng: 72.9133 }
    },
    type: "Public" as const,
    establishedYear: 1958,
    naacGrade: "A++",
    nirfRanking: 3,
    affiliatedUniversity: "Autonomous",
    totalStudents: 12000,
    officialWebsite: "https://www.iitb.ac.in",
    description: "Indian Institute of Technology Bombay is a premier public technical and research university located in Powai, Mumbai. It is globally recognized for its world-class academic programs, cutting-edge research, and top-tier placement opportunities. The campus is known for its rich student culture, scenic lakeside setting, and prestigious annual festivals like Mood Indigo and Techfest.",
    averagePackage: 2350000,
    highestPackage: 16800000,
    lowestPackage: 800000,
    placementPercentage: 92,
    facilities: {
      hostelBoys: true,
      hostelGirls: true,
      mess: true,
      gym: true,
      library: true,
      sportsComplex: true,
      medicalCenter: true,
      wifi: true
    },
    clubs: ["Robotics Club", "Aeromodelling Club", "Finance Club", "Inter-IIT Sports", "Debating Society"],
    culturalFests: ["Mood Indigo"],
    techFests: ["Techfest"],
    entranceExams: ["JEE Advanced", "UCEED", "GATE", "JAM"],
    applicationDeadline: "2026-06-30",
    cutoffRanks: {
      "Computer Science Engineering": 67,
      "Electrical Engineering": 290,
      "Mechanical Engineering": 650
    },
    admissionLink: "https://www.iitb.ac.in/en/education/admissions",
    topRecruiters: [
      { name: "Google", logo: "" },
      { name: "Microsoft", logo: "" },
      { name: "Apple", logo: "" },
      { name: "Morgan Stanley", logo: "" }
    ],
    notableAlumni: [
      { name: "Nandan Nilekani", designation: "Co-founder", company: "Infosys" },
      { name: "Parag Agrawal", designation: "Former CEO", company: "Twitter" }
    ],
    avgRating: 4.8,
    totalReviews: 1,
    ratingBreakdown: {
      academics: 4.9,
      campusLife: 4.7,
      placements: 4.9,
      facultyQuality: 4.8,
      infrastructure: 4.7,
      valueForMoney: 4.8
    },
    isApproved: true,
    isActive: true,
    viewCount: 1542,
    searchCount: 820
  },
  {
    name: "Indian Institute of Technology Delhi",
    slug: "iit-delhi",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/f/fd/IIT_Delhi_Logo.svg/300px-IIT_Delhi_Logo.svg.png",
    bannerImage: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?q=80&w=1200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1606761568289-44769c64528c?q=80&w=800&auto=format&fit=crop"
    ],
    location: {
      city: "New Delhi",
      state: "Delhi",
      address: "Hauz Khas",
      pincode: "110016",
      coordinates: { lat: 28.5450, lng: 77.1926 }
    },
    type: "Public" as const,
    establishedYear: 1961,
    naacGrade: "A++",
    nirfRanking: 2,
    affiliatedUniversity: "Autonomous",
    totalStudents: 10500,
    officialWebsite: "https://home.iitd.ac.in",
    description: "Indian Institute of Technology Delhi is a public research university located in New Delhi, India. It is one of the oldest and most prestigious IITs, situated in the vibrant neighbourhood of Hauz Khas. IIT Delhi excels in engineering, science, and management, fostering an entrepreneurial mindset that has produced numerous tech unicorns and industrial leaders.",
    averagePackage: 2180000,
    highestPackage: 12000000,
    lowestPackage: 750000,
    placementPercentage: 90,
    facilities: {
      hostelBoys: true,
      hostelGirls: true,
      mess: true,
      gym: true,
      library: true,
      sportsComplex: true,
      medicalCenter: true,
      wifi: true
    },
    clubs: ["DevClub", "Aero Club", "Entrepreneurship Development Cell", "Music Club", "Drama Club"],
    culturalFests: ["Rendezvous"],
    techFests: ["Tryst"],
    entranceExams: ["JEE Advanced", "GATE", "JAM", "CAT"],
    applicationDeadline: "2026-06-25",
    cutoffRanks: {
      "Computer Science Engineering": 115,
      "Mathematics and Computing": 310,
      "Electrical Engineering": 450
    },
    admissionLink: "https://home.iitd.ac.in/admissions.php",
    topRecruiters: [
      { name: "Goldman Sachs", logo: "" },
      { name: "Uber", logo: "" },
      { name: "Amazon", logo: "" },
      { name: "Intel", logo: "" }
    ],
    notableAlumni: [
      { name: "Deepinder Goyal", designation: "Founder & CEO", company: "Zomato" },
      { name: "Sachin Bansal", designation: "Co-founder", company: "Flipkart" }
    ],
    avgRating: 4.7,
    totalReviews: 0,
    ratingBreakdown: {
      academics: 4.8,
      campusLife: 4.6,
      placements: 4.8,
      facultyQuality: 4.7,
      infrastructure: 4.5,
      valueForMoney: 4.8
    },
    isApproved: true,
    isActive: true,
    viewCount: 1390,
    searchCount: 710
  },
  {
    name: "Birla Institute of Technology and Science, Pilani",
    slug: "bits-pilani",
    logo: "https://upload.wikimedia.org/wikipedia/en/d/d3/BITS_Pilani-Logo.svg",
    bannerImage: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800&auto=format&fit=crop"
    ],
    location: {
      city: "Pilani",
      state: "Rajasthan",
      address: "Vidya Vihar",
      pincode: "333031",
      coordinates: { lat: 28.3639, lng: 75.5870 }
    },
    type: "Private" as const,
    establishedYear: 1964,
    naacGrade: "A",
    nirfRanking: 25,
    affiliatedUniversity: "Autonomous (Deemed)",
    totalStudents: 5500,
    officialWebsite: "https://www.bits-pilani.ac.in",
    description: "BITS Pilani is India's leading private deemed university, renowned for its strong focus on engineering and sciences. Under its famous 'no attendance policy' and stellar practice school (internship) program, students gain incredible industry experience. The campus culture is highly cooperative, nurturing tech innovators, entrepreneurs, and artists.",
    averagePackage: 1900000,
    highestPackage: 6070000,
    lowestPackage: 600000,
    placementPercentage: 94,
    facilities: {
      hostelBoys: true,
      hostelGirls: true,
      mess: true,
      gym: true,
      library: true,
      sportsComplex: true,
      medicalCenter: true,
      wifi: true
    },
    clubs: ["Coding Club", "Wall Street Club", "Creative Activities Club", "Music Society", "English Press Club"],
    culturalFests: ["Oasis"],
    techFests: ["Apogee"],
    entranceExams: ["BITSAT"],
    applicationDeadline: "2026-06-15",
    cutoffRanks: {
      "Computer Science Engineering": 331,
      "Electronics & Communication": 296,
      "Electrical & Electronics": 270
    },
    admissionLink: "https://www.bitsadmission.com",
    topRecruiters: [
      { name: "Nvidia", logo: "" },
      { name: "Salesforce", logo: "" },
      { name: "JPMorgan Chase", logo: "" },
      { name: "Qualcomm", logo: "" }
    ],
    notableAlumni: [
      { name: "Phanindra Sama", designation: "Founder", company: "redBus" },
      { name: "Sanjay Mehrotra", designation: "CEO", company: "Micron Technology" }
    ],
    avgRating: 4.6,
    totalReviews: 0,
    ratingBreakdown: {
      academics: 4.6,
      campusLife: 4.8,
      placements: 4.7,
      facultyQuality: 4.4,
      infrastructure: 4.5,
      valueForMoney: 4.1
    },
    isApproved: true,
    isActive: true,
    viewCount: 1105,
    searchCount: 650
  },
  {
    name: "Delhi Technological University",
    slug: "dtu-delhi",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/b/b5/Delhi_Technological_University_Designation.svg/1200px-Delhi_Technological_University_Designation.svg.png",
    bannerImage: "https://images.unsplash.com/photo-1527891751199-7225231a68dd?q=80&w=1200&auto=format&fit=crop",
    gallery: [],
    location: {
      city: "New Delhi",
      state: "Delhi",
      address: "Shahbad Daulatpur, Bawana Road",
      pincode: "110042",
      coordinates: { lat: 28.7501, lng: 77.1177 }
    },
    type: "Public" as const,
    establishedYear: 1941,
    naacGrade: "A",
    nirfRanking: 29,
    affiliatedUniversity: "State University",
    totalStudents: 14000,
    officialWebsite: "http://www.dtu.ac.in",
    description: "Delhi Technological University (formerly Delhi College of Engineering - DCE) is a premier state public university in Delhi. DTU is highly sought-after for its excellent industry connections, massive campus, and top-tier placement records. It has a legacy of over 80 years in technical education.",
    averagePackage: 1550000,
    highestPackage: 8200000,
    lowestPackage: 550000,
    placementPercentage: 88,
    facilities: {
      hostelBoys: true,
      hostelGirls: true,
      mess: true,
      gym: true,
      library: true,
      sportsComplex: true,
      medicalCenter: true,
      wifi: true
    },
    clubs: ["DCE Coders", "Defianz Racing", "Inferno Dance Crew", "Sahitya Society"],
    culturalFests: ["Engifest"],
    techFests: ["Invictus"],
    entranceExams: ["JEE Main", "GATE", "CAT"],
    applicationDeadline: "2026-07-10",
    cutoffRanks: {
      "Computer Engineering (Delhi)": 10000,
      "Software Engineering (Delhi)": 12500,
      "Information Technology (Delhi)": 11800
    },
    admissionLink: "https://jacdelhi.admissions.nic.in",
    topRecruiters: [
      { name: "Paytm", logo: "" },
      { name: "Adobe", logo: "" },
      { name: "Flipkart", logo: "" }
    ],
    notableAlumni: [
      { name: "Sushant Singh Rajput", designation: "Late Actor", company: "Bollywood" },
      { name: "Vijay Shekhar Sharma", designation: "Founder", company: "Paytm" }
    ],
    avgRating: 4.3,
    totalReviews: 0,
    ratingBreakdown: {
      academics: 4.2,
      campusLife: 4.5,
      placements: 4.5,
      facultyQuality: 4.0,
      infrastructure: 4.1,
      valueForMoney: 4.4
    },
    isApproved: true,
    isActive: true,
    viewCount: 950,
    searchCount: 520
  },
  {
    name: "Vellore Institute of Technology",
    slug: "vit-vellore",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/c/c5/Vellore_Institute_of_Technology_logo_2017.svg/1200px-Vellore_Institute_of_Technology_logo_2017.svg.png",
    bannerImage: "https://images.unsplash.com/photo-1595853035070-59a39fe84de3?q=80&w=1200&auto=format&fit=crop",
    gallery: [],
    location: {
      city: "Vellore",
      state: "Tamil Nadu",
      address: "Katpadi Road",
      pincode: "632014",
      coordinates: { lat: 12.9692, lng: 79.1559 }
    },
    type: "Private" as const,
    establishedYear: 1984,
    naacGrade: "A++",
    nirfRanking: 11,
    affiliatedUniversity: "Autonomous (Deemed)",
    totalStudents: 35000,
    officialWebsite: "https://vit.ac.in",
    description: "Vellore Institute of Technology is a highly popular private research university with a sprawling campus in Vellore. Known for its modern infrastructure, dynamic campus life (Riviera and Gravitas), and flexible credit system (FFCS), it attracts students from all over India and abroad. VIT holds the Limca Book of Records for maximum campus placements.",
    averagePackage: 920000,
    highestPackage: 10200000,
    lowestPackage: 400000,
    placementPercentage: 85,
    facilities: {
      hostelBoys: true,
      hostelGirls: true,
      mess: true,
      gym: true,
      library: true,
      sportsComplex: true,
      medicalCenter: true,
      wifi: true
    },
    clubs: ["CodeChef VIT", "IEEE VIT", "DebSoc", "Music Club", "LUG"],
    culturalFests: ["Riviera"],
    techFests: ["Gravitas"],
    entranceExams: ["VITEEE"],
    applicationDeadline: "2026-04-30",
    cutoffRanks: {
      "Computer Science Engineering (Cat 1)": 1500,
      "Computer Science Engineering (Cat 2)": 4500,
      "Electronics & Communication (Cat 1)": 5000
    },
    admissionLink: "https://viteee.vit.ac.in",
    topRecruiters: [
      { name: "Cognizant", logo: "" },
      { name: "TCS", logo: "" },
      { name: "Wipro", logo: "" },
      { name: "Infosys", logo: "" }
    ],
    notableAlumni: [
      { name: "Dhyan Sreenivasan", designation: "Actor/Director", company: "Malayalam Cinema" }
    ],
    avgRating: 4.1,
    totalReviews: 0,
    ratingBreakdown: {
      academics: 4.0,
      campusLife: 4.3,
      placements: 4.1,
      facultyQuality: 3.8,
      infrastructure: 4.6,
      valueForMoney: 3.6
    },
    isApproved: true,
    isActive: true,
    viewCount: 1650,
    searchCount: 910
  },
  {
    name: "National Institute of Technology Tiruchirappalli",
    slug: "nit-trichy",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/e/e6/NIT_Trichy_logo.svg/300px-NIT_Trichy_logo.svg.png",
    bannerImage: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1200&auto=format&fit=crop",
    gallery: [],
    location: {
      city: "Tiruchirappalli",
      state: "Tamil Nadu",
      address: "Tanjore Main Road, National Highway 67",
      pincode: "620015",
      coordinates: { lat: 10.7589, lng: 78.8132 }
    },
    type: "Public" as const,
    establishedYear: 1964,
    naacGrade: "A",
    nirfRanking: 9,
    affiliatedUniversity: "Autonomous",
    totalStudents: 6500,
    officialWebsite: "https://www.nitt.edu",
    description: "NIT Trichy is consistently ranked as the top National Institute of Technology in India. The institution stands out for academic rigor, excellent placements, and the massive Festember and Pragyan festivals. The campus spans over 800 acres, offering a complete residential university experience.",
    averagePackage: 1580000,
    highestPackage: 5280000,
    lowestPackage: 500000,
    placementPercentage: 91,
    facilities: {
      hostelBoys: true,
      hostelGirls: true,
      mess: true,
      gym: true,
      library: true,
      sportsComplex: true,
      medicalCenter: true,
      wifi: true
    },
    clubs: ["Delta Force", "Spider R&D", "Feeds Club", "Rotaract Club"],
    culturalFests: ["Festember"],
    techFests: ["Pragyan"],
    entranceExams: ["JEE Main", "DASA", "GATE", "NIMCET"],
    applicationDeadline: "2026-06-30",
    cutoffRanks: {
      "Computer Science (Other State)": 710,
      "Electronics & Communication (OS)": 2800,
      "Electrical & Electronics (OS)": 5200
    },
    admissionLink: "https://josaa.nic.in",
    topRecruiters: [
      { name: "Microsoft", logo: "" },
      { name: "Texas Instruments", logo: "" },
      { name: "L&T", logo: "" }
    ],
    notableAlumni: [
      { name: "K. R. Sridhar", designation: "CEO", company: "Bloom Energy" }
    ],
    avgRating: 4.5,
    totalReviews: 0,
    ratingBreakdown: {
      academics: 4.6,
      campusLife: 4.4,
      placements: 4.6,
      facultyQuality: 4.3,
      infrastructure: 4.2,
      valueForMoney: 4.7
    },
    isApproved: true,
    isActive: true,
    viewCount: 780,
    searchCount: 430
  },
  {
    name: "Netaji Subhas University of Technology",
    slug: "nsut-delhi",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/e/ef/Netaji_Subhas_University_of_Technology_logo.svg/300px-Netaji_Subhas_University_of_Technology_logo.svg.png",
    bannerImage: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1200&auto=format&fit=crop",
    gallery: [],
    location: {
      city: "New Delhi",
      state: "Delhi",
      address: "Dwarka Sector 3",
      pincode: "110078",
      coordinates: { lat: 28.6083, lng: 77.0350 }
    },
    type: "Public" as const,
    establishedYear: 1983,
    naacGrade: "A",
    nirfRanking: 60,
    affiliatedUniversity: "State University",
    totalStudents: 8500,
    officialWebsite: "http://www.nsut.ac.in",
    description: "Netaji Subhas University of Technology (formerly NSIT) is a prominent state public engineering college located in Dwarka, Delhi. It is highly regarded for its coding culture, tech fests, and competitive placement outcomes, rivaling the top IITs and NITs.",
    averagePackage: 1600000,
    highestPackage: 12500000,
    lowestPackage: 500000,
    placementPercentage: 89,
    facilities: {
      hostelBoys: true,
      hostelGirls: true,
      mess: true,
      gym: true,
      library: true,
      sportsComplex: true,
      medicalCenter: true,
      wifi: true
    },
    clubs: ["IEEE NSUT", "Crosslinks", "CSI NSUT", "Capella Dance Club"],
    culturalFests: ["Moksha"],
    techFests: ["Resonanz"],
    entranceExams: ["JEE Main"],
    applicationDeadline: "2026-07-10",
    cutoffRanks: {
      "Computer Engineering (Delhi)": 8500,
      "Information Technology (Delhi)": 9800,
      "MAC (Delhi)": 11000
    },
    admissionLink: "https://jacdelhi.admissions.nic.in",
    topRecruiters: [
      { name: "Tower Research", logo: "" },
      { name: "Microsoft", logo: "" },
      { name: "Deshaw", logo: "" }
    ],
    notableAlumni: [
      { name: "Ira Singhal", designation: "IAS Officer", company: "Govt of India" }
    ],
    avgRating: 4.2,
    totalReviews: 0,
    ratingBreakdown: {
      academics: 4.1,
      campusLife: 4.3,
      placements: 4.5,
      facultyQuality: 3.8,
      infrastructure: 4.0,
      valueForMoney: 4.3
    },
    isApproved: true,
    isActive: true,
    viewCount: 680,
    searchCount: 390
  },
  {
    name: "College of Engineering, Pune",
    slug: "coep-pune",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/c/cf/COEP_logo.svg/300px-COEP_logo.svg.png",
    bannerImage: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1200&auto=format&fit=crop",
    gallery: [],
    location: {
      city: "Pune",
      state: "Maharashtra",
      address: "Wellesley Rd, Shivajinagar",
      pincode: "411005",
      coordinates: { lat: 18.5293, lng: 73.8565 }
    },
    type: "Autonomous" as const,
    establishedYear: 1854,
    naacGrade: "A",
    nirfRanking: 73,
    affiliatedUniversity: "Savitribai Phule Pune University",
    totalStudents: 4200,
    officialWebsite: "https://www.coep.org.in",
    description: "College of Engineering Pune (COEP) is one of the oldest engineering colleges in Asia (established 1854). Located at the confluence of the Mula and Mutha rivers in Shivajinagar, COEP possesses a historic heritage combined with a strong modern reputation for research, sports, and technical club activities (such as Satellite and Robot Study Circle).",
    averagePackage: 1050000,
    highestPackage: 5050000,
    lowestPackage: 450000,
    placementPercentage: 86,
    facilities: {
      hostelBoys: true,
      hostelGirls: true,
      mess: true,
      gym: true,
      library: true,
      sportsComplex: true,
      medicalCenter: true,
      wifi: true
    },
    clubs: ["COEP Satellite Team", "Robot Study Circle", "Janeev Club", "Boat Club"],
    culturalFests: ["MindSpark"],
    techFests: ["Zest"],
    entranceExams: ["MHT CET", "JEE Main", "GATE"],
    applicationDeadline: "2026-07-15",
    cutoffRanks: {
      "Computer Engineering (MHT-CET)": 99.93,
      "Information Technology (MHT-CET)": 99.88,
      "Electrical Engineering (MHT-CET)": 99.50
    },
    admissionLink: "https://www.coep.org.in/admissions",
    topRecruiters: [
      { name: "Tata Motors", logo: "" },
      { name: "Bajaj Auto", logo: "" },
      { name: "Goldman Sachs", logo: "" }
    ],
    notableAlumni: [
      { name: "Sir M. Visvesvaraya", designation: "Bharat Ratna Engineer", company: "Kingdom of Mysore" }
    ],
    avgRating: 4.4,
    totalReviews: 0,
    ratingBreakdown: {
      academics: 4.4,
      campusLife: 4.2,
      placements: 4.3,
      facultyQuality: 4.2,
      infrastructure: 4.1,
      valueForMoney: 4.7
    },
    isApproved: true,
    isActive: true,
    viewCount: 810,
    searchCount: 450
  },
  {
    name: "Manipal Institute of Technology",
    slug: "mit-manipal",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/e/e5/Manipal_Academy_of_Higher_Education_logo.svg/300px-Manipal_Academy_of_Higher_Education_logo.svg.png",
    bannerImage: "https://images.unsplash.com/photo-1595853035070-59a39fe84de3?q=80&w=1200&auto=format&fit=crop",
    gallery: [],
    location: {
      city: "Manipal",
      state: "Karnataka",
      address: "Udupi district",
      pincode: "576104",
      coordinates: { lat: 13.3523, lng: 74.7853 }
    },
    type: "Private" as const,
    establishedYear: 1957,
    naacGrade: "A++",
    nirfRanking: 61,
    affiliatedUniversity: "MAHE (Deemed)",
    totalStudents: 10000,
    officialWebsite: "https://manipal.edu/mit.html",
    description: "Manipal Institute of Technology is a highly rated private engineering college located in the beautiful university town of Manipal, Karnataka. The campus offers student-centric features, outstanding hostels, and a diverse culture. Famous for its cultural fest 'Revels' and tech fest 'Techtatva', it nurtures creators, developers, and writers.",
    averagePackage: 1250000,
    highestPackage: 5475000,
    lowestPackage: 500000,
    placementPercentage: 88,
    facilities: {
      hostelBoys: true,
      hostelGirls: true,
      mess: true,
      gym: true,
      library: true,
      sportsComplex: true,
      medicalCenter: true,
      wifi: true
    },
    clubs: ["Kryptic Club", "Formula Manipal", "LIT Club", "IEEE MIT"],
    culturalFests: ["Revels"],
    techFests: ["Techtatva"],
    entranceExams: ["MET"],
    applicationDeadline: "2026-05-15",
    cutoffRanks: {
      "Computer Science Engineering": 1200,
      "Data Science Engineering": 2500,
      "Information Technology": 3200
    },
    admissionLink: "https://apply.manipal.edu",
    topRecruiters: [
      { name: "Microsoft", logo: "" },
      { name: "Amazon", logo: "" },
      { name: "Cisco", logo: "" }
    ],
    notableAlumni: [
      { name: "Satya Nadella", designation: "CEO", company: "Microsoft" },
      { name: "Rajeev Suri", designation: "Former CEO", company: "Nokia" }
    ],
    avgRating: 4.3,
    totalReviews: 0,
    ratingBreakdown: {
      academics: 4.0,
      campusLife: 4.7,
      placements: 4.2,
      facultyQuality: 3.9,
      infrastructure: 4.8,
      valueForMoney: 3.7
    },
    isApproved: true,
    isActive: true,
    viewCount: 1240,
    searchCount: 560
  },
  {
    name: "SRM Institute of Science and Technology",
    slug: "srm-chennai",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/f/fe/SRM_University_logo.svg/300px-SRM_University_logo.svg.png",
    bannerImage: "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1200&auto=format&fit=crop",
    gallery: [],
    location: {
      city: "Chennai",
      state: "Tamil Nadu",
      address: "Kattankulathur",
      pincode: "603203",
      coordinates: { lat: 12.8230, lng: 80.0444 }
    },
    type: "Private" as const,
    establishedYear: 1985,
    naacGrade: "A++",
    nirfRanking: 28,
    affiliatedUniversity: "Autonomous (Deemed)",
    totalStudents: 22000,
    officialWebsite: "https://www.srmist.edu.in",
    description: "SRM Institute of Science and Technology is a large private university located at Kattankulathur near Chennai. It features outstanding labs, massive placement cycles, and a diverse student community representing all states of India. It is highly known for the Milan cultural fest.",
    averagePackage: 780000,
    highestPackage: 10000000,
    lowestPackage: 350000,
    placementPercentage: 82,
    facilities: {
      hostelBoys: true,
      hostelGirls: true,
      mess: true,
      gym: true,
      library: true,
      sportsComplex: true,
      medicalCenter: true,
      wifi: true
    },
    clubs: ["SRM Hackathon Club", "IEEE SRM", "Music Club", "SAE SRM"],
    culturalFests: ["Milan"],
    techFests: ["Aaruush"],
    entranceExams: ["SRMJEEE"],
    applicationDeadline: "2026-05-30",
    cutoffRanks: {
      "Computer Science (KTR Campus)": 9500,
      "Information Technology (KTR)": 15000,
      "ECE (KTR)": 20000
    },
    admissionLink: "https://www.srmist.edu.in/admission-india",
    topRecruiters: [
      { name: "TCS", logo: "" },
      { name: "Cognizant", logo: "" },
      { name: "Wipro", logo: "" }
    ],
    notableAlumni: [
      { name: "Murali Vijay", designation: "Cricketer", company: "Indian Cricket Team" }
    ],
    avgRating: 3.9,
    totalReviews: 0,
    ratingBreakdown: {
      academics: 3.8,
      campusLife: 4.2,
      placements: 3.9,
      facultyQuality: 3.6,
      infrastructure: 4.4,
      valueForMoney: 3.4
    },
    isApproved: true,
    isActive: true,
    viewCount: 940,
    searchCount: 480
  }
];

async function seed() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log(`Connected to database at ${MONGODB_URI}`);

    // Clear existing collections
    console.log("Clearing existing database tables...");
    await Promise.all([
      College.deleteMany({}),
      User.deleteMany({}),
      Course.deleteMany({}),
      Review.deleteMany({}),
      Meeting.deleteMany({}),
      Notification.deleteMany({}),
      QuizResult.deleteMany({})
    ]);
    console.log("Database cleared.");

    // Hashing passwords for demo accounts
    const hashedPassword = bcrypt.hashSync("Demo@1234", 10);

    // Create Demo Users
    console.log("Creating demo users...");
    const adminUser = await User.create({
      name: "Demo Admin",
      email: "admin@demo.com",
      password: hashedPassword,
      role: "admin",
      isVerified: true,
      isApproved: true,
      wishlist: [],
      rating: 0,
      reviewCount: 0,
      sessionCount: 0
    });

    const studentUser = await User.create({
      name: "Demo Student",
      email: "student@demo.com",
      password: hashedPassword,
      role: "student",
      isVerified: false,
      isApproved: true,
      wishlist: [],
      rating: 0,
      reviewCount: 0,
      sessionCount: 0
    });

    // Create Colleges
    console.log("Inserting colleges...");
    const seededColleges = await College.insertMany(COLLEGES_DATA);
    console.log(`Successfully seeded ${seededColleges.length} colleges.`);

    // Take IIT Bombay as reference for insider
    const iitBombay = seededColleges.find(c => c.slug === "iit-bombay")!;

    // Create Insider User
    const insiderUser = await User.create({
      name: "Demo Insider",
      email: "insider@demo.com",
      password: hashedPassword,
      role: "insider",
      college: iitBombay._id,
      course: "Computer Science Engineering",
      yearOfStudy: 3,
      isVerified: true,
      isApproved: true,
      bio: "Hey there! I am a third-year CSE student at IIT Bombay. I love competitive programming, full-stack development, and mentoring juniors. Feel free to book a slot for advice on JEE preparation or campus life!",
      expertise: ["JEE prep", "College Life", "CSE Curriculum", "Placements"],
      availabilitySlots: [
        { day: "Monday", startTime: "16:00", endTime: "17:00", isBooked: false },
        { day: "Wednesday", startTime: "14:00", endTime: "15:00", isBooked: false },
        { day: "Friday", startTime: "17:00", endTime: "18:00", isBooked: false }
      ],
      rating: 4.8,
      reviewCount: 1,
      sessionCount: 12,
      linkedIn: "https://linkedin.com",
      website: "https://github.com"
    });

    console.log("Demo users successfully created.");

    // Seed Courses for seeded colleges
    console.log("Creating courses...");
    const coursesToInsert: any[] = [];
    seededColleges.forEach(col => {
      coursesToInsert.push(
        {
          college: col._id,
          name: "B.Tech in Computer Science Engineering",
          type: "UG",
          duration: "4 Years",
          eligibility: "12th Pass with Physics, Chemistry & Maths (JEE Rank/Entrance exam)",
          annualFee: col.slug.includes("iit") || col.slug.includes("nit") ? 200000 : col.slug.includes("bits") ? 480000 : 350000,
          scholarshipAvailable: true,
          scholarshipDetails: "Merit-based tuition waiver up to 100% for deserving students.",
          seats: 120,
          specializations: ["AI & Machine Learning", "Data Science", "Cyber Security"],
          isActive: true
        },
        {
          college: col._id,
          name: "B.Tech in Electronics & Communication Engineering",
          type: "UG",
          duration: "4 Years",
          eligibility: "12th Pass with PCM",
          annualFee: col.slug.includes("iit") || col.slug.includes("nit") ? 200000 : col.slug.includes("bits") ? 480000 : 330000,
          scholarshipAvailable: true,
          seats: 90,
          specializations: ["VLSI Design", "Embedded Systems", "IoT"],
          isActive: true
        },
        {
          college: col._id,
          name: "M.Tech in Computer Science & Engineering",
          type: "PG",
          duration: "2 Years",
          eligibility: "B.Tech/BE in CS/IT + GATE Score",
          annualFee: col.slug.includes("iit") || col.slug.includes("nit") ? 50000 : col.slug.includes("bits") ? 250000 : 150000,
          scholarshipAvailable: true,
          scholarshipDetails: "GATE stipend of INR 12,400 per month.",
          seats: 30,
          isActive: true
        }
      );
    });

    const seededCourses = await Course.insertMany(coursesToInsert);
    console.log(`Seeded ${seededCourses.length} courses across colleges.`);

    // Seed Reviews
    console.log("Seeding reviews...");
    const review = await Review.create({
      author: insiderUser._id,
      college: iitBombay._id,
      ratings: {
        academics: 5,
        campusLife: 5,
        placements: 5,
        facultyQuality: 4,
        infrastructure: 5,
        valueForMoney: 5
      },
      overallRating: 4.8,
      pros: "World-class coding environment, fantastic placement opportunities, unmatched campus size and natural setting with Powai Lake right next to the campus. Mood Indigo is an amazing experience.",
      cons: "Extreme academic load can be stressful at times. Mess food is decent but gets monotonous over the weeks.",
      advice: "Try to balance your academics with extracurricular clubs. The peer network here is your biggest asset, so make sure to interact with students from other departments.",
      batch: "2023-2027",
      course: "B.Tech Computer Science Engineering",
      helpfulVotes: [studentUser._id],
      isFlagged: false,
      isApproved: true,
      isPublished: true
    });

    // Seed a meeting
    console.log("Seeding meetings...");
    const meeting = await Meeting.create({
      student: studentUser._id,
      insider: insiderUser._id,
      college: iitBombay._id,
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days in future
      timeSlot: "Wednesday 14:00 - 15:00",
      duration: 30,
      type: "1on1",
      message: "Hi! I wanted to understand the placement scenarios for the CSE branch and what kind of companies visit during the placement season.",
      status: "pending"
    });

    // Create a demo notification for student
    await Notification.create({
      user: studentUser._id,
      type: "meeting_accepted",
      title: "Welcome to Campus Compass",
      message: "Start discovering top colleges in India, take our College Match Quiz, and book slots with insiders!",
      link: "/colleges"
    });

    console.log("Database seeded successfully! 🌱");
  } catch (error) {
    console.error("Error during database seeding:", error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
}

seed();
