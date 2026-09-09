import nextVitals from 'eslint-config-next/core-web-vitals.js';
import nextTypescript from 'eslint-config-next/typescript.js';

export default [
 ...nextVitals,
 ...nextTypescript,
 {ignores:['.next/**','node_modules/**','next-env.d.ts']},
];
