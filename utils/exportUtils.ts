// We import html2pdf dynamically to avoid SSR issues if this were a framework like Next.js, 
// though for pure React SPA it's fine. We'll use a dynamic import pattern or require.
import html2pdf from 'html2pdf.js';

export const exportToPDF = async (element: HTMLElement, filename: string) => {
  const opt = {
    margin:       10,
    filename:     `${filename}.pdf`,
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2, useCORS: true },
    jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  try {
    // @ts-ignore - html2pdf types are loose
    await html2pdf().set(opt).from(element).save();
  } catch (e) {
    console.error("PDF Export failed", e);
    alert("Could not export PDF. Please try again.");
  }
};
