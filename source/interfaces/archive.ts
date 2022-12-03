import { Document } from 'mongoose';

export default interface IArchive extends Document {
  from: string;
  to: string;
  url: string;
  pageNumber: number;
  date: string;
  hospitalId: any;
}