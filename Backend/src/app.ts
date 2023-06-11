import dal from "./2-utils/dal";
dal.connect();

import express from "express";
import cors from "cors";
import expressFileUpload from "express-fileupload";
import catchAll from "./3-middleware/catch-all";
import routeNotFound from "./3-middleware/route-not-found";
import cartsController from "./6-controllers/carts-controller";
import ordersController from "./6-controllers/orders-controller";
import productsController from "./6-controllers/products-controller";
import authController from "./6-controllers/auth-controller";
import config from "./2-utils/config";

const server = express();

server.use(cors());
server.use(express.json());
server.use(express.static('src/1-assets'));
server.use(expressFileUpload());
server.use("/api", cartsController);
server.use("/api", ordersController);
server.use("/api", productsController);
server.use("/api", authController);
server.use("*", routeNotFound);
server.use(catchAll);

server.listen(config.port, () => console.log("Listening on http://localhost:" + config.port));