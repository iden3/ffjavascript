import config from "./rollup.cjs.config.js";
import jscc from 'rollup-plugin-jscc'

export default {
    input: "main.js",
    output: {
        file: "build/main.ses.cjs",
        format: "cjs",
    },
    external: [
        ...config.external,
    ],
    plugins: [
      jscc({
          values: { _SES: process.env.SES },
      })
    ],
};
