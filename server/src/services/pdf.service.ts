import PDFDocument from 'pdfkit';

export interface CertificateDetails {
  certificateId: string;
  studentName: string;
  courseTitle: string;
  issuedDate: string;
}

export class PDFService {
  /**
   * Generates a downloadable PDF buffer for course completion certificate
   */
  static generateCertificatePDF(details: CertificateDetails): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({
          size: 'A4',
          layout: 'landscape',
          margin: 40,
        });

        const buffers: Buffer[] = [];
        doc.on('data', (chunk) => buffers.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(buffers)));
        doc.on('error', (err) => reject(err));

        // Decorative Border Frame
        doc
          .lineWidth(4)
          .strokeColor('#4F46E5') // Indigo accent
          .rect(20, 20, doc.page.width - 40, doc.page.height - 40)
          .stroke();

        doc
          .lineWidth(1)
          .strokeColor('#9333EA') // Purple inner line
          .rect(28, 28, doc.page.width - 56, doc.page.height - 56)
          .stroke();

        // Header Title
        doc.moveDown(2);
        doc
          .font('Helvetica-Bold')
          .fontSize(28)
          .fillColor('#1E1B4B')
          .text('CLASSCONNECT ACADEMY', { align: 'center' });

        doc
          .font('Helvetica')
          .fontSize(14)
          .fillColor('#6B7280')
          .text('CERTIFICATE OF COURSE COMPLETION', { align: 'center' });

        doc.moveDown(1.5);
        doc
          .font('Helvetica-Oblique')
          .fontSize(12)
          .fillColor('#4B5563')
          .text('This is to certify that', { align: 'center' });

        // Student Name
        doc.moveDown(0.8);
        doc
          .font('Helvetica-Bold')
          .fontSize(26)
          .fillColor('#4F46E5')
          .text(details.studentName.toUpperCase(), { align: 'center' });

        // Subtext
        doc.moveDown(0.8);
        doc
          .font('Helvetica')
          .fontSize(12)
          .fillColor('#4B5563')
          .text('has successfully completed at least 90% of the required curriculum for', { align: 'center' });

        // Course Title
        doc.moveDown(0.8);
        doc
          .font('Helvetica-Bold')
          .fontSize(22)
          .fillColor('#111827')
          .text(`"${details.courseTitle}"`, { align: 'center' });

        // Metadata Footer
        doc.moveDown(2.5);

        const yPos = doc.y;
        doc
          .font('Helvetica')
          .fontSize(10)
          .fillColor('#6B7280')
          .text(`Date of Issue: ${details.issuedDate}`, 60, yPos);

        doc
          .font('Helvetica-Bold')
          .fontSize(10)
          .fillColor('#4F46E5')
          .text(`Certificate ID: ${details.certificateId}`, doc.page.width - 260, yPos, { align: 'right' });

        // Signature line
        doc.moveDown(1.5);
        doc
          .font('Helvetica-Bold')
          .fontSize(10)
          .fillColor('#111827')
          .text('ClassConnect Academic Board', { align: 'center' });

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }
}
