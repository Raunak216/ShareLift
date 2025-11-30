# 🚗 ShareLift – Find  Travelmates Easily
>Tired of spamming dozens of WhatsApp groups just to find a travel mate? Frustrated by high fares and empty seats during college breaks?

Introducing **ShareLift**: A modern web platform designed exclusively for college students. ShareLift instantly connects verified students traveling the same route, allowing you to split fares, share rides, and make every journey stress-free.


🌐 **Live Website:** [https://sharelift.in](https://sharelift.in)

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
## 🚀 Deployment & Access

The **ShareLift** platform is fully deployed and running on a modern, **serverless architecture** on Google Cloud. This setup ensures automatic scaling and high availability.

### 🔗 **Live Application Links**

You can access the live, deployed applications here:

* **Frontend App (Client):** [**sharelift.in**](https://sharelift.in)
* **Backend API (Server):**  **api.sharelift.in**

### ⚙️ **Deployment Architecture Details**

| Component | Technology | Deployment Platform | Status |
| :--- | :--- | :--- | :--- |
| **Frontend** | React (Build via `serve`) | Google Cloud Run (asia-southeast1) | Deployed & Mapped to `sharelift.in` |
| **Backend** | Express/Node.js | Google Cloud Run (asia-southeast1) | Deployed & Mapped to `api.sharelift.in` |

#### **Key Deployment Features:**

* **Continuous Deployment (CD):** The project is configured for automated CD. Every push to the main branch triggers an automatic build and update of the relevant Cloud Run service from the linked GitHub repository.
* **No Dockerfiles Required:** Deployment utilizes Cloud Run's automatic **Buildpacks** feature, which natively detects the Node.js runtime and containerizes the application directly from source code.
* **Custom Domain Mapping:** The deployed services are connected to the purchased domain, `sharelift.in`, using Google Cloud's Domain Mapping service.


## 👨‍💻 Developer

**Raunak Kumar**
🎓 B.Tech @ VIT, Vellore                                                                                                                                                                                             
💻 Passionate about MERN stack, cloud, and automation.

📫 Connect with me:                                                                                                                                                      
[LinkedIn](https://www.linkedin.com/in/raunak-216k/)                                                                                                                                                                 
Email: raunak.kr216@gmail.com
 
