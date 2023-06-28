import type { NextPage } from "next";
import Head from "next/head";
import { HomeView } from "../views";

const Home: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Chocoo'dropper</title>
        <meta
          name="description"
          content="Chocoo'dropper"
        />
      </Head>
      <HomeView />
    </div>
  );
};

export default Home;
