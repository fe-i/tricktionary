import Layout from "~/components/layout";

const HowTo: React.FC = () => {
  return (
    <Layout>
      {" "}
      How
      <div className="relative h-80 w-80">
        <div className="absolute left-1/4 top-1/4 h-1/2 w-1/2 rounded-full bg-gradient-to-br from-orange-300 to-orange-600"></div>
        <div className="absolute h-full w-full backdrop-blur-lg"></div>
      </div>
    </Layout>
  );
};

export default HowTo;
