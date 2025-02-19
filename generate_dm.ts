import bwip from "npm:bwip-js@2.0.0";
import {
  PDFDocument,
  StandardFonts,
  rgb,
} from "https://esm.sh/pdf-lib@1.17.1?dts";

const BARCODE_OPTIONS = {
  bcid: "datamatrix",
  scale: 50,
  padding: 20,
  textcolor: "000000",
  includetext: false,
};

const A4_WIDTH = 595;
const A4_HEIGHT = 842;
const DISPLAY_SIZE = 1500;

const barcodeX = (A4_WIDTH - DISPLAY_SIZE) / 2;
const barcodeY = (A4_HEIGHT - DISPLAY_SIZE) / 2;

export const generate_dm = async (value: string) => {
  try {
    const pngData = await bwip.toBuffer({ ...BARCODE_OPTIONS, text: value });

    const pdfDoc = await PDFDocument.create();
    pdfDoc.setTitle("Test", { showInWindowTitleBar: true });

    const page = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);

    const barcodeImage = await pdfDoc.embedPng(pngData);

    page.drawImage(barcodeImage, {
      x: barcodeX,
      y: barcodeY,
      width: DISPLAY_SIZE,
      height: DISPLAY_SIZE,
    });

    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const titleText = `DM-${value}`;
    const fontSize = 24;
    const textWidth = helveticaFont.widthOfTextAtSize(titleText, fontSize);
    const textX = (A4_WIDTH - textWidth) / 2;
    const textY = A4_HEIGHT - fontSize - 30;

    page.drawText(titleText, {
      x: textX,
      y: textY,
      size: fontSize,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    });

    const pdfBytes = await pdfDoc.save();
    await Deno.writeFile(`datamatrix_a4_${value}.pdf`, pdfBytes);
  } catch (err) {
    console.error("❌ Error generating PDF:", err);
  }
};
