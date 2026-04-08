import { randomUUID } from "node:crypto";
import { Router } from "express";
import { z } from "zod";
import { computeVfrRoute } from "./modules/flight/computeVfrRoute.js";
import { computeE6B } from "./modules/flight/e6b.js";
import { generateIcaoFlightPlan } from "./modules/flight/generateIcaoFlightPlan.js";
import { checklistsStore, communityStore, logbookStore } from "./modules/ops/inMemoryStores.js";
import { decodeMetar } from "./modules/weather/metarDecoder.js";
import { listNotamByAerodrome } from "./modules/weather/notam.js";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "aerozou-api", version: "0.2.0" });
});

router.post("/vfr/route", (req, res) => {
  const schema = z.object({
    waypoints: z
      .array(
        z.object({
          code: z.string().min(2),
          lat: z.number().gte(-90).lte(90),
          lon: z.number().gte(-180).lte(180),
        }),
      )
      .min(2),
    aircraft: z.object({
      trueAirspeedKt: z.number().positive(),
      fuelBurnLh: z.number().positive(),
    }),
    wind: z.object({
      directionDeg: z.number().gte(0).lte(359),
      speedKt: z.number().gte(0),
    }),
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  return res.json(
    computeVfrRoute(parsed.data.waypoints, parsed.data.aircraft, parsed.data.wind),
  );
});

router.post("/vfr/icao-flight-plan", (req, res) => {
  const schema = z.object({
    callsign: z.string().min(3),
    departure: z.string().length(4),
    destination: z.string().length(4),
    alternate: z.string().length(4).optional(),
    cruisingLevel: z.string().min(2),
    routeText: z.string().min(3),
    etdUtc: z.string().regex(/^\d{4}$/),
    endurance: z.string().regex(/^\d{4}$/),
    personsOnBoard: z.number().int().positive(),
    aircraft: z.object({
      trueAirspeedKt: z.number().positive(),
      fuelBurnLh: z.number().positive(),
    }),
    waypoints: z
      .array(
        z.object({
          code: z.string().min(2),
          lat: z.number().gte(-90).lte(90),
          lon: z.number().gte(-180).lte(180),
        }),
      )
      .min(2),
    wind: z.object({
      directionDeg: z.number().gte(0).lte(359),
      speedKt: z.number().gte(0),
    }),
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  return res.json(generateIcaoFlightPlan(parsed.data));
});

router.post("/tools/e6b", (req, res) => {
  const schema = z.object({
    trueAirspeedKt: z.number().positive(),
    courseDeg: z.number().gte(0).lte(359),
    windFromDeg: z.number().gte(0).lte(359),
    windKt: z.number().gte(0),
    variationDeg: z.number().min(-30).max(30).optional(),
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  return res.json(computeE6B(parsed.data));
});

router.post("/weather/metar/decode", (req, res) => {
  const schema = z.object({ raw: z.string().min(8) });
  const parsed = schema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  try {
    return res.json(decodeMetar(parsed.data.raw));
  } catch (error) {
    return res.status(400).json({ error: (error as Error).message });
  }
});

router.get("/notam/:aerodrome", (req, res) => {
  return res.json({
    aerodrome: req.params.aerodrome.toUpperCase(),
    notam: listNotamByAerodrome(req.params.aerodrome),
  });
});

router.get("/ops/checklists", (_req, res) => {
  return res.json([...checklistsStore.values()]);
});

router.post("/ops/checklists", (req, res) => {
  const schema = z.object({
    name: z.string().min(2),
    items: z.array(z.string().min(1)).min(1),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const checklist = {
    id: randomUUID(),
    name: parsed.data.name,
    items: parsed.data.items.map((label) => ({ id: randomUUID(), label, done: false })),
  };

  checklistsStore.set(checklist.id, checklist);
  return res.status(201).json(checklist);
});

router.patch("/ops/checklists/:id/items/:itemId", (req, res) => {
  const schema = z.object({ done: z.boolean() });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const checklist = checklistsStore.get(req.params.id);
  if (!checklist) {
    return res.status(404).json({ error: "Checklist introuvable" });
  }

  const item = checklist.items.find((i) => i.id === req.params.itemId);
  if (!item) {
    return res.status(404).json({ error: "Item introuvable" });
  }

  item.done = parsed.data.done;
  checklistsStore.set(checklist.id, checklist);
  return res.json(checklist);
});

router.get("/ops/logbook", (_req, res) => {
  return res.json([...logbookStore.values()]);
});

router.post("/ops/logbook", (req, res) => {
  const schema = z.object({
    dateUtc: z.string().min(10),
    aircraftReg: z.string().min(3),
    departure: z.string().length(4),
    destination: z.string().length(4),
    durationMin: z.number().int().positive(),
    remarks: z.string().max(500).optional(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const entry = { id: randomUUID(), ...parsed.data };
  logbookStore.set(entry.id, entry);
  return res.status(201).json(entry);
});

router.get("/ops/logbook/stats", (_req, res) => {
  const entries = [...logbookStore.values()];
  const totalMinutes = entries.reduce((sum, e) => sum + e.durationMin, 0);

  return res.json({
    totalFlights: entries.length,
    totalMinutes,
    totalHours: Number((totalMinutes / 60).toFixed(1)),
  });
});

router.get("/community/posts", (_req, res) => {
  const posts = [...communityStore.values()].sort((a, b) =>
    a.createdAtUtc < b.createdAtUtc ? 1 : -1,
  );
  return res.json(posts);
});

router.post("/community/posts", (req, res) => {
  const schema = z.object({
    author: z.string().min(2),
    aerodrome: z.string().length(4).optional(),
    content: z.string().min(3).max(1000),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const post = {
    id: randomUUID(),
    author: parsed.data.author,
    aerodrome: parsed.data.aerodrome?.toUpperCase(),
    content: parsed.data.content,
    createdAtUtc: new Date().toISOString(),
  };

  communityStore.set(post.id, post);
  return res.status(201).json(post);
});

router.post("/assistant/chat", (req, res) => {
  const schema = z.object({ question: z.string().min(2) });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  return res.json({
    language: "fr",
    answer:
      "Mode prototype: le module IA est prêt pour intégration OpenAI/modèle local. Je peux expliquer une route VFR, décoder un METAR ou lire une checklist.",
    question: parsed.data.question,
  });
});

export default router;
