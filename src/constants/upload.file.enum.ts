export enum UploadTypesEnum {
  ANY = 'jpg|jpeg|png|gif|pdf|docx|doc|xlsx|xls' ,
  IMAGES = 'jpg|jpeg|png',
  DOCS = 'pdf',
}

interface UploadProfileFileType extends Express.Multer.File {
  originalname: string
}

export interface UploadProfileFileTypes {
  avatar?: UploadProfileFileType[];
  resume?: UploadProfileFileType[]
}