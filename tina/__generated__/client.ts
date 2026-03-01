import { createClient } from "tinacms/dist/client";
import { queries } from "./types";
export const client = createClient({ cacheDir: 'C:/Users/LENOVO/Desktop/site/tina/__generated__/.cache/1772380224806', url: 'http://localhost:4001/graphql', token: 'null', queries,  });
export default client;
  