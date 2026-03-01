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

const FROM_EMAIL = "SkillCraft-Interlingua <noreply@skillcraft.interlingua.it>";
const SC_FROM_EMAIL = "Speaker's Corner - Interlingua <speakers_corner@interlingua.it>";
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

export async function sendSubscriptionConfirmation(data: {
  nome: string;
  cognome: string;
  email: string;
  subscriptionStart: string;
  subscriptionEnd: string;
  amount: string;
  paypalOrderId: string;
}) {
  const htmlBody = `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; padding: 20px;">
      <div style="background: linear-gradient(135deg, #7c3aed, #14b8a6); padding: 24px; border-radius: 12px 12px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 22px;">Abbonamento Speaker's Corner Attivato!</h1>
        <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0; font-size: 14px;">SkillCraft-Interlingua</p>
      </div>
      <div style="background: white; padding: 24px; border-radius: 0 0 12px 12px; border: 1px solid #e5e7eb; border-top: none;">
        <p style="color: #4b5563; line-height: 1.6;">Gentile <strong>${data.nome} ${data.cognome}</strong>,</p>
        <p style="color: #4b5563; line-height: 1.6;">Il tuo abbonamento a Speaker's Corner è stato attivato con successo. Ecco il riepilogo:</p>
        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin: 16px 0;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 6px 0; font-weight: 600; color: #374151; width: 160px;">Importo pagato</td>
              <td style="padding: 6px 0; color: #16a34a; font-weight: 700;">&euro;${data.amount}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: 600; color: #374151;">Inizio abbonamento</td>
              <td style="padding: 6px 0; color: #4b5563;">${data.subscriptionStart}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: 600; color: #374151;">Scadenza</td>
              <td style="padding: 6px 0; color: #4b5563;">${data.subscriptionEnd}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: 600; color: #374151;">ID transazione PayPal</td>
              <td style="padding: 6px 0; color: #4b5563; font-size: 13px;">${data.paypalOrderId}</td>
            </tr>
          </table>
        </div>
        <p style="color: #4b5563; line-height: 1.6;">Puoi accedere alla tua area personale e prenotare le sessioni settimanali dalla pagina <a href="https://skillcraft.interlingua.it/speakers-corner" style="color: #7c3aed; text-decoration: none; font-weight: 600;">Speaker's Corner</a>.</p>
        <div style="margin-top: 24px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px; margin: 0;">Per qualsiasi domanda contattaci a:</p>
          <p style="margin: 4px 0 0;"><a href="mailto:infocorsi@skillcraft.interlingua.it" style="color: #7c3aed; font-size: 14px;">infocorsi@skillcraft.interlingua.it</a></p>
        </div>
        <p style="color: #9ca3af; font-size: 12px; margin-top: 24px;">Questa è un'email automatica di conferma pagamento.</p>
      </div>
    </div>
  `;

  const textBody = `Gentile ${data.nome} ${data.cognome},

Il tuo abbonamento a Speaker's Corner è stato attivato con successo.

Importo pagato: €${data.amount}
Inizio abbonamento: ${data.subscriptionStart}
Scadenza: ${data.subscriptionEnd}
ID transazione PayPal: ${data.paypalOrderId}

Puoi accedere alla tua area personale e prenotare le sessioni settimanali dalla pagina Speaker's Corner su https://skillcraft.interlingua.it/speakers-corner

Per qualsiasi domanda contattaci a: infocorsi@skillcraft.interlingua.it

— SkillCraft-Interlingua`;

  if (!ses) {
    console.log("Email sending disabled — skipping subscription confirmation");
    return;
  }

  const command = new SendEmailCommand({
    Source: SC_FROM_EMAIL,
    Destination: {
      ToAddresses: [data.email],
    },
    Message: {
      Subject: {
        Data: "Speaker's Corner — Conferma Abbonamento e Pagamento",
        Charset: "UTF-8",
      },
      Body: {
        Html: { Data: htmlBody, Charset: "UTF-8" },
        Text: { Data: textBody, Charset: "UTF-8" },
      },
    },
    ReplyToAddresses: [NOTIFICATION_EMAIL],
  });

  await ses.send(command);
}

export async function sendBookingConfirmation(data: {
  nome: string;
  cognome: string;
  email: string;
  sessionDate: string;
  sessionTime: string;
  topic?: string | null;
}) {
  const topicLine = data.topic ? `<tr><td style="padding: 6px 0; font-weight: 600; color: #374151; width: 120px;">Tema</td><td style="padding: 6px 0; color: #4b5563;">${data.topic}</td></tr>` : "";
  const htmlBody = `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; padding: 20px;">
      <div style="background: linear-gradient(135deg, #7c3aed, #14b8a6); padding: 24px; border-radius: 12px 12px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 22px;">Prenotazione Confermata!</h1>
        <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0; font-size: 14px;">Speaker's Corner — SkillCraft-Interlingua</p>
      </div>
      <div style="background: white; padding: 24px; border-radius: 0 0 12px 12px; border: 1px solid #e5e7eb; border-top: none;">
        <p style="color: #4b5563; line-height: 1.6;">Gentile <strong>${data.nome} ${data.cognome}</strong>,</p>
        <p style="color: #4b5563; line-height: 1.6;">La tua prenotazione per la sessione di Speaker's Corner è confermata:</p>
        <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 16px; margin: 16px 0;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 6px 0; font-weight: 600; color: #374151; width: 120px;">Data</td>
              <td style="padding: 6px 0; color: #4b5563;">${data.sessionDate}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: 600; color: #374151;">Ora</td>
              <td style="padding: 6px 0; color: #4b5563;">${data.sessionTime}</td>
            </tr>
            ${topicLine}
          </table>
        </div>
        <p style="color: #4b5563; line-height: 1.6;">Puoi gestire le tue prenotazioni dalla tua <a href="https://skillcraft.interlingua.it/speakers-corner" style="color: #7c3aed; text-decoration: none; font-weight: 600;">area personale</a>.</p>
        <div style="margin-top: 24px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px; margin: 0;">Per qualsiasi domanda contattaci a:</p>
          <p style="margin: 4px 0 0;"><a href="mailto:infocorsi@skillcraft.interlingua.it" style="color: #7c3aed; font-size: 14px;">infocorsi@skillcraft.interlingua.it</a></p>
        </div>
        <p style="color: #9ca3af; font-size: 12px; margin-top: 24px;">Questa è un'email automatica di conferma prenotazione.</p>
      </div>
    </div>
  `;

  const textBody = `Gentile ${data.nome} ${data.cognome},

La tua prenotazione per la sessione di Speaker's Corner è confermata:

Data: ${data.sessionDate}
Ora: ${data.sessionTime}${data.topic ? `\nTema: ${data.topic}` : ""}

Puoi gestire le tue prenotazioni dalla tua area personale su https://skillcraft.interlingua.it/speakers-corner

Per qualsiasi domanda contattaci a: infocorsi@skillcraft.interlingua.it

— SkillCraft-Interlingua`;

  if (!ses) {
    console.log("Email sending disabled — skipping booking confirmation");
    return;
  }

  const command = new SendEmailCommand({
    Source: `${data.nome} ${data.cognome} <speakers_corner@interlingua.it>`,
    Destination: {
      ToAddresses: [data.email],
      CcAddresses: [SC_FROM_EMAIL],
    },
    Message: {
      Subject: {
        Data: `Speaker's Corner — Prenotazione confermata per il ${data.sessionDate}`,
        Charset: "UTF-8",
      },
      Body: {
        Html: { Data: htmlBody, Charset: "UTF-8" },
        Text: { Data: textBody, Charset: "UTF-8" },
      },
    },
    ReplyToAddresses: [SC_FROM_EMAIL],
  });

  await ses.send(command);
}

export async function sendTestResultEmail(data: {
  candidateName: string;
  candidateEmail: string;
  candidatePhone?: string | null;
  candidateAzienda?: string | null;
  candidateCitta?: string | null;
  candidateProvincia?: string | null;
  grammarScore: number;
  grammarLevel: string;
  writingScore: number;
  writingLevel: string;
  speakingScore: number;
  speakingLevel: string;
  overallScore: number;
  overallLevel: string;
  writingResponses?: string;
  speakingResponses?: string;
}) {
  if (!ses) {
    console.warn("SES not configured — skipping test result email");
    return;
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) {
    console.warn("ADMIN_EMAIL not configured — skipping test result email");
    return;
  }

  const levelColor: Record<string, string> = {
    A1: "#e74c3c", A2: "#e67e22", B1: "#f39c12", B2: "#2ecc71", C1: "#3498db", C2: "#9b59b6",
  };

  const overallColor = levelColor[data.overallLevel] || "#333";

  let writingDetails = "";
  if (data.writingResponses) {
    try {
      const responses = JSON.parse(data.writingResponses);
      writingDetails = responses.map((r: any, i: number) => `
        <div style="margin: 12px 0; padding: 12px; background: #f8f9fa; border-radius: 8px; border-left: 3px solid #3498db;">
          <p style="font-weight: 600; margin: 0 0 4px;">Task ${i + 1}: ${r.prompt || ""}</p>
          <p style="margin: 4px 0; color: #555; font-size: 13px;"><strong>Score:</strong> ${r.score}/100 (${r.level})</p>
          <p style="margin: 4px 0; color: #555; font-size: 13px;"><strong>Feedback:</strong> ${r.feedback || ""}</p>
        </div>
      `).join("");
    } catch {}
  }

  let speakingDetails = "";
  if (data.speakingResponses) {
    try {
      const responses = JSON.parse(data.speakingResponses);
      speakingDetails = responses.map((r: any, i: number) => `
        <div style="margin: 12px 0; padding: 12px; background: #f8f9fa; border-radius: 8px; border-left: 3px solid #9b59b6;">
          <p style="font-weight: 600; margin: 0 0 4px;">Task ${i + 1}: ${r.prompt || ""}</p>
          <p style="margin: 4px 0; color: #555; font-size: 13px;"><strong>Score:</strong> ${r.score}/100 (${r.level})</p>
          <p style="margin: 4px 0; color: #555; font-size: 13px;"><strong>Feedback:</strong> ${r.feedback || ""}</p>
        </div>
      `).join("");
    } catch {}
  }

  const htmlBody = `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; padding: 20px;">
      <div style="background: linear-gradient(135deg, #1e40af, #f97316); padding: 24px; border-radius: 12px 12px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 22px;">English Placement Test Results</h1>
        <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0; font-size: 14px;">SkillCraft-Interlingua</p>
      </div>
      <div style="background: white; padding: 24px; border-radius: 0 0 12px 12px; border: 1px solid #e5e7eb; border-top: none;">
        <div style="text-align: center; padding: 20px; margin-bottom: 20px; background: linear-gradient(135deg, ${overallColor}15, ${overallColor}05); border-radius: 12px; border: 2px solid ${overallColor};">
          <p style="margin: 0; font-size: 14px; color: #666;">Overall Level</p>
          <h2 style="margin: 8px 0; font-size: 48px; color: ${overallColor}; font-weight: 800;">${data.overallLevel}</h2>
          <p style="margin: 0; font-size: 18px; color: #333; font-weight: 600;">${data.overallScore}/100</p>
        </div>

        <h3 style="margin: 20px 0 12px; color: #1e40af;">Candidate Information</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #f1f3f5; font-weight: 600; color: #374151; width: 140px;">Name</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #f1f3f5; color: #4b5563;">${data.candidateName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #f1f3f5; font-weight: 600; color: #374151;">Email</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #f1f3f5;"><a href="mailto:${data.candidateEmail}" style="color: #1e40af;">${data.candidateEmail}</a></td>
          </tr>
          ${data.candidatePhone ? `<tr><td style="padding: 8px 0; border-bottom: 1px solid #f1f3f5; font-weight: 600; color: #374151;">Phone</td><td style="padding: 8px 0; border-bottom: 1px solid #f1f3f5; color: #4b5563;">${data.candidatePhone}</td></tr>` : ""}
          ${data.candidateAzienda ? `<tr><td style="padding: 8px 0; border-bottom: 1px solid #f1f3f5; font-weight: 600; color: #374151;">Azienda</td><td style="padding: 8px 0; border-bottom: 1px solid #f1f3f5; color: #4b5563;">${data.candidateAzienda}</td></tr>` : ""}
          ${data.candidateCitta || data.candidateProvincia ? `<tr><td style="padding: 8px 0; border-bottom: 1px solid #f1f3f5; font-weight: 600; color: #374151;">Localita</td><td style="padding: 8px 0; border-bottom: 1px solid #f1f3f5; color: #4b5563;">${[data.candidateCitta, data.candidateProvincia ? `(${data.candidateProvincia})` : ""].filter(Boolean).join(" ")}</td></tr>` : ""}
        </table>

        <h3 style="margin: 20px 0 12px; color: #1e40af;">Section Scores</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="background: #f8f9fa;">
            <th style="padding: 10px; text-align: left; color: #374151;">Section</th>
            <th style="padding: 10px; text-align: center; color: #374151;">Score</th>
            <th style="padding: 10px; text-align: center; color: #374151;">Level</th>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #f1f3f5;">Grammar</td>
            <td style="padding: 10px; text-align: center; border-bottom: 1px solid #f1f3f5;">${data.grammarScore}/100</td>
            <td style="padding: 10px; text-align: center; border-bottom: 1px solid #f1f3f5;"><span style="background: ${levelColor[data.grammarLevel] || "#333"}; color: white; padding: 2px 10px; border-radius: 12px; font-size: 13px;">${data.grammarLevel}</span></td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #f1f3f5;">Writing</td>
            <td style="padding: 10px; text-align: center; border-bottom: 1px solid #f1f3f5;">${data.writingScore}/100</td>
            <td style="padding: 10px; text-align: center; border-bottom: 1px solid #f1f3f5;"><span style="background: ${levelColor[data.writingLevel] || "#333"}; color: white; padding: 2px 10px; border-radius: 12px; font-size: 13px;">${data.writingLevel}</span></td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #f1f3f5;">Speaking</td>
            <td style="padding: 10px; text-align: center; border-bottom: 1px solid #f1f3f5;">${data.speakingScore}/100</td>
            <td style="padding: 10px; text-align: center; border-bottom: 1px solid #f1f3f5;"><span style="background: ${levelColor[data.speakingLevel] || "#333"}; color: white; padding: 2px 10px; border-radius: 12px; font-size: 13px;">${data.speakingLevel}</span></td>
          </tr>
        </table>

        ${writingDetails ? `<h3 style="margin: 20px 0 12px; color: #3498db;">Writing Details</h3>${writingDetails}` : ""}
        ${speakingDetails ? `<h3 style="margin: 20px 0 12px; color: #9b59b6;">Speaking Details</h3>${speakingDetails}` : ""}

        <div style="margin-top: 24px; padding: 16px; background: #f0f9ff; border-radius: 8px; text-align: center;">
          <p style="margin: 0; color: #555; font-size: 13px;">Test completed on ${new Date().toLocaleDateString("it-IT", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
        </div>
      </div>
    </div>`;

  const command = new SendEmailCommand({
    Source: FROM_EMAIL,
    Destination: {
      ToAddresses: [adminEmail],
    },
    Message: {
      Subject: {
        Data: `English Test Result: ${data.candidateName} - Level ${data.overallLevel} (${data.overallScore}/100)`,
        Charset: "UTF-8",
      },
      Body: {
        Html: { Data: htmlBody, Charset: "UTF-8" },
      },
    },
    ReplyToAddresses: [data.candidateEmail],
  });

  await ses.send(command);
}

export async function sendEnglishTestResultEmail(data: {
  candidateName: string;
  candidateEmail: string;
  company: string;
  phone: string | null;
  finalLevel: string;
  overallScore: string;
  mcAccuracy: string;
  writingLevel: string | null;
  writingFeedback: string | null;
  writingScores: { grammar: number; vocabulary: number; coherence: number; taskCompletion: number } | null;
  speakingLevel: string | null;
  speakingFeedback: string | null;
  speakingScores: { grammar: number; vocabulary: number; coherence: number; taskCompletion: number } | null;
  sectionResults: Array<{ sectionName: string; cefrLevel: string | null; accuracy: number | null }>;
}): Promise<void> {
  if (!ses) {
    console.warn("SES not configured — English adaptive test result email not sent");
    return;
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) {
    console.warn("ADMIN_EMAIL not set — English adaptive test result email not sent");
    return;
  }

  const sectionRows = data.sectionResults.map(s =>
    `<tr><td style="padding:8px;border-bottom:1px solid #eee;">${s.sectionName}</td><td style="padding:8px;text-align:center;border-bottom:1px solid #eee;">${s.cefrLevel || "N/A"}</td><td style="padding:8px;text-align:center;border-bottom:1px solid #eee;">${s.accuracy !== null ? s.accuracy + "%" : "N/A"}</td></tr>`
  ).join("");

  const writingBlock = data.writingLevel && data.writingScores ? `
    <h3 style="margin:20px 0 8px;color:#2563eb;">Writing Assessment</h3>
    <p><strong>Level:</strong> ${data.writingLevel}</p>
    <p>Grammar: ${data.writingScores.grammar}/100 | Vocabulary: ${data.writingScores.vocabulary}/100 | Coherence: ${data.writingScores.coherence}/100 | Task: ${data.writingScores.taskCompletion}/100</p>
    ${data.writingFeedback ? `<p style="color:#555;font-style:italic;">${data.writingFeedback}</p>` : ""}
  ` : "";

  const speakingBlock = data.speakingLevel && data.speakingScores ? `
    <h3 style="margin:20px 0 8px;color:#7c3aed;">Speaking Assessment</h3>
    <p><strong>Level:</strong> ${data.speakingLevel}</p>
    <p>Grammar: ${data.speakingScores.grammar}/100 | Vocabulary: ${data.speakingScores.vocabulary}/100 | Coherence: ${data.speakingScores.coherence}/100 | Task: ${data.speakingScores.taskCompletion}/100</p>
    ${data.speakingFeedback ? `<p style="color:#555;font-style:italic;">${data.speakingFeedback}</p>` : ""}
  ` : "";

  const htmlBody = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;">
      <div style="background:linear-gradient(135deg,#1e40af,#3b82f6);padding:24px;text-align:center;">
        <h1 style="color:#fff;margin:0;font-size:22px;">English Adaptive Test Result</h1>
        <p style="color:#dbeafe;margin:8px 0 0;font-size:14px;">${data.candidateName}${data.company ? " - " + data.company : ""}</p>
      </div>
      <div style="padding:24px;">
        <div style="text-align:center;margin-bottom:24px;">
          <div style="display:inline-block;background:#1e40af;color:#fff;padding:12px 32px;border-radius:8px;font-size:28px;font-weight:bold;">${data.finalLevel}</div>
          <p style="color:#666;margin:8px 0 0;">Overall Level</p>
        </div>
        <table style="width:100%;margin-bottom:16px;">
          <tr><td style="color:#666;">Email:</td><td>${data.candidateEmail}</td></tr>
          ${data.company ? `<tr><td style="color:#666;">Company:</td><td>${data.company}</td></tr>` : ""}
          ${data.phone ? `<tr><td style="color:#666;">Phone:</td><td>${data.phone}</td></tr>` : ""}
          <tr><td style="color:#666;">MC Accuracy:</td><td>${data.mcAccuracy}</td></tr>
        </table>
        <h3 style="margin:20px 0 8px;color:#333;">Section Breakdown</h3>
        <table style="width:100%;border-collapse:collapse;">
          <tr style="background:#f8fafc;"><th style="padding:8px;text-align:left;">Section</th><th style="padding:8px;text-align:center;">Level</th><th style="padding:8px;text-align:center;">Accuracy</th></tr>
          ${sectionRows}
        </table>
        ${writingBlock}
        ${speakingBlock}
        <div style="margin-top:24px;padding:12px;background:#f0f9ff;border-radius:8px;text-align:center;">
          <p style="margin:0;color:#555;font-size:12px;">Test completed: ${new Date().toLocaleDateString("it-IT", { day:"2-digit", month:"long", year:"numeric", hour:"2-digit", minute:"2-digit" })}</p>
        </div>
      </div>
    </div>`;

  const command = new SendEmailCommand({
    Source: FROM_EMAIL,
    Destination: { ToAddresses: [adminEmail] },
    Message: {
      Subject: { Data: `English Test: ${data.candidateName}${data.company ? " (" + data.company + ")" : ""} - ${data.finalLevel}`, Charset: "UTF-8" },
      Body: { Html: { Data: htmlBody, Charset: "UTF-8" } },
    },
    ReplyToAddresses: [data.candidateEmail],
  });

  await ses.send(command);
}

export async function sendEnglishTestConfirmationEmail(email: string, firstName: string, resultData?: {
  finalLevel: string;
  sectionResults: Array<{ sectionName: string; cefrLevel: string | null; accuracy: number | null }>;
  writingLevel: string | null;
  writingFeedback: string | null;
  speakingLevel: string | null;
  speakingFeedback: string | null;
}): Promise<void> {
  if (!ses) return;

  const courseRecommendations: Record<string, { description: string; courses: string[] }> = {
    "A0": {
      description: "Your test result is A0. To progress to the next level, we recommend an A1 beginner course to build your foundational English skills.",
      courses: ["General English - Beginner (A1)", "English Starter Intensive Course"],
    },
    "A1": {
      description: "Your current level is A1. To reach A2, we recommend an elementary course that will expand your vocabulary and build confidence in everyday situations.",
      courses: ["General English - Elementary (A2)", "English for Daily Life (A2)", "Conversation Course - Elementary"],
    },
    "A2": {
      description: "Your current level is A2. To progress to B1, we recommend a pre-intermediate course to develop your grammar and communication skills for more complex situations.",
      courses: ["General English - Pre-Intermediate (B1)", "Conversation Course - Pre-Intermediate", "Cambridge KET Preparation"],
    },
    "B1": {
      description: "Your current level is B1. To advance to B2, we recommend an upper-intermediate course that will strengthen your fluency and prepare you for professional or academic contexts.",
      courses: ["General English - Upper-Intermediate (B2)", "Business English - Upper-Intermediate (B2)", "Cambridge FCE Preparation", "Full Immersion Course"],
    },
    "B2": {
      description: "Your current level is B2. To reach C1, we recommend an advanced course that will refine your precision, nuance, and ability to handle complex language.",
      courses: ["Advanced English (C1)", "Business English - Advanced (C1)", "Cambridge CAE Preparation", "Full Immersion Course"],
    },
    "C1": {
      description: "Your current level is C1. To achieve C2 proficiency, we recommend a mastery-level course focused on specialised language and near-native fluency.",
      courses: ["English Masterclass (C2)", "Cambridge CPE Preparation", "Specialised Business English - Proficiency", "Full Immersion Course"],
    },
    "C2": {
      description: "Congratulations — you have reached C2, the highest level! To maintain and sharpen your skills, we recommend specialised courses in your areas of interest.",
      courses: ["English Masterclass - Maintenance (C2)", "Cambridge CPE Preparation", "Specialised Business English", "Full Immersion Course"],
    },
  };

  let resultBlock = "";
  let courseBlock = "";
  let subjectSuffix = "";

  if (resultData) {
    subjectSuffix = ` — Your Level: ${resultData.finalLevel}`;

    const rec = courseRecommendations[resultData.finalLevel] || courseRecommendations["B1"];

    const sectionRows = resultData.sectionResults.map(s =>
      `<tr>
        <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;color:#334155;">${s.sectionName}</td>
        <td style="padding:10px 12px;text-align:center;border-bottom:1px solid #e2e8f0;font-weight:bold;color:#1e40af;">${s.cefrLevel || "N/A"}</td>
        <td style="padding:10px 12px;text-align:center;border-bottom:1px solid #e2e8f0;color:#334155;">${s.accuracy !== null ? s.accuracy + "%" : "N/A"}</td>
      </tr>`
    ).join("");

    const writingRow = resultData.writingLevel ? `
      <tr>
        <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;color:#334155;">✍️ Writing</td>
        <td style="padding:10px 12px;text-align:center;border-bottom:1px solid #e2e8f0;font-weight:bold;color:#2563eb;">${resultData.writingLevel}</td>
        <td style="padding:10px 12px;text-align:center;border-bottom:1px solid #e2e8f0;color:#64748b;font-size:12px;font-style:italic;">${resultData.writingFeedback ? resultData.writingFeedback.substring(0, 80) + (resultData.writingFeedback.length > 80 ? "..." : "") : ""}</td>
      </tr>` : "";

    const speakingRow = resultData.speakingLevel ? `
      <tr>
        <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;color:#334155;">🎤 Speaking</td>
        <td style="padding:10px 12px;text-align:center;border-bottom:1px solid #e2e8f0;font-weight:bold;color:#7c3aed;">${resultData.speakingLevel}</td>
        <td style="padding:10px 12px;text-align:center;border-bottom:1px solid #e2e8f0;color:#64748b;font-size:12px;font-style:italic;">${resultData.speakingFeedback ? resultData.speakingFeedback.substring(0, 80) + (resultData.speakingFeedback.length > 80 ? "..." : "") : ""}</td>
      </tr>` : "";

    resultBlock = `
      <div style="text-align:center;margin:24px 0;">
        <p style="color:#64748b;font-size:13px;margin:0 0 8px;text-transform:uppercase;letter-spacing:1px;">Your Overall Level</p>
        <div style="display:inline-block;background:linear-gradient(135deg,#1e40af,#3b82f6);color:#fff;padding:16px 40px;border-radius:12px;font-size:32px;font-weight:bold;letter-spacing:2px;">${resultData.finalLevel}</div>
      </div>

      <h3 style="color:#1e293b;font-size:16px;margin:28px 0 12px;border-bottom:2px solid #e2e8f0;padding-bottom:8px;">📊 Section Breakdown</h3>
      <table style="width:100%;border-collapse:collapse;margin-bottom:8px;">
        <tr style="background:#f1f5f9;">
          <th style="padding:10px 12px;text-align:left;font-size:13px;color:#64748b;">Section</th>
          <th style="padding:10px 12px;text-align:center;font-size:13px;color:#64748b;">Level</th>
          <th style="padding:10px 12px;text-align:center;font-size:13px;color:#64748b;">Accuracy</th>
        </tr>
        ${sectionRows}
        ${writingRow}
        ${speakingRow}
      </table>
    `;

    const courseList = rec.courses.map(c => `<li style="padding:4px 0;color:#334155;">${c}</li>`).join("");

    courseBlock = `
      <div style="margin:28px 0;padding:20px;background:linear-gradient(135deg,#f0f9ff,#e0f2fe);border-radius:12px;border-left:4px solid #3b82f6;">
        <h3 style="color:#1e40af;font-size:16px;margin:0 0 10px;">🎯 Our Recommendation for You</h3>
        <p style="color:#334155;font-size:14px;line-height:1.6;margin:0 0 12px;">${rec.description}</p>
        <p style="color:#1e40af;font-size:13px;font-weight:bold;margin:0 0 6px;">Suggested courses:</p>
        <ul style="margin:0;padding-left:20px;font-size:14px;">${courseList}</ul>
      </div>

      <div style="text-align:center;margin:20px 0;">
        <a href="https://skillcraft.interlingua.it" style="display:inline-block;background:linear-gradient(135deg,#1e40af,#3b82f6);color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:15px;">Explore Our Courses</a>
      </div>
    `;
  }

  const htmlBody = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0;">
      <div style="background:linear-gradient(135deg,#1e40af,#3b82f6);padding:28px;text-align:center;">
        <h1 style="color:#fff;margin:0;font-size:22px;">Grazie, ${firstName}!</h1>
        <p style="color:#dbeafe;margin:8px 0 0;font-size:14px;">English Adaptive Test — Results</p>
      </div>
      <div style="padding:28px;">
        <p style="color:#334155;font-size:15px;line-height:1.6;">Thank you for completing the English Adaptive Test. Here are your results:</p>
        ${resultBlock}
        ${courseBlock}
        <p style="color:#334155;font-size:14px;line-height:1.6;">If you have any questions about your results or would like to discuss the best course for your needs, please don't hesitate to contact us.</p>
        <div style="margin-top:28px;padding:16px;background:#f8fafc;border-radius:8px;text-align:center;">
          <p style="margin:0;color:#64748b;font-size:12px;">Test completed: ${new Date().toLocaleDateString("it-IT", { day:"2-digit", month:"long", year:"numeric", hour:"2-digit", minute:"2-digit" })}</p>
          <p style="margin:8px 0 0;color:#94a3b8;font-size:11px;">Interlingua / SkillCraft</p>
        </div>
      </div>
    </div>`;

  const command = new SendEmailCommand({
    Source: FROM_EMAIL,
    Destination: { ToAddresses: [email] },
    Message: {
      Subject: { Data: `English Adaptive Test — Results${subjectSuffix}`, Charset: "UTF-8" },
      Body: { Html: { Data: htmlBody, Charset: "UTF-8" } },
    },
  });

  await ses.send(command);
}
