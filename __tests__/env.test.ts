describe('env', () => {
  it('should have MONGODB_URI', () => {
    expect(process.env.MONGODB_URI).toBeDefined();
    expect(typeof process.env.MONGODB_URI).toBe('string');
  });
});
