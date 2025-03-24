import { resolve } from 'path';
import { defineConfig } from 'vite';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

// 创建一个通用的配置基础
const createConfig = (format: 'es' | 'umd', emptyOutDir: boolean) => ({
  plugins: [cssInjectedByJsPlugin()],
  define: {
    'process.env': {},
  },
  build: {
    sourcemap: true,
    emptyOutDir,
    lib: {
      entry: resolve(__dirname, 'src/index.tsx'),
      name: 'OTExplorer',
      formats: [format],
      fileName: () =>
        `opfs-tools-explorer.${format === 'es' ? 'mjs' : 'umd.js'}`,
    },
    rollupOptions: {
      external:
        // es 排除所有非相对路径的导入（即第三方库）
        format === 'es' ? ['react', 'react-dom'] : [],
    },
  },
});

// 导出配置函数
export default defineConfig(({ mode }) => {
  // 通过环境变量或命令行参数来选择配置
  if (mode === 'es') {
    return createConfig('es', true); // ES 模块，外部依赖
  }
  if (mode === 'umd') {
    return createConfig('umd', false); // UMD，打包所有依赖
  }

  return createConfig('umd', false);
});
