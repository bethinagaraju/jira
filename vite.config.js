// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })



// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// export default defineConfig({
//   plugins: [react()],
//   build: {
//     lib: {
//       entry: 'src/index.jsx',  // update this path if your main export file is different
//       name: 'JiraTaskManagement',  // global variable name for UMD build
//       fileName: (format) => `index.${format}.js`,
//     },
//     rollupOptions: {
//       external: ['react', 'react-dom'],  // don't bundle react/react-dom
//       output: {
//         globals: {
//           react: 'React',
//           'react-dom': 'ReactDOM',
//         },
//       },
//     },
//     sourcemap: true,
//   },
// })







// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.jsx'), // Entry point updated to index.jsx
      name: 'MyReactApp', // Global variable name (for UMD builds)
      fileName: (format) => `my-react-app.${format}.js`, // Output file name
      formats: ['es', 'cjs'], // Output formats: ES Module and CommonJS
    },
    rollupOptions: {
      // Externalize dependencies that shouldn't be bundled
      external: ['react', 'react-dom', 'react-router-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react-router-dom': 'ReactRouterDOM',
        },
      },
    },
    outDir: 'dist', // Output directory
  },
});
