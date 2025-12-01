// src/api/quotation/content-types/quotation/lifecycles.js

module.exports = {
  async beforeCreate(event) {
    const { data } = event.params;
    const { financialYear } = data;

    // 1. Find the highest documentNo for the given Financial Year
    const lastQuotation = await strapi.db.query('api::quotation.quotation').findOne({
      where: { financialYear },
      orderBy: { documentNo: 'desc' },
    });

    // 2. Calculate the next document number
    let nextDocumentNo = 1;

    if (lastQuotation) {
      nextDocumentNo = lastQuotation.documentNo + 1;
    }

    // 3. Assign the new, permanent document number to the data payload
    data.documentNo = nextDocumentNo;
  },
};