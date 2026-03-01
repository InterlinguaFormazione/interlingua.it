const CRM_WEBHOOK_URL = process.env.CRM_WEBHOOK_URL || "https://crm-privati.skillcraft.it/api/webhook/nuova-richiesta";
const CRM_API_KEY = process.env.CRM_API_KEY;

interface CRMPayload {
  email: string;
  nome: string;
  cognome?: string;
  cellulare?: string;
  telefono?: string;
  citta?: string;
  provincia?: string;
  corso_interesse?: string;
  livello?: string;
  messaggio?: string;
  come_conosciuto?: string;
  source?: string;
}

interface CRMResponse {
  success: boolean;
  cliente_id?: number;
  iscrizione_id?: number;
  is_new_client?: boolean;
  message?: string;
  error?: string;
}

export async function sendToCRM(payload: CRMPayload): Promise<CRMResponse | null> {
  if (!CRM_API_KEY) {
    console.warn("CRM_API_KEY not configured — skipping CRM forwarding");
    return null;
  }

  try {
    const response = await fetch(CRM_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": CRM_API_KEY,
      },
      body: JSON.stringify(payload),
    });

    const result: CRMResponse = await response.json();

    if (result.success) {
      console.log(`CRM: ${result.message} (cliente_id: ${result.cliente_id}, source: ${payload.source})`);
    } else {
      console.error("CRM webhook error:", result.error);
    }

    return result;
  } catch (error) {
    console.error("Failed to send to CRM:", error);
    return null;
  }
}

export async function forwardToCRM(data: {
  name: string;
  email: string;
  phone?: string | null;
  courseInterest?: string | null;
  message: string;
}): Promise<CRMResponse | null> {
  const nameParts = data.name.trim().split(/\s+/);
  const nome = nameParts[0];
  const cognome = nameParts.length > 1 ? nameParts.slice(1).join(" ") : undefined;

  const payload: CRMPayload = {
    email: data.email,
    nome,
    cognome,
    messaggio: data.message,
    come_conosciuto: "Sito Web",
    source: "form-contatti",
  };

  if (data.phone) payload.cellulare = data.phone;
  if (data.courseInterest) payload.corso_interesse = data.courseInterest;

  return sendToCRM(payload);
}

export async function forwardPurchaseToCRM(data: {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  city?: string | null;
  province?: string | null;
  productName: string;
  amount: string;
  paymentMethod: string;
  source: string;
}): Promise<CRMResponse | null> {
  return sendToCRM({
    email: data.email,
    nome: data.firstName,
    cognome: data.lastName,
    cellulare: data.phone || undefined,
    citta: data.city || undefined,
    provincia: data.province || undefined,
    corso_interesse: data.productName,
    messaggio: `Acquisto completato: ${data.productName} — €${data.amount} via ${data.paymentMethod}`,
    come_conosciuto: "Sito Web",
    source: data.source,
  });
}

export async function forwardTestToCRM(data: {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  city?: string | null;
  province?: string | null;
  selfAssessedLevel?: string | null;
  finalLevel?: string | null;
  language: string;
  source: string;
}): Promise<CRMResponse | null> {
  const levelInfo = data.finalLevel
    ? `Risultato test ${data.language}: ${data.finalLevel}`
    : `Test ${data.language} iniziato (autovalutazione: ${data.selfAssessedLevel || "N/A"})`;

  return sendToCRM({
    email: data.email,
    nome: data.firstName,
    cognome: data.lastName,
    cellulare: data.phone || undefined,
    citta: data.city || undefined,
    provincia: data.province || undefined,
    livello: data.finalLevel || data.selfAssessedLevel || undefined,
    messaggio: levelInfo,
    come_conosciuto: "Sito Web",
    source: data.source,
  });
}

export async function forwardNewsletterToCRM(email: string): Promise<CRMResponse | null> {
  const localPart = email.split("@")[0] || "Utente";
  return sendToCRM({
    email,
    nome: localPart,
    messaggio: "Iscrizione alla newsletter dal sito web",
    come_conosciuto: "Sito Web",
    source: "newsletter",
  });
}
