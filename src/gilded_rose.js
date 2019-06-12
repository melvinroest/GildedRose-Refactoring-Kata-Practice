const SPECIAL_QUALITY_ITEMS = ['Sulfuras, Hand of Ragnaros', 'Aged Brie', 'Backstage passes to a TAFKAL80ETC concert']
const EPIC_ITEMS = ['Sulfuras, Hand of Ragnaros']

class Item {
  constructor(name, sellIn, quality){
    this.name = name;
    this.sellIn = sellIn;
    this.quality = quality;
  }
}

class Shop {
  constructor(items=[]){
    this.items = items;
    for(let i = 0; i < items.length; i++){
      const item = this.items[i]
      if (item.quality > 50 && !SPECIAL_QUALITY_ITEMS.includes(item.name)){
        item.quality = 50
      }
    }
  }

  subtractItemQuality(item){
    const isConjured = item.name.toLowerCase().includes("conjured")
    const passedBySellDate = item.sellIn < 0
    item.quality = isConjured ? item.quality - 2 : item.quality - 1
    if(passedBySellDate) item.quality -= 1
    item.quality = item.quality < 0 ? 0 : item.quality
  }

  addItemQuality(item){
    switch(item.name) {
      case 'Backstage passes to a TAFKAL80ETC concert':
        this.calculateBackstageQuality(item)
        break
      case 'Aged Brie':
        this.calculateAgedBrieQuality(item)
        break
    }
    item.quality = Math.min(50, item.quality)
  }

  calculateBackstageQuality(item){
    const sellIn = item.sellIn + 1 //item.sellIn should be decremented *after* the following ruleset applied
    if(item.sellIn < 0) item.quality = 0
    else if(sellIn > 10) item.quality += 1
    else if(sellIn > 5) item.quality += 2
    else if(sellIn <= 5) item.quality += 3
  }

  calculateAgedBrieQuality(item){
    item.quality += 1
    if(item.sellIn < 0) item.quality += 1
  }

  /**
  * updateQuality() shows how classes of certain items will be treated in a general way
  * the more specific approaches as to how individual items are treated are in the
  * respective helper functions. 
  */
  updateQuality() {
    for (let i = 0; i < this.items.length; i++) {
      let item = this.items[i]
      const isSpecialQualityItem = SPECIAL_QUALITY_ITEMS.includes(item.name)
      const isEpicItem = EPIC_ITEMS.includes(item.name)

      if(!isEpicItem){
        item.sellIn -= 1
      }
      if(!isSpecialQualityItem){
        this.subtractItemQuality(item)
      }
      else if(isSpecialQualityItem && !isEpicItem){
        this.addItemQuality(item)
      }
    }
    return this.items;
  }

}

module.exports = {
  Item,
  Shop
}
