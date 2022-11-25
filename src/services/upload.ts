import { NextFunction, Request, Response } from "express";
import admin from "firebase-admin";
import { storageBucket, uploader } from "../configs/uploader";

interface CustomProp extends Request {
  firebaseUrl?: string;
  firebaseId?: string;
}

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: uploader.project_id,
    clientEmail: uploader.client_email,
    privateKey: uploader.private_key,
  }),
  storageBucket: storageBucket,
});

const bucket = admin.storage().bucket();

const upload = (req: CustomProp, res: Response, next: NextFunction) => {
  if (!req.file) {
    next();
  }

  const image = req.file;
  const name = `${Date.now()}.${image?.originalname.split(".").pop()}`;
  const file = bucket.file(name);

  const stream = file.createWriteStream({
    metadata: {
      contentType: image?.mimetype,
    },
  });
  stream.on("error", (err) => {
    next(err);
  });
  stream.on("finish", async () => {
    await file.makePublic();
    req.firebaseUrl = file.publicUrl();
    req.firebaseId = file.id;
    next();
  });
  stream.end(image?.buffer);
};

export { upload, bucket };
