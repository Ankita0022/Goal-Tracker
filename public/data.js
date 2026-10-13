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
    id: "sscje", name: "SSC JE", kind: "Exam", date: "2026-11-02", tentative: true,
    note: "SSC JE has no CS paper (only Civil / Electrical / Mechanical). Edit the Technical topics in data.js to match the paper you actually applied for.",
    sections: {
      "General Intelligence & Reasoning": ["Revise RRB reasoning error log", "Analogy, classification, series", "Coding-decoding, blood relations, direction", "Syllogism & logical deduction", "Non-verbal reasoning"],
      "General Awareness": ["Current affairs refresh", "Static GK, polity, history", "Geography & economy", "General science"],
      "Technical (Part A)": ["Technical topic 1 — edit me", "Technical topic 2 — edit me", "Technical topic 3 — edit me"],
      "Practice": ["SSC JE PYQ 2023", "SSC JE PYQ 2024", "Full mock 1", "Full mock 2"],
    },
  },
  {
    id: "chsl", name: "SSC CHSL (10+2)", kind: "Exam", date: "2026-11-30",
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

// Study phases. Each phase has a daily timetable. Dates inclusive.
const PHASES = [
  {
    from: "2026-10-13", to: "2026-10-19", title: "RRB JE sprint + finish UI/UX course",
    slots: [
      ["06:00–08:00", "RRB Maths (1 topic + 30 questions)"],
      ["08:30–10:30", "RRB Technical CS (1 subject)"],
      ["11:00–12:30", "UI/UX course modules"],
      ["14:00–15:30", "Reasoning practice"],
      ["16:00–17:00", "GA + Science (current affairs)"],
      ["18:00–19:30", "UI/UX project / quiz"],
      ["21:00–21:30", "Revise error log & plan tomorrow"],
    ],
  },
  {
    from: "2026-10-20", to: "2026-10-26", title: "RRB JE final week — mocks & revision",
    slots: [
      ["06:00–08:00", "Full mock test (timed)"],
      ["08:30–10:00", "Analyse mock, update error log"],
      ["10:30–12:30", "Technical CS weak areas"],
      ["14:00–15:30", "Maths weak areas"],
      ["16:00–17:00", "Reasoning sectional"],
      ["17:30–18:30", "GA + Science revision"],
      ["21:00–21:30", "Short-notes revision"],
    ],
  },
  { from: "2026-10-27", to: "2026-10-27", title: "RRB JE exam day 🎯", slots: [["", "Light revision, reach centre early. All the best!"]] },
  {
    from: "2026-10-28", to: "2026-11-01", title: "SSC JE switch-over",
    slots: [
      ["06:00–08:00", "SSC JE technical part"],
      ["08:30–10:00", "SSC JE PYQ"],
      ["11:00–12:30", "Reasoning (reuse RRB prep)"],
      ["14:00–15:30", "Technical part"],
      ["16:00–17:00", "GA revision"],
      ["21:00–21:30", "Revise notes"],
    ],
  },
  { from: "2026-11-02", to: "2026-11-06", title: "SSC JE exam window 🎯", slots: [["", "Before your slot: light revision only. Other days: CHSL English (1h) + rest."]] },
  {
    from: "2026-11-07", to: "2026-11-29", title: "SSC CHSL main prep + GATE start",
    slots: [
      ["06:00–08:00", "Quant (1 topic + practice)"],
      ["08:30–10:00", "English (grammar + vocab)"],
      ["10:30–11:30", "Reasoning"],
      ["14:00–15:00", "General Awareness"],
      ["15:30–17:30", "GATE: 1 core subject (start with Maths + DS)"],
      ["18:00–19:00", "CHSL sectional / mock (alternate days full mock)"],
      ["21:00–21:30", "Vocab + error log"],
    ],
  },
  {
    from: "2026-11-30", to: "2026-12-31", title: "CHSL exam window + GATE core",
    slots: [
      ["06:00–09:00", "GATE core subject"],
      ["09:30–11:00", "CHSL mock / revision (until your slot)"],
      ["14:00–16:30", "GATE core subject + PYQs"],
      ["17:00–18:00", "GATE General Aptitude"],
      ["21:00–21:30", "Short notes"],
    ],
  },
  {
    from: "2027-01-01", to: "2027-01-25", title: "GATE: finish syllabus + PYQs",
    slots: [
      ["06:00–09:00", "Remaining core subject"],
      ["09:30–12:00", "Subject-wise PYQs"],
      ["14:00–16:00", "Engineering Maths"],
      ["16:30–18:00", "Test series (subject tests)"],
      ["21:00–21:30", "Short notes"],
    ],
  },
  {
    from: "2027-01-26", to: "2027-02-14", title: "GATE: full mocks & revision",
    slots: [
      ["09:30–12:30", "Full-length mock (exam timing)"],
      ["14:00–16:00", "Mock analysis"],
      ["16:30–18:30", "Revise weak subjects"],
      ["21:00–21:30", "Formula sheet"],
    ],
  },
];
