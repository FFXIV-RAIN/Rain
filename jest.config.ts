import type { JestConfigWithTsJest } from 'ts-jest';
import { defaults as tsjPreset } from 'ts-jest/presets';

const jestConfig: JestConfigWithTsJest = {
  testEnvironment: 'node',
  transform: {
    ...tsjPreset.transform,
  },
  collectCoverageFrom: ['<rootDir>/src/**/*', '<rootDir>/@rain/**/*'],
  coveragePathIgnorePatterns: ['<rootDir>/test/'],
  modulePaths: ['<rootDir>'],
  setupFiles: ['./test/__utils__/.setup.ts'],
};

export default jestConfig;
