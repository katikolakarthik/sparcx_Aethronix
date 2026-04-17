import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Builds a branded PDF report for a simulation record.
 */
export function exportSimulationPdf(simulation) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const margin = 48;
  let y = margin;

  doc.setFillColor(20, 83, 45);
  doc.rect(0, 0, doc.internal.pageSize.getWidth(), 72, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.text('Smart Farm Simulator', margin, 44);
  doc.setFontSize(10);
  doc.text('AI simulation report', margin, 58);

  y = 96;
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(12);
  doc.text(`Farmer: ${simulation.farmerName || '—'}`, margin, y);
  y += 18;
  doc.text(`Location: ${simulation.location || '—'}  ·  Land: ${simulation.landSize} acres`, margin, y);
  y += 28;

  doc.setFontSize(14);
  doc.setTextColor(22, 101, 52);
  doc.text('Prediction summary', margin, y);
  y += 8;

  autoTable(doc, {
    startY: y + 8,
    head: [['Field', 'Value']],
    body: [
      ['Recommended crop', simulation.recommendedCrop],
      ['Yield (tons)', String(simulation.yield)],
      ['Estimated cost', String(simulation.cost)],
      ['Expected revenue', String(simulation.revenue)],
      ['Net profit', String(simulation.profit)],
      ['Risk score', String(simulation.risk)],
      ['Climate suitability %', String(simulation.climateSuitability ?? '—')],
      ['Soil compatibility %', String(simulation.soilCompatibility ?? '—')],
      ['Water need status', simulation.waterNeedStatus || '—'],
    ],
    styles: { fontSize: 10, cellPadding: 8 },
    headStyles: { fillColor: [22, 163, 74] },
  });

  const afterTable = doc.lastAutoTable.finalY + 24;
  doc.setFontSize(11);
  doc.setTextColor(30, 41, 59);
  doc.text('Why this crop', margin, afterTable);
  doc.setFontSize(10);
  const reason = doc.splitTextToSize(simulation.recommendationReason || '—', doc.internal.pageSize.getWidth() - margin * 2);
  doc.text(reason, margin, afterTable + 16);

  let y2 = afterTable + 16 + reason.length * 12 + 16;
  doc.setFontSize(11);
  doc.text('Suggested fertilizers', margin, y2);
  y2 += 14;
  doc.setFontSize(10);
  (simulation.suggestedFertilizers || []).forEach((line) => {
    doc.text(`• ${line}`, margin, y2);
    y2 += 14;
  });

  y2 += 8;
  doc.setFontSize(11);
  doc.text('Pest alerts', margin, y2);
  y2 += 14;
  doc.setFontSize(10);
  (simulation.pestWarnings || []).forEach((line) => {
    doc.text(`• ${line}`, margin, y2);
    y2 += 14;
  });

  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184);
  doc.text(
    `Generated ${new Date().toLocaleString()} · Smart Farm Simulator`,
    margin,
    doc.internal.pageSize.getHeight() - 32,
  );

  doc.save(`farm-sim-${simulation._id || 'report'}.pdf`);
}
