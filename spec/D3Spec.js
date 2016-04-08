describe('Test D3.js with jasmine ', function() {
  var c;

  beforeEach(function() {
    c = metExploreD3.GraphNetwork.delayedInitialisation();
    c.render();
  });

  afterEach(function() {
    d3.selectAll('svg').remove();
  });

  describe('the svg' ,function() {
    it('should be created', function() {
        expect(getSvg()).not.toBeNull();
    });

  /*  it('should have the correct height', function() {
      expect(getSvg().attr('width')).toBe('100%');
    });

    it('should have the correct width', function() {
      expect(getSvg().attr('width')).toBe('100%');
    });*/
  });

  function getSvg() {
    return d3.select('svg');
  }

});
