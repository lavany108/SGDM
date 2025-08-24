// ======= State =======
let totalRaised = 0;
const goal = 100000;
let selectedSubAmount = 300;

// ======= GSAP Animations =======
window.addEventListener('load', () => {
  if (!window.gsap) return;
  gsap.registerPlugin(ScrollTrigger);
  gsap.from('header', { y: -80, opacity: 0, duration: 0.8, ease: 'power3.out' });
  gsap.from('.glass', {
    scrollTrigger: { trigger: '#impact', start: 'top 80%' },
    y: 30, opacity: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out'
  });
  gsap.utils.toArray('#how .group').forEach((el) => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 85%' },
      y: 40, opacity: 0, duration: 0.8, ease: 'power3.out'
    });
  });
  gsap.utils.toArray('#donate .rounded-3xl').forEach((el, i) => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 90%' },
      y: 40, opacity: 0, duration: 0.7, delay: i * 0.05, ease: 'power3.out'
    });
  });
});

// ======= Razorpay Checkout =======
function openRazorpay(amount = 500) {
  if (amount < 100) { alert('Minimum amount is ₹100'); return; }
  const options = {
    key: "rzp_test_1DP5mmOlF5G5ag", // ⚠ REPLACE with your test/live key
    amount: amount * 100,
    currency: "INR",
    name: "Social Good",
    description: "Donation",
    handler: function (response) {
      totalRaised += amount;
      updateProgressUI();
      fireConfetti();
      alert("Thank you! Payment ID: " + response.razorpay_payment_id);
    },
    prefill: {
      name: "Test Donor",
      email: "donor@example.com",
      contact: "9876543210"
    },
    theme: { color: "#4F46E5" }
  };
  const rzp = new Razorpay(options);
  rzp.open();
}

// Custom amount
function donateCustom() {
  const val = parseInt(document.getElementById('customAmount').value);
  if (isNaN(val) || val < 100) { alert('Please enter at least ₹100'); return; }
  openRazorpay(val);
}

// Subscription amount select (mock front-end only)
document.querySelectorAll('.sub-amt').forEach(btn => {
  btn.addEventListener('click', () => {
    selectedSubAmount = parseInt(btn.dataset.amt);
    document.querySelectorAll('.sub-amt').forEach(b => b.classList.remove('bg-indigo-50','border-indigo-400'));
    btn.classList.add('bg-indigo-50','border-indigo-400');
  });
});

// ======= UPI intent quick amounts =======
const upiId = 'yourupi@bank'; // ⚠ REPLACE with your UPI ID
const upiName = 'Arpit Kumar Varshney'; // ⚠ REPLACE with your display name
function quickUPI(amount) {
  const url = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(upiName)}&tn=${encodeURIComponent('Social Good Donation')}&am=${amount}&cu=INR`;
  document.getElementById('upiIntent').setAttribute('href', url);
  if (/Android|iPhone/i.test(navigator.userAgent)) {
    window.location.href = url;
  } else {
    alert('UPI link prepared. Scan QR or open on mobile to pay.');
  }
}

// ======= Progress + Stats UI =======
function updateProgressUI() {
  const percent = Math.min((totalRaised / goal) * 100, 100);
  document.getElementById('progressBar').style.width = percent + '%';
  document.getElementById('progressLabel').textContent = `₹${totalRaised.toLocaleString()} of ₹${goal.toLocaleString()}`;
  document.getElementById('stat-raised').textContent = `₹${totalRaised.toLocaleString()}`;
  document.getElementById('stat-wells').textContent = Math.floor(totalRaised / 50000);
  document.getElementById('stat-filters').textContent = Math.floor(totalRaised / 2500);
  document.getElementById('stat-people').textContent = Math.floor(totalRaised / 800);
}

// ======= Confetti (tiny) =======
const confettiCanvas = document.getElementById('confetti');
const ctx = confettiCanvas.getContext('2d');
let confettiPieces = [];
function resizeConfetti() {
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeConfetti);
resizeConfetti();
function fireConfetti() {
  const colors = ['#4F46E5','#22C55E','#F59E0B','#EC4899','#06B6D4'];
  for (let i = 0; i < 150; i++) {
    confettiPieces.push({
      x: Math.random() * confettiCanvas.width,
      y: -10,
      r: Math.random() * 6 + 4,
      c: colors[Math.floor(Math.random() * colors.length)],
      s: Math.random() * 3 + 2,
      a: Math.random() * 360
    });
  }
  requestAnimationFrame(drawConfetti);
  setTimeout(() => confettiPieces = [], 2200);
}
function drawConfetti() {
  ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  confettiPieces.forEach(p => {
    p.y += p.s;
    p.x += Math.sin(p.a / 20);
    p.a += 5;
    ctx.fillStyle = p.c;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
  });
  if (confettiPieces.length) requestAnimationFrame(drawConfetti);
}

// Pre-highlight a subscription choice
document.querySelector('.sub-amt[data-amt="300"]').classList.add('bg-indigo-50','border-indigo-400');
