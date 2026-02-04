# Poll Dynamics

Poll Dynamics is a modern, user-friendly online polling platform that allows users to create, share, and participate in polls while viewing live results and analytics. The system is designed to simulate a real-world SaaS product and serves as a frontend engineering assessment project built with scalability, usability, and clear user flows in mind.

---

##  Features

###  User Authentication

* Sign up and log in functionality
* Guest access for viewing and voting on polls
* Secure logout

###  Onboarding & Landing Experience

* Onboarding page as the first entry point
* Landing page with platform insights
* Poll cards displaying available polls

###  Poll Creation 4-Step Wizard

1. **Basic Information**

   * Poll title
   * Poll description

2. **Poll Options**

   * Create voting options (minimum of 2)

3. **Poll Settings**

   * Poll duration
   * Poll visibility (public / private – private disabled for now)
   * Number of votes allowed per user

4. **Preview & Publish**

   * Review poll details
   * Publish poll for voting

###  Poll Sharing

After publishing a poll, users are redirected to a sharing page containing:

* A shareable poll link
* Social media share buttons
* A QR code for quick access
* Tips on how to get more votes
* Quick navigation buttons to:

  * Dashboard
  * Live results

###  Voting System

* Authenticated users can vote on polls
* Only one vote allowed per user
* Users who revisit a poll they have already voted on are redirected to the results page

###  Live Results

* Real-time or refreshed poll results
* Conditional redirection if a user has not voted

###  User Dashboard

The dashboard provides an overview of user activity, including:

* Total number of polls created
* Active polls (non-expired)
* Total votes across all polls
* Average votes per poll
* Clickable active poll cards that redirect to voting pages

---

##  User Journey Overview

1. User opens the app → Onboarding page
2. User proceeds to the landing page
3. User logs in, signs up, or continues as a guest
4. Authenticated users can:

   * Create a poll
   * Vote on polls
   * View live results
   * Access their dashboard
5. After poll creation, users can share polls and track engagement via the dashboard

---

##  Tech Stack

* **Frontend:** React + TypeScript
* **State Management:** Redux
* **Styling:** CSS / Tailwind / Styled Components (depending on implementation)
* **Build Tool:** Vite / CRA (depending on setup)
* **Deployment:** Netlify

---

##  Installation & Setup

```bash
# To Clone the repository use this command
git clone https://github.com/Vx-tech-2024/alx-project-nexus

# Navigate to project directory
cd alx-online_poll_system

# Install dependencies
npm install

# Start development server
npm run dev
```

---

##  Deployment

The project is configured for deployment on **Netlify**.


---

##  Future Enhancements

* Private polls with access control
* Real-time updates using WebSockets
* Poll expiration handling
* Enhanced analytics and charts
* Admin moderation tools

---

##  License

This project is for educational and assessment purposes.

---

##  Author

**Joel Birundu George**
Frontend Engineer | Mathematics & Computer Science

---

Feel free to fork, improve, or extend this project 🚀
