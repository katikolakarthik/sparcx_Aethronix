import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export function exportDiseaseScanPdf(scan) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const margin = 48;
  doc.setFillColor(20, 83, 45);
  doc.rect(0, 0, doc.internal.pageSize.getWidth(), 72, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.text('Smart Farm Simulator', margin, 44);
  doc.setFontSize(10);
  doc.text('AI Crop Disease Detection Report', margin, 58);

  let y = 96;
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(12);
  doc.text(`Crop: ${scan.cropType || '—'}`, margin, y);
  y += 18;
  doc.text(`Disease: ${scan.diseaseName}`, margin, y);
  y += 18;
  doc.text(`Confidence: ${scan.confidence}% · Severity: ${scan.severity}`, margin, y);
  y += 28;

  doc.setFontSize(14);
  doc.setTextColor(22, 101, 52);
  doc.text('Summary', margin, y);
  y += 10;

  autoTable(doc, {
    startY: y,
    head: [['Metric', 'Value']],
    body: [
      ['Recovery chance', `${scan.recoveryChance ?? '—'}%`],
      ['Est. treatment cost', String(scan.estimatedTreatmentCost ?? '—')],
      ['Cause', scan.cause || '—'],
    ],
    styles: { fontSize: 10, cellPadding: 8 },
    headStyles: { fillColor: [22, 163, 74] },
  });

  let y2 = doc.lastAutoTable.finalY + 24;
  doc.setFontSize(12);
  doc.text('Medicines', margin, y2);
  y2 += 6;
  autoTable(doc, {
    startY: y2,
    head: [['Name', 'Usage', 'Method', 'Duration', 'INR est.']],
    body: (scan.medicines || []).map((m) => [
      m.name,
      m.usageAmount,
      m.sprayMethod,
      m.duration,
      String(m.priceEstimate ?? ''),
    ]),
    styles: { fontSize: 9, cellPadding: 6 },
    headStyles: { fillColor: [13, 148, 136] },
  });

  y2 = doc.lastAutoTable.finalY + 20;
  doc.setFontSize(12);
  doc.text('Nearby stores', margin, y2);
  y2 += 6;
  autoTable(doc, {
    startY: y2,
    head: [['Store', 'Distance', 'Open', 'Phone']],
    body: (scan.stores || []).map((s) => [s.name, s.distance, s.isOpen ? 'Open' : 'Closed', s.contactNumber || '—']),
    styles: { fontSize: 9, cellPadding: 6 },
    headStyles: { fillColor: [22, 101, 52] },
  });

  y2 = doc.lastAutoTable.finalY + 20;
  doc.setFontSize(11);
  doc.text('Prevention tips', margin, y2);
  y2 += 14;
  doc.setFontSize(10);
  (scan.preventionTips || []).forEach((tip) => {
    const lines = doc.splitTextToSize(`• ${tip}`, doc.internal.pageSize.getWidth() - margin * 2);
    doc.text(lines, margin, y2);
    y2 += lines.length * 12 + 4;
  });

  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184);
  doc.text(`Generated ${new Date().toLocaleString()}`, margin, doc.internal.pageSize.getHeight() - 32);

  doc.save(`disease-scan-${scan._id || 'report'}.pdf`);
}
