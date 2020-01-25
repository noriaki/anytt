describe('env', () => {
  it('should have MONGODB_URI', () => {
    expect(process.env.MONGODB_URI).toBeDefined();
  });

  it('should have DB_NAME', () => {
    expect(process.env.DB_NAME).toBe('anytt_test');
  });
});
