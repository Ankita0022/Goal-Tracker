// Goals (exams + courses) with syllabus. Edit this file to add new goals or topics.
// Topic ids are derived from goal id + section + topic text, so keep text stable once you start ticking.
const GOALS = [
  {
    id: "uiux", name: "UI/UX Design Certificate", kind: "Course", date: "2026-10-19",
    sections: {
      "Modules": [
        "Intro to UX vs UI, design thinking process",
        "User research: interviews, surveys, empathy maps",
        "Personas, user journeys, problem statements",
        "Information architecture, user flows, sitemaps",
        "Wireframing (low-fidelity) in Figma",
        "Visual design: typography, colour, grids, spacing",
        "Components, auto layout & design systems in Figma",
        "High-fidelity prototyping & interactions",
        "Usability testing & iteration",
        "Accessibility basics (contrast, WCAG)",
        "Final project / case study",
        "Final quiz & download certificate",
      ],
    },
  },
  {
    id: "rrbje", name: "RRB JE (IT/CS)", kind: "Exam", date: "2026-10-27",
    sections: {
      "Mathematics": ["Number system, HCF/LCM, simplification", "Percentage, profit & loss, SI/CI", "Ratio, average, ages, mixtures", "Time & work, pipes", "Time, speed, distance, boats & trains", "Algebra, trigonometry, heights & distances", "Mensuration, geometry", "Statistics & data interpretation"],
      "Reasoning": ["Analogy, classification, series", "Coding-decoding, blood relations", "Direction sense, ranking", "Syllogism, statements & conclusions", "Puzzles & seating arrangement", "Venn diagrams, mathematical operations", "Non-verbal (mirror, paper folding, figures)"],
      "General Awareness & Science": ["Current affairs (last 6 months)", "Indian polity & history", "Geography & economy", "Physics basics", "Chemistry basics", "Biology basics", "Environment & pollution control", "Railways & static GK"],
      "Technical (CS/IT)": ["Computer fundamentals & number systems", "C / C++ programming", "Data structures", "Operating systems", "DBMS & SQL", "Computer networks & Internet", "Software engineering (SDLC, testing)", "Web technologies (HTML, XML)", "Computer architecture / digital logic", "MS Office & basic applications"],
      "Practice": ["PYQ set 1", "PYQ set 2", "Full mock 1", "Full mock 2", "Full mock 3", "Formula & error-log revision"],
    },
  },
  {
    id: "sscje", name: "SSC JE", kind: "Exam", date: "2026-11-02", tentative: true, window: ["2026-11-02", "2026-11-06"],
    note: "SSC JE has no CS paper (only Civil / Electrical / Mechanical). Edit the Technical topics in data.js to match the paper you actually applied for.",
    sections: {
      "General Intelligence & Reasoning": ["Revise RRB reasoning error log", "Analogy, classification, series", "Coding-decoding, blood relations, direction", "Syllogism & logical deduction", "Non-verbal reasoning"],
      "General Awareness": ["Current affairs refresh", "Static GK, polity, history", "Geography & economy", "General science"],
      "Technical (Part A)": ["Technical topic 1 — edit me", "Technical topic 2 — edit me", "Technical topic 3 — edit me"],
      "Practice": ["SSC JE PYQ 2023", "SSC JE PYQ 2024", "Full mock 1", "Full mock 2"],
    },
  },
  {
    id: "chsl", name: "SSC CHSL (10+2)", kind: "Exam", date: "2026-11-30", window: ["2026-11-30", "2026-12-31"],
    note: "Exam window Nov 30 – Dec 31. Update the date once your slot is out.",
    sections: {
      "Quantitative Aptitude": ["Arithmetic (%, P&L, SI/CI, ratio, average)", "Time & work, TSD", "Algebra & identities", "Geometry (triangles, circles)", "Mensuration 2D/3D", "Trigonometry", "Data interpretation"],
      "General Intelligence": ["Analogy, classification, series", "Coding-decoding", "Puzzles & seating", "Syllogism", "Non-verbal reasoning", "Matrix, embedded figures"],
      "English Language": ["Reading comprehension", "Cloze test", "Error spotting & sentence improvement", "Active/passive, direct/indirect", "Synonyms, antonyms, one-word substitution", "Idioms & phrases, spellings"],
      "General Awareness": ["Current affairs", "History", "Polity", "Geography", "Economy", "Static GK (awards, books, days)", "General science"],
      "Practice": ["Sectional tests (daily)", "Full mock ×5", "PYQ shifts ×5"],
    },
  },
  {
    id: "gate", name: "GATE CS", kind: "Exam", date: "2027-02-06", tentative: true,
    note: "GATE 2027 runs over weekends in early-mid Feb. Set your exact date once the admit card is out.",
    sections: {
      "General Aptitude": ["Verbal ability", "Quantitative aptitude", "Analytical & spatial reasoning"],
      "Engineering Mathematics": ["Discrete maths: logic, sets, relations", "Graph theory & combinatorics", "Linear algebra", "Calculus", "Probability & statistics"],
      "Core CS": ["Digital logic", "Computer organisation & architecture", "Programming in C & data structures", "Algorithms", "Theory of computation", "Compiler design", "Operating systems", "Databases", "Computer networks"],
      "Practice": ["Subject-wise PYQs (2010–2026)", "Mock test series start", "10 full-length mocks", "Formula & short-notes revision"],
    },
  },
];

// Study phases, built around a 9–6 office day (wake 7, dinner done by 21:30).
// "weekday" = Mon–Sat (office), "weekend" = Sunday. Dates inclusive.
// Weekdays: commute/lunch = light phone revision, main study 21:30–00:30.
const PHASES = [
  {
    from: "2026-10-13", to: "2026-10-19", title: "RRB JE sprint + finish UI/UX course",
    weekday: [
      ["07:00–09:00", "Get ready · 10 min formula flashcards while eating"],
      ["Commute", "Current affairs podcast / GA notes on phone"],
      ["Lunch break", "15 reasoning questions on phone"],
      ["Commute home", "UI/UX course video (watch on phone)"],
      ["18:00–21:30", "Freshen up, dinner · listen to Science/GA audio while cooking"],
      ["21:30–22:30", "UI/UX: 1–2 modules (aim: all modules done by Sat Oct 17)"],
      ["22:35–23:35", "RRB Technical CS (1 subject)"],
      ["23:35–00:20", "RRB Maths (1 topic + 20 questions)"],
      ["00:20–00:30", "Error log + plan tomorrow · sleep by 12:45 AM"],
    ],
    weekend: [
      ["08:00–11:00", "UI/UX: final project + final quiz → download certificate (Sun Oct 18)"],
      ["11:30–13:30", "RRB Technical CS"],
      ["14:30–16:00", "RRB Maths"],
      ["16:30–17:30", "Reasoning practice"],
      ["21:30–23:30", "RRB full mock / PYQ set"],
    ],
  },
  {
    from: "2026-10-20", to: "2026-10-26", title: "RRB JE final week — mocks & revision",
    weekday: [
      ["Commute", "GA + Science revision on phone"],
      ["Lunch break", "Reasoning sectional (20 min)"],
      ["Commute home", "Revise short notes / error log"],
      ["21:30–23:00", "Mini mock (60 Qs, timed) or PYQ set"],
      ["23:00–00:00", "Analyse mock + fix weak Technical CS topics"],
      ["00:00–00:30", "Maths formulas revision"],
    ],
    weekend: [
      ["09:00–10:30", "Full mock test (exam timing)"],
      ["11:00–13:00", "Mock analysis + error log"],
      ["14:30–16:30", "Technical CS weak areas"],
      ["17:00–18:30", "Maths + Reasoning weak areas"],
      ["21:30–23:00", "GA + Science final revision"],
    ],
  },
  { from: "2026-10-27", to: "2026-10-27", title: "RRB JE exam day 🎯", weekday: [["", "Take leave. Light revision, reach centre early. All the best!"]] },
  {
    from: "2026-10-28", to: "2026-11-01", title: "SSC JE switch-over",
    weekday: [
      ["Commute", "GA revision on phone"],
      ["Lunch break", "Reasoning (reuse RRB prep)"],
      ["21:30–23:00", "SSC JE technical part"],
      ["23:00–00:30", "SSC JE PYQ"],
    ],
    weekend: [
      ["09:00–11:00", "SSC JE full mock"],
      ["11:30–13:00", "Mock analysis"],
      ["14:30–17:30", "Technical part revision"],
      ["21:30–23:00", "GA + Reasoning revision"],
    ],
  },
  {
    from: "2026-11-02", to: "2026-11-06", title: "SSC JE exam window 🎯",
    weekday: [
      ["", "Take leave on your exam day. Night before: light revision only."],
      ["21:30–23:00", "Other days: SSC JE PYQ / revision"],
      ["23:00–23:30", "CHSL English vocab (starts next)"],
    ],
  },
  {
    from: "2026-11-07", to: "2026-11-29", title: "SSC CHSL main prep + GATE start",
    weekday: [
      ["Commute", "GA / current affairs on phone"],
      ["Lunch break", "English vocab: 20 words + idioms"],
      ["Commute home", "Reasoning puzzles on phone"],
      ["21:30–22:45", "Quant (1 topic + practice)"],
      ["22:50–23:40", "English grammar"],
      ["23:40–00:30", "GATE: Engineering Maths / DS (light)"],
    ],
    weekend: [
      ["09:00–10:00", "CHSL full mock"],
      ["10:15–11:30", "Mock analysis"],
      ["11:30–13:30", "GATE core subject (DS, then Algorithms)"],
      ["14:30–16:30", "GATE core subject + PYQs"],
      ["17:00–18:30", "Quant weak areas"],
      ["21:30–23:00", "English + GA revision"],
    ],
  },
  {
    from: "2026-11-30", to: "2026-12-31", title: "CHSL exam window + GATE core",
    weekday: [
      ["Commute", "GATE short notes / CHSL GA on phone"],
      ["Lunch break", "GATE General Aptitude (10 Qs)"],
      ["21:30–23:30", "GATE core subject"],
      ["23:30–00:30", "CHSL mock section (until your slot) → then GATE PYQs"],
    ],
    weekend: [
      ["09:00–13:00", "GATE core subject (2 sessions with a break)"],
      ["14:30–17:00", "GATE PYQs on the week's subject"],
      ["17:30–18:30", "CHSL revision (until your slot)"],
      ["21:30–23:00", "GATE short notes"],
    ],
  },
  {
    from: "2027-01-01", to: "2027-01-25", title: "GATE: finish syllabus + PYQs",
    weekday: [
      ["Commute", "Formula sheet / short notes on phone"],
      ["Lunch break", "10 PYQs"],
      ["21:30–23:30", "Remaining core subject"],
      ["23:30–00:30", "Subject-wise PYQs"],
    ],
    weekend: [
      ["09:00–12:00", "Test series: subject test"],
      ["12:00–13:00", "Analysis"],
      ["14:30–17:30", "Remaining core subject"],
      ["21:30–23:00", "Engineering Maths"],
    ],
  },
  {
    from: "2027-01-26", to: "2027-02-14", title: "GATE: full mocks & revision",
    weekday: [
      ["Commute", "Formula sheet"],
      ["21:30–23:30", "Revise weak subject from last mock"],
      ["23:30–00:30", "PYQs on weak areas"],
    ],
    weekend: [
      ["09:30–12:30", "Full-length GATE mock (exam timing)"],
      ["14:00–16:30", "Mock analysis"],
      ["17:00–19:00", "Revise weak subjects"],
    ],
  },
];

// Extra learning (not part of the timetable). Shown in the 🌟 Learn tab.
// Main topics; each sub-topic in LEARN points to one via `group`.
const LEARN_GROUPS = [
  { id: "finance", emoji: "💰", title: "Finance", why: "How money works, how to manage it, and how to make smarter money decisions." },
  { id: "mind", emoji: "🧠", title: "Mind & Focus", why: "Take back your attention from endless scrolling and feed your brain better stuff." },
  { id: "psych", emoji: "🧩", title: "Psychology", why: "How minds work: your own brain, the biases everyone has, and how to spot manipulation so nobody can play you." },
  { id: "world", emoji: "🌍", title: "World & Geopolitics", why: "Why countries do what they do. Also gold for SSC/RRB General Awareness." },
  { id: "api", emoji: "💻", title: "Tech: APIs, System Design & AI", why: "AI is reshaping every job. System design: how big apps like YouTube and Instagram are built. How apps talk to each other. Learn the basics, then the API types, then REST, then design." },
];

// Link type is auto-detected: YouTube ▶️, Instagram 📸, anything else 📰.
const LEARN = [
  // ---- From reel: "25 Days, 1 Skill a Day — FINANCE"
  {
    id: "fin-basics", group: "finance", emoji: "💰", title: "Money basics: budgeting, saving, compounding, inflation",
    why: "The foundation of every money decision. Learn the 50/30/20 budget, why you need an emergency fund, and how compounding and inflation quietly grow or shrink your money.",
    links: [
      { label: "Khan Academy — Personal finance (free course)", url: "https://www.khanacademy.org/college-careers-more/personal-finance" },
      { label: "Investopedia — The 50/30/20 budget rule", url: "https://www.investopedia.com/ask/answers/022916/what-502030-budget-rule.asp" },
      { label: "Investopedia — Emergency fund", url: "https://www.investopedia.com/terms/e/emergency_fund.asp" },
      { label: "Investopedia — Compound interest", url: "https://www.investopedia.com/terms/c/compoundinterest.asp" },
      { label: "Investopedia — Inflation", url: "https://www.investopedia.com/terms/i/inflation.asp" },
      { label: "Original post (finance series)", url: "https://www.instagram.com/p/DeQ0ffKFCre/" },
    ],
  },
  {
    id: "fin-invest", group: "finance", emoji: "📈", title: "Investing in India: mutual funds, SIPs, index funds, stocks",
    why: "How to make your salary work for you. Understand SIPs, index funds vs active funds, and how the stock market actually works before putting money in.",
    links: [
      { label: "Zerodha Varsity — free stock market & finance lessons", url: "https://zerodha.com/varsity/" },
      { label: "Zerodha Varsity — Personal Finance module (MFs, SIPs, retirement)", url: "https://zerodha.com/varsity/module/personalfinance/" },
      { label: "Investopedia — What is a mutual fund?", url: "https://www.investopedia.com/terms/m/mutualfund.asp" },
      { label: "SEBI investor education site (official)", url: "https://investor.sebi.gov.in/" },
      { label: "YouTube: SIP & mutual funds explained (Hindi/English)", url: "https://www.youtube.com/results?search_query=SIP+mutual+funds+explained+for+beginners+India", type: "youtube" },
    ],
  },
  {
    id: "fin-protect", group: "finance", emoji: "🛡️", title: "Tax, insurance & credit score",
    why: "Keep more of what you earn and stay protected: old vs new tax regime, term + health insurance, and how your CIBIL score affects loans.",
    links: [
      { label: "Zerodha Varsity — Personal Finance module (insurance chapters)", url: "https://zerodha.com/varsity/module/personalfinance/" },
      { label: "YouTube: Old vs new tax regime explained", url: "https://www.youtube.com/results?search_query=old+vs+new+tax+regime+explained", type: "youtube" },
      { label: "YouTube: Term vs health insurance for beginners", url: "https://www.youtube.com/results?search_query=term+insurance+vs+health+insurance+beginners+India", type: "youtube" },
      { label: "YouTube: How CIBIL credit score works", url: "https://www.youtube.com/results?search_query=how+CIBIL+credit+score+works", type: "youtube" },
    ],
  },

  // ---- From post: "Your attention is one of your most valuable resources"
  {
    id: "attention", group: "mind", emoji: "🧠", title: "Protect your attention (beat doomscrolling)",
    why: "Apps are designed to keep you scrolling. Knowing how that works makes it much easier to take your time back for studying.",
    links: [
      { label: "TED — Tristan Harris: How tech companies control billions of minds", url: "https://www.youtube.com/watch?v=C74amJRp730" },
      { label: "TED — Cal Newport: Why you should quit social media", url: "https://www.ted.com/talks/cal_newport_why_you_should_quit_social_media" },
      { label: "Center for Humane Technology — articles & resources", url: "https://www.humanetech.com/" },
      { label: "Original post", url: "https://www.instagram.com/p/DeTRNfTCtNy/" },
    ],
  },
  {
    id: "goodwatch", group: "mind", emoji: "📺", title: "Better things to watch instead of scrolling",
    why: "Swap a reel spiral for one video that teaches you something. These channels are fun and genuinely make you smarter.",
    links: [
      { label: "Kurzgesagt — science & big ideas, animated", url: "https://www.youtube.com/@kurzgesagt" },
      { label: "Veritasium — science & engineering puzzles", url: "https://www.youtube.com/@veritasium" },
      { label: "TED-Ed — short lessons on everything", url: "https://www.youtube.com/@TEDEd" },
      { label: "CrashCourse — full courses in bite-size episodes", url: "https://www.youtube.com/@crashcourse" },
    ],
  },
  {
    id: "debates", group: "mind", emoji: "🎤", title: "Debates to watch instead of doomscrolling",
    why: "Hearing smart people disagree trains you to see both sides of an argument. It's great for GA/essay topics and for thinking clearly. Pick one when you'd otherwise scroll.",
    points: ["AI: an inhuman future?", "Social media corrupts human interaction", "Men's rights vs feminism", "What makes a real man", "Is reservation compromising merit?", "Socialism vs capitalism"],
    links: [
      { label: "AI: An Inhuman Future? (full panel discussion)", url: "https://www.youtube.com/results?search_query=AI+An+Inhuman+Future+full+panel+discussion", type: "youtube" },
      { label: "Oxford Union — Social Media Corrupts Human Interactions (Jack Symonds, Part 1 of 6)", url: "https://www.youtube.com/watch?v=5hCq0V_edbY" },
      { label: "Jubilee Middle Ground — Men's Rights vs Feminism: Is Toxic Masculinity Real?", url: "https://www.youtube.com/results?search_query=Jubilee+Middle+Ground+Men%27s+Rights+vs+Feminism+toxic+masculinity", type: "youtube" },
      { label: "Jubilee — 25 Traditional vs 25 Progressive Men (What makes a real man)", url: "https://www.youtube.com/results?search_query=Jubilee+25+traditional+vs+25+progressive+men", type: "youtube" },
      { label: "Brut — Is Reservation Compromising Merit? Shashi Tharoor & D.Y. Chandrachud", url: "https://www.brut.media/in/videos/is-reservation-compromising-merit-shashi-tharoor-d-y-chandrachud-answers" },
      { label: "Socialism vs Capitalism debate (Richard Wolff)", url: "https://www.youtube.com/results?search_query=Socialism+vs+Capitalism+debate+Richard+Wolff", type: "youtube" },
      { label: "Original post (comment \"LINKS\" there to get the exact videos)", url: "https://www.instagram.com/p/DeTRNfTCtNy/" },
    ],
  },

  // ---- From post: "7 things that make you dangerously untouchable"
  {
    id: "psy-brain", group: "psych", emoji: "🧠", title: "1. Learn about your brain",
    why: "Real neuroscience behind habits and focus. Note: “dopamine detox” is a pop idea; the Harvard link explains what's true about it.",
    points: ["Placebo effect", "Reticular Activating System (RAS)", "Default Mode Network (DMN)", "Neuroplasticity", "Dopamine detox"],
    links: [
      { label: "Sentis — Neuroplasticity (2-min animation)", url: "https://www.youtube.com/watch?v=ELpfYCZa87g" },
      { label: "Wikipedia — Placebo", url: "https://en.wikipedia.org/wiki/Placebo" },
      { label: "Wikipedia — Reticular formation (the RAS)", url: "https://en.wikipedia.org/wiki/Reticular_formation" },
      { label: "Wikipedia — Default mode network", url: "https://en.wikipedia.org/wiki/Default_mode_network" },
      { label: "Wikipedia — Neuroplasticity", url: "https://en.wikipedia.org/wiki/Neuroplasticity" },
      { label: "Harvard Health — Dopamine fasting: what the science actually says", url: "https://www.health.harvard.edu/blog/dopamine-fasting-misunderstanding-science-spawns-a-maladaptive-fad-2020022618917" },
      { label: "Original post (7 things…)", url: "https://www.instagram.com/p/DeUZe9Sicxp/" },
    ],
  },
  {
    id: "psy-manip", group: "psych", emoji: "🚩", title: "2. Manipulation tactics (spot & defend)",
    why: "Learn these as red flags so you can recognise them in relationships, friends or at work, and protect yourself.",
    points: ["Blame shifting", "Triangulation", "Gaslighting", "Love bombing", "Silent treatment", "Victim playing"],
    links: [
      { label: "Wikipedia — Gaslighting", url: "https://en.wikipedia.org/wiki/Gaslighting" },
      { label: "Wikipedia — Love bombing", url: "https://en.wikipedia.org/wiki/Love_bombing" },
      { label: "Wikipedia — Triangulation (psychology)", url: "https://en.wikipedia.org/wiki/Triangulation_(psychology)" },
      { label: "Wikipedia — Silent treatment", url: "https://en.wikipedia.org/wiki/Silent_treatment" },
      { label: "YouTube: How to recognise manipulation tactics", url: "https://www.youtube.com/results?search_query=how+to+recognize+manipulation+tactics+psychologist", type: "youtube" },
      { label: "YouTube: In Sheep's Clothing (George K. Simon) summary", url: "https://www.youtube.com/results?search_query=In+Sheep%27s+Clothing+George+Simon+summary", type: "youtube" },
    ],
  },
  {
    id: "psy-bias", group: "psych", emoji: "🎭", title: "3. “Dark psychology” = cognitive biases",
    why: "These are well-researched mental shortcuts everyone has. Knowing them makes you a sharper thinker and harder to fool.",
    points: ["Halo effect", "Confirmation bias", "Cognitive dissonance", "Sunk cost fallacy", "Foot-in-the-door technique"],
    links: [
      { label: "Wikipedia — Halo effect", url: "https://en.wikipedia.org/wiki/Halo_effect" },
      { label: "Wikipedia — Confirmation bias", url: "https://en.wikipedia.org/wiki/Confirmation_bias" },
      { label: "Wikipedia — Cognitive dissonance", url: "https://en.wikipedia.org/wiki/Cognitive_dissonance" },
      { label: "Wikipedia — Sunk cost", url: "https://en.wikipedia.org/wiki/Sunk_cost" },
      { label: "Wikipedia — Foot-in-the-door technique", url: "https://en.wikipedia.org/wiki/Foot-in-the-door_technique" },
      { label: "Book: Influence — Robert Cialdini", url: "https://en.wikipedia.org/wiki/Influence:_Science_and_Practice" },
      { label: "Book: Thinking, Fast and Slow — Daniel Kahneman", url: "https://en.wikipedia.org/wiki/Thinking,_Fast_and_Slow" },
      { label: "YouTube: Cognitive biases explained", url: "https://www.youtube.com/results?search_query=cognitive+biases+explained+TED-Ed", type: "youtube" },
    ],
  },
  {
    id: "psy-power", group: "psych", emoji: "♟️", title: "4. Laws of power",
    why: "From Robert Greene's book. Useful for understanding office politics; read it critically, as some laws are cynical.",
    points: ["Never outshine the master", "Say less than necessary", "Make people come to you", "Master the art of timing", "Control the frame"],
    links: [
      { label: "Wikipedia — The 48 Laws of Power", url: "https://en.wikipedia.org/wiki/The_48_Laws_of_Power" },
      { label: "YouTube: 48 Laws of Power summary", url: "https://www.youtube.com/results?search_query=48+laws+of+power+book+summary", type: "youtube" },
    ],
  },
  {
    id: "psy-comm", group: "psych", emoji: "🗣️", title: "5. Communication superpowers",
    why: "Calm, confident communication: great for interviews, negotiations and arguments.",
    points: ["Mirroring", "Strategic silence", "Socratic questioning", "Power of pause", "Never explain too much"],
    links: [
      { label: "Book: Never Split the Difference — Chris Voss (mirroring, pauses)", url: "https://en.wikipedia.org/wiki/Never_Split_the_Difference" },
      { label: "Wikipedia — Mirroring (psychology)", url: "https://en.wikipedia.org/wiki/Mirroring_(psychology)" },
      { label: "Wikipedia — Socratic questioning", url: "https://en.wikipedia.org/wiki/Socratic_questioning" },
      { label: "YouTube: Chris Voss on mirroring & labelling", url: "https://www.youtube.com/results?search_query=Chris+Voss+mirroring+labeling+negotiation", type: "youtube" },
    ],
  },
  {
    id: "psy-manifest", group: "psych", emoji: "✨", title: "6. “Manifesting”: the real science behind it",
    why: "Manifesting itself isn't science, but the ideas behind it are real: self-image shapes behaviour, and beliefs can become self-fulfilling.",
    points: ["Self-image controls your life", "Subconscious doesn't know jokes", "Your nervous system must feel safe to receive", "You manifest what you ARE, not what you want"],
    links: [
      { label: "Wikipedia — Self-fulfilling prophecy", url: "https://en.wikipedia.org/wiki/Self-fulfilling_prophecy" },
      { label: "Wikipedia — Self-concept", url: "https://en.wikipedia.org/wiki/Self-concept" },
      { label: "Book: Psycho-Cybernetics — Maxwell Maltz (self-image)", url: "https://en.wikipedia.org/wiki/Psycho-Cybernetics" },
      { label: "YouTube: Identity-based habits (Atomic Habits)", url: "https://www.youtube.com/results?search_query=identity+based+habits+atomic+habits+james+clear", type: "youtube" },
    ],
  },
  {
    id: "psy-detach", group: "psych", emoji: "🧊", title: "7. Detachment psychology",
    why: "Ways to protect your peace around draining or toxic people without getting pulled into drama.",
    points: ["Emotional withholding", "Strategic silence", "Grey rocking", "Detached empathy", "Reverse hoover"],
    links: [
      { label: "Healthline — The grey rock method", url: "https://www.healthline.com/health/grey-rock" },
      { label: "Wikipedia — Emotional detachment", url: "https://en.wikipedia.org/wiki/Emotional_detachment" },
      { label: "Wikipedia — Empathy (cognitive vs emotional)", url: "https://en.wikipedia.org/wiki/Empathy" },
      { label: "YouTube: What is hoovering in toxic relationships", url: "https://www.youtube.com/results?search_query=what+is+hoovering+narcissist+psychologist", type: "youtube" },
    ],
  },

  // ---- From reel: APIs (also useful for RRB JE / GATE CS networking topics)
  {
    id: "api-what", group: "api", emoji: "🔌", title: "What is an API?",
    why: "APIs are how apps talk to each other: every login, payment and weather widget uses one. A must-know for any CS/IT role.",
    links: [
      { label: "IBM Technology — What is a REST API? (short)", url: "https://www.youtube.com/watch?v=lsMQRaeKNDk" },
      { label: "AWS — What is an API?", url: "https://aws.amazon.com/what-is/api/" },
      { label: "MDN — Introduction to web APIs", url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Client-side_APIs/Introduction" },
      { label: "Original reel", url: "https://www.instagram.com/p/Dd3i5axT07I/" },
    ],
  },
  {
    id: "api-types", group: "api", emoji: "🧬", title: "Types of APIs: REST, GraphQL, WebSocket, gRPC, SOAP, Webhooks",
    why: "Each style suits a different job, for example live chat (WebSocket), flexible data (GraphQL) or fast microservices (gRPC).",
    links: [
      { label: "ByteByteGo — Cheatsheet comparing API styles", url: "https://bytebytego.com/guides/a-cheatsheet-on-comparing-api-architectural-styles" },
      { label: "GraphQL — official Learn guide", url: "https://graphql.org/learn/" },
      { label: "YouTube: ByteByteGo — API architecture styles", url: "https://www.youtube.com/results?search_query=ByteByteGo+API+architecture+styles", type: "youtube" },
    ],
  },
  {
    id: "api-rest", group: "api", emoji: "🛠️", title: "REST APIs in about an hour",
    why: "Learn GET/POST/PUT/DELETE, status codes and JSON by actually building and calling an API.",
    links: [
      { label: "Fireship — RESTful APIs in 100 seconds (warm-up)", url: "https://www.youtube.com/watch?v=-MTSQjw5DrM" },
      { label: "Programming with Mosh — Build a REST API with Node.js & Express", url: "https://www.youtube.com/watch?v=pKd0Rpw7O48" },
      { label: "freeCodeCamp — APIs for Beginners (full course)", url: "https://www.youtube.com/watch?v=GZvSYJDk-us" },
      { label: "restfulapi.net — REST concepts explained", url: "https://restfulapi.net/" },
    ],
  },
  {
    id: "api-design", group: "api", emoji: "🏗️", title: "API design & architecture",
    why: "How pros design clean, versioned, secure APIs. Great for interviews and real projects.",
    links: [
      { label: "Microsoft — RESTful web API design best practices", url: "https://learn.microsoft.com/en-us/azure/architecture/best-practices/api-design" },
      { label: "YouTube: API design best practices", url: "https://www.youtube.com/results?search_query=REST+API+design+best+practices", type: "youtube" },
    ],
  },
  {
    id: "sysdesign", group: "api", emoji: "🏛️", title: "System design in 6 videos (watch in order)",
    why: "A roadmap from the core concepts to building a real system. Great for backend interviews, and it overlaps with GATE CS networks/DBMS.",
    points: ["1. The 8 core concepts", "2. 20 concepts in 10 min", "3. 30 concepts, clearly", "4. Learning roadmap (HLD vs LLD)", "5. Every type of API", "6. Design it with a builder"],
    links: [
      { label: "1. ByteByteGo — 8 Most Important System Design Concepts", url: "https://www.youtube.com/watch?v=BTjxUS_PylA" },
      { label: "2. NeetCode — 20 System Design Concepts in 10 Minutes", url: "https://www.youtube.com/watch?v=i53Gi_K3o7I" },
      { label: "3. Ashish Pratap Singh — 30 System Design Concepts", url: "https://www.youtube.com/watch?v=s9Qh9fWeOAk" },
      { label: "4. YouTube: Complete system design roadmap (HLD & LLD)", url: "https://www.youtube.com/results?search_query=Complete+System+Design+roadmap+HLD+LLD", type: "youtube" },
      { label: "5. YouTube: Every type of API explained (Priyanka Vergadia)", url: "https://www.youtube.com/results?search_query=Priyanka+Vergadia+every+type+of+API+explained", type: "youtube" },
      { label: "6. YouTube: Master system design by building one", url: "https://www.youtube.com/results?search_query=Master+System+Design+build+from+scratch", type: "youtube" },
      { label: "Original post (comment \"system\" there to get the exact links)", url: "https://www.instagram.com/p/DeHptL9Bgfh/" },
    ],
  },
  // ---- From post: "9 subjects women are dangerously under-educated on"
  {
    id: "sub-nervous", group: "mind", emoji: "🫀", title: "Nervous system regulation",
    why: "You can't out-perform a stressed, dysregulated body. Learn how stress builds up in your body and how to release it (sleep, movement, breathing).",
    points: ["📚 Burnout — Emily & Amelia Nagoski", "Stress cycle", "Fight/flight vs rest/digest"],
    links: [
      { label: "Book: Burnout — Emily & Amelia Nagoski (Goodreads)", url: "https://www.goodreads.com/search?q=Burnout+Emily+Nagoski" },
      { label: "Wikipedia — Autonomic nervous system", url: "https://en.wikipedia.org/wiki/Autonomic_nervous_system" },
      { label: "YouTube: Emily Nagoski — completing the stress cycle", url: "https://www.youtube.com/results?search_query=Emily+Nagoski+complete+the+stress+cycle", type: "youtube" },
      { label: "Original post (9 subjects…)", url: "https://www.instagram.com/p/DeOrJFZiBfQ/" },
    ],
  },
  {
    id: "sub-resilience", group: "mind", emoji: "🌱", title: "Emotional resilience",
    why: "Feel deeply without letting it break you: bounce back and stay steady in a chaotic world. Handy during exam stress!",
    points: ["📚 Daring Greatly — Brené Brown", "Bouncing back", "Vulnerability = courage"],
    links: [
      { label: "Book: Daring Greatly — Brené Brown", url: "https://en.wikipedia.org/wiki/Daring_Greatly" },
      { label: "TED — Brené Brown: The power of vulnerability", url: "https://www.ted.com/talks/brene_brown_the_power_of_vulnerability" },
      { label: "Wikipedia — Psychological resilience", url: "https://en.wikipedia.org/wiki/Psychological_resilience" },
      { label: "Original post (9 subjects…)", url: "https://www.instagram.com/p/DeOrJFZiBfQ/" },
    ],
  },
  {
    id: "sub-neuro", group: "psych", emoji: "🔁", title: "Neuroplasticity: rewire your brain",
    why: "Your brain physically rewires itself based on what you repeat every day. So what are you training it for?",
    points: ["📚 The Woman Who Changed Her Brain — Barbara Arrowsmith-Young", "Repetition builds the brain"],
    links: [
      { label: "Book: The Woman Who Changed Her Brain (Goodreads)", url: "https://www.goodreads.com/search?q=The+Woman+Who+Changed+Her+Brain" },
      { label: "Wikipedia — Barbara Arrowsmith-Young", url: "https://en.wikipedia.org/wiki/Barbara_Arrowsmith-Young" },
      { label: "YouTube: Barbara Arrowsmith-Young TEDx talk", url: "https://www.youtube.com/results?search_query=Barbara+Arrowsmith-Young+TEDx", type: "youtube" },
      { label: "See also: 🧠 1. Learn about your brain (above)", url: "https://en.wikipedia.org/wiki/Neuroplasticity" },
      { label: "Original post (9 subjects…)", url: "https://www.instagram.com/p/DeOrJFZiBfQ/" },
    ],
  },
  {
    id: "sub-negotiate", group: "psych", emoji: "🤝", title: "Negotiation & persuasion",
    why: "Stop accepting what you're given and start asking for what you're worth. Useful for salary talks and job offers.",
    points: ["📚 Ask For It — Linda Babcock & Sara Laschever", "Ask for your worth"],
    links: [
      { label: "Book: Ask For It — Babcock & Laschever (Goodreads)", url: "https://www.goodreads.com/search?q=Ask+For+It+Linda+Babcock" },
      { label: "Book: Never Split the Difference — Chris Voss", url: "https://en.wikipedia.org/wiki/Never_Split_the_Difference" },
      { label: "YouTube: How to negotiate your salary", url: "https://www.youtube.com/results?search_query=how+to+negotiate+salary+tips", type: "youtube" },
      { label: "Original post (9 subjects…)", url: "https://www.instagram.com/p/DeOrJFZiBfQ/" },
    ],
  },
  {
    id: "sub-power", group: "psych", emoji: "👑", title: "The psychology of power",
    why: "Understand how influence and power dynamics work, so you're a player and not just an observer.",
    points: ["📚 Women & Power — Mary Beard", "Architecture of influence"],
    links: [
      { label: "Book: Women & Power — Mary Beard (Goodreads)", url: "https://www.goodreads.com/search?q=Women+%26+Power+Mary+Beard" },
      { label: "YouTube: Mary Beard — Women in Power lecture", url: "https://www.youtube.com/results?search_query=Mary+Beard+women+in+power+lecture", type: "youtube" },
      { label: "See also: ♟️ 4. Laws of power (above)", url: "https://en.wikipedia.org/wiki/The_48_Laws_of_Power" },
      { label: "Original post (9 subjects…)", url: "https://www.instagram.com/p/DeOrJFZiBfQ/" },
    ],
  },
  {
    id: "sub-biases", group: "psych", emoji: "🪤", title: "Cognitive biases: your brain's traps",
    why: "Your brain fools you every day, even your memories can be false. Know the traps and you become very hard to manipulate.",
    points: ["📚 The Memory Illusion — Dr. Julia Shaw", "False memories"],
    links: [
      { label: "Book: The Memory Illusion — Julia Shaw (Goodreads)", url: "https://www.goodreads.com/search?q=The+Memory+Illusion+Julia+Shaw" },
      { label: "YouTube: Julia Shaw on false memories", url: "https://www.youtube.com/results?search_query=Julia+Shaw+false+memories", type: "youtube" },
      { label: "Wikipedia — List of cognitive biases", url: "https://en.wikipedia.org/wiki/List_of_cognitive_biases" },
      { label: "Original post (9 subjects…)", url: "https://www.instagram.com/p/DeOrJFZiBfQ/" },
    ],
  },
  {
    id: "sub-wealth", group: "finance", emoji: "💎", title: "Wealth psychology",
    why: "It's not just budgeting. It's dropping the scarcity mindset; financial independence is self-respect.",
    points: ["📚 We Should All Be Millionaires — Rachel Rodgers", "📚 The Psychology of Money — Morgan Housel", "Scarcity vs abundance mindset"],
    links: [
      { label: "Book: We Should All Be Millionaires — Rachel Rodgers (Goodreads)", url: "https://www.goodreads.com/search?q=We+Should+All+Be+Millionaires" },
      { label: "Book: The Psychology of Money — Morgan Housel", url: "https://en.wikipedia.org/wiki/The_Psychology_of_Money" },
      { label: "YouTube: The Psychology of Money summary", url: "https://www.youtube.com/results?search_query=psychology+of+money+morgan+housel+summary", type: "youtube" },
      { label: "Original post (9 subjects…)", url: "https://www.instagram.com/p/DeOrJFZiBfQ/" },
    ],
  },
  {
    id: "sub-geo", group: "world", emoji: "🗺️", title: "Geopolitics",
    why: "A few people quietly decide the fate of the world. Understanding geopolitics explains why events happen the way they do.",
    points: ["📚 The Silk Road: A New History — Valerie Hansen", "📚 Prisoners of Geography — Tim Marshall", "Trade routes & power"],
    links: [
      { label: "Book: The Silk Road: A New History — Valerie Hansen (Goodreads)", url: "https://www.goodreads.com/search?q=The+Silk+Road+A+New+History+Valerie+Hansen" },
      { label: "Book: Prisoners of Geography — Tim Marshall (easy starter)", url: "https://en.wikipedia.org/wiki/Prisoners_of_Geography" },
      { label: "Wikipedia — Geopolitics", url: "https://en.wikipedia.org/wiki/Geopolitics" },
      { label: "CaspianReport — geopolitics explained (YouTube)", url: "https://www.youtube.com/@CaspianReport" },
      { label: "Original post (9 subjects…)", url: "https://www.instagram.com/p/DeOrJFZiBfQ/" },
    ],
  },
  {
    id: "sub-ai", group: "api", emoji: "🤖", title: "Artificial intelligence",
    why: "If you don't understand AI, you'll spend your life working for people who do. Learn how it works and its real-world costs.",
    points: ["📚 Atlas of AI — Kate Crawford", "How neural networks learn", "AI's impact on society"],
    links: [
      { label: "Book: Atlas of AI — Kate Crawford", url: "https://en.wikipedia.org/wiki/Atlas_of_AI" },
      { label: "3Blue1Brown — But what is a neural network?", url: "https://www.youtube.com/watch?v=aircAruvnKk" },
      { label: "Elements of AI — free beginner course", url: "https://www.elementsofai.com/" },
      { label: "Original post (9 subjects…)", url: "https://www.instagram.com/p/DeOrJFZiBfQ/" },
    ],
  },
];
