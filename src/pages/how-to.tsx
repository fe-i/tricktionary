import { Layout } from "~/components/ui/layout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/accordion";
import { UnderlineHover } from "~/components/underline-hover";

const faq: { q: string; a: string }[] = [
  //TODO: add FAQ
  // { q: "", a: "" },
];

const HowTo: React.FC = () => {
  return (
    <Layout title="How to Play">
      <div className="flex w-full flex-col items-start justify-start gap-6 py-4">
        <UnderlineHover>
          <h1 className="text-4xl font-bold">Instructions</h1>
        </UnderlineHover>
        <p className="mx-4">
          This game is all about your ability to trick your opponents. Read one
          word at a time from the word bank on the last page. Players write
          their own made-up definitions for that word, but one chosen player,
          the Know-it-All, has the real definitions to each word. Everyone but
          the Know-it-All guesses which is the actual definition of the word.
          The more convincing you make your definition, the more likely you are
          to trick your opponents and win the game!
        </p>
        <p className="mx-4">
          One player will be assinged the Know-it-All each round. The
          Know-it-All will choose one word from a predetermined word bank. Every
          other player will write down a made-up definition for that word submit
          it to the group. All of the definitions (including the correct one)
          are shuffled, then displayed for all players to read. All players
          except the Know-it-All vote for the definition they think is correct.
          The correct definition is then revealed. Players who guessed it
          correctly get 4 points, and all players get 1 point for each vote that
          their fake definitions received.
        </p>
        {!!faq.length && (
          <>
            <UnderlineHover>
              <h1 className="text-4xl font-bold">FAQ</h1>
            </UnderlineHover>
            <Accordion type="multiple" className="w-full">
              {faq.map((item, _) => (
                <AccordionItem key={_} value={String(_)}>
                  <AccordionTrigger>{item.q}</AccordionTrigger>
                  <AccordionContent>{item.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </>
        )}
      </div>
    </Layout>
  );
};

export default HowTo;
