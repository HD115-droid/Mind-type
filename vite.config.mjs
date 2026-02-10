import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    react({
      include: /\.(jsx|js|tsx|ts)$/,
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './client'),
      '@shared': path.resolve(__dirname, './shared'),
      'react-native': 'react-native-web',
      'expo-linear-gradient': path.resolve(__dirname, './client/shims/expo-linear-gradient.tsx'),
      'expo-blur': path.resolve(__dirname, './client/shims/expo-blur.tsx'),
      'expo-status-bar': path.resolve(__dirname, './client/shims/expo-status-bar.tsx'),
      'expo-glass-effect': path.resolve(__dirname, './client/shims/expo-glass-effect.tsx'),
      '@expo/vector-icons': path.resolve(__dirname, './client/shims/vector-icons.tsx'),
    },
    extensions: ['.web.tsx', '.web.ts', '.web.jsx', '.web.js', '.tsx', '.ts', '.jsx', '.js'],
  },
  define: {
    global: 'globalThis',
    __DEV__: JSON.stringify(process.env.NODE_ENV !== 'production'),
    'process.env': {},
  },
  server: {
    port: 5173,
    host: true,
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-native-web',
    ],
    esbuildOptions: {
      resolveExtensions: ['.web.tsx', '.web.ts', '.web.jsx', '.web.js', '.tsx', '.ts', '.jsx', '.js'],
      loader: {
        '.js': 'jsx',
      },
    },
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true,
    },
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
});
