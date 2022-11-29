import express from "express";
import multer from "multer";
import { upload } from "./services/upload";

import ClientCRUDController from "./controllers/clients/crud";
import LoginController from "./controllers/clients/login";
import CategoriesCRUDController from "./controllers/categories/crud";
import BannerCRUDController from "./controllers/banners/crud";
import ProductsCRUDController from "./controllers/products/crud";
import ModelingCRUDController from "./controllers/modeling/crud";
import TablesCRUDController from "./controllers/tables/crud";
import CatalogsCRUDController from "./controllers/catalogs/crud";
import SizesCRUDController from "./controllers/sizes/crud";

const Multer = multer({
  storage: multer.memoryStorage(),
});

const router = express.Router();

/** CLIENTS */

router.post("/clients", ClientCRUDController.Create);
router.put("/clients/:clientId", ClientCRUDController.Update);
router.get("/clients", ClientCRUDController.Show);
router.post("/login", LoginController.Login);
router.put("/updatePassword", LoginController.RequestUpdatePassword);

/** CATEGORIES */

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
router.get("/categories", CategoriesCRUDController.Show);

/** BANNERS */
router.get("/banners/:origin", BannerCRUDController.Show);
router.post(
  "/banners/desktop",
  Multer.single("thumbnail"),
  upload,
  BannerCRUDController.CreateDesktop
);
router.post(
  "/banners/mobile/:id",
  Multer.single("thumbnail"),
  upload,
  BannerCRUDController.CreateMobile
);
router.put(
  "/banners/desktop/:id",
  Multer.single("thumbnail"),
  upload,
  BannerCRUDController.UpdateDesktop
);
router.put(
  "/banners/mobile/:id",
  Multer.single("thumbnail"),
  upload,
  BannerCRUDController.UpdateMobile
);
router.get("/banners/:origin", BannerCRUDController.Show);
router.put("/banners/redirect/:id", BannerCRUDController.UpdateRedirect);

/** PRODUCTS */

router.get("/products", ProductsCRUDController.Show);
router.post("/products", ProductsCRUDController.Create);
router.put("/products/active/:id", ProductsCRUDController.Active);
router.put("/products/update/:id", ProductsCRUDController.Update);
router.put(
  "/products/thumbnail/:id",
  Multer.single("thumbnail"),
  upload,
  ProductsCRUDController.Thumbnail
);
router.put(
  "/products/updateThumbnail/:id",
  Multer.single("thumbnail"),
  upload,
  ProductsCRUDController.UpdateThumbnail
);

/** MODELINGS */

router.post(
  "/modeling/:id",
  Multer.single("thumbnail"),
  upload,
  ModelingCRUDController.Create
);
router.put(
  "/modeling/updateThumbnail/:id",
  Multer.single("thumbnail"),
  upload,
  ModelingCRUDController.UpdateThumbnail
);
router.delete("/modeling/:id", ModelingCRUDController.Delete);
router.put("/modeling/updateInfo/:id", ModelingCRUDController.UpdateInfo);
router.get("/modeling/:productId", ModelingCRUDController.Find);

/** TABLES */

router.get("/tables/:productId", TablesCRUDController.Find);
router.post(
  "/tables/:id",
  Multer.single("thumbnail"),
  upload,
  TablesCRUDController.Create
);
router.put(
  "/tables/thumbnail/:id",
  Multer.single("thumbnail"),
  upload,
  TablesCRUDController.UpdateThumbnail
);
router.put("/tables/title/:id", TablesCRUDController.UpdateTitle);
router.delete("/tables/:id", TablesCRUDController.Delete);

/** CATALOGS */

router.get("/catalogs/:productId", CatalogsCRUDController.Find);
router.post(
  "/catalogs/:id",
  Multer.single("thumbnail"),
  upload,
  CatalogsCRUDController.Create
);
router.delete("/catalogs/:id", CatalogsCRUDController.Delete);

/** SIZES */

router.get("/sizes/:productId", SizesCRUDController.Find);
router.post("/sizes/:producId", SizesCRUDController.Create);
router.put("/sizes/:id", SizesCRUDController.Update);
router.delete("/sizes/:id", SizesCRUDController.Delete);

export { router };
