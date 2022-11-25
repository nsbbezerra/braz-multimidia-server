import express from "express";
import multer from "multer";

import ClientCRUDController from "./controllers/clients/crud";
import LoginController from "./controllers/clients/login";
import CategoriesCRUDController from "./controllers/categories/crud";
import { upload } from "./services/upload";

const Multer = multer({
  storage: multer.memoryStorage(),
});

const router = express.Router();

router.post("/clients", ClientCRUDController.Create);
router.put("/clients/:clientId", ClientCRUDController.Update);
router.post("/login", LoginController.Login);
router.put("/updatePassword", LoginController.RequestUpdatePassword);

router.post("/categories", CategoriesCRUDController.Create);
router.put(
  "/thumbnailCateogry/:id",
  Multer.single("thumbnail"),
  upload,
  CategoriesCRUDController.StoreThumbnail
);
router.put("/categories/:id", CategoriesCRUDController.Update);
router.put("/activeCategory/:id", CategoriesCRUDController.Active);
router.put(
  "/updateThumbnailCategory/:id",
  Multer.single("thumbnail"),
  upload,
  CategoriesCRUDController.UpdateThumbnail
);

export { router };
