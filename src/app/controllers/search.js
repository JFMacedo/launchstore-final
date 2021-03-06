const Product = require('../models/Product')
const LoadProductService = require('../services/LoadProduct')

module.exports = {
  async index(req, res) {
    try {
      let { filter, category } = req.query

      if(!filter || filter.toLowerCase() == 'toda a loja') filter = null

      let products = await Product.search({ filter, category })

      const productsPromise = products.map(LoadProductService.format)

      products = await Promise.all(productsPromise)

      const search = {
        term: filter || 'Toda a loja',
        total: products.length
      }

      const categories = products.map(product => ({
        id: product.category_id,
        name: product.category_name
      })).reduce((filteredCategories, category) => {
        const found = filteredCategories.some(cat => cat.id == category.id)

        if(!found)
          filteredCategories.push(category)

        return filteredCategories
      }, [])

      return res.render('search/index', { products, search, categories })
    } catch(err) {
      console.error(err)
    }
    
  }
}