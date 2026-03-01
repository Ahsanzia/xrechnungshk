export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  vatRate: number;
  totalAmount: number;
}

export interface InvoiceData {
  invoiceNumber: string;
  date: string;
  sellerName: string;
  sellerAddress: string;
  sellerVatId: string;
  buyerName: string;
  buyerAddress: string;
  buyerVatId: string;
  items: InvoiceItem[];
  currency: string;
  totalNetAmount: number;
  totalVatAmount: number;
  totalGrossAmount: number;
}

export function generateXRechnung(data: InvoiceData): string {
  const now = new Date().toISOString().split('T')[0].replace(/-/g, '');
  const invoiceDate = data.date.replace(/-/g, '') || now;

  return `<?xml version="1.0" encoding="UTF-8"?>
<ubl:Invoice xmlns:ubl="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2"
             xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2"
             xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2">
    <cbc:CustomizationID>urn:cen.eu:en16931:2017#compliant#urn:xoev-de:kosit:standard:xrechnung_3.0</cbc:CustomizationID>
    <cbc:ProfileID>urn:fdc:peppol.eu:poacc:bis:3:2018</cbc:ProfileID>
    <cbc:ID>${data.invoiceNumber || 'INV-001'}</cbc:ID>
    <cbc:IssueDate>${invoiceDate.substring(0, 4)}-${invoiceDate.substring(4, 6)}-${invoiceDate.substring(6, 8)}</cbc:IssueDate>
    <cbc:InvoiceTypeCode>380</cbc:InvoiceTypeCode>
    <cbc:DocumentCurrencyCode>${data.currency || 'EUR'}</cbc:DocumentCurrencyCode>
    <cbc:BuyerReference>${data.buyerVatId || '991:12345-67890-45'}</cbc:BuyerReference>
    
    <cac:AccountingSupplierParty>
        <cac:Party>
            <cac:PartyName>
                <cbc:Name>${data.sellerName || 'Unbekannter Verkäufer'}</cbc:Name>
            </cac:PartyName>
            <cac:PostalAddress>
                <cbc:StreetName>${data.sellerAddress || 'Musterstraße 1'}</cbc:StreetName>
                <cbc:CityName>Musterstadt</cbc:CityName>
                <cbc:PostalZone>12345</cbc:PostalZone>
                <cac:Country>
                    <cbc:IdentificationCode>DE</cbc:IdentificationCode>
                </cac:Country>
            </cac:PostalAddress>
            <cac:PartyTaxScheme>
                <cbc:CompanyID>${data.sellerVatId || 'DE123456789'}</cbc:CompanyID>
                <cac:TaxScheme>
                    <cbc:ID>VAT</cbc:ID>
                </cac:TaxScheme>
            </cac:PartyTaxScheme>
        </cac:Party>
    </cac:AccountingSupplierParty>

    <cac:AccountingCustomerParty>
        <cac:Party>
            <cac:PartyName>
                <cbc:Name>${data.buyerName || 'Unbekannter Käufer'}</cbc:Name>
            </cac:PartyName>
            <cac:PostalAddress>
                <cbc:StreetName>${data.buyerAddress || 'Kundenstraße 2'}</cbc:StreetName>
                <cbc:CityName>Kundenstadt</cbc:CityName>
                <cbc:PostalZone>54321</cbc:PostalZone>
                <cac:Country>
                    <cbc:IdentificationCode>DE</cbc:IdentificationCode>
                </cac:Country>
            </cac:PostalAddress>
            <cac:PartyTaxScheme>
                <cbc:CompanyID>${data.buyerVatId || 'DE987654321'}</cbc:CompanyID>
                <cac:TaxScheme>
                    <cbc:ID>VAT</cbc:ID>
                </cac:TaxScheme>
            </cac:PartyTaxScheme>
        </cac:Party>
    </cac:AccountingCustomerParty>

    <cac:TaxTotal>
        <cbc:TaxAmount currencyID="${data.currency || 'EUR'}">${data.totalVatAmount || 0}</cbc:TaxAmount>
        <cac:TaxSubtotal>
            <cbc:TaxableAmount currencyID="${data.currency || 'EUR'}">${data.totalNetAmount || 0}</cbc:TaxableAmount>
            <cbc:TaxAmount currencyID="${data.currency || 'EUR'}">${data.totalVatAmount || 0}</cbc:TaxAmount>
            <cac:TaxCategory>
                <cbc:ID>S</cbc:ID>
                <cbc:Percent>19</cbc:Percent>
                <cac:TaxScheme>
                    <cbc:ID>VAT</cbc:ID>
                </cac:TaxScheme>
            </cac:TaxCategory>
        </cac:TaxSubtotal>
    </cac:TaxTotal>

    <cac:LegalMonetaryTotal>
        <cbc:LineExtensionAmount currencyID="${data.currency || 'EUR'}">${data.totalNetAmount || 0}</cbc:LineExtensionAmount>
        <cbc:TaxExclusiveAmount currencyID="${data.currency || 'EUR'}">${data.totalNetAmount || 0}</cbc:TaxExclusiveAmount>
        <cbc:TaxInclusiveAmount currencyID="${data.currency || 'EUR'}">${data.totalGrossAmount || 0}</cbc:TaxInclusiveAmount>
        <cbc:PayableAmount currencyID="${data.currency || 'EUR'}">${data.totalGrossAmount || 0}</cbc:PayableAmount>
    </cac:LegalMonetaryTotal>

    ${data.items.map((item, index) => `
    <cac:InvoiceLine>
        <cbc:ID>${index + 1}</cbc:ID>
        <cbc:InvoicedQuantity unitCode="C62">${item.quantity}</cbc:InvoicedQuantity>
        <cbc:LineExtensionAmount currencyID="${data.currency || 'EUR'}">${item.totalAmount}</cbc:LineExtensionAmount>
        <cac:Item>
            <cbc:Name>${item.description}</cbc:Name>
            <cac:ClassifiedTaxCategory>
                <cbc:ID>S</cbc:ID>
                <cbc:Percent>${item.vatRate}</cbc:Percent>
                <cac:TaxScheme>
                    <cbc:ID>VAT</cbc:ID>
                </cac:TaxScheme>
            </cac:ClassifiedTaxCategory>
        </cac:Item>
        <cac:Price>
            <cbc:PriceAmount currencyID="${data.currency || 'EUR'}">${item.unitPrice}</cbc:PriceAmount>
        </cac:Price>
    </cac:InvoiceLine>
    `).join('')}
</ubl:Invoice>`;
}
