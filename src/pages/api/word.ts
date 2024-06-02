import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import * as cheerio from "cheerio";

const Word = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });
  const quantity = Number(req.query.quantity ?? 1);

  if (quantity > 6) return res.status(404).send("😭");

  if (session) {
    const words = [];

    for (let i = 0; i < quantity; i++) {
      const response = await fetch("https://randomword.com", {
        headers: { "User-Agent": Date.now().toFixed() },
      });

      const html = await response.text();
      const $ = cheerio.load(html);
      const data = $(".section #shared_section")
        .text()
        .trim()
        .split("\n\t\t\t\t");

      const definition = data[1]?.split(";")[0];

      if (Number(definition?.split(" ")?.length) < 3) {
        i--;
        continue;
      }

      words.push({ word: data[0], definition: data[1]?.split(";")[0] });
    }

    return res.status(200).send(JSON.stringify(words, null, 2));
  }
  return res.status(401).send({ error: 401, message: "Unauthorized." });
};

export default Word;
