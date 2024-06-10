import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { rword } from "rword";

const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const Word = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });
  const quantity = Number(req.query.quantity ?? 1);

  if (quantity > 6) return res.status(404).send("😭");

  if (session) {
    const words: { word: string; definition: string }[] = [];

    for (let i = 0; i < quantity; i++) {
      await sleep(100);
      const word = rword.generate();

      const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`,
        {
          headers: { "User-Agent": Date.now().toFixed() },
        },
      );

      try {
        const query = (await response.json()) as {
          meanings: { definitions: { definition: string }[] }[];
        }[];

        const definition = query[0]?.meanings[0]?.definitions[0]?.definition;

        if (!definition) {
          i--;
          continue;
        }
        if (Number(definition?.split(" ")?.length) < 3) {
          i--;
          continue;
        }

        words.push({ word, definition });
      } catch {
        i--;
        continue;
      }
    }

    return res.status(200).send(JSON.stringify(words, null, 2));
  }
  return res.status(401).send({ error: 401, message: "Unauthorized." });
};

export default Word;
