const { db, query } = require(`../database/index`);

module.exports = {
  getRelatedProduct: async (req, res) => {
    try {
      const relatedProductQuery = `select * from `;
      return res.status(200).send({ succes: true });
    } catch (error) {
      return res.status(400).send(error.message);
    }
  },
};
