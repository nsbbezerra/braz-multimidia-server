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
import DashboardSizePageFinderController from "./controllers/dashboard/sizesPage";
import IndexPageController from "./controllers/site/indexPage";
import CategoriesPageController from "./controllers/site/categoriesPage";
import ProductPageController from "./controllers/site/productPage";
import OrdersController from "./controllers/orders/crud";
import PrinterController from "./controllers/print/print";

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
  "/banners",
  Multer.single("thumbnail"),
  upload,
  BannerCRUDController.CreateBanner
);
router.put("/banners/redirect/:id", BannerCRUDController.UpdateRedirect);
router.delete("/banners/:id", BannerCRUDController.Delete);

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
router.post("/sizes/:productId", SizesCRUDController.Create);
router.put("/sizes/:id", SizesCRUDController.Update);
router.delete("/sizes/:id", SizesCRUDController.Delete);

/** DASHBOARD */

router.get(
  "/findCategoriesWithProducts",
  DashboardSizePageFinderController.FindCategoriesAndProducts
);

/** SITE PAGES */

router.get("/fromIndexPage", IndexPageController.Find);
router.get(
  "/findProductsAndCategories",
  IndexPageController.FindCategoriesAndProducts
);
router.get("/fromOthersPageBanner", IndexPageController.FindOtherBanners);
router.get("/fromCategoriesPage/:id", CategoriesPageController.Find);
router.get("/fromCategoriesPagePaths", CategoriesPageController.FindCategories);
router.get("/fromProductPagePaths", ProductPageController.FindProductPath);
router.get("/fromProductPage/:id", ProductPageController.FindProduct);
router.get("/findCatalogOfProducts/:id", ProductPageController.FindCatalog);
router.get("/fromCartPageBanner", IndexPageController.FindCartBanner);

/** ORDERS */

router.post("/order", OrdersController.Create);
router.get("/order/:id", OrdersController.FindOrder);
router.get("/orders/:search/:value", OrdersController.Search);
router.put("/orders/shipping/:id", OrdersController.UpdateShipping);
router.put("/orders/status/:id", OrdersController.UpdateStatus);
router.get(
  "/order/payment/:checkoutId/:order",
  OrdersController.FindPaymentInfo
);

router.get("/print/:id", PrinterController.Generate);

export { router };
