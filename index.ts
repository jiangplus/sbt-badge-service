import fastify from "fastify";
import cors from "@fastify/cors";
import multipart from "@fastify/multipart";
import statics from "@fastify/static";

import { generateNonce, SiweMessage } from "siwe";
import * as jwt from "jsonwebtoken";

import { ethers, BigNumber } from "ethers";

import { readFileSync } from "fs";
import { createHash } from 'node:crypto'

import { ImageData, getNounSeedFromBlockHash, getNounData } from '@nouns/assets';
import { buildSVG } from '@nouns/sdk';
const { palette } = ImageData;

import * as dotenv from "dotenv";
dotenv.config();

let SECRET_KEY = process.env.SECRET_KEY || "";
let signer = new ethers.Wallet(process.env.PRV_KEY || "");

function sha256(content: any) {  
  return createHash('sha256').update(content).digest('hex')
}

const server = fastify();

server.register(cors, {
  origin: "*",
});

server.get("/", async (request, reply) => {
  return "pong\n";
});

server.get<{
  Querystring: {
    name: string;
  };
}>("/nouns/getimg", async (request, reply) => {
  let name = request.query.name || "";
  let nextNounId = 123
  let hash = '0x' + sha256(name)
  console.log(name)
  console.log(hash)
  const seed = getNounSeedFromBlockHash(nextNounId, hash);

  const { parts, background } = getNounData(seed);
  console.log({parts, background})

  const svgBinary = buildSVG(parts, palette, background);
  return svgBinary;
});


server.get<{}>("/siwe/nonce", async (request, reply) => {
  return { nonce: generateNonce() };
});

server.post<{
  Body: {
    message: string;
    signature: string;
  };
}>("/siwe/verify", async (request, reply) => {
  let { message, signature } = request.body;

  if (!message) {
    return {
      result: "error",
      message: "Expected prepareMessage object as body.",
    };
  }

  try {
    let SIWEObject = new SiweMessage(message);
    console.log("SIWEObject", SIWEObject);

    if (SIWEObject.domain != process.env.SIWE_DOMAIN) {
      return { result: "error", message: "invalid siwe domain" };
    }
    let result = await SIWEObject.verify({ signature });
    console.log("result", result);

    let address = result.data.address;

    let token = jwt.sign({ address: address }, SECRET_KEY);
    console.log(token);
    return { result: "ok", address: result.data.address, token: token };
  } catch (e: any) {
    console.error(e);
    return { result: "error", message: e.message };
  }
});

server.get<{
  Querystring: {
    authToken: string;
  };
}>("/siwe/info", async (request, reply) => {
  let { authToken } = request.query;

  if (!authToken) {
    return { result: "error", message: "empty authToken" };
  }

  try {
    let decoded = jwt.verify(authToken, SECRET_KEY);
    return { result: "ok", decoded: decoded };
  } catch (e: any) {
    console.error(e);
    return { result: "error", message: e.message };
  }
});


const port = process.env.PORT || "8080";
server.listen({ port: Number(port) }, async (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
