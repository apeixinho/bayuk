import express from "express";
import path from "path";
import passport from "passport";
import configureServer from "./serverConfiguration/configureServer";
import "./db";
import apiRoutes from "./api/routes/index";
import unauthorizedError from "./middlewares/errors/unauthorizedError";

import "./api/passport";

const createServer = () => {
	const DEFAULT_PORT = 3000;

	let server = express();

	server.set("port", process.env.PORT || DEFAULT_PORT);

	server.use("/image/product", express.static(path.join(process.env.IMAGESDIR, "/products")));
	server.use("/image/user", express.static(path.join(process.env.IMAGESDIR, "/users")));

	server.use(passport.initialize());

	server.use("/api", apiRoutes);

	configureServer(server);

	server.use(unauthorizedError);

	return server.listen(server.get("port"));
};

export default createServer;
