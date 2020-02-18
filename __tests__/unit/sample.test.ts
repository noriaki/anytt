import { compilerOptions } from '../../tsconfig-jest.json';

const sum = (a: number, b: number): number => a + b;

describe('sample', () => {
  it('1 + 2 = 3', () => {
    expect(1 + 2).toBe(3);
  });

  it('sum(1, 2) = 3', () => {
    expect(sum(1, 2)).toBe(3);
  });

  it('tsconfig.compilerOptions.jsx === react', () => {
    expect(compilerOptions.jsx).toBe('react');
  });
});
