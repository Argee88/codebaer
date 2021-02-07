import { Util } from './util.class';

describe('Util', () => {
  it('should create an instance', () => {
    expect(new Util()).toBeTruthy();
  });

  describe('errorOptionsToArray', () => {
    it('should return an array when given an array', () => {
      const givenData = ['one', 'two'];
      const expectedData = givenData;

      const receivedData = Util.errorOptionsToArray(givenData);

      expect(receivedData).toEqual(expectedData);
    });

    it('should return an array when given a string', () => {
      const givenData = 'one';
      const expectedData = [givenData];

      const receivedData = Util.errorOptionsToArray(givenData);

      expect(receivedData).toEqual(expectedData);
    });
  });
});
