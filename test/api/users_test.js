import chai from "chai";
import request from "supertest";
import createServer from "../../server/server";
import db from "../../server/db";
import {global} from "../../server/sql/sql";
import {addUser} from "../../server/api/services/users";
import {getUser} from "../../server/seeder/database/usersTableSeeder";
import {fieldNotFound} from "../../server/api/controllers/users/errors";
import faker from "faker";
import jwt from "jsonwebtoken";

chai.should();

let server = {};

describe("users", function () {
	beforeEach(function () {
		server = createServer();

		return db.none(global.truncateAll);
	});

	afterEach(function (done) {
		server.close(done);
	});

	describe("POST /register", function () {
		it("should register a user", function () {
			const user = {
				email:    faker.internet.email(),
				name:     faker.name.findName(),
				password: faker.internet.password(),
				location: {
					latitude:  faker.address.latitude(),
					longitude: faker.address.longitude()
				}
			};

			return request(server)
				.post("/api/register")
				.send(user)
				.expect(201)
				.expect("Location", /\/api\/users\/.+/);
		});

		it("should return a valid jwt with user info when successfully registering a user", function () {
			return request(server)
				.post("/api/register")
				.send(getUser())
				.expect(201)
				.then(response => {
					const tokenPayload = jwt.verify(response.body, process.env.JWT_SECRET);

					tokenPayload.should.contain.all.keys(["id", "name", "email", "location", "image"]);
				})
		});

		it("should fail if any required field is not found", function () {
			const user = {
				email:    faker.internet.email(),
				password: faker.internet.password(),
				location: {
					latitude:  faker.address.latitude(),
					longitude: faker.address.longitude()
				}
			};

			return request(server)
				.post("/api/register")
				.send(user)
				.expect(400)
				.then(response => {
					const errors = response.body;

					errors.should.be.instanceOf(Array);
					errors.should.not.be.empty;
				});
		});

		it("should provide an error for any field that is not found", function () {
			const user = {
				password: faker.internet.password(),
				location: {
					latitude:  faker.address.latitude(),
					longitude: faker.address.longitude()
				}
			};

			const FIELDS_DELETED = 2;

			return request(server)
				.post("/api/register")
				.send(user)
				.expect(400)
				.then(response => {
					const errors = response.body;

					errors.should.be.have.lengthOf(FIELDS_DELETED);
				})
		});

		it("should provide specific errors for each field", function () {
			const user = {
				password: faker.internet.password(),
				location: {
					latitude:  faker.address.latitude(),
					longitude: faker.address.longitude()
				}
			};

			return request(server)
				.post("/api/register")
				.send(user)
				.expect(400)
				.then(response => {
					const errors = response.body;

					const emailError = fieldNotFound("email"),
								nameError  = fieldNotFound("name");

					errors.should.deep.include.members([emailError, nameError]);
				});
		});
	});

	describe("POST /login", function () {
		it("should login a user", function () {
			const user = getUser();

			return addUser(user)
				.then(() =>
					request(server)
						.post("/api/login")
						.send({
							email:    user.email,
							password: user.password
						})
						.expect(201)
						.expect("Location", /\/api\/users\/.+/)
				);
		});

		it("should return a valid jwt with user info when successfully login a user", function () {
			const user = getUser();

			return addUser(user)
				.then(() =>
					request(server)
						.post("/api/login")
						.send({
							email:    user.email,
							password: user.password
						})
						.expect(201))
				.then(response => {
					const tokenPayload = jwt.verify(response.body, process.env.JWT_SECRET);

					tokenPayload.should.contain.all.keys(["id", "name", "email", "location", "image"]);
				});
		});
	});
});