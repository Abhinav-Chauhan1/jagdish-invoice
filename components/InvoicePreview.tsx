import type { InvoiceWithItems } from '@/types/invoice';
import { formatDate, formatCurrency } from '@/lib/invoice-helpers';

// Static shop constants — update here if details change
const SHOP = {
  nameEnglish: 'JAGDISH SHARAN & SONS',
  nameHindi: 'जगदीश शरण एण्ड सन्स',
  taglineHindi: 'चश्मे वाले, फल लोक मुहल्ला, धामपुर',
  gst: '09AASPK5225M1Z6',
  leftOpt: {
    name: 'Anish Mittal',
    degree: 'D.R. Opt, Lucknow',
    center: 'Center for Sight',
    city: 'Dhampur',
  },
  rightOpt: {
    name: 'Amit Kumar',
    degree: 'D.R. Opt, Lucknow',
    regNo: 'Reg. No. OPT/12655',
    extra: 'F2 & O.A. Gasix',
    mob: '8270412545',
  },
};

interface InvoicePreviewProps {
  invoice: InvoiceWithItems;
}

export function InvoicePreview({ invoice }: InvoicePreviewProps) {
  const { invoice_items, prescriptions } = invoice;

  return (
    <div
      id="invoice-print-area"
      className="bg-white font-sans"
      style={{
        width: '210mm',
        minHeight: '297mm',
        padding: '8mm 8mm',
        fontSize: '11px',
        lineHeight: '1.4',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      {/* HEADER */}
      <div style={{ borderBottom: '3px solid #C0392B', paddingBottom: '6px', marginBottom: '6px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            <tr>
              {/* Left Optometrist */}
              <td style={{ width: '30%', verticalAlign: 'top', fontSize: '9px' }}>
                <div style={{ fontWeight: 700 }}>{SHOP.leftOpt.name}</div>
                <div>{SHOP.leftOpt.degree}</div>
                <div>{SHOP.leftOpt.center}</div>
                <div>{SHOP.leftOpt.city}</div>
              </td>

              {/* Center — Shop Name */}
              <td style={{ width: '40%', textAlign: 'center', verticalAlign: 'middle' }}>
                <div style={{ color: '#C0392B', fontWeight: 900, fontSize: '18px', letterSpacing: '1px' }}>
                  {SHOP.nameEnglish}
                </div>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: '15px',
                    fontFamily: "'Noto Sans Devanagari', sans-serif",
                    margin: '2px 0',
                  }}
                >
                  {SHOP.nameHindi}
                </div>
                <div
                  style={{
                    fontSize: '9px',
                    fontFamily: "'Noto Sans Devanagari', sans-serif",
                    color: '#555',
                  }}
                >
                  {SHOP.taglineHindi}
                </div>
                <div style={{ fontSize: '9px', marginTop: '3px', color: '#333' }}>
                  GST No: {SHOP.gst}
                </div>
              </td>

              {/* Right Optometrist */}
              <td style={{ width: '30%', verticalAlign: 'top', textAlign: 'right', fontSize: '9px' }}>
                <div style={{ fontWeight: 700 }}>{SHOP.rightOpt.name}</div>
                <div>{SHOP.rightOpt.degree}</div>
                <div>{SHOP.rightOpt.regNo}</div>
                <div>{SHOP.rightOpt.extra}</div>
                <div>Mob: {SHOP.rightOpt.mob}</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* CUSTOMER + INVOICE DETAILS */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '6px', border: '1px solid #333' }}>
        <tbody>
          <tr>
            <td style={{ width: '50%', padding: '6px 8px', verticalAlign: 'top', borderRight: '1px solid #333' }}>
              <div style={{ fontWeight: 700, fontSize: '10px', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Customer Details
              </div>
              <div style={{ fontSize: '13px', fontWeight: 700 }}>{invoice.customer_name}</div>
              <div style={{ fontSize: '11px', color: '#444', marginTop: '2px' }}>
                Mob: {invoice.customer_mobile}
              </div>
            </td>
            <td style={{ width: '50%', padding: '6px 8px', verticalAlign: 'top' }}>
              <div style={{ fontWeight: 900, fontSize: '14px', textDecoration: 'underline', textAlign: 'center', marginBottom: '4px' }}>
                INVOICE
              </div>
              <table style={{ width: '100%', fontSize: '10px' }}>
                <tbody>
                  <tr>
                    <td style={{ color: '#555' }}>Invoice No:</td>
                    <td style={{ fontWeight: 700, textAlign: 'right' }}>#{invoice.invoice_number}</td>
                  </tr>
                  <tr>
                    <td style={{ color: '#555' }}>Invoice Date:</td>
                    <td style={{ textAlign: 'right' }}>{formatDate(invoice.invoice_date)}</td>
                  </tr>
                  <tr>
                    <td style={{ color: '#555' }}>Date of Order:</td>
                    <td style={{ textAlign: 'right' }}>{formatDate(invoice.order_date)}</td>
                  </tr>
                  {invoice.delivery_date && (
                    <tr>
                      <td style={{ color: '#555' }}>Date of Delivery:</td>
                      <td style={{ textAlign: 'right' }}>{formatDate(invoice.delivery_date)}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>

      {/* ITEMS TABLE */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '6px' }}>
        <thead>
          <tr style={{ backgroundColor: '#333', color: '#fff' }}>
            <th style={{ padding: '5px 8px', textAlign: 'center', border: '1px solid #333', width: '10%', fontSize: '10px' }}>
              SL NO
            </th>
            <th style={{ padding: '5px 8px', textAlign: 'left', border: '1px solid #333', width: '75%', fontSize: '10px' }}>
              PRODUCT DETAILS
            </th>
            <th style={{ padding: '5px 8px', textAlign: 'right', border: '1px solid #333', width: '15%', fontSize: '10px' }}>
              PRICE
            </th>
          </tr>
        </thead>
        <tbody>
          {invoice_items
            .slice()
            .sort((a, b) => a.sl_no - b.sl_no)
            .map(item => (
              <tr key={item.id}>
                <td style={{ padding: '5px 8px', textAlign: 'center', border: '1px solid #ccc', fontSize: '10px' }}>
                  {item.sl_no}
                </td>
                <td style={{ padding: '5px 8px', border: '1px solid #ccc', fontSize: '10px', whiteSpace: 'pre-line' }}>
                  {item.product_details}
                </td>
                <td style={{ padding: '5px 8px', textAlign: 'right', border: '1px solid #ccc', fontSize: '10px' }}>
                  Rs {Number(item.price).toFixed(2)}
                </td>
              </tr>
            ))}
          {/* Empty rows to fill space */}
          {invoice_items.length < 6 &&
            Array.from({ length: 6 - invoice_items.length }).map((_, i) => (
              <tr key={`empty-${i}`}>
                <td style={{ padding: '5px 8px', border: '1px solid #ccc', height: '24px' }}>&nbsp;</td>
                <td style={{ padding: '5px 8px', border: '1px solid #ccc' }}>&nbsp;</td>
                <td style={{ padding: '5px 8px', border: '1px solid #ccc' }}>&nbsp;</td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* TOTALS */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '4px', border: '2px solid #333' }}>
        <tbody>
          <tr>
            <td style={{ padding: '6px 10px', borderRight: '1px solid #333', textAlign: 'center', width: '33%', fontSize: '10px' }}>
              <div style={{ color: '#555', marginBottom: '2px' }}>Total Paid</div>
              <div style={{ fontWeight: 700, fontSize: '12px' }}>{formatCurrency(invoice.net_total)}</div>
            </td>
            <td style={{ padding: '6px 10px', borderRight: '1px solid #333', textAlign: 'center', width: '33%', fontSize: '10px' }}>
              <div style={{ color: '#555', marginBottom: '2px' }}>Total Discount</div>
              <div style={{ fontWeight: 700, fontSize: '12px' }}>{formatCurrency(invoice.discount)}</div>
            </td>
            <td style={{ padding: '6px 10px', textAlign: 'center', width: '34%', fontSize: '10px' }}>
              <div style={{ color: '#555', marginBottom: '2px' }}>Gross Total</div>
              <div style={{ fontWeight: 700, fontSize: '12px' }}>{formatCurrency(invoice.gross_total)}</div>
            </td>
          </tr>
        </tbody>
      </table>

      <div style={{ textAlign: 'right', fontWeight: 900, fontSize: '13px', padding: '4px 8px', borderTop: '2px solid #333', marginBottom: '8px' }}>
        Net Total Amount: {formatCurrency(invoice.net_total)}
      </div>

      {/* PRESCRIPTION */}
      {invoice.has_prescription && prescriptions && (
        <div style={{ marginBottom: '8px' }}>
          <div style={{ fontWeight: 900, textAlign: 'center', textDecoration: 'underline', fontSize: '11px', marginBottom: '4px', letterSpacing: '1px' }}>
            PRESCRIPTION
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '9px' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #333', padding: '3px 4px', width: '8%' }}>&nbsp;</th>
                <th colSpan={5} style={{ border: '1px solid #333', padding: '3px 4px', textAlign: 'center', backgroundColor: '#f5f5f5' }}>
                  RIGHT EYE (OD)
                </th>
                <th colSpan={5} style={{ border: '1px solid #333', padding: '3px 4px', textAlign: 'center', backgroundColor: '#f5f5f5' }}>
                  LEFT EYE (OS)
                </th>
              </tr>
              <tr style={{ backgroundColor: '#eee' }}>
                <th style={{ border: '1px solid #333', padding: '3px 4px' }}>&nbsp;</th>
                {['SPH', 'CYL', 'AXIS', 'PD', 'VA'].map(h => (
                  <th key={`od-${h}`} style={{ border: '1px solid #333', padding: '3px 4px', textAlign: 'center', fontWeight: 700 }}>{h}</th>
                ))}
                {['SPH', 'CYL', 'AXIS', 'PD', 'VA'].map(h => (
                  <th key={`os-${h}`} style={{ border: '1px solid #333', padding: '3px 4px', textAlign: 'center', fontWeight: 700 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <PrescriptionRow label="DV" values={[
                prescriptions.od_dv_sph, prescriptions.od_dv_cyl, prescriptions.od_dv_axis, prescriptions.od_dv_pd, prescriptions.od_dv_va,
                prescriptions.os_dv_sph, prescriptions.os_dv_cyl, prescriptions.os_dv_axis, prescriptions.os_dv_pd, prescriptions.os_dv_va,
              ]} />
              <PrescriptionRow label="NV" values={[
                prescriptions.od_nv_sph, prescriptions.od_nv_cyl, prescriptions.od_nv_axis, prescriptions.od_nv_pd, prescriptions.od_nv_va,
                prescriptions.os_nv_sph, prescriptions.os_nv_cyl, prescriptions.os_nv_axis, prescriptions.os_nv_pd, prescriptions.os_nv_va,
              ]} />
              <PrescriptionRow label="AOD" values={[
                prescriptions.od_aod, null, null, null, null,
                prescriptions.os_aod, null, null, null, null,
              ]} />
              <PrescriptionRow label="IOD" values={[
                prescriptions.od_iod, null, null, null, null,
                prescriptions.os_iod, null, null, null, null,
              ]} />
            </tbody>
          </table>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '10px' }}>
            <div>
              {prescriptions.constant_use ? '☑' : '☐'} Constant Use
            </div>
            <div style={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
              Optometrist
            </div>
          </div>
        </div>
      )}

      {/* BRAND LOGOS FOOTER */}
      <div style={{ borderTop: '2px solid #C0392B', paddingTop: '6px', marginTop: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
          <BrandLogo src="/logos/rayban.png" alt="Ray-Ban" text="Ray-Ban" />
          <BrandLogo src="/logos/titan.png" alt="TITAN Eyewear" text="TITAN Eyewear" />
          <BrandLogo src="/logos/crizal.png" alt="Crizal" text="Crizal" />
          <BrandLogo src="/logos/bausch.png" alt="Bausch+Lomb" text="Bausch+Lomb" />
          <BrandLogo src="/logos/vogue.png" alt="VOGUE" text="VOGUE" />
          <BrandLogo src="/logos/zeiss.png" alt="ZEISS" text="ZEISS" />
        </div>
        <div style={{ textAlign: 'center', fontSize: '8px', color: '#999', marginTop: '4px' }}>
          Dhampur, Uttar Pradesh — Thank you for your business!
        </div>
      </div>
    </div>
  );
}

function PrescriptionRow({ label, values }: { label: string; values: (string | null | undefined)[] }) {
  return (
    <tr>
      <td style={{ border: '1px solid #333', padding: '3px 4px', fontWeight: 700, textAlign: 'center', backgroundColor: '#f9f9f9' }}>
        {label}
      </td>
      {values.map((v, i) => (
        <td key={i} style={{ border: '1px solid #ccc', padding: '3px 6px', textAlign: 'center', minWidth: '30px' }}>
          {v || ''}
        </td>
      ))}
    </tr>
  );
}

function BrandLogo({ src, alt, text }: { src: string; alt: string; text: string }) {
  return (
    <div style={{ textAlign: 'center', fontSize: '8px', minWidth: '48px' }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        style={{ height: '20px', objectFit: 'contain', display: 'block', margin: '0 auto 2px' }}
        onError={e => {
          (e.target as HTMLImageElement).style.display = 'none';
        }}
      />
      <span style={{ fontWeight: 700, letterSpacing: '0.5px', color: '#333' }}>{text}</span>
    </div>
  );
}
