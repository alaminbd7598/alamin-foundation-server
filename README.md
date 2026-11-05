# Alamin Foundation - Social Development Events Platform

**Live Website URL:** [https://alamin-foundation-events.vercel.app](https://alamin-foundation-events.vercel.app)

**Alamin Foundation - Social Development Events Platform** is a community-driven event management platform where citizens, youth collectives, and local organizers across Bangladesh create, join, and track verified social service events in their neighborhood—such as winter clothes distributions in Mirpur 10, blanket drives for the needy in Mohammadpur, Dhanmondi Lake cleanups, urban tree plantations, and community healthcare camps.

---

## Key Features

- **Dynamic Upcoming Events & MongoDB `.limit(6)` Feed:** The Home page dynamically displays the 6 nearest upcoming events sorted chronologically by date using the `.limit(6)` operator, while the Upcoming Events directory automatically filters out any past-dated events and offers instant category filtering (`Cleanup`, `Plantation`, `Donation`, `Winter Drive`, `Healthcare`, `Education`, `Disaster Relief`) and keyword search.
- **Full-Stack Authentication & Private Route Reload Persistence:** Supports Email/Password authentication with strict password validation (uppercase letter, lowercase letter, minimum 6 characters) as well as Google and GitHub social login. Reloading any public or private route preserves the user's logged-in session without throwing 404 or redirecting to `/login`.
- **JWT-Protected Event Creation & Future Date Validation:** Logged-in users can publish new social development events with strict validation ensuring no past dates can be selected, automatically associating the event with the creator's email (`creatorEmail`).
- **One-Click Event Joining & Chronological Volunteer Schedule:** Authenticated users can join any upcoming event from the public Event Details page, storing their participation record in the database and viewing all joined initiatives sorted by event date on the **Joined Events** page—complete with an official printable **Alamin Foundation Volunteer Participation Pass**.
- **Creator-Only Event Management (Update & Delete):** Through the **Manage Events** dashboard, organizers can update event logistics or permanently delete their own created events via custom confirmation modals protected by server-side JWT and creator ownership checks.
- **Interactive 3D Card Architecture, Light/Dark Theme & Profile Management:** Features tactile 3D perspective card interactions, a full-system Light/Dark mode toggle across all pages, shimmer loading skeletons, a regional division impact explorer, and a dedicated **Profile Settings** page to update display name and profile picture (`photoURL`).

---

## Tech Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS v4, Lucide Icons
- **Backend:** Node.js, Express.js, RESTful API Architecture
- **Authentication & Authorization:** JSON Web Tokens (JWT `HS256`), Scrypt Password Hashing, OAuth 2.0 Social Sign-In
- **Database:** MongoDB-compatible Query Engine (`.find()`, `.sort()`, `.limit(6)`) with persistent storage

---

## Local Setup & Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd alamin-foundation-events
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

4. **Run unit tests:**
   ```bash
   npm test
   ```

