let {Shop, Item} = require('../src/gilded_rose.js')
// in jasmine.json "random" has been set to false for sequential testing.

describe("Gilded Rose Normal Behavior 1 day", () => {

  const gildedRose = new Shop([ new Item("Monty Python's guide to the universe", 14, 42)])
  const items = gildedRose.updateQuality()

  it("should know the name of the monty python item", () => {
    expect(items[0].name).toEqual("Monty Python's guide to the universe")
  })

  it("should lower the sellIn value for a normal item", () => {
    expect(items[0].sellIn).toEqual(13)
  })

  it("should lower the quality value for a normal item", () => {
    expect(items[0].quality).toEqual(41)
  })

})

describe("Gilded Rose Normal Behavior Multiple Days", () => {

  const gildedRose = new Shop([ new Item("Monty Python's guide to the universe", 14, 42)])
  let items = undefined

  for(let i = 0; i < 5; i++){
    items = gildedRose.updateQuality()
  }

  it("should lower the sellIn value for a normal item by 5 days", () => {
    expect(items[0].sellIn).toEqual(9)
  })

  it("should lower the quality value for a normal item by 5 days", () => {
    expect(items[0].quality).toEqual(37)
  })

})

describe("Once the sell by date has passed, Quality degrades twice as fast", () => {
  const gildedRose = new Shop([ new Item("Monty Python's guide to the universe", 14, 42)])
  let items = undefined

  it("should have 22 and not 25", () => {
    for(let i = 0; i < 17; i++){
      items = gildedRose.updateQuality()
    }
    expect(items[0].quality).toEqual(22) //42 - 14 - 6 = 22
  })
})

describe("The Quality of an item is never negative", () => {
  const gildedRose = new Shop([ new Item("Monty Python's guide to the universe", 14, 42)])
  let items = undefined

    for(let i = 0; i < 30; i++){
      items = gildedRose.updateQuality()
    }

  it("should have 0 and not -4", () => {
    expect(items[0].quality).toEqual(0)
  })
})

describe("The Quality of an item is never more than 50 upon creation, unless special and does not increase to be more than 50.", () => {
  const gildedRose = new Shop([
    new Item("IMPOSSIBLE BURGER", 365, 1000),
    new Item("Aged Brie", 365, 49),
    new Item("Backstage passes to a TAFKAL80ETC concert", 5, 49),
    new Item("Sulfuras, Hand of Ragnaros", 365, 80)])
  const burger = gildedRose.items[0]
  const brie = gildedRose.items[1]
  const backstagePasses = gildedRose.items[2]
  const sulfuras = gildedRose.items[3]

  it("Should not have 1000 but 50 or lower", () => {
    expect(burger.quality).toBeLessThanOrEqual(50)
  })

  it("Aged Brie and backstage passes should not increase above 50 and the burger should be 48", () => {
    for(let i = 0; i < 2; i++){
      gildedRose.updateQuality()
    }
    expect(brie.quality).toEqual(50)
    expect(backstagePasses.quality).toEqual(50)
    expect(burger.quality).toEqual(48)
    expect(sulfuras.quality).toEqual(80)
  })
})

describe("Backstage passes, like aged brie, increases in Quality as its SellIn value approaches;", () => {
  const gildedRose = new Shop([
    new Item("Backstage passes to a TAFKAL80ETC concert", 10, 10)])
  const backstagePasses = gildedRose.items[0]

  describe("Quality increases by 2 when there are 10 days or less.", () => {
    it("Increases in quality to 20", () => {
      for(let i = 0; i < 5; i++){
        gildedRose.updateQuality()
      }
      expect(backstagePasses.quality).toEqual(20)
      expect(backstagePasses.sellIn).toEqual(5)
    })
  })

  describe("Quality goes up by 3 when there are 5 days or less.", () => {
    it("Increases in quality to 35", () => {
      for(let i = 0; i < 5; i++){
        gildedRose.updateQuality()
      }
      expect(backstagePasses.quality).toEqual(35)
      expect(backstagePasses.sellIn).toEqual(0)
    })
  })

  describe("Quality drops to 0 after the concert", () => {
    it("Drops quality to 0 and sellIn days to -1", () => {
      gildedRose.updateQuality()
      expect(backstagePasses.quality).toEqual(0)
      expect(backstagePasses.sellIn).toEqual(-1)
    })
  })
})

describe("'Conjured' items degrade in Quality twice as fast as normal items", () => {
  const gildedRose = new Shop([
    new Item("conjured item", 15, 30),
    new Item("Monty Python's guide to the universe", 14, 42)])
  const conjuredItem = gildedRose.items[0]
  const montyPythonBOok = gildedRose.items[1]

  it("degrades the conjured item to 10", () => {
    for(let i = 0; i < 10; i++){
      gildedRose.updateQuality()
    }
    expect(conjuredItem.quality).toEqual(10)
    expect(conjuredItem.sellIn).toEqual(5)
    expect(montyPythonBOok.quality).toEqual(32)
    expect(montyPythonBOok.sellIn).toEqual(4)
  })
})