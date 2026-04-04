# ShiftSheild — AI-Powered Parametric Income Insurance for Q-Commerce Delivery Partners

**Guidewire DEVTrails 2026 | Phase 1 Submission**

---

## Problem Statement

India's Q-Commerce delivery partners (Zepto, Blinkit, Swiggy Instamart) operate on a promise of 10-minute delivery — every minute they can't work directly cuts their income. Unlike salaried employees, these workers have zero safety net when external disruptions like extreme rain, floods, curfews, or severe pollution make it impossible to ride.

GigShield is an AI-enabled parametric income insurance platform built exclusively for Q-Commerce delivery partners. When a verified external disruption hits their zone, GigShield automatically detects it, triggers a claim, and pays them — no forms, no waiting, no hassle.

---

## Persona: Q-Commerce Delivery Partner (Zepto / Blinkit / Swiggy Instamart)

### Who They Are
- Age: 19-32, predominantly male, semi-urban/urban India
- Income: Rs. 600-1,000/day (Rs. 4,200-7,000/week), primarily cash or UPI
- Works: 8-12 hours/day, 6-7 days/week in a hyper-local zone (2-5 km radius)
- Device: Android smartphone, limited data literacy
- Pain Point: A single flooded road or heavy rain event can wipe out 50-100% of their daily earnings with no recourse

### Persona-Based Scenarios

**Scenario 1 — The Monsoon Wipeout**
Raju, a Zepto delivery partner in Hyderabad, cannot ride during heavy rain (>35mm/hr). Orders drop to zero. The platform shows surge unavailable. He loses Rs. 700 in a single day. GigShield detects the IMD weather trigger, auto-initiates a claim, and credits Rs. 500 to his UPI within the hour.

**Scenario 2 — The Pollution Shutdown**
Delhi AQI spikes above 400. The city enforces a 2-wheeler restriction order. Arjun, a Blinkit partner, cannot step out. GigShield cross-checks AQI data and local enforcement alerts, triggers a partial-day income claim, and processes the payout automatically.

**Scenario 3 — The Curfew Freeze**
A sudden curfew/bandh is called in a city zone. The delivery app goes dark. Priya, a Swiggy Instamart partner, is locked out of her zone for 6 hours. GigShield uses geofence and platform API signals to validate the blackout and pays her proportional income loss.

---

## Application Workflow

```
[Worker Onboarding]
    |
Register -> KYC (Aadhaar/PAN mock) -> Link delivery platform account (simulated API)
    |
[Risk Profiling]
AI model assesses: zone flood history, avg daily earnings, platform activity patterns
    |
[Weekly Policy Issuance]
Dynamic premium calculated -> Worker pays weekly via UPI/wallet
    |
[Real-Time Disruption Monitoring]
Weather API + AQI feed + Traffic/curfew signals -> Zone-level trigger evaluation
    |
[Parametric Claim Auto-Trigger]
Threshold breached -> Claim auto-initiated (no manual filing needed)
    |
[Fraud Validation]
AI checks: GPS location during event, platform activity log, anomaly scoring
    |
[Instant Payout]
Approved -> UPI/wallet credit within 60 minutes
    |
[Dashboard]
Worker sees earnings protected | Admin sees loss ratios and predictive analytics
```

---

## Weekly Premium Model

GigShield operates on a strictly weekly pricing basis, aligned with the gig worker's earnings cycle.

### Premium Tiers

| Plan | Weekly Premium | Max Weekly Payout | Coverage Hours/Week |
|------|---------------|-------------------|---------------------|
| Basic Shield | Rs. 29/week | Rs. 500 | Up to 8 hours |
| Standard Shield | Rs. 49/week | Rs. 1,000 | Up to 16 hours |
| Pro Shield | Rs. 79/week | Rs. 2,000 | Up to 30 hours |

### How the Premium is Calculated (AI-Driven)

The AI risk engine calculates the weekly premium using:

```
Weekly Premium = Base Rate
              x Zone Risk Multiplier (flood/pollution history)
              x Earnings Volatility Score
              x Season Factor (monsoon = higher)
              x Platform Activity Score (more active = lower risk)
```

- Zone Risk Multiplier: Derived from 3-year historical weather/AQI data for the worker's operating pin code
- Earnings Volatility Score: Estimated from platform activity (orders/week, active hours)
- Season Factor: Pre-trained seasonal model (monsoon months get 1.2-1.5x adjustment)
- Workers in historically safe zones pay up to 30% less. High-risk flood zones pay more but get higher payouts.

---

## Parametric Triggers (Income Loss Only)

Five automated triggers, all tied exclusively to income loss and not physical damage:

| # | Trigger | Data Source | Threshold | Income Loss Assumed |
|---|---------|------------|-----------|-------------------|
| 1 | Heavy Rain | OpenWeatherMap API | Rainfall > 35mm/hr for 2+ hrs | 100% of covered hours |
| 2 | Severe AQI | AQICN / OpenAQ API | AQI > 350 + 2-wheeler restriction | 100% of covered hours |
| 3 | Flash Flood Alert | IMD API / mock | District-level flood warning issued | 100% of covered hours |
| 4 | Extreme Heat | OpenWeatherMap | Temp > 45 degrees C for 4+ hrs | 50% of covered hours |
| 5 | Curfew / Bandh | News API + Platform signal | Zone order detection + app blackout | Proportional to hours affected |

All triggers are parametric — payout is automatic when thresholds are breached. No manual claim required.

---

## AI/ML Integration Plan

### 1. Dynamic Premium Calculation
- Model: Gradient Boosted Regression (XGBoost / sklearn)
- Features: Zone pin code, historical weather events, worker's platform tenure, avg weekly orders, season
- Output: Personalized weekly premium per worker
- Implementation: Python microservice exposing a REST endpoint called at policy creation

### 2. Fraud Detection
- Method: Isolation Forest / rule-based anomaly scoring
- Signals checked:
  - Was the worker's GPS inside the disrupted zone during the event?
  - Did their platform show zero orders during the claimed period?
  - Is the claim suspiciously timed (filed seconds after trigger)?
  - Duplicate claim detection across policy IDs
- Output: Fraud confidence score (0-100). Score above 70 flags for manual review. Below 70 auto-approves.

### 3. Predictive Risk Dashboard (Admin)
- Time-series model forecasting next week's likely disruption probability by zone
- Input: IMD seasonal forecasts + historical claim patterns
- Output: Heatmap of high-risk zones for insurer portfolio planning

---

## Adversarial Defense & Anti-Spoofing Strategy

### The Threat
A coordinated group of bad actors using GPS spoofing applications can fake their location inside a disrupted weather zone while sitting safely at home, triggering false claims and draining the payout pool. Simple GPS coordinate verification alone is not sufficient to catch this.

### 1. The Differentiation — How We Tell a Real Worker from a Faker

GigShield does not rely on GPS alone. A genuine stranded delivery partner leaves a very specific digital footprint that a spoofing actor cannot easily replicate:

- Platform order data goes to zero: A real worker in a disrupted zone will show zero completed orders on the delivery platform during the event window. A spoofer sitting at home may show continued app activity or irregular session patterns.
- Device sensor consistency: A genuinely stationary worker's phone will show consistent accelerometer and gyroscope readings — no movement. A spoofer using a GPS mock app while moving around at home will show motion sensor data that contradicts their claimed GPS position.
- Network cell tower triangulation: The phone's connected cell tower must be consistent with the claimed GPS pin code. A spoofed GPS location that does not match the nearest cell tower is an immediate red flag.
- Historical behavior baseline: The AI model builds a 4-week baseline of each worker's normal operating hours and zone. A claim filed during hours the worker never historically works is automatically flagged.

### 2. The Data — What We Analyze Beyond GPS

To detect a coordinated fraud ring specifically, GigShield analyzes the following additional data points:

- Claim velocity per zone: If more than 40% of all policy holders in a single pin code file claims within the same 10-minute window, the system flags it as a potential coordinated event rather than individual genuine claims.
- Device fingerprinting: Each registered device has a unique fingerprint. If multiple policy IDs are filing claims from the same physical device or the same IP address, all linked claims are held for review.
- GPS spoofing app detection: Known GPS mock applications leave detectable traces in Android system logs. During onboarding and at claim time, GigShield's mobile SDK performs a background check for the presence of these applications on the device.
- Telegram and social signal monitoring: Unusual spikes in claim volume that correlate with no verifiable external weather event (cross-checked against IMD and OpenWeatherMap independently) trigger an automatic fraud ring investigation flag for the admin dashboard.

### 3. The UX Balance — Protecting Honest Workers

The biggest risk with aggressive fraud detection is punishing genuine workers who happen to have poor network connectivity during a real weather event, which is common during heavy rain. GigShield handles this with a tiered response:

- Tier 1 — Auto Approve (fraud score below 40): Payout is processed immediately with no disruption to the worker.
- Tier 2 — Soft Hold (fraud score 40-70): Payout is held for a maximum of 2 hours while the system runs additional checks automatically. The worker receives a notification: "Your claim is being verified. You will receive your payout within 2 hours." No action is required from the worker.
- Tier 3 — Manual Review (fraud score above 70): A human reviewer on the admin dashboard examines the claim within 4 hours. The worker is notified and given the option to submit one additional proof such as a photo of their location. Genuine workers in this tier are still paid the same day.

The key principle is that a network drop or poor GPS signal during a storm does not automatically raise a fraud score. The model is trained to treat connectivity issues as expected behavior during genuine disruption events, not as suspicious signals.

---

## Tech Stack

### Frontend
- Framework: React.js (Vite)
- UI: Tailwind CSS + shadcn/ui
- Maps/Zones: Leaflet.js (zone-level geofencing visualization)
- Charts: Recharts (analytics dashboard)

### Backend
- Runtime: Node.js + Express.js
- Database: PostgreSQL (policies, claims, workers) + Redis (real-time trigger state)
- Auth: JWT-based auth with OTP mock (simulating Aadhaar OTP)

### AI/ML
- Language: Python (FastAPI microservice)
- Libraries: scikit-learn, XGBoost, pandas, numpy
- Hosting: Separate lightweight container

### External APIs
- OpenWeatherMap API (free tier) — weather triggers
- OpenAQ API (free) — AQI data
- Razorpay Test Mode — simulated UPI payouts
- IMD alerts — mocked JSON feed

### Cloud / DevOps
- Hosting: AWS (EC2 / Elastic Beanstalk) or Render.com
- CI/CD: GitHub Actions
- Containerization: Docker Compose (frontend + backend + ML service)

---

## Development Plan

### Phase 1 (Week 1-2): Ideation and Foundation
- [x] Define persona, scenarios, and parametric triggers
- [x] Design weekly premium model and actuarial logic
- [x] Finalize tech stack
- [x] Adversarial defense and anti-spoofing strategy defined
- [ ] Basic project scaffolding (React app + Express API skeleton)
- [ ] Mock data models for workers, policies, claims

### Phase 2 (Week 3-4): Automation and Protection
- [ ] Worker registration + KYC onboarding flow
- [ ] Policy creation with dynamic AI premium calculation
- [ ] 5 automated parametric trigger integrations (weather/AQI APIs)
- [ ] Claims management — auto-trigger -> fraud check -> approval pipeline
- [ ] Basic payout simulation (Razorpay test mode)

### Phase 3 (Week 5-6): Scale and Optimise
- [ ] Advanced fraud detection (GPS spoofing app detection, coordinated ring alerts)
- [ ] Intelligent dual dashboard (Worker view + Admin/Insurer view)
- [ ] Predictive analytics (next-week risk heatmap)
- [ ] Full demo scenario: simulate rainstorm -> auto claim -> instant payout
- [ ] Final pitch deck + 5-minute demo video

---

## Why GigShield

1. Zero-touch experience: Workers never file a claim. The system detects, validates, and pays automatically.
2. Hyper-local precision: Pin code level risk profiling means fair pricing — a worker in Koramangala pays differently than one in Whitefield.
3. Weekly model fits real life: Rs. 29-79/week is within reach. No annual lock-in, no confusion.
4. Built for Bharat: UPI-native payouts, vernacular-ready UI, Android-first design.
5. Q-Commerce is the future: 10-minute delivery is India's fastest growing gig segment and the most vulnerable to disruption.

---

## Team

| Role | Responsibility |
|------|---------------|
| Full Stack (React + Node) | Frontend UI, API development, policy/claims backend |
| Backend + DevOps | Infrastructure, database, CI/CD, API integrations |
| ML + Product | AI premium model, fraud detection, product design |

---

