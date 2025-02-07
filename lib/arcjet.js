import arcjet, { tokenBucket } from "@arcjet/next";

const aj = arcjet({
  key: process.env.ARCJET_KEY,
  characteristics: ["userId"],
  rules: [
    tokenBucket({
        mode: "LIVE",
        refillRate: 5,
        interval: 3600,
        capacity: 5,
    })
],
});

export default aj;
 