# VoiceMatch - Voice Actor Marketplace PRD

## High-Level Goal

Build a fully functional Voice Actor Marketplace to:

- Discover and filter professional voice talent
- View detailed actor profiles and portfolios
- Invite actors to custom jobs via a form
- Store all job submissions in Supabase

---

## 1. User Journeys

### Journey A: Discover Talent (Marketplace Homepage)

- User lands on the homepage
- Uses search bar (e.g., name, skill, language)
- Applies category filters (e.g., Animation, Commercials)
- Browses actor cards: profile picture, rating, audio snippet, and CTA
- Clicks "View Details" to go to profile page

### Journey B: Explore Actor Profile

- User views:
  - Name, location, rating, review count
  - Bio, certifications, sample work (audio clips)
  - Client badges, job stats (reply time, jobs done)
- Clicks "Invite to Job" CTA

### Journey C: Post a Job (Invitation Modal)

- Modal opens with form fields:
  - Project name, category, character, language, accent, gender
  - Script file upload, estimated length, deadline, budget, approval steps
- On submit:
  - Script uploaded to Supabase Storage
  - Metadata saved to `jobs` table in Supabase
  - Success confirmation shown

---

## 2. Data Models

### VoiceActors Table

```json
{
  "id": "uuid",
  "name": "string",
  "location": "string",
  "rating": "float",
  "review_count": "int",
  "profile_picture_url": "string",
  "bio": "text",
  "categories": ["string"],
  "audio_samples": [{ "title": "string", "url": "string" }],
  "certifications": ["string"],
  "last_online": "timestamp",
  "typical_reply_time": "string", //'<1 hour', '1-2 hours', '1 day', '2+ days'
  "last_hired": "timestamp",
  "completed_jobs": "int",
  "past_clients": ["string"]
}
```

### Jobs Table

```json
{
  "id": "uuid",
  "actor_id": "uuid",
  "project_name": "string",
  "category": "string",
  "character_traits": ["string"],
  "language": "string",
  "accent": "string",
  "voice_gender": "string",
  "script_url": "string",
  "estimated_length_minutes": "int",
  "deadline": "date",
  "budget": "number",
  "approval_steps": "string",
  "submitted_at": "timestamp"
}
```

### Reviews Table

```json
{
  "id": "uuid",
  "actor_id": "uuid",
  "reviewer_name": "string",
  "rating": "float",
  "comment": "text",
  "created_at": "timestamp"
}
```

---

## 3. Architecture Decisions

### Frontend

- **Framework:** React with Next.js
- **Styling:** TailwindCSS for mobile-first design
- **Audio Player:** Native HTML5
- **State Management:** React Context and zustand
- **Routing:** Dynamic routes for profile pages

### Backend

- **Database:** Supabase (PostgreSQL)
- **Storage:** Supabase Storage for audio samples and uploaded scripts
- **Auth:** Supabase Auth (if user-level access is added later)
- **Realtime:** Supabase subscriptions for job updates (optional)

### File Uploads

- Scripts uploaded to Supabase Storage with metadata referencing the `jobs` table

### Deployment

- Vercel or Netlify for hosting
- CI/CD using GitHub Actions or Vercel’s native pipelines

---

## 4. Functional Requirements

### Marketplace

- Search bar (name, skill, language)
- Category filters (Animation, Commercials, Audiobooks, etc.)
- Voice actor cards with:
  - Picture, name, rating, reviews, audio snippet, CTA

### Actor Profile

- Profile header: name, location, rating, reviews
- About section, certifications
- Audio portfolio (list of playable samples)
- Widgets:
  - Invite to Job (CTA)
  - Client logos
  - Job stats (reply time, last hired, total jobs)
  - Reviews & ratings

### Invitation Modal

- Triggered by CTA
- Fields: name, category, traits, script upload, budget, etc.
- Submit: validates inputs, stores job in Supabase

### Search & Filters

- Filtered results dynamically rerendered
- Keyword search scoped across name, skills, and tags

---

## 5. Scalability & Future Scope

### Near-Term Improvements

- Add login/authentication with Supabase Auth
- Add notifications for actors when invited
- Pagination or infinite scroll in marketplace
- Basic analytics/dashboard for admin

### Mid-Term Scope

- Payment integration (e.g., Stripe) for job hiring
- Messaging/chat between client and actor
- Availability calendar for actors
- Profile claiming and account verification

### Long-Term Opportunities

- AI-based voice matching (e.g., recommend actors based on script)
- Role-based access for studios, agencies, freelance actors
- Talent onboarding workflow
- Review moderation and flagging

---

## 6. UX Goals

- Mobile-friendly UI
- Fast navigation and intuitive flow
- Easy discovery and minimal steps to hire

---

## 7. Summary

This Voice Actor Marketplace bridges clients and talent by combining rich profile discovery with structured job invitations. Leveraging Supabase’s backend-as-a-service capabilities allows rapid MVP delivery with room to scale.

---
