# Voice Actor Marketplace App

A fully functional Voice Actor Marketplace built with **Next.js**, **Supabase**, and modern developer workflows.

---

## Overview

This application enables users to:

- Browse a list of voice actors in a card-based UI.
- Search by keywords and filter by categories.
- View detailed profiles of voice actors.
- Invite voice actors for jobs through a modal form.
- Save job invitations to Supabase in real-time.

---

## Tech Stack

- **Frontend**: Next.js (React, TailwindCSS)
- **Backend**: Supabase (Database, Auth, Storage)
- **AI Tools Used**: Claude, Cursor, ChatGPT (for PRD, code generation, refactoring)

---

## Features

- Responsive landing page displaying voice actor cards.
- Functional search and category filter.
- Detailed voice actor profile page.
- "Invite to Job" modal capturing all necessary fields.
- Job postings saved to Supabase.
- Clean and modular code with error handling and loading states.
- AI-driven enhancements across development lifecycle.

---

## Setup Instructions

1. **Clone the Repository**

   ```bash
   git clone https://github.com/HilloriDesai/VoiceActorMarketplace.git
   cd voicematch
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Configure Environment Variables**

   Create a `.env.local` file and add:

   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the Application**

   ```bash
   npm run dev
   ```

5. **Access Locally**

   Open your browser and go to [http://localhost:3000](http://localhost:3000)

---

## AI Tools Usage

- **PRD Generation**: Initial structure and flow brainstormed using ChatGPT.
- **Code Snippets**: Components, hooks, Supabase integration assisted by Cursor & Lovable.
- **UI/UX Brainstorming**: Prompted AI for card layouts, modal fields, and state management best practices.
- **Database Design**: Suggested field naming and types validated via AI.
- More details available in `AIUsage.md` file

---

## Architecture Overview

- **Pages**: `/` (Marketplace), `/actors/[id]` (Voice Actor Profile), `/actors/new` (New Voice Actor Creation)
- **Components**: SearchBar, FilterMenu, VoiceActorCard, InviteModal, ProfileDetails
- **Hooks**: `useVoiceActors`, `useJobs`
- **Supabase Client**: Lightweight wrapper for CRUD operations.

## PRD Document

- Available in `projectRequirementDoc.md` file

---

## Deployment

The app is deployed using Vercel: https://voice-actor-marketplace.vercel.app

---

## Future Enhancements (Bonus Features)

- User authentication (sign up/sign in).
- Real-time job updates using Supabase subscriptions.
- Review and Rating submission by clients.
- Production deployment with SEO optimization.

---

## License

This project is licensed under the MIT License.

---

## Acknowledgements

- Built with Next.js, TailwindCSS, Supabase.
- Code and product thinking enhanced using AI-native tools.
