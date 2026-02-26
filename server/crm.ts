const CRM_BASE_URL = process.env.CRM_BASE_URL || "https://crm.skillcraft.it";
const CRM_WEBHOOK_API_KEY = process.env.CRM_WEBHOOK_API_KEY;

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

export async function forwardToCRM(data: {
  name: string;
  email: string;
  phone?: string | null;
  courseInterest?: string | null;
  message: string;
}): Promise<CRMResponse | null> {
  if (!CRM_WEBHOOK_API_KEY) {
    console.warn("CRM_WEBHOOK_API_KEY not configured — skipping CRM forwarding");
    return null;
  }

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

  if (data.phone) {
    payload.cellulare = data.phone;
  }

  if (data.courseInterest) {
    payload.corso_interesse = data.courseInterest;
  }

  try {
    const response = await fetch(`${CRM_BASE_URL}/api/webhook/nuova-richiesta`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": CRM_WEBHOOK_API_KEY,
      },
      body: JSON.stringify(payload),
    });

    const result: CRMResponse = await response.json();

    if (result.success) {
      console.log(`CRM: ${result.message} (cliente_id: ${result.cliente_id})`);
    } else {
      console.error("CRM webhook error:", result.error);
    }

    return result;
  } catch (error) {
    console.error("Failed to forward to CRM:", error);
    return null;
  }
}
