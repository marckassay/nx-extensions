import {
  ensureNxProject,
  renameFile,
  runNxCommandAsync,
  uniq,
} from '@nrwl/nx-plugin/testing';

xdescribe('buildoptions e2e', () => {
  beforeAll(() => {
    ensureNxProject('@nxext/stencil', 'dist/packages/stencil');
  });

  it(`should build with custom stencil config naming`, async () => {
    const plugin = uniq('library');

    await runNxCommandAsync(
      `generate @nxext/stencil:lib ${plugin} --style=scss --buildable --e2eTestRunner='none' --junitTestRunner='none'`
    );

    const uniqConfigFilename = uniq('stencil.config');
    renameFile(
      `libs/${plugin}/stencil.config.ts`,
      `libs/${plugin}/${uniqConfigFilename}.ts`
    );

    const result = await runNxCommandAsync(
      `build ${plugin} --configPath=libs/${plugin}/${uniqConfigFilename}.ts`
    );
    expect(result.stdout).toContain('build finished');
  });

  it(`should build with custom configPath`, async () => {
    const plugin = uniq('library');
    await runNxCommandAsync(
      `generate @nxext/stencil:lib ${plugin} --style=scss --buildable --e2eTestRunner='none' --junitTestRunner='none'`
    );

    const result = await runNxCommandAsync(
      `build ${plugin} --configPath=libs/${plugin}/stencil.config.ts`
    );
    expect(result.stdout).toContain('build finished');
  });
});
