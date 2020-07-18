import express from "express";

function getMathRoutes() {
  const router = express.Router();
  router.get("/add", add);
  router.get("/subtract", subtract);
  return router;
}

type MathQuery = {
  a: number;
  b: number;
  c: number;
};

async function add(req: any, res: any) {
  const mathQuery = req.query as MathQuery;
  const sum = Number(mathQuery.a) + Number(mathQuery.c);
  res.send(sum.toString());
}

async function subtract(req: any, res: any) {
  const mathQuery = req.query as MathQuery;
  const difference = Number(mathQuery.a) - Number(mathQuery.b);
  res.send(difference.toString());
}

export { getMathRoutes };
