import https from "https";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PRODUCTION_ENDPOINT = "https://ws-cartegiovani.cultura.gov.it/WSUtilizzoVoucherGMWEB/VerificaVoucher";
const TEST_ENDPOINT = "https://wstestcartegiovani.cultura.gov.it/WSUtilizzoVoucherGMWEB/VerificaVoucher";
const PARTITA_IVA = "03828240246";
const SOAP_NS = "http://bonus.mic.it/VerificaVoucher/";

function getEndpoint(): string {
  return process.env.NODE_ENV === "production" ? PRODUCTION_ENDPOINT : TEST_ENDPOINT;
}

function getHttpsAgent(): https.Agent | null {
  try {
    const certPath = path.join(__dirname, "certs", "carta-cultura.cer");
    const cert = fs.readFileSync(certPath);
    const privateKeyPem = process.env.CARTA_CULTURA_PRIVATE_KEY;
    if (!privateKeyPem) {
      console.warn("CARTA_CULTURA_PRIVATE_KEY not set — Carta della Cultura integration disabled");
      return null;
    }
    return new https.Agent({
      cert,
      key: privateKeyPem,
      rejectUnauthorized: true,
    });
  } catch (error) {
    console.error("Error loading Carta della Cultura certificates:", error);
    return null;
  }
}

function buildCheckRequest(codiceVoucher: string, tipoOperazione: string): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ver="${SOAP_NS}">
  <soapenv:Header/>
  <soapenv:Body>
    <ver:CheckRequestObj>
      <checkReq>
        <tipoOperazione>${tipoOperazione}</tipoOperazione>
        <codiceVoucher>${codiceVoucher}</codiceVoucher>
        <partitaIvaEsercente>${PARTITA_IVA}</partitaIvaEsercente>
      </checkReq>
    </ver:CheckRequestObj>
  </soapenv:Body>
</soapenv:Envelope>`;
}

function buildConfirmRequest(codiceVoucher: string, importo: string): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ver="${SOAP_NS}">
  <soapenv:Header/>
  <soapenv:Body>
    <ver:ConfirmRequestObj>
      <checkReq>
        <tipoOperazione>1</tipoOperazione>
        <codiceVoucher>${codiceVoucher}</codiceVoucher>
        <importo>${importo}</importo>
      </checkReq>
    </ver:ConfirmRequestObj>
  </soapenv:Body>
</soapenv:Envelope>`;
}

function extractXmlValue(xml: string, tag: string): string | null {
  const regex = new RegExp(`<${tag}>([^<]*)</${tag}>`);
  const match = xml.match(regex);
  return match ? match[1] : null;
}

function extractFault(xml: string): string | null {
  const faultString = extractXmlValue(xml, "faultstring") || extractXmlValue(xml, "faultString");
  return faultString;
}

async function soapCall(body: string): Promise<string> {
  const agent = getHttpsAgent();
  if (!agent) {
    throw new Error("Carta della Cultura non configurata: chiave privata mancante.");
  }

  const endpoint = getEndpoint();
  const url = new URL(endpoint);

  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: url.hostname,
        port: 443,
        path: url.pathname,
        method: "POST",
        agent,
        headers: {
          "Content-Type": "text/xml; charset=utf-8",
          "Content-Length": Buffer.byteLength(body),
          "SOAPAction": "",
        },
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
            resolve(data);
          } else {
            const fault = extractFault(data);
            reject(new Error(fault || `HTTP ${res.statusCode}: ${data.substring(0, 200)}`));
          }
        });
      }
    );
    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

export interface CartaCulturaCheckResult {
  success: boolean;
  nominativo?: string;
  ambito?: string;
  bene?: string;
  importo?: number;
  error?: string;
}

export interface CartaCulturaConfirmResult {
  success: boolean;
  esito?: string;
  error?: string;
}

export async function checkVoucher(codiceVoucher: string, consume: boolean = false): Promise<CartaCulturaCheckResult> {
  try {
    const tipoOperazione = consume ? "2" : "1";
    const requestBody = buildCheckRequest(codiceVoucher, tipoOperazione);
    const response = await soapCall(requestBody);
    const fault = extractFault(response);
    if (fault) {
      return { success: false, error: fault };
    }
    const nominativo = extractXmlValue(response, "nominativoBeneficiario");
    const ambito = extractXmlValue(response, "ambito");
    const bene = extractXmlValue(response, "bene");
    const importoStr = extractXmlValue(response, "importo");
    const importo = importoStr ? parseFloat(importoStr) : undefined;
    return {
      success: true,
      nominativo: nominativo || undefined,
      ambito: ambito || undefined,
      bene: bene || undefined,
      importo,
    };
  } catch (error: any) {
    return { success: false, error: error.message || "Errore di comunicazione con il sistema Carta della Cultura." };
  }
}

export async function confirmVoucher(codiceVoucher: string, importo: number): Promise<CartaCulturaConfirmResult> {
  try {
    const requestBody = buildConfirmRequest(codiceVoucher, importo.toFixed(2));
    const response = await soapCall(requestBody);
    const fault = extractFault(response);
    if (fault) {
      return { success: false, error: fault };
    }
    const esito = extractXmlValue(response, "esito");
    return {
      success: esito === "OK",
      esito: esito || undefined,
      error: esito !== "OK" ? `Esito: ${esito}` : undefined,
    };
  } catch (error: any) {
    return { success: false, error: error.message || "Errore di comunicazione con il sistema Carta della Cultura." };
  }
}

export function isCartaCulturaAvailable(): boolean {
  return !!process.env.CARTA_CULTURA_PRIVATE_KEY;
}
