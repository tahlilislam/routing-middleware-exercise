// setting environment variable for node env which has 3 options:
// development, production, tests -> useful when you have different configerations when your app is running, right now it wont make a difference
process.env.NODE_ENV = "test";
const request = require("supertest");

const app = require("../app");
let items = require("../fakeDb");

let pizza = { name: "Pizza", price: 18.99 };

beforeEach(function () {
  items.push(pizza);
});

afterEach(function () {
  // make sure this *mutates*, not redefines, `cats`
  // cats =[] //This redifines the original array; it will be a new array in memory
  items.length = 0; //we are clearing the contents this way
});

describe("GET /items", () => {
  test("Get all items", async () => {
    // request using supertest, the app; this test time request takes time; its asynchronous
    const res = await request(app).get("/items");
    expect(res.statusCode).toBe(200);
    // what we expect to get back from server, a json response
    expect(res.body).toEqual({ items: [pizza] });
  });
});

describe("GET /items/:name", () => {
  test("Get item by name", async () => {
    const res = await request(app).get(`/items/${pizza.name}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ item: pizza });
  });
  test("Responds with 404 for invalid item", async () => {
    const res = await request(app).get(`/items/icecube`);
    expect(res.statusCode).toBe(404);
  });
});

describe("POST /items", () => {
  test("Creating an item in list", async () => {
    const res = await request(app)
      .post("/items")
      .send({ name: "Strawberry", price: 4.99 });
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({ added: { name: "Strawberry", price: 4.99 } });
  });
  test("Responds with 400 if name is missing", async () => {
    const res = await request(app).post("/items").send({});
    expect(res.statusCode).toBe(400);
    debugger;
  });
});

describe("/PATCH /items/:name", () => {
  test("Updating an item's name ONLY", async () => {
    const res = await request(app)
      .patch(`/items/${pizza.name}`)
      .send({ name: "Noodles" });
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      updated: { name: "Noodles", price: pizza.price },
    });
  });
  test("Updating an item's price ONLY", async () => {
    const res = await request(app)
      .patch(`/items/${pizza.name}`)
      .send({ price: 20.99 });
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ updated: { name: pizza.name, price: 20.99 } });
  });
  test("Updating an item's name AND price", async () => {
    const res = await request(app)
      .patch(`/items/${pizza.name}`)
      .send({ name: "cheese pizza", price: 22.99 });
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      updated: { name: "cheese pizza", price: 22.99 },
    });
  });
  test("Checking for falsy values for item's name and price", async () => {
    const res = await request(app)
      .patch(`/items/${pizza.name}`)
      .send({ name: "", price: 0 });
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      updated: { name: pizza.name, price: pizza.price },
    });
  });
  test("Responds with 404 for invalid name", async () => {
    const res = await request(app).patch(`/items/toyota`).send({ name: "Toy" });
    expect(res.statusCode).toBe(404);
  });
});

describe("/DELETE /items/:name", () => {
  test("Deleting an item", async () => {
    const res = await request(app).delete(`/items/${pizza.name}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: "Deleted" });
  });
  test("Responds with 404 for deleting invalid item", async () => {
    const res = await request(app).delete(`/items/mercedes`);
    expect(res.statusCode).toBe(404);
  });
});
