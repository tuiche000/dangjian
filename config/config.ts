import { IConfig, IPlugin } from 'umi-types';
import defaultSettings from './defaultSettings'; // https://umijs.org/config/

import slash from 'slash2';
import webpackPlugin from './plugin.config';
const { pwa, primaryColor } = defaultSettings;

// preview.pro.ant.design only do not use in your production ;
// preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
const { ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION } = process.env;
const isAntDesignProPreview = ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site';
const plugins: IPlugin[] = [
  [
    'umi-plugin-react',
    {
      antd: true,
      dva: {
        hmr: true,
      },
      locale: {
        // default false
        enable: true,
        // default zh-CN
        default: 'zh-CN',
        // default true, when it is true, will use `navigator.language` overwrite default
        baseNavigator: true,
      },
      // dynamicImport: {
      //   loadingComponent: './components/PageLoading/index',
      //   webpackChunkName: true,
      //   level: 3,
      // },
      pwa: pwa
        ? {
            workboxPluginMode: 'InjectManifest',
            workboxOptions: {
              importWorkboxFrom: 'local',
            },
          }
        : false,
      // default close dll, because issue https://github.com/ant-design/ant-design-pro/issues/4665
      // dll features https://webpack.js.org/plugins/dll-plugin/
      // dll: {
      //   include: ['dva', 'dva/router', 'dva/saga', 'dva/fetch'],
      //   exclude: ['@babel/runtime', 'netlify-lambda'],
      // },
    },
  ],
  [
    'umi-plugin-pro-block',
    {
      moveMock: false,
      moveService: false,
      modifyRequest: true,
      autoAddMenu: true,
    },
  ],
]; // 针对 preview.pro.ant.design 的 GA 统计代码

if (isAntDesignProPreview) {
  plugins.push([
    'umi-plugin-ga',
    {
      code: 'UA-72788897-6',
    },
  ]);
}

export default {
  plugins,
  block: {
    // 国内用户可以使用码云
    // defaultGitUrl: 'https://gitee.com/ant-design/pro-blocks',
    defaultGitUrl: 'https://github.com/ant-design/pro-blocks',
  },
  hash: true,
  targets: {
    ie: 11,
  },
  devtool: isAntDesignProPreview ? 'source-map' : false,
  // umi routes: https://umijs.org/zh/guide/router.html
  routes: [
    {
      path: '/',
      component: '../layouts/BlankLayout',
      routes: [
        {
          path: '/',
          redirect: '/home'
        },
        {
          path: '/user',
          component: '../layouts/UserLayout',
          routes: [
            {
              path: '/user',
              redirect: '/user/login',
            },
            {
              name: 'login',
              icon: 'smile',
              path: '/user/login',
              component: './user/login',
            },
            {
              name: 'register-result',
              icon: 'smile',
              path: '/user/register-result',
              component: './user/register-result',
            },
            {
              name: 'register',
              icon: 'smile',
              path: '/user/register',
              component: './user/register',
            },
            {
              component: '404',
            },
          ],
        },
        {
          path: '',
          component: '../layouts/BasicLayout',
          // redirect: '/home',
          // Routes: ['src/pages/Authorized'],
          // authority: ['admin', 'user'],
          routes: [
            {
              name: 'home',
              icon: 'home',
              path: '/home',
              component: './home',
              authority: ['ROLE_ADMINISTRATOR', 'ROLE_ORGADMIN'],
            },
            {
              name: 'activity',
              icon: 'setting',
              path: '/activity',
              component: './activity',
              authority: ['ROLE_ADMINISTRATOR'],
              // authority: ['admin', 'user'],
            },
            {
              name: 'checkin',
              icon: 'setting',
              path: '/checkin',
              component: './checkin',
              authority: ['ROLE_ADMINISTRATOR', 'ROLE_ORGADMIN'],
            },
           
            {
              name: 'organization',
              icon: 'team',
              path: '/organization',
              component: './organization',
              authority: ['ROLE_ADMINISTRATOR'],
            },
            {
              name: 'department',
              icon: 'team',
              path: '/department',
              component: './department',
              authority: ['ROLE_ADMINISTRATOR'],
            },
            {
              name: 'point',
              icon: 'money-collect',
              path: '/point',
              routes: [
                {
                  name: 'point-point',
                  // icon: 'smile',
                  path: '/point/point',
                  authority: ['ROLE_ADMINISTRATOR', 'ROLE_ORGADMIN'],
                  component: './point',
                },
                {
                  name: 'point-pointRank',
                  // icon: 'smile',
                  path: '/point/pointRank',
                  authority: ['ROLE_ADMINISTRATOR'],
                  component: './pointRank',
                },
                {
                  name: 'point-pointRule',
                  // icon: 'smile',
                  path: '/point/pointRule',
                  authority: ['ROLE_ADMINISTRATOR'],
                  component: './pointRule',
                },
              ],
            },
            {
              name: 'content',
              icon: 'table',
              path: '/content',
              authority: ['ROLE_ADMINISTRATOR'],
              routes: [
                {
                  name: 'content-topic',
                  // icon: 'smile',
                  path: '/content/topic',
                  component: './topic',
                },
                {
                  name: 'content-menu',
                  // icon: 'smile',
                  path: '/content/menu',
                  component: './menu',
                },
                {
                  name: 'content-apply',
                  // icon: 'smile',
                  path: '/content/apply',
                  component: './apply',
                },
              ],
            },

            {
              name: 'userManger',
              icon: 'user',
              path: '/userManger',
              authority: ['ROLE_ADMINISTRATOR'],
              routes: [
                {
                  name: 'userManger-userManger',
                  // icon: 'smile',
                  path: '/userManger/userManger',
                  component: './userManger',
                },
              ],
            },
            {
              component: '404',
            },
          ],
        },
      ],
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': primaryColor,
  },
  define: {
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION:
      ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION || '', // preview.pro.ant.design only do not use in your production ; preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
  },
  ignoreMomentLocale: true,
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  disableRedirectHoist: true,
  cssLoaderOptions: {
    modules: true,
    getLocalIdent: (
      context: {
        resourcePath: string;
      },
      _: string,
      localName: string,
    ) => {
      if (
        context.resourcePath.includes('node_modules') ||
        context.resourcePath.includes('ant.design.pro.less') ||
        context.resourcePath.includes('global.less')
      ) {
        return localName;
      }

      const match = context.resourcePath.match(/src(.*)/);

      if (match && match[1]) {
        const antdProPath = match[1].replace('.less', '');
        const arr = slash(antdProPath)
          .split('/')
          .map((a: string) => a.replace(/([A-Z])/g, '-$1'))
          .map((a: string) => a.toLowerCase());
        return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
      }

      return localName;
    },
  },
  manifest: {
    basePath: '/',
  },
  chainWebpack: webpackPlugin,
  /*
  proxy: {
    '/server/api/': {
      target: 'https://preview.pro.ant.design/',
      changeOrigin: true,
      pathRewrite: { '^/server': '' },
    },
  },
  */
} as IConfig;
