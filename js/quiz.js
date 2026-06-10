/* ============================================
   CHAD BITES - QUIZ JS
   Question flow, scoring, transitions, email capture
   ============================================ */

(function() {
  'use strict';

  var questions = [
    {
      id: 'intro',
      num: 'Question 1 of 9',
      question: 'Do You Have Low Testosterone?',
      sub: 'Answer a few quick questions to find out your risk level.',
      type: 'list',
      options: [
        { label: "I think so — I've been feeling off lately", score: 4 },
        { label: "Maybe — I'm not sure what the symptoms are", score: 3 },
        { label: "I don't think so, but I want to check", score: 2 },
        { label: "No — I just want to optimize my levels", score: 1 }
      ]
    },
    {
      id: 'body',
      num: 'Question 2 of 9',
      question: 'Which body type best describes you?',
      sub: 'Select the silhouette that most closely matches your current physique.',
      type: 'grid',
      options: [
        { label: 'Lean / Slim', icon: '🏃', score: 2 },
        { label: 'Athletic', icon: '💪', score: 1 },
        { label: 'Average', icon: '🧍', score: 3 },
        { label: 'Stocky', icon: '🏋️', score: 3 },
        { label: 'Overweight', icon: '⚖️', score: 4 }
      ]
    },
    {
      id: 'age',
      num: 'Question 3 of 9',
      question: 'What is your age range?',
      sub: 'Testosterone naturally declines with age, but the rate varies.',
      type: 'list',
      options: [
        { label: '18-25', score: 1 },
        { label: '26-35', score: 2 },
        { label: '36-45', score: 3 },
        { label: '46-55', score: 4 },
        { label: '55+', score: 5 }
      ]
    },
    {
      id: 'sleep',
      num: 'Question 4 of 9',
      question: 'How would you rate your sleep quality?',
      sub: 'Most testosterone production happens during deep sleep.',
      type: 'list',
      options: [
        { label: 'Excellent — I sleep 7-9 hours and wake refreshed', score: 1 },
        { label: 'Good — I usually sleep well but have off nights', score: 2 },
        { label: 'Fair — I often wake up tired or have trouble falling asleep', score: 3 },
        { label: 'Poor — I rarely get quality sleep', score: 4 }
      ]
    },
    {
      id: 'energy',
      num: 'Question 5 of 9',
      question: 'How is your energy throughout the day?',
      sub: 'Sustained energy is one of the first markers of healthy testosterone.',
      type: 'list',
      options: [
        { label: 'High — I have steady energy from morning to night', score: 1 },
        { label: 'Moderate — I crash in the afternoon but recover', score: 2 },
        { label: 'Low — I rely on caffeine and still feel drained', score: 3 },
        { label: 'Very low — I drag through the entire day', score: 4 }
      ]
    },
    {
      id: 'motivation',
      num: 'Question 6 of 9',
      question: 'How would you describe your motivation lately?',
      sub: 'Drive and ambition are closely tied to testosterone levels.',
      type: 'list',
      options: [
        { label: "Fired up — I'm chasing goals every day", score: 1 },
        { label: "Decent — I get things done but don't feel driven", score: 2 },
        { label: "Low — I struggle to start tasks or stay committed", score: 3 },
        { label: "Flat — I've lost interest in things I used to care about", score: 4 }
      ]
    },
    {
      id: 'libido',
      num: 'Question 7 of 9',
      question: 'How is your libido / sex drive?',
      sub: 'Libido is one of the most sensitive indicators of testosterone.',
      type: 'list',
      options: [
        { label: 'Strong — no complaints', score: 1 },
        { label: "It's okay — not what it used to be", score: 2 },
        { label: "Noticeably lower — I'm rarely in the mood", score: 3 },
        { label: 'Almost nonexistent', score: 4 }
      ]
    },
    {
      id: 'bedroom',
      num: 'Question 8 of 9',
      question: 'How is your performance in the bedroom?',
      sub: 'Performance quality is directly linked to hormonal health.',
      type: 'list',
      options: [
        { label: 'Excellent — confident and consistent', score: 1 },
        { label: 'Good — occasional off days', score: 2 },
        { label: 'Declining — noticeable changes', score: 3 },
        { label: "Struggling — it's affecting my confidence", score: 4 }
      ]
    },
    {
      id: 'outside',
      num: 'Question 9 of 9',
      question: 'How is your performance outside the bedroom?',
      sub: 'Gym performance, mental sharpness, and body composition.',
      type: 'list',
      options: [
        { label: "Peak form — I'm strong, sharp, and lean", score: 1 },
        { label: 'Decent — holding steady but not improving', score: 2 },
        { label: "Declining — gaining fat, losing muscle, brain fog", score: 3 },
        { label: "Poor — I feel like I'm aging rapidly", score: 4 }
      ]
    }
  ];

  var currentQ = 0;
  var answers = [];
  var totalQuestions = questions.length;

  function init() {
    renderQuestion(0);
    updateProgress(0);
  }

  function updateProgress(step) {
    var pct = Math.round(((step) / totalQuestions) * 100);
    var fill = document.getElementById('progress-fill');
    var stepText = document.getElementById('progress-step');
    if (fill) fill.style.width = pct + '%';
    if (stepText) stepText.textContent = 'Step ' + (step + 1) + ' of ' + totalQuestions;
  }

  function renderQuestion(index) {
    var q = questions[index];
    var container = document.getElementById('quiz-body');
    if (!container) return;

    var html = '<div class="quiz-slide active" id="slide-' + index + '">';
    html += '<div class="quiz-question-num">' + q.num + '</div>';
    html += '<h2 class="quiz-question">' + q.question + '</h2>';
    html += '<p class="quiz-question-sub">' + q.sub + '</p>';

    if (q.type === 'grid') {
      html += '<div class="quiz-options-grid">';
      q.options.forEach(function(opt, i) {
        html += '<button class="quiz-option-card" data-index="' + i + '" data-score="' + opt.score + '">';
        html += '<span class="quiz-option-card-icon">' + opt.icon + '</span>';
        html += '<span class="quiz-option-card-label">' + opt.label + '</span>';
        html += '</button>';
      });
      html += '</div>';
    } else {
      html += '<div class="quiz-options">';
      q.options.forEach(function(opt, i) {
        html += '<button class="quiz-option" data-index="' + i + '" data-score="' + opt.score + '">';
        html += '<span class="quiz-option-icon"></span>';
        html += '<span>' + opt.label + '</span>';
        html += '</button>';
      });
      html += '</div>';
    }

    html += '</div>';

    // Transition: slide out old, slide in new
    var oldSlide = container.querySelector('.quiz-slide.active');
    if (oldSlide) {
      oldSlide.classList.remove('active');
      oldSlide.classList.add('exiting');
      setTimeout(function() {
        container.innerHTML = html;
        bindOptions(index);
      }, 300);
    } else {
      container.innerHTML = html;
      bindOptions(index);
    }
  }

  function bindOptions(qIndex) {
    var btns = document.querySelectorAll('.quiz-option, .quiz-option-card');
    btns.forEach(function(btn) {
      btn.addEventListener('click', function() {
        // Visual selection
        btns.forEach(function(b) { b.classList.remove('selected'); });
        btn.classList.add('selected');

        var score = parseInt(btn.getAttribute('data-score'));
        answers[qIndex] = score;

        // Auto-advance after short delay
        setTimeout(function() {
          if (currentQ < totalQuestions - 1) {
            currentQ++;
            updateProgress(currentQ);
            renderQuestion(currentQ);
          } else {
            showLoading();
          }
        }, 400);
      });
    });
  }

  function showLoading() {
    document.getElementById('quiz-body').style.display = 'none';
    document.querySelector('.quiz-progress').style.display = 'none';
    var loading = document.getElementById('quiz-loading');
    loading.classList.add('active');

    var steps = loading.querySelectorAll('.quiz-loading-step');
    var progressFill = document.getElementById('loading-progress-fill');
    var stepIndex = 0;

    function advanceStep() {
      if (stepIndex > 0) {
        steps[stepIndex - 1].classList.remove('active');
        steps[stepIndex - 1].classList.add('done');
      }
      if (stepIndex < steps.length) {
        steps[stepIndex].classList.add('active');
        var pct = Math.round(((stepIndex + 1) / steps.length) * 100);
        if (progressFill) progressFill.style.width = pct + '%';
        stepIndex++;
        setTimeout(advanceStep, 1200);
      } else {
        // Mark last as done
        steps[steps.length - 1].classList.remove('active');
        steps[steps.length - 1].classList.add('done');
        if (progressFill) progressFill.style.width = '100%';
        setTimeout(showResults, 800);
      }
    }

    advanceStep();
  }

  function showResults() {
    document.getElementById('quiz-loading').classList.remove('active');
    var results = document.getElementById('quiz-results');
    results.classList.add('active');

    // Calculate score
    var totalScore = 0;
    answers.forEach(function(s) { totalScore += s; });
    var maxScore = totalQuestions * 4.5; // approximate max
    var riskPct = Math.round((totalScore / maxScore) * 100);
    riskPct = Math.min(riskPct, 98);
    riskPct = Math.max(riskPct, 15);

    // Display score (inverted: higher risk = lower "T score")
    var tScore = 100 - riskPct;
    var scoreEl = document.getElementById('result-score');
    if (scoreEl) scoreEl.textContent = tScore;

    // Animate ring
    var ring = document.getElementById('result-ring-fill');
    if (ring) {
      var circumference = 2 * Math.PI * 65;
      var target = (tScore / 100) * circumference;
      setTimeout(function() {
        ring.style.strokeDasharray = target + ', ' + circumference;
      }, 200);
    }

    // Risk level
    var riskBadge = document.getElementById('result-risk');
    if (riskPct > 60) {
      riskBadge.textContent = 'HIGH RISK';
      riskBadge.className = 'quiz-risk-badge quiz-risk-high';
      if (scoreEl) scoreEl.style.color = '#ef4444';
    } else if (riskPct > 35) {
      riskBadge.textContent = 'MODERATE RISK';
      riskBadge.className = 'quiz-risk-badge quiz-risk-moderate';
      if (scoreEl) scoreEl.style.color = '#f59e0b';
    } else {
      riskBadge.textContent = 'LOW RISK';
      riskBadge.className = 'quiz-risk-badge quiz-risk-low';
      if (scoreEl) scoreEl.style.color = '#22c55e';
    }

    // Shake CTA periodically
    var ctaBtn = document.getElementById('quiz-cta');
    if (ctaBtn) {
      setInterval(function() {
        ctaBtn.classList.add('shake-anim');
        setTimeout(function() { ctaBtn.classList.remove('shake-anim'); }, 700);
      }, 4000);
    }
  }

  // Email capture
  function initEmailCapture() {
    var form = document.getElementById('email-form');
    if (!form) return;
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      var email = document.getElementById('email-input').value;
      if (email && email.indexOf('@') > -1) {
        // In production, this would post to an API
        var btn = form.querySelector('button');
        btn.textContent = 'CLAIMED!';
        btn.style.background = '#22c55e';
        btn.disabled = true;
        console.log('Quiz email captured:', email);
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function() {
    init();
    initEmailCapture();
  });
})();
