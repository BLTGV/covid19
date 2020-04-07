import Head from "next/head";

import { useStoreActions } from "../src/store";
import { useEffect } from "react";
import Dashboard from "../src/components/Dashboard";

const Home = (props) => {
  return <Dashboard />;
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
