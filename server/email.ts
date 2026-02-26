import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

function createSESClient(): SESClient | null {
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  const region = process.env.AWS_REGION;

  if (!accessKeyId || !secretAccessKey || !region) {
    console.warn("AWS SES credentials not configured — email sending disabled");
    return null;
  }

  return new SESClient({
    region,
    credentials: { accessKeyId, secretAccessKey },
  });
}

const ses = createSESClient();

const FROM_EMAIL = "noreply@skillcraft.interlingua.it";
const NOTIFICATION_EMAIL = "infocorsi@skillcraft.interlingua.it";

export async function sendContactNotification(data: {
  name: string;
  email: string;
  phone?: string | null;
  courseInterest?: string | null;
  message: string;
}) {
  const htmlBody = `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; padding: 20px;">
      <div style="background: linear-gradient(135deg, #7c3aed, #14b8a6); padding: 24px; border-radius: 12px 12px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 22px;">Nuova Richiesta di Contatto</h1>
        <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0; font-size: 14px;">SkillCraft-Interlingua — Formazione Privati</p>
      </div>
      <div style="background: white; padding: 24px; border-radius: 0 0 12px 12px; border: 1px solid #e5e7eb; border-top: none;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f1f3f5; font-weight: 600; color: #374151; width: 140px;">Nome</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f1f3f5; color: #4b5563;">${data.name}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f1f3f5; font-weight: 600; color: #374151;">Email</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f1f3f5;"><a href="mailto:${data.email}" style="color: #7c3aed;">${data.email}</a></td>
          </tr>
          ${data.phone ? `
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f1f3f5; font-weight: 600; color: #374151;">Telefono</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f1f3f5;"><a href="tel:${data.phone}" style="color: #7c3aed;">${data.phone}</a></td>
          </tr>` : ""}
          ${data.courseInterest ? `
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f1f3f5; font-weight: 600; color: #374151;">Corso</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f1f3f5; color: #4b5563;">${data.courseInterest}</td>
          </tr>` : ""}
        </table>
        <div style="margin-top: 20px;">
          <p style="font-weight: 600; color: #374151; margin-bottom: 8px;">Messaggio:</p>
          <div style="background: #f8f9fa; padding: 16px; border-radius: 8px; color: #4b5563; line-height: 1.6; white-space: pre-wrap;">${data.message}</div>
        </div>
      </div>
    </div>
  `;

  const textBody = `Nuova Richiesta di Contatto — SkillCraft-Interlingua

Nome: ${data.name}
Email: ${data.email}
${data.phone ? `Telefono: ${data.phone}` : ""}
${data.courseInterest ? `Corso: ${data.courseInterest}` : ""}

Messaggio:
${data.message}`;

  if (!ses) {
    console.log("Email sending disabled — skipping contact notification");
    return;
  }

  const command = new SendEmailCommand({
    Source: FROM_EMAIL,
    Destination: {
      ToAddresses: [NOTIFICATION_EMAIL],
    },
    Message: {
      Subject: {
        Data: `[Sito Web] Nuova richiesta da ${data.name}`,
        Charset: "UTF-8",
      },
      Body: {
        Html: {
          Data: htmlBody,
          Charset: "UTF-8",
        },
        Text: {
          Data: textBody,
          Charset: "UTF-8",
        },
      },
    },
    ReplyToAddresses: [data.email],
  });

  await ses.send(command);
}

export async function sendContactConfirmation(data: {
  name: string;
  email: string;
  courseInterest?: string | null;
}) {
  const htmlBody = `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; padding: 20px;">
      <div style="background: linear-gradient(135deg, #7c3aed, #14b8a6); padding: 24px; border-radius: 12px 12px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 22px;">Grazie per averci contattato!</h1>
        <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0; font-size: 14px;">SkillCraft-Interlingua — Formazione Professionale</p>
      </div>
      <div style="background: white; padding: 24px; border-radius: 0 0 12px 12px; border: 1px solid #e5e7eb; border-top: none;">
        <p style="color: #4b5563; line-height: 1.6;">Gentile <strong>${data.name}</strong>,</p>
        <p style="color: #4b5563; line-height: 1.6;">Abbiamo ricevuto la tua richiesta${data.courseInterest ? ` relativa al corso <strong>${data.courseInterest}</strong>` : ""}. Il nostro team ti risponderà il prima possibile, solitamente entro 24 ore lavorative.</p>
        <p style="color: #4b5563; line-height: 1.6;">Nel frattempo, puoi esplorare la nostra offerta formativa su <a href="https://skillcraft.interlingua.it" style="color: #7c3aed; text-decoration: none; font-weight: 600;">skillcraft.interlingua.it</a></p>
        <div style="margin-top: 24px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px; margin: 0;">Per qualsiasi urgenza puoi contattarci a:</p>
          <p style="margin: 4px 0 0;"><a href="mailto:infocorsi@skillcraft.interlingua.it" style="color: #7c3aed; font-size: 14px;">infocorsi@skillcraft.interlingua.it</a></p>
        </div>
        <p style="color: #9ca3af; font-size: 12px; margin-top: 24px;">Questa è un'email automatica. Se non hai inviato alcuna richiesta, puoi ignorare questo messaggio.</p>
      </div>
    </div>
  `;

  const textBody = `Gentile ${data.name},

Abbiamo ricevuto la tua richiesta${data.courseInterest ? ` relativa al corso ${data.courseInterest}` : ""}. Il nostro team ti risponderà il prima possibile, solitamente entro 24 ore lavorative.

Nel frattempo, puoi esplorare la nostra offerta formativa su https://skillcraft.interlingua.it

Per qualsiasi urgenza puoi contattarci a: infocorsi@skillcraft.interlingua.it

— SkillCraft-Interlingua`;

  if (!ses) {
    console.log("Email sending disabled — skipping contact confirmation to sender");
    return;
  }

  const command = new SendEmailCommand({
    Source: FROM_EMAIL,
    Destination: {
      ToAddresses: [data.email],
    },
    Message: {
      Subject: {
        Data: "SkillCraft-Interlingua — Abbiamo ricevuto la tua richiesta",
        Charset: "UTF-8",
      },
      Body: {
        Html: {
          Data: htmlBody,
          Charset: "UTF-8",
        },
        Text: {
          Data: textBody,
          Charset: "UTF-8",
        },
      },
    },
    ReplyToAddresses: [NOTIFICATION_EMAIL],
  });

  await ses.send(command);
}

export async function sendNewsletterConfirmation(email: string) {
  const htmlBody = `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; padding: 20px;">
      <div style="background: linear-gradient(135deg, #7c3aed, #14b8a6); padding: 24px; border-radius: 12px 12px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 22px;">Iscrizione alla Newsletter</h1>
        <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0; font-size: 14px;">SkillCraft-Interlingua</p>
      </div>
      <div style="background: white; padding: 24px; border-radius: 0 0 12px 12px; border: 1px solid #e5e7eb; border-top: none;">
        <p style="color: #4b5563; line-height: 1.6;">Grazie per esserti iscritto alla nostra newsletter!</p>
        <p style="color: #4b5563; line-height: 1.6;">Riceverai aggiornamenti sui nostri corsi di formazione, novità nel campo dell'AI e delle competenze digitali, e offerte esclusive.</p>
        <p style="color: #9ca3af; font-size: 12px; margin-top: 24px;">Se non hai richiesto questa iscrizione, puoi ignorare questa email.</p>
      </div>
    </div>
  `;

  if (!ses) {
    console.log("Email sending disabled — skipping newsletter confirmation");
    return;
  }

  const command = new SendEmailCommand({
    Source: FROM_EMAIL,
    Destination: {
      ToAddresses: [email],
    },
    Message: {
      Subject: {
        Data: "Benvenuto nella Newsletter di SkillCraft-Interlingua!",
        Charset: "UTF-8",
      },
      Body: {
        Html: {
          Data: htmlBody,
          Charset: "UTF-8",
        },
        Text: {
          Data: "Grazie per esserti iscritto alla nostra newsletter! Riceverai aggiornamenti sui nostri corsi di formazione, novità nel campo dell'AI e delle competenze digitali, e offerte esclusive.",
          Charset: "UTF-8",
        },
      },
    },
  });

  await ses.send(command);
}
