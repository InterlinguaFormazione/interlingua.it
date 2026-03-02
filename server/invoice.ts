import PDFDocument from "pdfkit";
import path from "path";
import fs from "fs";
import { ShopOrder } from "@shared/schema";

const LOGO_PATH = path.resolve("attached_assets/SKILLCRAFT-INTERLINGUA_1769354785857.png");

const IVA_RATE = 0.22;

const COMPANY = {
  name: "Interlingua Formazione S.r.l.",
  sdiName: "Interlingua Formazione srl",
  brandName: "SkillCraft",
  address: "Viale Giuseppe Mazzini 27",
  sdiAddress: "Viale Mazzini 27",
  cap: "36100",
  city: "Vicenza",
  province: "VI",
  country: "Italia",
  piva: "03828240246",
  cf: "03828240246",
  reaUfficio: "VI",
  reaNumero: "VI-357313",
  sdi: "M5UXCR1",
  email: "infocorsi@skillcraft.interlingua.it",
  sdiEmail: "amministrazione@interlingua.it",
  pec: "postpec@pec.interlingua.it",
  phone: "+39 0444 321601",
  sdiPhone: "0444321601",
  website: "skillcraft.interlingua.it",
};

const INTERMEDIARIO_ARUBA = "01879020517";

function formatDate(d: Date): string {
  return d.toLocaleDateString("it-IT", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function formatCurrency(n: number): string {
  return n.toFixed(2).replace(".", ",");
}

export function generateInvoiceNumber(year: number, seq: number): string {
  return `${seq}/${year}`;
}

export function generateInvoicePDF(order: ShopOrder, invoiceNumber: string, invoiceDate: Date): Promise<Buffer> {
  return new Promise((resolve, reject) => {
  const chunks: Buffer[] = [];
  const doc = new PDFDocument({ size: "A4", margin: 50, bufferPages: true });

  doc.on("data", (chunk: Buffer) => chunks.push(chunk));
  doc.on("end", () => resolve(Buffer.concat(chunks)));
  doc.on("error", (err: Error) => reject(err));

  const totalAmount = parseFloat(order.amount);
  const imponibile = totalAmount / (1 + IVA_RATE);
  const ivaAmount = totalAmount - imponibile;
  const discountAmt = order.discountAmount ? parseFloat(order.discountAmount) : 0;

  const pageWidth = doc.page.width - 100;

  let headerY = 40;
  const logoWidth = 180;
  if (fs.existsSync(LOGO_PATH)) {
    const logoX = (doc.page.width - logoWidth) / 2;
    doc.image(LOGO_PATH, logoX, headerY, { width: logoWidth });
    headerY += 60;
  }

  doc.fontSize(12).font("Helvetica-Bold").fillColor("#1e3a5f")
    .text(COMPANY.name, 50, headerY, { align: "center", width: pageWidth });
  headerY += 16;
  doc.fontSize(8).font("Helvetica").fillColor("#555")
    .text(`${COMPANY.address} - ${COMPANY.cap} ${COMPANY.city} (${COMPANY.province})`, 50, headerY, { align: "center", width: pageWidth });
  headerY += 11;
  doc.text(`P.IVA: ${COMPANY.piva} — C.F.: ${COMPANY.cf} — REA: ${COMPANY.reaNumero}`, 50, headerY, { align: "center", width: pageWidth });
  headerY += 11;
  doc.text(`Tel: ${COMPANY.phone} — Email: ${COMPANY.email}`, 50, headerY, { align: "center", width: pageWidth });
  headerY += 11;
  doc.text(`PEC: ${COMPANY.pec} — SDI: ${COMPANY.sdi}`, 50, headerY, { align: "center", width: pageWidth });
  headerY += 14;

  doc.moveTo(50, headerY).lineTo(50 + pageWidth, headerY).strokeColor("#1e3a5f").lineWidth(2).stroke();
  headerY += 12;

  doc.fontSize(16).font("Helvetica-Bold").fillColor("#1e3a5f")
    .text("FATTURA", 50, headerY);
  doc.fontSize(10).font("Helvetica").fillColor("#333");
  doc.text(`N. ${invoiceNumber}`, 350, headerY, { align: "right", width: pageWidth - 300 });
  doc.text(`Data: ${formatDate(invoiceDate)}`, 350, headerY + 16, { align: "right", width: pageWidth - 300 });
  headerY += 40;

  const isB2B = !!order.billingPartitaIva;

  doc.fontSize(10).font("Helvetica-Bold").fillColor("#1e3a5f")
    .text("Destinatario:", 50, headerY);
  doc.fontSize(10).font("Helvetica").fillColor("#333");
  let destY = headerY + 16;

  if (isB2B && order.billingPartitaIva) {
    doc.font("Helvetica-Bold").text(`${order.customerFirstName} ${order.customerLastName}`, 50, destY);
    destY += 14;
    doc.font("Helvetica").text(`P.IVA: ${order.billingPartitaIva}`, 50, destY);
    destY += 14;
  } else {
    doc.font("Helvetica-Bold").text(`${order.customerFirstName} ${order.customerLastName}`, 50, destY);
    destY += 14;
  }

  if (order.billingCodiceFiscale) {
    doc.font("Helvetica").text(`C.F.: ${order.billingCodiceFiscale}`, 50, destY);
    destY += 14;
  }
  if (order.billingIndirizzo) {
    doc.font("Helvetica").text(order.billingIndirizzo, 50, destY);
    destY += 14;
  }
  const cityLine = [
    order.billingCap,
    order.billingCitta,
    order.billingProvincia ? `(${order.billingProvincia})` : null,
  ].filter(Boolean).join(" ");
  if (cityLine) {
    doc.font("Helvetica").text(cityLine, 50, destY);
    destY += 14;
  }
  const countryName = order.billingPaese && order.billingPaese !== "IT" ? order.billingPaese : null;
  if (countryName) {
    doc.font("Helvetica").text(countryName, 50, destY);
    destY += 14;
  }
  if (order.billingCodiceSdi) {
    doc.font("Helvetica").text(`Codice SDI: ${order.billingCodiceSdi}`, 50, destY);
    destY += 14;
  }
  if (order.billingPec) {
    doc.font("Helvetica").text(`PEC: ${order.billingPec}`, 50, destY);
    destY += 14;
  }
  doc.font("Helvetica").text(`Email: ${order.customerEmail}`, 50, destY);
  destY += 14;
  if (order.customerPhone) {
    doc.font("Helvetica").text(`Tel: ${order.customerPhone}`, 50, destY);
    destY += 14;
  }

  const tableTop = Math.max(destY + 20, 310);

  doc.rect(50, tableTop, pageWidth, 24).fill("#1e3a5f");
  doc.fontSize(9).font("Helvetica-Bold").fillColor("#fff");
  doc.text("Descrizione", 56, tableTop + 7, { width: 260 });
  doc.text("Qtà", 320, tableTop + 7, { width: 40, align: "center" });
  doc.text("Prezzo Unit.", 365, tableTop + 7, { width: 80, align: "right" });
  doc.text("Importo", 450, tableTop + 7, { width: pageWidth - 405, align: "right" });

  const rowY = tableTop + 28;
  doc.rect(50, rowY, pageWidth, 30).fill("#f8f9fa");
  doc.fontSize(9).font("Helvetica").fillColor("#333");
  doc.text(order.productName, 56, rowY + 5, { width: 260 });
  doc.text("1", 320, rowY + 10, { width: 40, align: "center" });
  doc.text(`€ ${formatCurrency(imponibile)}`, 365, rowY + 10, { width: 80, align: "right" });
  doc.text(`€ ${formatCurrency(imponibile)}`, 450, rowY + 10, { width: pageWidth - 405, align: "right" });

  if (order.studentFirstName && order.studentLastName) {
    doc.fontSize(8).fillColor("#666")
      .text(`Studente: ${order.studentFirstName} ${order.studentLastName}${order.studentEmail ? ` (${order.studentEmail})` : ""}`, 56, rowY + 22, { width: 400 });
  }

  let summaryY = rowY + 50;
  doc.moveTo(50, summaryY).lineTo(50 + pageWidth, summaryY).strokeColor("#ddd").lineWidth(0.5).stroke();
  summaryY += 10;

  const labelX = 350;
  const valueX = 450;
  const valueW = pageWidth - 405;

  doc.fontSize(10).font("Helvetica").fillColor("#333");
  doc.text("Imponibile:", labelX, summaryY, { width: 95, align: "right" });
  doc.text(`€ ${formatCurrency(imponibile)}`, valueX, summaryY, { width: valueW, align: "right" });
  summaryY += 18;

  if (discountAmt > 0) {
    doc.fillColor("#c0392b");
    doc.text(`Sconto (${order.discountCode || ""}):`, labelX, summaryY, { width: 95, align: "right" });
    doc.text(`- € ${formatCurrency(discountAmt)}`, valueX, summaryY, { width: valueW, align: "right" });
    summaryY += 18;
    doc.fillColor("#333");
  }

  doc.text(`IVA (${(IVA_RATE * 100).toFixed(0)}%):`, labelX, summaryY, { width: 95, align: "right" });
  doc.text(`€ ${formatCurrency(ivaAmount)}`, valueX, summaryY, { width: valueW, align: "right" });
  summaryY += 20;

  doc.moveTo(labelX, summaryY).lineTo(50 + pageWidth, summaryY).strokeColor("#1e3a5f").lineWidth(1).stroke();
  summaryY += 8;

  doc.fontSize(12).font("Helvetica-Bold").fillColor("#1e3a5f");
  doc.text("Totale:", labelX, summaryY, { width: 95, align: "right" });
  doc.text(`€ ${formatCurrency(totalAmount)}`, valueX, summaryY, { width: valueW, align: "right" });
  summaryY += 30;

  doc.fontSize(9).font("Helvetica").fillColor("#555");
  const paymentMethod = order.paypalOrderId.startsWith("CC-")
    ? "Carta della Cultura" + (order.paypalOrderId.includes("+PP-") ? " + PayPal" : "")
    : "PayPal";
  doc.text(`Metodo di pagamento: ${paymentMethod}`, 50, summaryY);
  summaryY += 14;
  doc.text(`Riferimento transazione: ${order.paypalOrderId}`, 50, summaryY);
  summaryY += 14;
  doc.text(`Stato: Pagato`, 50, summaryY);
  summaryY += 30;

  doc.fontSize(8).fillColor("#888");
  doc.text("Documento emesso ai sensi dell'art. 21 del D.P.R. 633/72.", 50, summaryY);
  summaryY += 12;
  doc.text("Imposta assolta ai sensi della normativa vigente.", 50, summaryY);
  summaryY += 12;
  doc.text("Operazione soggetta a IVA — Regime ordinario.", 50, summaryY);

  const bottomY = doc.page.height - 60;
  doc.moveTo(50, bottomY - 10).lineTo(50 + pageWidth, bottomY - 10).strokeColor("#ddd").lineWidth(0.5).stroke();
  doc.fontSize(7).fillColor("#aaa")
    .text(`${COMPANY.name} — ${COMPANY.address}, ${COMPANY.cap} ${COMPANY.city} (${COMPANY.province}) — P.IVA ${COMPANY.piva} — ${COMPANY.website}`, 50, bottomY, { align: "center", width: pageWidth });

  doc.end();
  });
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function sanitizeLatinString(str: string): string {
  return str
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/\u2026/g, "...")
    .replace(/[^\x20-\x7E\u00C0-\u00FF\u0100-\u017F]/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function sanitizePhone(phone: string): string {
  return phone.replace(/[^0-9]/g, "");
}

function formatDateISO(d: Date): string {
  return d.toISOString().split("T")[0];
}

function formatDecimal(n: number, decimals = 2): string {
  return n.toFixed(decimals);
}

export function generateFatturaPA(order: ShopOrder, invoiceNumber: string, invoiceDate: Date, progressivoInvio: string): string {
  const totalAmount = parseFloat(order.amount);
  const discountAmt = order.discountAmount ? parseFloat(order.discountAmount) : 0;
  const imponibile = totalAmount / (1 + IVA_RATE);
  const ivaAmount = totalAmount - imponibile;
  const grossUnitPrice = discountAmt > 0 ? (totalAmount + discountAmt) / (1 + IVA_RATE) : imponibile;

  const isB2B = !!order.billingPartitaIva;
  const customerPaese = order.billingPaese || "IT";
  const isItalianCustomer = customerPaese === "IT";

  const codiceDestinatario = order.billingCodiceSdi || "0000000";

  let pecDestinatario = "";
  if (codiceDestinatario === "0000000" && order.billingPec) {
    pecDestinatario = `\n        <PECDestinatario>${escapeXml(order.billingPec)}</PECDestinatario>`;
  }

  let cessionarioAnagrafici = "";
  if (isB2B && order.billingPartitaIva) {
    cessionarioAnagrafici = `
      <DatiAnagrafici>
        <IdFiscaleIVA>
          <IdPaese>${escapeXml(customerPaese)}</IdPaese>
          <IdCodice>${escapeXml(order.billingPartitaIva)}</IdCodice>
        </IdFiscaleIVA>${order.billingCodiceFiscale ? `\n        <CodiceFiscale>${escapeXml(order.billingCodiceFiscale)}</CodiceFiscale>` : ""}
        <Anagrafica>
          <Denominazione>${escapeXml(sanitizeLatinString(`${order.customerFirstName} ${order.customerLastName}`))}</Denominazione>
        </Anagrafica>
      </DatiAnagrafici>`;
  } else {
    const cfBlock = order.billingCodiceFiscale
      ? `\n        <CodiceFiscale>${escapeXml(order.billingCodiceFiscale)}</CodiceFiscale>`
      : (isItalianCustomer ? `\n        <CodiceFiscale>0000000000000000</CodiceFiscale>` : "");
    cessionarioAnagrafici = `
      <DatiAnagrafici>${cfBlock}
        <Anagrafica>
          <Nome>${escapeXml(sanitizeLatinString(order.customerFirstName))}</Nome>
          <Cognome>${escapeXml(sanitizeLatinString(order.customerLastName))}</Cognome>
        </Anagrafica>
      </DatiAnagrafici>`;
  }

  const provincia = isItalianCustomer && order.billingProvincia
    ? `\n        <Provincia>${escapeXml(order.billingProvincia)}</Provincia>`
    : "";

  const customerCap = order.billingCap || (isItalianCustomer ? "00000" : "00000");
  const customerIndirizzo = sanitizeLatinString(order.billingIndirizzo || (isItalianCustomer ? "Non specificato" : "N/A"));
  const customerComune = sanitizeLatinString(order.billingCitta || (isItalianCustomer ? "Non specificato" : "N/A"));

  let scontoLineBlock = "";
  if (discountAmt > 0) {
    const scontoImponibile = discountAmt / (1 + IVA_RATE);
    scontoLineBlock = `
        <ScontoMaggiorazione>
          <Tipo>SC</Tipo>
          <Importo>${formatDecimal(scontoImponibile)}</Importo>
        </ScontoMaggiorazione>`;
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<p:FatturaElettronica xmlns:ds="http://www.w3.org/2000/09/xmldsig#" xmlns:p="http://ivaservizi.agenziaentrate.gov.it/docs/xsd/fatture/v1.2" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" versione="FPR12" xsi:schemaLocation="http://ivaservizi.agenziaentrate.gov.it/docs/xsd/fatture/v1.2 http://www.fatturapa.gov.it/export/fatturazione/sdi/fatturapa/v1.2/Schema_del_file_xml_FatturaPA_versione_1.2.xsd">
  <FatturaElettronicaHeader>
    <DatiTrasmissione>
      <IdTrasmittente>
        <IdPaese>IT</IdPaese>
        <IdCodice>${escapeXml(INTERMEDIARIO_ARUBA)}</IdCodice>
      </IdTrasmittente>
      <ProgressivoInvio>${escapeXml(progressivoInvio)}</ProgressivoInvio>
      <FormatoTrasmissione>FPR12</FormatoTrasmissione>
      <CodiceDestinatario>${escapeXml(codiceDestinatario)}</CodiceDestinatario>${pecDestinatario}
    </DatiTrasmissione>
    <CedentePrestatore>
      <DatiAnagrafici>
        <IdFiscaleIVA>
          <IdPaese>IT</IdPaese>
          <IdCodice>${escapeXml(COMPANY.piva)}</IdCodice>
        </IdFiscaleIVA>
        <Anagrafica>
          <Denominazione>${escapeXml(COMPANY.sdiName)}</Denominazione>
        </Anagrafica>
        <RegimeFiscale>RF01</RegimeFiscale>
      </DatiAnagrafici>
      <Sede>
        <Indirizzo>${escapeXml(COMPANY.sdiAddress)}</Indirizzo>
        <CAP>${escapeXml(COMPANY.cap)}</CAP>
        <Comune>${escapeXml(COMPANY.city)}</Comune>
        <Provincia>${escapeXml(COMPANY.province)}</Provincia>
        <Nazione>IT</Nazione>
      </Sede>
      <IscrizioneREA>
        <Ufficio>${escapeXml(COMPANY.reaUfficio)}</Ufficio>
        <NumeroREA>${escapeXml(COMPANY.reaNumero)}</NumeroREA>
        <StatoLiquidazione>LN</StatoLiquidazione>
      </IscrizioneREA>
      <Contatti>
        <Telefono>${COMPANY.sdiPhone}</Telefono>
        <Email>${escapeXml(COMPANY.sdiEmail)}</Email>
      </Contatti>
    </CedentePrestatore>
    <CessionarioCommittente>${cessionarioAnagrafici}
      <Sede>
        <Indirizzo>${escapeXml(customerIndirizzo)}</Indirizzo>
        <CAP>${escapeXml(customerCap)}</CAP>
        <Comune>${escapeXml(customerComune)}</Comune>${provincia}
        <Nazione>${escapeXml(customerPaese)}</Nazione>
      </Sede>
    </CessionarioCommittente>
  </FatturaElettronicaHeader>
  <FatturaElettronicaBody>
    <DatiGenerali>
      <DatiGeneraliDocumento>
        <TipoDocumento>TD01</TipoDocumento>
        <Divisa>EUR</Divisa>
        <Data>${formatDateISO(invoiceDate)}</Data>
        <Numero>${escapeXml(invoiceNumber)}</Numero>
        <ImportoTotaleDocumento>${formatDecimal(totalAmount)}</ImportoTotaleDocumento>
      </DatiGeneraliDocumento>
    </DatiGenerali>
    <DatiBeniServizi>
      <DettaglioLinee>
        <NumeroLinea>1</NumeroLinea>
        <Descrizione>${escapeXml(sanitizeLatinString(order.productName))}</Descrizione>
        <Quantita>${formatDecimal(1, 2)}</Quantita>
        <PrezzoUnitario>${formatDecimal(grossUnitPrice, 3)}</PrezzoUnitario>${scontoLineBlock}
        <PrezzoTotale>${formatDecimal(imponibile)}</PrezzoTotale>
        <AliquotaIVA>${formatDecimal(IVA_RATE * 100)}</AliquotaIVA>
      </DettaglioLinee>
      <DatiRiepilogo>
        <AliquotaIVA>${formatDecimal(IVA_RATE * 100)}</AliquotaIVA>
        <ImponibileImporto>${formatDecimal(imponibile)}</ImponibileImporto>
        <Imposta>${formatDecimal(ivaAmount)}</Imposta>
        <EsigibilitaIVA>I</EsigibilitaIVA>
      </DatiRiepilogo>
    </DatiBeniServizi>
    <DatiPagamento>
      <CondizioniPagamento>TP02</CondizioniPagamento>
      <DettaglioPagamento>
        <ModalitaPagamento>MP08</ModalitaPagamento>
        <ImportoPagamento>${formatDecimal(totalAmount)}</ImportoPagamento>
      </DettaglioPagamento>
    </DatiPagamento>
  </FatturaElettronicaBody>
</p:FatturaElettronica>`;

  return xml;
}

export function generateProgressivoInvio(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 5; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

export function generateFatturaFilename(progressivoInvio: string): string {
  return `IT${INTERMEDIARIO_ARUBA}_${progressivoInvio}.xml`;
}
