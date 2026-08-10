import mongoose, { Schema, Document } from 'mongoose';

export interface ICertificate extends Document {
  certificateId: string;
  userId: string;
  courseId: string;
  studentName: string;
  courseTitle: string;
  issuedDate: Date;
  pdfUrl: string;
  createdAt: Date;
}

const CertificateSchema = new Schema<ICertificate>(
  {
    certificateId: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    courseId: { type: String, required: true },
    studentName: { type: String, required: true },
    courseTitle: { type: String, required: true },
    issuedDate: { type: Date, default: Date.now },
    pdfUrl: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export const Certificate = mongoose.model<ICertificate>('Certificate', CertificateSchema);
