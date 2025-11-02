# 🚗 ShareLift – Find  Travelmates Easily
> A modern web platform that connects verified college students traveling the same route — save money, share rides, and make your journeys stress-free.

🌐 **Live Website:** [https://sharelift.in](https://sharelift.in)

![ShareLift Preview](https://your-image-link-here.png)

---

## ✨ Features

- 🧠 **Smart Ride Grouping** — Automatically groups students with overlapping routes & timings.  
- 🧍‍♂️ **Verified VIT Login** — Google OAuth 2.0 with `@vitstudent.ac.in` email validation.  
- 💬 **Email Notifications** — Sent using **Amazon SNS & SES** (for confirmations and updates).  
- ⏱ **Auto Group Expiry** — Unfilled or expired rides trigger regret emails via scheduled jobs.  
- 💫 **Typewriter Animations** — Interactive landing page with smooth transitions.  
- ⚡ **Form Validations** — Built with `react-hook-form` and dynamic alerts.  
- 🌈 **Beautiful UI** — Glassmorphic card design with animated plasma gradient background.  
- ☁️ **Deployed on Google Cloud Run** — Backend and Frontend hosted separately for scalability.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-------------|
| Frontend | React (CRA),CSS, TailwindCSS, Framer Motion |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| Auth | Google OAuth 2.0 |
| Emailing | Amazon SES |
| Deployment | Google Cloud Run |
| Scheduler | node-cron |

---

## ⚙️ Environment Variables

To run this project, you’ll need to add the following environment variables to your `.env` file:

| Variable | Description |
|-----------|--------------|
| `MONGO_URL` | MongoDB Atlas connection string |
| `JWT_SECRET` | JWT signing key |
| `CLIENT_ID` | Google OAuth Client ID |
| `CLIENT_SECRET_ID` | Google OAuth Secret |
| `GOOGLE_OAUTH_REDIRECT_URL` | Redirect URI for Google OAuth |
| `FRONTEND_HOME_URL` | Base URL for frontend |
| `SES_ACCESS_KEY_ID` | AWS SES Access Key |
| `SES_SECRET_KEY` | AWS SES Secret |

---



## 👨‍💻 Developer

**Raunak Kumar**
🎓 B.Tech @ VIT, Vellore
💻 Passionate about MERN stack, cloud, and automation.

📫 Connect with me:
[LinkedIn](https://www.linkedin.com/in/raunak-216k/)
raunak.kr216@gmail.com
 
