const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');
const { AutoUnpackNativesPlugin } = require('@electron-forge/plugin-auto-unpack-natives');

module.exports = {
  // =========================
  // PACKAGER CONFIG (App runtime)
  // =========================
  packagerConfig: {
    asar: true,
    prune: true,

    // ✅ App icon (window, taskbar while running)
    icon: './assets/icon',

    // App identity (important for Windows shortcuts)
    name: 'Clinic App',

    ignore: (file) => {
      if (!file) return false;

      const keep =
        file.startsWith('/.vite') ||
        file.startsWith('/node_modules');

      return !keep;
    },
  },

  rebuildConfig: {},

  // =========================
  // MAKERS (INSTALLERS)
  // =========================
  makers: [
    // ✅ Windows Installer (Squirrel)
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        name: 'clinic_app',

        // ✅ Installer + desktop shortcut icon
        setupIcon: './assets/icon.ico',

        // App name shown in Windows
        title: 'Clinic App',

        // Ensures proper shortcut creation behavior
        noMsi: true,
      },
    },

    // =========================
    // macOS
    // =========================
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },

    // =========================
    // Linux
    // =========================
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],

  // =========================
  // PLUGINS
  // =========================
  plugins: [
    {
      name: '@electron-forge/plugin-vite',
      config: {
        build: [
          {
            entry: 'src/main.js',
            config: 'vite.main.config.mjs',
            target: 'main',
          },
          {
            entry: 'src/preload.js',
            config: 'vite.preload.config.mjs',
            target: 'preload',
          },
        ],
        renderer: [
          {
            name: 'main_window',
            config: 'vite.renderer.config.mjs',
          },
        ],
      },
    },

    // Native module support
    new AutoUnpackNativesPlugin({}),

    // Security fuses
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};