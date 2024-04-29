import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import * as cheerio from "cheerio";

export const dynamic = "force-dynamic";

const Word = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });

  if (session) {
    const response = await fetch("https://randomword.com", {
      headers: {
        "User-Agent": Date.now().toFixed(), // USED TO GET NEW WORDS ON RELOAD
      },
    });

    const html = await response.text();
    const $ = cheerio.load(html);
    const data = $(".section #shared_section")
      .text()
      .trim()
      .split("\n\t\t\t\t");

    return res.status(200).json({ word: data[0], definition: data[1] });
  }
  return res.status(401).send({ error: 401, message: "Unauthorized." });
};

export default Word;
