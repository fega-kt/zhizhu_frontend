import { Agent } from 'https';
import path from 'path';

import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';
import Joi from 'Joi';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  if (!process.env.ENV_FOLDER) {
    throw new Error('Chưa được config đường dẫn thư mục env');
  }

  const loaded = dotenv.config({
    path: path.resolve(
      __dirname,
      'env',
      process.env.ENV_FOLDER,
      mode === 'development' ? '.env.development' : '.env.production',
    ),
  });
  if (loaded.error) {
    throw new Error();
  }

  const validateResult = Joi.object({
    VITE_APP_BASE_API: Joi.string().required(),
    VITE_APP_HOMEPAGE: Joi.string().required(),
    VITE_APP_APP_NAME: Joi.string().required(),
  }).validate(loaded.parsed);

  if (validateResult.error) {
    throw new Error(`Error env: ${validateResult.error.message}`);
  }
  return {
    base: './',
    esbuild: {
      // drop: ['console', 'debugger'],
    },
    css: {
      // 开css sourcemap方便找css
      devSourcemap: true,
    },
    plugins: [
      react(),
      // 同步tsconfig.json的path设置alias
      tsconfigPaths(),
      createSvgIconsPlugin({
        // 指定需要缓存的图标文件夹
        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
        // 指定symbolId格式
        symbolId: 'icon-[dir]-[name]',
      }),
      visualizer({
        open: false,
      }),
    ],
    envDir: path.resolve(__dirname, 'env'),
    server: {
      // 自动打开浏览器
      open: true,
      host: true,
      port: 3001,
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
          // https://github.com/vitejs/vite/discussions/8998#discussioncomment-4408695
          agent: new Agent({ keepAlive: true, keepAliveMsecs: 20000 }),
        },
      },
    },
    build: {
      target: 'esnext',
      minify: 'terser',
      // rollupOptions: {
      //   output: {
      //     manualChunks(id) {
      //       if (id.includes('node_modules')) {
      //         // 让每个插件都打包成独立的文件
      //         return id.toString().split('node_modules/')[1].split('/')[0].toString();
      //       }
      //       return null;
      //     },
      //   },
      // },

      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
        },
      },

      terserOptions: {
        compress: {
          // 生产环境移除console
          drop_console: true,
          drop_debugger: true,
        },
      },
    },
  };
});
