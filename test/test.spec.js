'use strict';

const chai = require('chai');
const expect = chai.expect;
const groupByMin = require('../index');

describe('Collapse arrays with min', function() {
  describe('Collapse good array', function() {

    const arr = [
      { name: 'Vasya', who: 'man', weight: 100, height: 100 },
      { name: 'Vasya', who: 'man', weight: 90, height: 101 },
      { name: 'Kolya', who: 'man', weight: 50, height: 102 },
      { name: 'Katya', who: 'woman', weight: 90, height: 104 },
      { name: 'Olya', who: 'woman', weight: 100, height: 120 }
    ];

    it('One column grouped', function() {
      const result = groupByMin(arr, 'who', 'weight, height');

      expect(result).to.be.deep.equal([
        {
          who: 'man',
          weight: 50,
          height: 100
        },
        {
          who: 'woman',
          weight: 90,
          height: 104
        }
      ]);
    });

    xit('Two columns grouped', function() {
      const result = groupByMin(arr, 'who,name', 'weight, height');

      expect(result).to.deep.equal([
        { name: 'Vasya', who: 'man', weight: 90, height: 100 },
        { name: 'Kolya', who: 'man', weight: 50, height: 102 },
        { name: 'Katya', who: 'woman', weight: 90, height: 104 },
        { name: 'Olya', who: 'woman', weight: 100, height: 120 }
      ]);
    });

    it('Without summary columns', function() {
      const result = groupByMin(arr, 'who');

      expect(result).to.be.deep.equal([
        { who: 'man' },
        { who: 'woman' }
      ]);
    });
  });

  describe('Collapse bad arrays', function() {
    it('Add digits as strings', function() {
      var badArray = [
        {
          name: 'a',
          who: 'people',
          money: '10'
        },
        {
          name: 'b',
          who: 'people',
          money: '15'
        },
        {
          name: 'b',
          who: 'animals',
          money: '0'
        }
      ];

      const result = groupByMin(badArray, 'who', 'money');

      expect(result).to.deep.equal([
        {
          who: 'people',
          money: 10
        },
        {
          who: 'animals',
          money: 0
        }
      ]);
    });

    it('Array with holes in sum props', function() {
      const badArray = [
        {
          name: 'a',
          who: 'people',
          money: '10'
        },
        {
          name: 'b',
          who: 'people'
        },
        {
          name: 'b',
          who: 'animals',
          money: '0'
        }
      ];

      const result = groupByMin(badArray, 'who', 'money');

      expect(result).to.deep.equal([
        {
          who: 'people',
          money: 10
        },
        {
          who: 'animals',
          money: 0
        }
      ]);
    });

    it('Array with holes in grouped props', function() {
      const badArray = [
        {
          name: 'a',
          who: 'people',
          money: '10'
        },
        {
          name: 'b',
          money: '16'
        },
        {
          name: 'b',
          who: 'animals',
          money: '0'
        }
      ];

      const result = groupByMin(badArray, 'who', 'money');

      expect(result).to.be.an('array');
      expect(result).to.have.lengthOf(3);

      expect(result[0]).to.deep.equal({
        who: 'people',
        money: 10
      });

      expect(result[1]).to.deep.equal({
        who: undefined,
        money: 16
      });

      expect(result[2]).to.deep.equal({
        who: 'animals',
        money: 0
      });
    });
  });

  describe('Collapse arrays by objects', function() {
    const arr = [
      {
        who: {
          role: 'dev',
          access: [ 'dev' ]
        },
        profile: {
          name: 'vasya',
          email: 'vasyq@domen.com'
        },
        commits: 140
      },
      {
        who: {
          role: 'dev',
          access: [ 'dev' ]
        },
        profile: {
          name: 'kolya',
          email: 'kolya@domen.com'
        },
        commits: 156
      },{
        who: {
          role: 'main',
          access: [ 'dev', 'master' ]
        },
        profile: {
          name: 'kolya',
          email: 'kolya@domen.com'
        },
        commits: 10
      },
      {
        who: {
          role: 'main',
          access: [ 'dev', 'master' ]
        },
        profile: {
          name: 'gg',
          email: 'gg@domen.com'
        },
        commits: 260
      }
    ];

    it('By objects', function() {
      const result = groupByMin(arr, 'profile', 'commits');

      expect(result).to.be.an('array');
      expect(result).to.have.lengthOf(3);

      expect(result[0]).to.deep.equal({
        profile: {
          name: 'vasya',
          email: 'vasyq@domen.com'
        },
        commits: 140
      });

      expect(result[1]).to.deep.equal({
        profile: {
          name: 'kolya',
          email: 'kolya@domen.com'
        },
        commits: 10
      });

      expect(result[2]).to.deep.equal({
        profile: {
          name: 'gg',
          email: 'gg@domen.com'
        },
        commits: 260
      });
    });

    it('By object with array', function() {
      const result = groupByMin(arr, 'who', 'commits');

      expect(result).to.deep.equal([
        {
          who: {
            role: 'dev',
            access: [ 'dev' ]
          },
          commits: 140
        },
        {
          who: {
            role: 'main',
            access: [ 'dev', 'master' ]
          },
          commits: 10
        }
      ]);
    });
  });

  describe('Collapse with additional function', function() {
    const arr = [
      {
        who: {
          role: 'dev',
          access: [ 'dev' ]
        },
        profile: {
          name: 'vasya',
          email: 'vasyq@domen.com'
        },
        commits: 140
      },
      {
        who: {
          role: 'dev',
          access: [ 'dev' ]
        },
        profile: {
          name: 'kolya',
          email: 'kolya@domen.com'
        },
        commits: 156
      },
      {
        who: {
          role: 'main',
          access: [ 'dev', 'master' ]
        },
        profile: {
          name: 'kolya',
          email: 'kolya@domen.com'
        },
        commits: 11
      },
      {
        who: {
          role: 'main',
          access: [ 'dev', 'master' ]
        },
        profile: {
          name: 'gg',
          email: 'gg@domen.com'
        },
        commits: 260
      }
    ];

    it('By values of object', function() {
      const fn = (grouped) => {
        return grouped.profile.email;
      };

      const result = groupByMin(arr, 'profile', 'commits', fn);

      expect(result).to.deep.equal([
        {
          profile: {
            name: 'vasya',
            email: 'vasyq@domen.com'
          },
          commits: 140
        },
        {
          profile: {
            name: 'kolya',
            email: 'kolya@domen.com'
          },
          commits: 11
        },
        {
          profile: {
            name: 'gg',
            email: 'gg@domen.com'
          },
          commits: 260
        }
      ]);
    });

    it('By values of object without sum props', function() {
      const fn = (grouped) => {
        return grouped.profile.email;
      };

      const result = groupByMin(arr, 'profile', fn);

      expect(result).to.deep.equal([
        {
          profile: {
            name: 'vasya',
            email: 'vasyq@domen.com'
          }
        },
        {
          profile: {
            name: 'kolya',
            email: 'kolya@domen.com'
          }
        },
        {
          profile: {
            name: 'gg',
            email: 'gg@domen.com'
          }
        }
      ]);
    });
  });

  describe('Collapse bad arrays', function() {
    const nonNumeric = [
      {
        name: 'a',
        who: 'people',
        money: 10,
        tomates: 2
      },
      {
        name: 'b',
        who: 'people',
        money: 'rer',
        tomates: 0
      },
      {
        name: 'b',
        who: 'animals',
        money: 'sfsdf',
        tomates: 1
      }
    ];

    it('Array with non-numeric sum props', function() {
      const result = groupByMin(nonNumeric, 'who', 'money, tomates');

      expect(result).to.deep.equal([
        {
          who: 'people',
          money: 10,
          tomates: 0
        },
        {
          who: 'animals',
          tomates: 1
        }
      ])
    });
  });

  describe('Non validated args', function() {
    it('Intersection columns', function() {
      expect(function() {
        groupByMin([], 'who,name', 'who,money');
      }).to.throw('who');
    });

    it('First arg is not array', function() {
      expect(function() {
        groupByMin({}, 'a', 'b');
      }).to.throw('First argument must be an Array');
    });

    it('Arg groupedProps is absent', function() {
      expect(function() {
        groupByMin([]);
      }).to.throw('Argument "groupedProps" must be present');
    });

    it('Arg "groupedProps" is not a string', function() {
      expect(function() {
        groupByMin([], {});
      }).to.throw('Argument "groupedProps" must be a string');
    });

    it('Arg "sumProps" is not a string', function() {
      expect(function() {
        groupByMin([], 'a,b', {});
      }).to.throw('Argument "sumProps" must be a string');
    });
  });
});