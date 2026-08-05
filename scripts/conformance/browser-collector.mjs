// Tiny HTTP collector that the in-browser conformance workers POST captures to.
//
// @web/test-runner forwards browser `console.log` to its Node host via a
// websocket that JSON.stringify's the whole message; large capture frames
// exceed that limit ("RangeError: Invalid string length") and disconnect the
// browser. Instead of relying on console output, workers POST each fixture's
// captures straight to this server over HTTP (CORS-enabled), completely
// bypassing WTR's serialization.

import { createServer } from "node:http";

const HOST = "127.0.0.1";
const PORT = Number(process.env.KRDS_BROWSER_COLLECTOR_PORT ?? 8123);

const payloads = [];
let config = {};

const server = createServer((request, response) => {
  if (request.method === "OPTIONS") {
    response.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    response.end();
    return;
  }
  if (request.method === "POST" && request.url?.startsWith("/results")) {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > 512 * 1024 * 1024) request.destroy();
    });
    request.on("end", () => {
      try {
        const parsed = JSON.parse(body);
        payloads.push(parsed);
        response.writeHead(201, { "Access-Control-Allow-Origin": "*" });
        response.end("ok");
      } catch (error) {
        response.writeHead(400, { "Access-Control-Allow-Origin": "*" });
        response.end(String(error));
      }
    });
    return;
  }
  if (request.method === "GET" && request.url?.startsWith("/dump")) {
    response.writeHead(200, {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    });
    response.end(JSON.stringify(payloads));
    return;
  }
  if (request.method === "GET" && request.url?.startsWith("/config")) {
    response.writeHead(200, {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    });
    response.end(JSON.stringify(config));
    return;
  }
  response.writeHead(404, { "Access-Control-Allow-Origin": "*" });
  response.end("not found");
});

export const startCollector = () =>
  new Promise((resolve) => {
    server.listen(PORT, HOST, () => resolve({ host: HOST, port: PORT }));
  });

export const stopCollector = () => new Promise((resolve) => server.close(() => resolve()));

export const getPayloads = () => payloads;
export const setConfig = (value) => {
  config = value;
};
export const getConfig = () => config;
