import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

async function sendGroupFormedMail({
  recipientEmail,
  userName,
  journeyDirection,
  journeyDate,
  journeyTime,
  groupMembers,
}) {
  const sesClient = new SESClient({
    region: "ap-south-1",
    credentials: {
      accessKeyId: process.env.SES_ACCESS_KEY_ID,
      secretAccessKey: process.env.SES_SECRET_KEY,
    },
  });

  const memberListHTML = groupMembers
    .map(
      (m, i) => `
      <tr>
        <td style="padding:8px; border-bottom:1px solid #eee;">${i + 1}</td>
        <td style="padding:8px; border-bottom:1px solid #eee;">${m.name}</td>
        <td style="padding:8px; border-bottom:1px solid #eee;">${m.email}</td>
        <td style="padding:8px; border-bottom:1px solid #eee;">${m.phone}</td>
      </tr>`
    )
    .join("");

  const htmlBody = `
  <div style="font-family:Arial, sans-serif; color:#333; background:#f9f9f9; padding:20px;">
    <div style="max-width:600px; margin:auto; background:#fff; border-radius:8px; padding:20px; box-shadow:0 2px 6px rgba(0,0,0,0.1);">
      <h2 style="color:#2b6cb0;"> Your ShareLift Group is Confirmed!</h2>
      <p>Hi ${userName},</p>
      <p>Your travel group has been successfully formed! Here are the details:</p>
      <div style="margin:16px 0; padding:12px; background:#edf2f7; border-radius:6px;">
        <strong>Direction:</strong> ${journeyDirection}<br/>
        <strong>Date:</strong> ${journeyDate}<br/>
        <strong>Time:</strong> ${journeyTime}
      </div>
      <p><strong>Group Members:</strong></p>
      <table style="width:100%; border-collapse:collapse; font-size:14px;">
        <thead>
          <tr style="background:#f1f5f9;">
            <th style="text-align:left; padding:8px;">#</th>
            <th style="text-align:left; padding:8px;">Name</th>
            <th style="text-align:left; padding:8px;">Email</th>
            <th style="text-align:left; padding:8px;">Phone</th>
          </tr>
        </thead>
        <tbody>${memberListHTML}</tbody>
      </table>
      <p style="margin-top:20px;">You can now contact your group members to coordinate your trip.</p>
      <p style="font-size:13px; color:#555;">- The ShareLift Team</p>
    </div>
  </div>`;

  const textBody = `
Hi ${userName},

Your travel group has been successfully formed!

Direction: ${journeyDirection}
Date: ${journeyDate}
Time: ${journeyTime}

Group Members:
${groupMembers
  .map((m, i) => `${i + 1}. ${m.name} — ${m.email} | ${m.phone}`)
  .join("\n")}

– The ShareLift Team
`;

  const params = {
    Destination: { ToAddresses: [recipientEmail] },
    Message: {
      Body: {
        Html: { Data: htmlBody },
        Text: { Data: textBody },
      },
      Subject: { Data: "Your ShareLift Group is Confirmed" },
    },
    Source: "noreply@sharelift.in",
  };

  try {
    const data = await sesClient.send(new SendEmailCommand(params));
    console.log("Email sent successfully:", data.MessageId);
  } catch (err) {
    console.error("Error sending email:", err);
    throw new Error("Failed to send confirmation email");
  }
}
//------------------------------------------------------------
async function sendRegretMail({
  recipientEmail,
  userName,
  journeyDirection,
  journeyDate,
  journeyTime,
}) {
  const sesClient = new SESClient({
    region: "ap-south-1",
    credentials: {
      accessKeyId: process.env.SES_ACCESS_KEY_ID,
      secretAccessKey: process.env.SES_SECRET_KEY,
    },
  });

  const htmlBody = `
  <div style="font-family:Arial, sans-serif; color:#333; background:#f9f9f9; padding:20px;">
    <div style="max-width:600px; margin:auto; background:#fff; border-radius:8px; padding:20px; box-shadow:0 2px 6px rgba(0,0,0,0.1);">
      <h2 style="color:#e53e3e;"> We Couldn't Form Your Group</h2>
      <p>Hi ${userName},</p>
      <p>
        Unfortunately, we couldn’t find enough travel partners for your ride:
      </p>
      <div style="margin:16px 0; padding:12px; background:#fef2f2; border-radius:6px;">
        <strong>Direction:</strong> ${journeyDirection}<br/>
        <strong>Date:</strong> ${journeyDate}<br/>
        <strong>Time:</strong> ${journeyTime}
      </div>
      <p>
        
        We’ll continue improving our matching system to serve you better.
      </p>
      <p style="margin-top:16px;">Thank you for using <strong>ShareLift</strong>! 💙</p>
      <p style="font-size:13px; color:#555;">- The ShareLift Team</p>
    </div>
  </div>`;

  const textBody = `
Hi ${userName},

We couldn’t form a group for your ride.

Direction: ${journeyDirection}
Date: ${journeyDate}
Time: ${journeyTime}

Invite your friends to use ShareLift and increase your chances of getting matched sooner!

– The ShareLift Team
`;

  const params = {
    Destination: { ToAddresses: [recipientEmail] },
    Message: {
      Body: {
        Html: { Data: htmlBody },
        Text: { Data: textBody },
      },
      Subject: { Data: "We Couldn't Form Your ShareLift Group" },
    },
    Source: "noreply@sharelift.in",
  };

  try {
    const data = await sesClient.send(new SendEmailCommand(params));
    console.log("Regret email sent:", data.MessageId);
  } catch (err) {
    console.error("Error sending regret email:", err);
    throw new Error("Failed to send regret email");
  }
}
async function sendPartialGroupFormed(groupMembers, group) {
  const sesClient = new SESClient({
    region: "ap-south-1",
    credentials: {
      accessKeyId: process.env.SES_ACCESS_KEY_ID,
      secretAccessKey: process.env.SES_SECRET_KEY,
    },
  });

  const memberListHTML = groupMembers
    .map(
      (m, i) => `
      <tr>
        <td style="padding:8px; border-bottom:1px solid #eee;">${i + 1}</td>
        <td style="padding:8px; border-bottom:1px solid #eee;">${m.name}</td>
        <td style="padding:8px; border-bottom:1px solid #eee;">${m.email}</td>
        <td style="padding:8px; border-bottom:1px solid #eee;">${m.phone}</td>
      </tr>`
    )
    .join("");

  const htmlBody = `
  <div style="font-family:Arial, sans-serif; color:#333; background:#f9f9f9; padding:20px;">
    <div style="max-width:600px; margin:auto; background:#fff; border-radius:8px; padding:20px; box-shadow:0 2px 6px rgba(0,0,0,0.1);">
      <h2 style="color:#d97706;"> Your Group is Partially Formed</h2>
      <p>Hi there,</p>
      <p>We tried to form a full travel group for your trip but only a few members matched so far.</p>
      <div style="margin:16px 0; padding:12px; background:#fef3c7; border-radius:6px;">
        <strong>Direction:</strong> ${group.direction}<br/>
        <strong>Date:</strong> ${
          group.journeyDate.toISOString().split("T")[0]
        }<br/>
        <strong>Time:</strong> ${group.journeyTime}
      </div>
      <p><strong>Current Members:</strong></p>
      <table style="width:100%; border-collapse:collapse; font-size:14px;">
        <thead>
          <tr style="background:#f1f5f9;">
            <th style="text-align:left; padding:8px;">#</th>
            <th style="text-align:left; padding:8px;">Name</th>
            <th style="text-align:left; padding:8px;">Email</th>
            <th style="text-align:left; padding:8px;">Phone</th>
          </tr>
        </thead>
        <tbody>${memberListHTML}</tbody>
      </table>
      <p style="margin-top:20px;">You can contact them to coordinate your journey, or wait for more matches to join.</p>
      <p style="font-size:13px; color:#555;">— The ShareLift Team</p>
    </div>
  </div>`;

  const textBody = `
Hi,

We tried to form a full travel group, but only a few members matched so far.

Direction: ${group.direction}
Date: ${group.journeyDate.toISOString().split("T")[0]}
Time: ${group.journeyTime}

Current Members:
${groupMembers
  .map((m, i) => `${i + 1}. ${m.name} — ${m.email} | ${m.phone}`)
  .join("\n")}

You can contact them to coordinate your journey.

- The ShareLift Team
`;

  const recipientEmails = groupMembers.map((m) => m.email);

  const params = {
    Destination: { ToAddresses: recipientEmails },
    Message: {
      Body: { Html: { Data: htmlBody }, Text: { Data: textBody } },
      Subject: { Data: "Your Group is Partially Formed" },
    },
    Source: "noreply@sharelift.in",
  };

  try {
    const data = await sesClient.send(new SendEmailCommand(params));
    console.log("Partial group email sent:", data.MessageId);
  } catch (err) {
    console.error("Error sending partial group email:", err);
    throw new Error("Failed to send partial group email");
  }
}

//--------------------------------------------------
async function ContactMeMail({ recipientEmail, userName, message }) {
  const sesClient = new SESClient({
    region: "ap-south-1",
    credentials: {
      accessKeyId: process.env.SES_ACCESS_KEY_ID,
      secretAccessKey: process.env.SES_SECRET_KEY,
    },
  });

  const htmlBody = `
  <div style="font-family:Arial, sans-serif; color:#333; background:#f9f9f9; padding:20px;">
    <div style="max-width:600px; margin:auto; background:#fff; border-radius:8px; padding:20px; box-shadow:0 2px 6px rgba(0,0,0,0.1);">
      <h2 style="color:#2b6cb0;"> Review / complaint from user </h2>
      <p>username : ${userName}</p>
      <p>email : ${recipientEmail}</p>
      <p>${message}</p>
      
    </div>
  </div>`;

  const textBody = `
Username: ${userName}
Email: ${recipientEmail}

Message:
${message}
`;

  const params = {
    Destination: { ToAddresses: ["raunakzyx2@gmail.com"] },
    Message: {
      Body: {
        Html: { Data: htmlBody },
        Text: { Data: textBody },
      },
      Subject: { Data: "ShareLift User review/complaint" },
    },
    Source: "noreply@sharelift.in",
  };

  try {
    const data = await sesClient.send(new SendEmailCommand(params));
    console.log("Email sent successfully:", data.MessageId);
  } catch (err) {
    console.error("Error sending email:", err);
    throw new Error("Failed to send Contact me email");
  }
}
//--------------------------------------------------

export {
  sendGroupFormedMail,
  sendRegretMail,
  sendPartialGroupFormed,
  ContactMeMail,
};
