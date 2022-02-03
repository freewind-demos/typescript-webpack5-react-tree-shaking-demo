import webpack from 'webpack';

interface SideEffectsFreePluginOptions {
  /** Mark matched files side effect free. */
  includes?: RegExp[];
  /**
   * Skip matched files.
   *
   * @default [/\/node_modules\//]
   */
  excludes?: RegExp[];
}

const pluginName = 'SideEffectsFreePlugin';

/**
 * Webpack side effects free plugin indicates which pattern files are side effects free, so that
 * they can be dead-code eliminated via tree shaking.
 *
 * Why not add to `package.json` directly? Because multi `package.json` in non workspaces folder is
 * not allowed by uc-frontend CI config.
 *
 * @see https://webpack.js.org/guides/tree-shaking/
 * @see https://github.com/UrbanCompass/uc-frontend/blob/0ef62aca3977be2f28e8ad688d574792c9b70d83/apps/pull-request-bot/src/checks/hydra/PackageJsonCheck.ts#L68-L76
 */
export class SideEffectsFreePlugin {
  constructor(public options: SideEffectsFreePluginOptions = {}) {
  }

  apply(compiler: webpack.Compiler): void {
    const {includes, excludes = [/\/node_modules\//]} = this.options;

    compiler.hooks.compilation.tap(pluginName, (compilation, {normalModuleFactory}) => {
      normalModuleFactory.hooks.module.tap(pluginName, (module: any /*webpack.NormalModule*/) => {
        // Absolute path
        const {userRequest} = module;

        if (excludes.some((r) => r.test(userRequest))) return;

        if (includes?.some((r) => r.test(userRequest))) {
          console.log("### userRequest", userRequest);
          module.factoryMeta ??= {};

          // Tell `SideEffectsFlagPlugin` this file is side effect free and should be mark as `/*#__PURE__*/`.
          (module.factoryMeta as any).sideEffectFree = true;
          return module;
        }
      });
    });
  }
}
