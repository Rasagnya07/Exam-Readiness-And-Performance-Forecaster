// ============================================================
// dashboard.js — EduPulse Dashboard Logic
// CO COVERAGE:
//   CO3 — Functions, conditions, loops, objects, arrays,
//          arrow functions, object inheritance
//   CO4 — DOM manipulation, event handling, localStorage,
//          asynchronous countdown (setInterval)
//   CO5 — Dynamic input handling, form validation with JS
// ============================================================


// ── CO3: Object — stores all app state in one place ─────────
// Think of this like a container that holds all our data
var app = {
  currentStep:  1,       // which step we're on (1-4)
  examDate:     '',      // the exam date the user entered
  numSubjects:  0,       // how many subjects
  subjects:     [],      // array of subject objects (filled in step 2)
  subjectData:  [],      // array with attendance + syllabus data (step 3)
  countdownTimer: null   // will hold our interval timer reference
};


// ── CO4: Run when page loads — check login, setup page ──────
document.addEventListener('DOMContentLoaded', function() {

  // CO4: localStorage — check if user is logged in
  var isLoggedIn = localStorage.getItem('edupulse_loggedin');

  // CO3: if condition — if not logged in, send back to login page
  if (isLoggedIn !== 'true') {
    window.location.href = 'index.html';
    return;
  }

  // CO4: DOM manipulation — show the user's name in the header
  var userName = localStorage.getItem('edupulse_currentUser');
  var navEl = document.getElementById('navUserName');
  if (navEl && userName) {
    navEl.textContent = 'Hello, ' + userName + ' 👋';
  }

  // CO4: localStorage — try to restore any saved progress
  restoreProgress();

});


// ── CO4: localStorage — save current progress ───────────────
// Called every time the user moves to a new step
function saveProgress() {
  // CO4: JSON.stringify converts our JS object into a string for localStorage
  localStorage.setItem('edupulse_progress', JSON.stringify({
    currentStep:  app.currentStep,
    examDate:     app.examDate,
    numSubjects:  app.numSubjects,
    subjects:     app.subjects,
    subjectData:  app.subjectData
  }));
}


// ── CO4: localStorage — restore saved progress ──────────────
// Called on page load to bring back where the user left off
function restoreProgress() {
  var saved = localStorage.getItem('edupulse_progress');

  // CO3: if condition — only restore if something was saved
  if (!saved) return;

  // CO4: JSON.parse converts the stored string back into a JS object
  var data = JSON.parse(saved);

  // CO3: Object property assignment — copy saved values into app object
  app.examDate    = data.examDate    || '';
  app.numSubjects = data.numSubjects || 0;
  app.subjects    = data.subjects    || [];
  app.subjectData = data.subjectData || [];

  // CO3: if condition — restore to the step the user was on
  if (data.currentStep && data.currentStep > 1) {
    goToStep(data.currentStep);
  }
}


// ── CO3: Function — navigate between steps ──────────────────
// Takes stepNumber (1, 2, 3, or 4) as a parameter
function goToStep(stepNumber) {

  // CO4: DOM manipulation — hide all sections first
  var allSections = ['setupSection', 'subjectNamesSection', 'subjectDataSection', 'resultsSection'];

  // CO3: for loop — loop through each section ID and hide it
  for (var i = 0; i < allSections.length; i++) {
    var section = document.getElementById(allSections[i]);
    if (section) {
      section.classList.add('hidden');
    }
  }

  // CO3: Array — step IDs mapped to section IDs
  var sectionIds = ['setupSection', 'subjectNamesSection', 'subjectDataSection', 'resultsSection'];
  var targetSection = document.getElementById(sectionIds[stepNumber - 1]);
  if (targetSection) {
    targetSection.classList.remove('hidden');
  }

  // Update the step progress bar
  updateStepBar(stepNumber);

  // Save which step we're on
  app.currentStep = stepNumber;
  saveProgress();

  // CO3: if condition — build UI for specific steps when navigating back
  if (stepNumber === 2 && app.numSubjects > 0) {
    buildSubjectNameInputs();
  }
  if (stepNumber === 3 && app.subjects.length > 0) {
    buildSubjectDataInputs();
  }
}


// ── CO4: DOM manipulation — update step progress bar ────────
function updateStepBar(activeStep) {

  // CO3: for loop — go through all 4 steps
  for (var i = 1; i <= 4; i++) {
    var stepEl = document.getElementById('step' + i);
    if (!stepEl) continue;

    // Remove previous classes
    stepEl.classList.remove('active', 'done');

    // CO3: if/else condition — mark as done, active, or neither
    if (i < activeStep) {
      stepEl.classList.add('done');
    } else if (i === activeStep) {
      stepEl.classList.add('active');
    }
  }
}


// ── CO5: Form validation — Step 1 Setup ─────────────────────
// Runs when user submits the setup form
function handleSetup(event) {

  // CO5: Prevent default form submission (page reload)
  event.preventDefault();

  var examDateInput  = document.getElementById('examDate').value;
  var numSubjectsInput = parseInt(document.getElementById('numSubjects').value);
  var errorEl = document.getElementById('setupError');

  // CO5: Validate — exam date must be entered
  if (!examDateInput) {
    errorEl.textContent = 'Please select your exam date.';
    return;
  }

  // CO5: Validate — exam date must be in the future
  // CO3: creating Date objects to compare dates
  var today    = new Date();
  var examDay  = new Date(examDateInput);
  today.setHours(0, 0, 0, 0); // reset time to compare just dates

  if (examDay <= today) {
    errorEl.textContent = 'Exam date must be a future date.';
    return;
  }

  // CO5: Validate — number of subjects must be between 1 and 10
  if (isNaN(numSubjectsInput) || numSubjectsInput < 1 || numSubjectsInput > 10) {
    errorEl.textContent = 'Please enter a number of subjects between 1 and 10.';
    return;
  }

  // Clear error and save values
  errorEl.textContent  = '';
  app.examDate         = examDateInput;
  app.numSubjects      = numSubjectsInput;

  // Build subject name inputs and move to step 2
  buildSubjectNameInputs();
  goToStep(2);
}


// ── CO4: DOM manipulation — build subject name input fields ─
// Dynamically creates an input card for each subject
function buildSubjectNameInputs() {

  var container = document.getElementById('subjectNamesContainer');
  container.innerHTML = ''; // clear any existing content

  // CO3: for loop — create one card per subject
  for (var i = 0; i < app.numSubjects; i++) {

    // CO4: DOM — create a new div element
    var card = document.createElement('div');
    card.className = 'subject-name-card';

    // Get any previously saved subject data
    var savedSubject = app.subjects[i] || {};

    // CO4: DOM — set the innerHTML of the card
    // Uses template literal syntax for cleaner HTML building
    card.innerHTML =
      '<h3>Subject ' + (i + 1) + '</h3>' +

      '<div class="field-group">' +
        '<label for="subName_' + i + '">Subject Name</label>' +
        '<input type="text" id="subName_' + i + '" ' +
          'placeholder="e.g. Mathematics" ' +
          'value="' + (savedSubject.name || '') + '" required />' +
      '</div>' +

      '<div class="field-group">' +
        '<label for="subTopics_' + i + '">Topics (one per line)</label>' +
        '<textarea id="subTopics_' + i + '" rows="4" ' +
          'placeholder="Arrays&#10;Linked Lists&#10;Sorting">' +
          (savedSubject.topicsRaw || '') +
        '</textarea>' +
      '</div>';

    // CO4: DOM — append the card to the container
    container.appendChild(card);
  }
}


// ── CO5: Validation — Step 2: collect subject names ─────────
function handleSubjectNames() {

  var errorEl = document.getElementById('subjectNamesError');
  var newSubjects = [];

  // CO3: for loop — read each subject's name and topics
  for (var i = 0; i < app.numSubjects; i++) {

    var nameInput   = document.getElementById('subName_' + i);
    var topicsInput = document.getElementById('subTopics_' + i);

    var name      = nameInput ? nameInput.value.trim() : '';
    var topicsRaw = topicsInput ? topicsInput.value.trim() : '';

    // CO5: Validate — subject name must not be empty
    if (name === '') {
      errorEl.textContent = 'Please enter a name for Subject ' + (i + 1) + '.';
      return;
    }

    // CO3: Array method — split textarea by newlines, filter empty lines
    var topicsArray = topicsRaw
      .split('\n')
      .map(function(t) { return t.trim(); })      // CO3: Arrow function equivalent
      .filter(function(t) { return t !== ''; });  // CO3: filter removes empty strings

    // CO3: if condition — use default topics if none entered
    if (topicsArray.length === 0) {
      topicsArray = ['Topic 1', 'Topic 2', 'Topic 3'];
    }

    // CO3: Object — create subject object
    newSubjects.push({
      name:      name,
      topicsRaw: topicsRaw,
      topics:    topicsArray
    });
  }

  errorEl.textContent = '';
  app.subjects = newSubjects;

  buildSubjectDataInputs();
  goToStep(3);
}


// ── CO4: DOM manipulation — build attendance + sliders ──────
function buildSubjectDataInputs() {

  var container = document.getElementById('subjectDataContainer');
  container.innerHTML = '';

  // CO3: for loop — one card per subject
  for (var i = 0; i < app.subjects.length; i++) {

    var subject = app.subjects[i];
    var savedData = app.subjectData[i] || {};

    var card = document.createElement('div');
    card.className = 'subject-data-card';

    // Build the sliders HTML for each topic
    var slidersHTML = '';

    // CO3: for loop — one slider per topic
    for (var k = 0; k < subject.topics.length; k++) {

      var savedVal = (savedData.topicValues && savedData.topicValues[k]) || 0;

      slidersHTML +=
        '<div class="topic-row">' +
          '<div class="topic-row-header">' +
            '<span class="topic-name-label">' + subject.topics[k] + '</span>' +
            '<span class="topic-pct" id="topicVal_' + i + '_' + k + '">' + savedVal + '%</span>' +
          '</div>' +
          // CO4: oninput event — updates the badge as slider moves
          '<input type="range" id="topicSlider_' + i + '_' + k + '" ' +
            'min="0" max="100" step="5" value="' + savedVal + '" ' +
            'oninput="updateSlider(' + i + ', ' + k + ', this.value)" />' +
        '</div>';
    }

    card.innerHTML =
      '<h3>📚 ' + subject.name + '</h3>' +

      '<div class="field-group">' +
        '<label for="att_' + i + '">Attendance (%)</label>' +
        '<input type="number" id="att_' + i + '" ' +
          'min="0" max="100" placeholder="e.g. 78" ' +
          'value="' + (savedData.attendance || '') + '" />' +
      '</div>' +

      '<div class="field-group">' +
        '<label>Syllabus Completion — drag each topic slider</label>' +
        slidersHTML +
      '</div>';

    container.appendChild(card);
  }
}


// ── CO4: Event handler — update slider badge in real time ───
// Called by oninput on each range slider
// i = subject index, k = topic index, val = slider value
function updateSlider(i, k, val) {
  // CO4: DOM — find the badge element and update its text
  var badge = document.getElementById('topicVal_' + i + '_' + k);
  if (badge) {
    badge.textContent = val + '%';
  }
}


// ── CO5: Validate + CO3: Calculate — Step 3 Analyze ─────────
// Main function that reads all data and computes readiness scores
function analyzeReadiness() {

  var errorEl = document.getElementById('subjectDataError');
  var results = [];

  // CO3: for loop — process each subject
  for (var i = 0; i < app.subjects.length; i++) {

    var subject = app.subjects[i];

    // CO4: DOM — read attendance value
    var attInput  = document.getElementById('att_' + i);
    var attendance = attInput ? parseFloat(attInput.value) : 0;

    // CO5: Validate attendance
    if (isNaN(attendance) || attendance < 0 || attendance > 100) {
      errorEl.textContent = 'Please enter a valid attendance % for "' + subject.name + '".';
      return;
    }

    // CO3: Array — collect all topic slider values
    var topicValues = [];
    for (var k = 0; k < subject.topics.length; k++) {
      var slider = document.getElementById('topicSlider_' + i + '_' + k);
      var val    = slider ? parseFloat(slider.value) : 0;
      topicValues.push(val);
    }

    // CO3: Array method — reduce adds up all values
    var topicSum = topicValues.reduce(function(total, val) {
      return total + val;
    }, 0);

    // CO3: Average syllabus completion across all topics
    var syllabusPct = topicValues.length > 0 ? topicSum / topicValues.length : 0;

    // Calculate time score based on days left
    var timeScore   = getTimeScore(app.examDate);

    // ── READINESS FORMULA ──
    // Attendance (35%) + Syllabus (45%) + Time Factor (20%)
    var readiness = (attendance * 0.35) + (syllabusPct * 0.45) + (timeScore * 0.20);
    readiness     = Math.round(readiness);

    // CO3: Function call — determine level and recommendation
    var level          = getLevel(readiness);
    var recommendation = getRecommendation(level, subject.name, syllabusPct);

    // CO3: Object — store all computed data for this subject
    results.push({
      name:        subject.name,
      attendance:  Math.round(attendance),
      syllabusPct: Math.round(syllabusPct),
      readiness:   readiness,
      level:       level,
      recommendation: recommendation,
      topicValues: topicValues
    });

    // Save input data so it can be restored
    if (!app.subjectData[i]) app.subjectData[i] = {};
    app.subjectData[i].attendance   = attendance;
    app.subjectData[i].topicValues  = topicValues;
  }

  errorEl.textContent = '';
  displayResults(results);
  goToStep(4);
}


// ── CO3: Function — calculate time score from exam date ─────
// Returns a score 0-100 based on how many days are left
function getTimeScore(examDateStr) {
  var today   = new Date();
  var examDay = new Date(examDateStr);

  // Calculate difference in milliseconds, then convert to days
  var diffMs   = examDay - today;
  var diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  // CO3: if/else chain — score based on days remaining
  if (diffDays > 60) return 100;
  if (diffDays > 30) return 80;
  if (diffDays > 15) return 60;
  return 40;
}


// ── CO3: Function — return readiness level label ─────────────
function getLevel(score) {
  if (score >= 75) return 'High';
  if (score >= 50) return 'Medium';
  return 'Low';
}


// ── CO3: Function — return study recommendation text ─────────
function getRecommendation(level, subjectName, syllabusPct) {
  // CO3: if/else conditions based on level
  if (level === 'High') {
    return '✅ Great progress in ' + subjectName + '! Focus on revision and practice papers.';
  } else if (level === 'Medium') {
    return '📖 Decent progress in ' + subjectName + '. Strengthen weak topics and increase study time.';
  } else {
    return '⚠️ ' + subjectName + ' needs immediate attention. Cover remaining ' +
      Math.round(100 - syllabusPct) + '% of syllabus as a priority.';
  }
}


// ── CO4: DOM manipulation — display results on screen ───────
function displayResults(results) {

  // ── Countdown ──
  // CO4: setInterval — runs a function repeatedly (async behavior)
  // Updates the countdown every 60 seconds
  if (app.countdownTimer) clearInterval(app.countdownTimer);

  updateCountdown(); // run once immediately
  app.countdownTimer = setInterval(updateCountdown, 60000); // CO4: async setInterval

  // ── Overall Score ──
  // CO3: Array method — reduce to sum all readiness scores
  var total = results.reduce(function(sum, r) { return sum + r.readiness; }, 0);
  var overall = Math.round(total / results.length);
  var overallLevel = getLevel(overall);

  // CO4: DOM innerHTML — write the overall card HTML
  var overallCard = document.getElementById('overallScoreCard');
  overallCard.innerHTML =
    '<div class="overall-card">' +
      '<div class="score-ring ' + overallLevel.toLowerCase() + '">' +
        '<span class="score-big">' + overall + '</span>' +
        '<span class="score-sub">/ 100</span>' +
      '</div>' +
      '<span class="badge badge-' + overallLevel.toLowerCase() + '">' + overallLevel + ' Readiness</span>' +
      '<h2 style="margin-top:0.75rem;">Overall Exam Readiness</h2>' +
      '<p>Weighted average across all subjects</p>' +
    '</div>';

  // ── Per-Subject Cards ──
  var container = document.getElementById('subjectResultsContainer');
  container.innerHTML = '';

  // CO3: for loop — one result card per subject
  for (var i = 0; i < results.length; i++) {
    var r   = results[i];
    var lvl = r.level.toLowerCase();

    var card = document.createElement('div');
    card.className = 'result-card';
    card.innerHTML =
      '<div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem;">' +
        '<h3>📚 ' + r.name + '</h3>' +
        '<span class="badge badge-' + lvl + '">' + r.level + ' Readiness</span>' +
      '</div>' +

      '<div class="metrics-grid">' +
        '<div class="metric-box"><div class="metric-val">' + r.attendance + '%</div><div class="metric-label">Attendance</div></div>' +
        '<div class="metric-box"><div class="metric-val">' + r.syllabusPct + '%</div><div class="metric-label">Syllabus Done</div></div>' +
        '<div class="metric-box"><div class="metric-val">' + r.readiness + '</div><div class="metric-label">Score</div></div>' +
      '</div>' +

      '<div class="progress-wrap">' +
        '<div class="progress-fill ' + lvl + '" style="width:' + r.readiness + '%"></div>' +
      '</div>' +

      '<div class="recommendation">' + r.recommendation + '</div>';

    container.appendChild(card);
  }
}


// ── CO4: DOM + Async — update the countdown display ─────────
// Called immediately and then every 60s via setInterval
function updateCountdown() {

  var today   = new Date();
  var examDay = new Date(app.examDate);

  var diffMs    = examDay - today;
  var diffDays  = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  var diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  // CO4: DOM — update the countdown display elements
  var daysEl  = document.getElementById('countdownDays');
  var hoursEl = document.getElementById('countdownHours');

  if (daysEl)  daysEl.textContent  = diffDays > 0 ? diffDays : 0;
  if (hoursEl) hoursEl.textContent = diffDays > 0
    ? diffHours + ' hours remaining'
    : 'Exam day has passed';
}


// ── CO4: localStorage + DOM — logout ────────────────────────
function logout() {
  // CO4: localStorage — remove login session
  localStorage.removeItem('edupulse_loggedin');
  localStorage.removeItem('edupulse_currentUser');
  localStorage.removeItem('edupulse_progress');

  // Clear countdown timer if running
  if (app.countdownTimer) clearInterval(app.countdownTimer);

  // CO4: Redirect back to login page
  window.location.href = 'index.html';
}


// ── Reset dashboard to start over ───────────────────────────
function resetDashboard() {
  // CO4: localStorage — clear saved progress
  localStorage.removeItem('edupulse_progress');

  // CO3: Reset app object back to defaults
  app.currentStep   = 1;
  app.examDate      = '';
  app.numSubjects   = 0;
  app.subjects      = [];
  app.subjectData   = [];

  if (app.countdownTimer) clearInterval(app.countdownTimer);

  goToStep(1);
}
