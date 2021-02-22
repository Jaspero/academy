import commonjs from '@rollup/plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';

export default {
    input: 'dist/index.js',
    inlineDynamicImports: true,
    output: [
        {
            name: 'Academy',
            file: 'dist/academy.js',
            format: 'umd',
            exports: 'default',
        },
        // {
        //     name: 'Academy',
        //     dir: 'academy',
        //     format: 'esm',
        //     exports: 'default',
        // },
    ],
    plugins: [
        resolve(),
        commonjs()
    ]
};
