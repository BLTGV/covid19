import Head from "next/head";

import Header from "../src/argon/components/Headers/Header";
import { retrieveSource } from "../src/data/source";
import { useStoreActions } from "../src/store";
import { useEffect } from "react";

const Home = (
  {
    /* raw */
  },
) => {
  // const loadRaw = useStoreActions((actions) => actions.data.loadRaw);
  // useEffect(() => {
  //   loadRaw(raw);
  // }, []);
  return <Header />;
};

export default Home;

// export const getStaticProps = async () => {
//   const raw = await retrieveSource();
//   return {
//     props: {
//       raw,
//     },
//   };
// };
