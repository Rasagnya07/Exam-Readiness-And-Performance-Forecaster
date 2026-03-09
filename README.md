# Exam-Readiness-And-Performance-Forecaster (ERPF)

> A client-side web app that helps students track attendance, syllabus completion, and time remaining before exams — and calculates a personalized readiness score.

<br/>

## Live Demo

Open `index.html` in any browser — no installation or server required.

<br/>

## About the Project

**Exam-Readiness-And-Performance-Forecaster (ERPF)** is a browser-based exam readiness forecasting tool built as part of the **Project Based Learning from FWD** module at **KLH University, Bachupally**.

Students enter their exam date, subjects, topics, and attendance data. EduPulse applies a weighted formula to calculate how prepared they are — and gives actionable recommendations for each subject.

**No backend. No frameworks. No external libraries.**  
Pure HTML, CSS, and JavaScript — running entirely in the browser.

<br/>

## Features

- **Login & Signup** — client-side authentication stored in localStorage
- **Exam Setup** — set your exam date and number of subjects
- **Subject & Topic Entry** — add subjects with topic lists per subject
- **Topic Sliders** — drag sliders to mark how much of each topic is done
- **Readiness Score** — weighted formula calculates your overall score
- **Live Countdown** — real-time days and hours counter to exam day
- **Recommendations** — subject-level advice based on your score
- **Progress Persistence** — saves your data using localStorage so nothing is lost on refresh
- **Responsive Design** — works on desktop, tablet, and mobile

<br/>

## Readiness Formula

```
Readiness Score = (Attendance × 0.35) + (Syllabus % × 0.45) + (Time Factor × 0.20)
```

| Days Until Exam | Time Factor |
|-----------------|-------------|
| More than 60 days | 100 |
| 31 – 60 days | 80 |
| 16 – 30 days | 60 |
| 15 days or less | 40 |

| Score Range | Level | Meaning |
|-------------|-------|---------|
| 70 and above | High | On track |
| 50 – 69 | Medium | Needs more focus |
| Below 50 | Low | Critical attention needed |

<br/>

## Project Structure

```
EduPulse_FWD/
│
├── index.html        # Login and Signup page
├── dashboard.html    # Main 4-step dashboard
├── style.css         # All styles (Flexbox, Grid, animations, responsive)
├── auth.js           # Login, signup, validation logic
├── dashboard.js      # Steps, sliders, readiness calculation, DOM updates
├── logo.png          # App logo
│
└── dsa/
    ├── dsa.js        # DSA concepts in JavaScript (console output)
    └── dsa.html      # Open in browser to run DSA — view output in Console (F12)
```

<br/>

## System Architecture

```
Student (Browser)
       ↓
User Interface  (HTML + CSS)
       ↓
Client-Side Logic  (JavaScript)
       ↓
Readiness Calculation Engine  (JS)
  Attendance × 0.35 + Syllabus × 0.45 + Time Factor × 0.20
       ↓
Result Rendering  (DOM Manipulation + setInterval)
       ↓
localStorage  —  Data Persistence
```

<br/>

## CO-Wise Implementation

| CO | Topic | Implementation in EduPulse |
|----|-------|----------------------------|
| CO1 | HTML & Introductory CSS | Semantic tags, meta tags, external stylesheet, Google Fonts, CSS custom properties |
| CO2 | Forms, Layout & Responsiveness | `<fieldset>`, `<legend>`, `<nav>`, `<aside>`, CSS Grid, Flexbox, pseudo-classes, pseudo-elements, media queries, transitions, animations |
| CO3 | JavaScript Essentials | Functions, objects, for loops, arrays, if/else — no array methods used |
| CO4 | DOM & Events | Dynamic DOM building, `onclick`, `onsubmit`, `setInterval` countdown, localStorage CRUD |
| CO5 | SEO & Validation | Meta description/keywords, `type` attributes, `required`, `minlength`, ARIA labels |

<br/>

## DSA Sub-folder (`dsa/`)

The `dsa/` folder contains JavaScript implementations of all DSA concepts from the syllabus, applied to EduPulse subject data.

**To run:**
- **Browser:** Open `dsa/dsa.html` → Press `F12` → Go to Console tab
- **Terminal:** `node dsa/dsa.js`

**Concepts covered:**

| Category | Topics |
|----------|--------|
| Algorithm Analysis | Big-O notation, running time — O(n), O(log n), O(n²), O(n log n) |
| Searching | Linear Search, Binary Search |
| Sorting | Bubble, Insertion, Selection, Merge, Quick Sort |
| Lists | Array ADT, Singly Linked List, Polynomial ADT |
| Stacks | Stack ADT, Balanced Symbols, Infix to Postfix |
| Queues | Queue ADT, Circular Queue, Dequeue |
| Hashing | Hash Function, Separate Chaining, Open Addressing |

<br/>

## How to Run

1. Download or clone this repository
2. Open `index.html` in any modern browser (Chrome, Firefox, Edge)
3. Sign up with any email and password
4. Follow the 4-step dashboard to get your readiness score

```bash
# Clone the repo
git clone https://github.com/your-username/EduPulse.git

# Open in browser
cd EduPulse_FWD
open index.html       # macOS
start index.html      # Windows
xdg-open index.html   # Linux
```

<br/>

## 🛠️ Built With

| Technology | Purpose |
|------------|---------|
| HTML5 | Page structure and semantic markup |
| CSS3 | Styling, layout (Grid + Flexbox), animations |
| JavaScript (ES5) | Logic, DOM manipulation, localStorage |
| Google Fonts | Cormorant Garamond + Plus Jakarta Sans |
| localStorage API | Client-side data persistence |

<br/>

## 📋 localStorage Keys

| Key | Stores |
|-----|--------|
| `edupulse_users` | Array of all registered users |
| `edupulse_loggedin` | Boolean — whether a user is logged in |
| `edupulse_currentUser` | Currently logged-in user's name |
| `edupulse_progress` | Dashboard step data and subject entries |

<br/>

## Author

**Rasagnya Machanavajhala**  
Roll No: `2520090018`  
Cluster: `2`  
FWD Section: `6`  
KLH University, Bachupally  

<br/>

## 📄 License

This project was built for academic purposes as part of the FWD curriculum at KLH University.
