import { pathsToModuleNameMapper } from "ts-jest";
import { compilerOptions } from "./tsconfig.json";
import type { JestConfigWithTsJest } from "ts-jest";
import { defaults as tsjPreset } from "ts-jest/presets";

const jestConfig: JestConfigWithTsJest = {
  testEnvironment: 'node',
  transform: {
    ...tsjPreset.transform,
  },
  collectCoverageFrom: [
    '<rootDir>/src/**/*',
    '<rootDir>/@rain/**/*'
  ],
  coveragePathIgnorePatterns: [
    '<rootDir>/test/'
  ],
  moduleNameMapper: pathsToModuleNameMapper(
    compilerOptions.paths /*, { prefix: '<rootDir>/' } */
  ),
  modulePaths: ["<rootDir>"],
  setupFiles: ["./test/__utils__/.setup.ts"],
};

export default jestConfig;
