import Layout from "~/components/layout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/accordion";

const HowTo: React.FC = () => {
  return (
    <Layout>
      <div className="flex w-full flex-col items-start justify-start gap-6 py-4">
        <h1 className="text-4xl font-bold ">Instructions</h1>
        <p className="ml-4">
          This game is all about your ability to trick your opponents. Read one
          word at a time from the word bank on the last page. Players write
          their own made-up definitions for that word, but one chosen player,
          the Know-it-All, has the real definitions to each word. Everyone but
          the Know-it-All guesses which is the actual definition of the word.
          The more convincing you make your definition, the more likely you are
          to trick your opponents and win the game!{" "}
        </p>
        <p className="ml-4">
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
        <h1 className="mt-8 text-4xl font-bold">FAQ</h1>
        <Accordion type="multiple" className="ml-4 w-4/5">
          <AccordionItem value="item-1">
            <AccordionTrigger>Is it accessible?</AccordionTrigger>
            <AccordionContent>
              Yes. It adheres to the WAI-ARIA design pattern.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Is it accessible?</AccordionTrigger>
            <AccordionContent>
              Yes. It adheres to the WAI-ARIA design pattern.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Is it accessible?</AccordionTrigger>
            <AccordionContent>
              Yes. It adheres to the WAI-ARIA design pattern.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </Layout>
  );
};

export default HowTo;
