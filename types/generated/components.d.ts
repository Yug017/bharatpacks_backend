import type { Schema, Struct } from '@strapi/strapi';

export interface QuotationMaterial extends Struct.ComponentSchema {
  collectionName: 'components_quotation_materials';
  info: {
    displayName: 'material';
  };
  attributes: {
    name: Schema.Attribute.String;
    value: Schema.Attribute.Decimal;
    wastage: Schema.Attribute.Decimal;
    wastageValue: Schema.Attribute.Decimal;
  };
}

export interface QuotationQuotationItem extends Struct.ComponentSchema {
  collectionName: 'components_quotation_quotation_items';
  info: {
    displayName: 'items';
  };
  attributes: {
    amount: Schema.Attribute.Decimal;
    category: Schema.Attribute.String;
    name: Schema.Attribute.Text;
    price: Schema.Attribute.Decimal;
    quantity: Schema.Attribute.Decimal;
    unit: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'quotation.material': QuotationMaterial;
      'quotation.quotation-item': QuotationQuotationItem;
    }
  }
}
