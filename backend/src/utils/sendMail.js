import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

async function sendAdminAlert(subject, text) {
  try {
    await transporter.sendMail({
      from: { name: "ShareLift System", address: process.env.EMAIL_USERNAME },
      to: process.env.ADMIN_EMAIL,
      subject: ` ${subject}`,
      text: `${text}\n\nTimestamp: ${new Date().toLocaleString("en-IN")}`,
    });
    console.log("Admin alert sent successfully.");
  } catch (err) {
    console.error(
      "CRITICAL: SMTP is likely blocked. Could not send Admin Alert:",
      err.message
    );
  }
}

const sendMailHelper = async (params) => {
  try {
    return await transporter.sendMail(params);
  } catch (err) {
    const msg = err.message || "";
    const isQuotaError = /quota|Daily sending|4\.7\.0|5\.4\.5/i.test(msg);

    if (isQuotaError) {
      console.error("Gmail Quota Exceeded. Triggering Admin Alert...");
      await sendAdminAlert(
        "Gmail Quota Exceeded",
        "The daily sending limit for Gmail has been reached. The email worker will pause operations until the next reset."
      );
    } else {
      await sendAdminAlert(
        "Email Delivery Failed",
        `An email to ${params.to} failed.\nError: ${msg}`
      );
    }

    throw err;
  }
};

export async function sendGroupFormedMail({
  recipientEmail,
  userName,
  journeyDirection,
  journeyDate,
  journeyTime,
  transport,
  trainNumber,
  groupMembers,
}) {
  // Card Layout

  const memberListHTML = groupMembers
    .map(
      (m, i) => `
    <div style="border-bottom: 1px solid #eeeeee; padding: 12px 0;">
      <div style="font-weight: bold; color: #333; font-size: 16px;">
        ${i + 1}. ${m.name}
      </div>
      <div style="margin-top: 4px; color: #555; font-size: 14px;">
        📞 ${m.phone}
      </div>
      <div style="margin-top: 2px;">
        ✉️ <a href="mailto:${
          m.email
        }" style="color: #2b6cb0; text-decoration: none; font-size: 14px; word-break: break-all;">
          ${m.email}
        </a>
      </div>
    </div>`
    )
    .join("");

  const isTrainJourney = transport === "train";

  const journeyInfoHTML = isTrainJourney
    ? `<p style="margin: 5px 0;"><strong>🚆 Train Number:</strong> ${trainNumber}</p>`
    : `<p style="margin: 5px 0;"><strong>⏰ Time:</strong> ${journeyTime}</p>`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f4;">
      
      <div style="width: 100%; background-color: #f4f4f4; padding: 20px 0;">
        
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); width: 90%;">
          
          <div style="background-color: #2b6cb0; padding: 25px 20px; text-align: center; color: #ffffff;">
            <h1 style="margin: 0; font-size: 24px; font-weight: 700;">Group Formed! 🚕</h1>
          </div>

          <div style="padding: 25px;">
            <p style="font-size: 16px; color: #333; margin-top: 0;">Hi <strong>${userName}</strong>,</p>
            <p style="font-size: 16px; color: #555; line-height: 1.6;">Great news! Your travel group has been successfully formed.</p>
            
            <div style="background: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; margin: 20px 0;">
              <p style="margin: 5px 0; color: #4a5568;"><strong>📍 Direction:</strong> ${journeyDirection}</p>
              <p style="margin: 5px 0; color: #4a5568;"><strong>📅 Date:</strong> ${journeyDate}</p>
              ${journeyInfoHTML}
            </div>

            <p style="font-size: 16px; font-weight: bold; margin-bottom: 15px; border-bottom: 2px solid #2b6cb0; display: inline-block; padding-bottom: 5px;">Group Contact Details:</p>
            
            <div style="width: 100%;">
              ${memberListHTML}
            </div>

            <div style="margin-top: 24px; font-size: 14px; line-height: 1.6; color: #444; background-color: #ebf8ff; padding: 15px; border-radius: 6px; border-left: 4px solid #2b6cb0;">
              You can now connect with your group members using the contact details above to coordinate your travel plans.
            </div>

            <p style="margin-top: 30px; font-size: 14px; color: #888; text-align: center;">
              Safe travels!<br/><strong>The ShareLift Team</strong>
            </p>
          </div>
        </div>
      </div>
    </body>
    </html>`;

  return sendMailHelper({
    from: { name: "ShareLift", address: process.env.EMAIL_USERNAME },
    to: recipientEmail,
    subject: "Your Group is Formed ",
    html,
    text: `Hi ${userName}, your group for ${journeyDirection} on ${journeyDate} is formed! Check your email for contact details.`,
  });
}

export default transporter;
