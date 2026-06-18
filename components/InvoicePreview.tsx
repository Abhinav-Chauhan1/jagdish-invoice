'use client';

import type { InvoiceWithItems } from '@/types/invoice';
import { formatDate } from '@/lib/invoice-helpers';

// ─── Shop constants ───────────────────────────────────────────────────────────
const SHOP = {
  nameEnglish: 'Jagdish Sharan & Sons',
  nameHindi: 'जगदीश शरण एण्ड सन्स',
  addressHindi: 'चश्मे वाले, फल चौक, मेन मार्केट, धामपुर -246761',
  gst: '09ASGPK5025M1ZG',
  leftOpt: {
    name: 'Amish Mittal',
    line1: 'D.R. Opt.,Lucknow',
    line2: 'Center for Sight Eye Hospital',
    line3: 'Asin Vivekanand Hospital, Moradabad',
    line4: 'Consultant Optometrist',
    mob: '8279813335',
  },
  rightOpt: {
    name: 'Amit Kumar',
    line1: 'D.R. Opt.,Lucknow',
    line2: 'Reg. No. OPT/12035',
    line3: 'F.D.O.A.(Delhi),F.C.L.I.(Aligarh)',
    line4: 'Consultant Optometrist',
    mob: '9412151444',
  },
};

// Logo row definitions — two rows, all same visual size
const LOGO_ROW_1 = [
  { src: '/logos/rayban.png',  alt: 'Ray-Ban' },
  { src: '/logos/titan.png',   alt: 'TITAN Eyewear' },
  { src: '/logos/crizal.png',  alt: 'Crizal' },
  { src: '/logos/bausch.png',  alt: 'Bausch & Lomb' },
];
const LOGO_ROW_2 = [
  { src: '/logos/fastrack.png', alt: 'fastrack' },
  { src: '/logos/idee.png',     alt: 'IDEE' },
  { src: '/logos/vogue.png',    alt: 'VOGUE' },
  { src: '/logos/zeiss.png',    alt: 'ZEISS' },
];
const LOGO_H = 44; // px — same for every logo

interface Props { invoice: InvoiceWithItems; id?: string; }

export function InvoicePreview({ invoice, id = 'invoice-print-area' }: Props) {
  const { invoice_items, prescriptions } = invoice;
  const sortedItems = [...invoice_items].sort((a, b) => a.sl_no - b.sl_no);
  const grossTotal = Number(invoice.gross_total);
  const discount   = Number(invoice.discount);
  const netTotal   = Number(invoice.net_total);

  return (
    <div
      id={id}
      style={{
        background: '#fff',
        fontFamily: 'Arial, Helvetica, sans-serif',
        fontSize: '10.5px',
        lineHeight: '1.45',
        color: '#111',
        width: '210mm',
        height: '297mm',
        padding: '7mm 8mm 6mm',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
      }}
    >

      {/* ── HEADER ────────────────────────────────────────────────────── */}
      <div style={{ borderBottom: '2.5px solid #C0392B', paddingBottom: '6px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            <tr>
              <td style={{ width: '28%', verticalAlign: 'top' }}>
                <div style={{ fontWeight: 700, fontSize: '9.5px', color: '#1a56c4' }}>{SHOP.leftOpt.name}</div>
                {[SHOP.leftOpt.line1, SHOP.leftOpt.line2, SHOP.leftOpt.line3, SHOP.leftOpt.line4].map((l, i) => (
                  <div key={i} style={{ fontSize: '8.5px', color: '#333', lineHeight: '1.5' }}>{l}</div>
                ))}
                <div style={{ fontSize: '8.5px', color: '#333', lineHeight: '1.5' }}>Mob.: {SHOP.leftOpt.mob}</div>
              </td>

              <td style={{ width: '44%', textAlign: 'center', verticalAlign: 'middle', padding: '0 6px' }}>
                <div style={{ color: '#C0392B', fontWeight: 900, fontSize: '22px', letterSpacing: '0.5px', lineHeight: 1.1, fontFamily: 'Arial Black, Arial, sans-serif' }}>
                  {SHOP.nameEnglish}
                </div>
                <div style={{ color: '#1a56c4', fontWeight: 700, fontSize: '17px', fontFamily: "'Noto Sans Devanagari', Arial, sans-serif", lineHeight: 1.2, margin: '2px 0' }}>
                  {SHOP.nameHindi}
                </div>
                <div style={{ fontSize: '9.5px', fontFamily: "'Noto Sans Devanagari', Arial, sans-serif", color: '#333' }}>
                  {SHOP.addressHindi}
                </div>
                <div style={{ fontSize: '9px', fontWeight: 700, marginTop: '3px', color: '#222' }}>
                  GST No : {SHOP.gst}
                </div>
              </td>

              <td style={{ width: '28%', verticalAlign: 'top', textAlign: 'right' }}>
                <div style={{ fontWeight: 700, fontSize: '9.5px', color: '#1a56c4' }}>{SHOP.rightOpt.name}</div>
                {[SHOP.rightOpt.line1, SHOP.rightOpt.line2, SHOP.rightOpt.line3, SHOP.rightOpt.line4].map((l, i) => (
                  <div key={i} style={{ fontSize: '8.5px', color: '#333', lineHeight: '1.5' }}>{l}</div>
                ))}
                <div style={{ fontSize: '8.5px', color: '#333', lineHeight: '1.5' }}>Mob.: {SHOP.rightOpt.mob}</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ── CUSTOMER + INVOICE ────────────────────────────────────────── */}
      <table style={{ width: '100%', borderCollapse: 'collapse', border: '1.5px solid #555', marginTop: '10px' }}>
        <tbody>
          <tr>
            <td style={{ width: '48%', padding: '8px 10px', verticalAlign: 'top', borderRight: '1.5px solid #555' }}>
              <div style={{ fontWeight: 700, fontSize: '9px', letterSpacing: '0.8px', textTransform: 'uppercase', color: '#444', marginBottom: '4px' }}>
                Customer Details
              </div>
              {invoice.company_name && (
                <>
                  <div style={{ fontSize: '8px', fontWeight: 600, color: '#666', marginBottom: '1px', textTransform: 'uppercase', letterSpacing: '0.3px' }}>Company Name</div>
                  <div style={{ fontSize: '11px', fontWeight: 700, marginBottom: '3px', color: '#1a56c4' }}>{invoice.company_name}</div>
                </>
              )}
              <div style={{ fontSize: '8px', fontWeight: 600, color: '#666', marginBottom: '1px', textTransform: 'uppercase', letterSpacing: '0.3px' }}>Customer Name</div>
              <div style={{ fontSize: '12px', fontWeight: 700, marginBottom: '2px' }}>{invoice.customer_name}</div>
              <div style={{ fontSize: '10px', color: '#444' }}>Mobile Number : {invoice.customer_mobile}</div>
            </td>
            <td style={{ width: '52%', padding: '8px 10px', verticalAlign: 'top' }}>
              <div style={{ fontWeight: 900, fontSize: '16px', textDecoration: 'underline', textAlign: 'center', marginBottom: '5px', letterSpacing: '1px' }}>
                INVOICE
              </div>
              <table style={{ width: '100%', fontSize: '10px', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr>
                    <td style={{ color: '#555', paddingBottom: '2px' }}>Invoice Number :</td>
                    <td style={{ fontWeight: 700, textAlign: 'right' }}>{invoice.invoice_number}</td>
                  </tr>
                  <tr>
                    <td style={{ color: '#555', paddingBottom: '2px' }}>Invoice Date :</td>
                    <td style={{ textAlign: 'right' }}>{formatDate(invoice.invoice_date)}</td>
                  </tr>
                  <tr>
                    <td style={{ color: '#555', paddingBottom: '2px' }}>Date of Order :</td>
                    <td style={{ textAlign: 'right' }}>{formatDate(invoice.order_date)}</td>
                  </tr>
                  {invoice.delivery_date && (
                    <tr>
                      <td style={{ color: '#555' }}>Date of Delivery :</td>
                      <td style={{ textAlign: 'right' }}>{formatDate(invoice.delivery_date)}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>

      {/* ── ITEMS TABLE ───────────────────────────────────────────────── */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
        <thead>
          <tr style={{ backgroundColor: '#222', color: '#fff' }}>
            <th style={{ padding: '6px 8px', textAlign: 'center', border: '1px solid #444', width: '8%', fontSize: '10px', letterSpacing: '0.5px' }}>SL NO</th>
            <th style={{ padding: '6px 8px', textAlign: 'left',   border: '1px solid #444', fontSize: '10px', letterSpacing: '0.5px' }}>PRODUCT DETAILS</th>
            <th style={{ padding: '6px 8px', textAlign: 'right',  border: '1px solid #444', width: '16%', fontSize: '10px', letterSpacing: '0.5px' }}>PRICE</th>
          </tr>
        </thead>
        <tbody>
          {sortedItems.map(item => (
            <tr key={item.id}>
              <td style={{ padding: '7px 8px', textAlign: 'center', border: '1px solid #ccc', fontSize: '10px', verticalAlign: 'top' }}>{item.sl_no}</td>
              <td style={{ padding: '7px 8px', border: '1px solid #ccc', fontSize: '10px', whiteSpace: 'pre-line', verticalAlign: 'top' }}>{item.product_details}</td>
              <td style={{ padding: '7px 8px', textAlign: 'right', border: '1px solid #ccc', fontSize: '10px', verticalAlign: 'top', fontWeight: 600 }}>Rs {Number(item.price).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ── TOTALS ────────────────────────────────────────────────────── */}
      <table style={{ width: '100%', borderCollapse: 'collapse', border: '1.5px solid #555' }}>
        <tbody>
          <tr>
            <td style={{ width: '30%', padding: '9px 10px', borderRight: '1px solid #999', verticalAlign: 'middle' }}>
              <div style={{ fontSize: '10px', color: '#555', marginBottom: '2px' }}>Total Paid</div>
              <div style={{ fontSize: '13px', fontWeight: 900 }}>: Rs {netTotal.toFixed(2)}</div>
            </td>
            <td style={{ width: '38%', padding: '9px 10px', borderRight: '1px solid #999', textAlign: 'center', verticalAlign: 'middle', backgroundColor: '#fafafa' }}>
              {discount > 0 ? (
                <>
                  <div style={{ fontSize: '9px', color: '#666', marginBottom: '3px' }}>Cart Discount : Rs {discount.toFixed(2)}</div>
                  <div style={{ fontSize: '13px', fontWeight: 900, color: '#C0392B' }}>YOU SAVE : Rs {discount.toFixed(2)}</div>
                </>
              ) : (
                <div style={{ fontSize: '10px', color: '#aaa' }}>No Discount Applied</div>
              )}
            </td>
            <td style={{ width: '32%', padding: '9px 10px', textAlign: 'right', verticalAlign: 'middle' }}>
              <div style={{ fontSize: '10px', marginBottom: '3px' }}>
                <span style={{ color: '#555' }}>Gross Total : </span>
                <span style={{ fontWeight: 700 }}>Rs {grossTotal.toFixed(2)}</span>
              </div>
              <div style={{ fontSize: '10px' }}>
                <span style={{ color: '#555' }}>Total Discount : </span>
                <span style={{ fontWeight: 700 }}>Rs {discount.toFixed(2)}</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Net total bar */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '8px', padding: '7px 10px', backgroundColor: '#f5f5f5', border: '1.5px solid #555', borderTop: 'none' }}>
        <span style={{ fontSize: '11px', fontWeight: 700, color: '#444' }}>Net Total Amount</span>
        <span style={{ fontSize: '17px', fontWeight: 900 }}>Rs {netTotal.toFixed(2)}</span>
      </div>

      {/* ── PRESCRIPTION ──────────────────────────────────────────────── */}
      {invoice.has_prescription && prescriptions && (
        <>
          <div style={{ fontWeight: 900, textAlign: 'center', textDecoration: 'underline', fontSize: '12px', marginTop: '12px', marginBottom: '7px', letterSpacing: '1.5px' }}>
            PRESCRIPTION
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '9.5px' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #555', padding: '4px 6px', width: '7%', background: '#f0f0f0' }}></th>
                <th colSpan={5} style={{ border: '1px solid #555', padding: '4px', textAlign: 'center', background: '#e8e8e8', fontWeight: 700 }}>RIGHT EYE (OD)</th>
                <th colSpan={5} style={{ border: '1px solid #555', padding: '4px', textAlign: 'center', background: '#e8e8e8', fontWeight: 700 }}>LEFT EYE (OS)</th>
              </tr>
              <tr style={{ background: '#f5f5f5' }}>
                <th style={{ border: '1px solid #555', padding: '3px 4px' }}></th>
                {['SPH','CYL','AXIS','PD','VA'].map(h => (
                  <th key={`od-${h}`} style={{ border: '1px solid #555', padding: '4px 5px', textAlign: 'center', fontWeight: 700, minWidth: '32px' }}>{h}</th>
                ))}
                {['SPH','CYL','AXIS','PD','VA'].map(h => (
                  <th key={`os-${h}`} style={{ border: '1px solid #555', padding: '4px 5px', textAlign: 'center', fontWeight: 700, minWidth: '32px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <RxRow label="DV" values={[
                prescriptions.od_dv_sph, prescriptions.od_dv_cyl, prescriptions.od_dv_axis, prescriptions.od_dv_pd, prescriptions.od_dv_va,
                prescriptions.os_dv_sph, prescriptions.os_dv_cyl, prescriptions.os_dv_axis, prescriptions.os_dv_pd, prescriptions.os_dv_va,
              ]} />
              <RxRow label="NV" values={[
                prescriptions.od_nv_sph, prescriptions.od_nv_cyl, prescriptions.od_nv_axis, prescriptions.od_nv_pd, prescriptions.od_nv_va,
                prescriptions.os_nv_sph, prescriptions.os_nv_cyl, prescriptions.os_nv_axis, prescriptions.os_nv_pd, prescriptions.os_nv_va,
              ]} />
              <RxRow label="ADD" values={[prescriptions.od_aod,'-','-','-','-', prescriptions.os_aod,'-','-','-','-']} />
              <RxRow label="IPD" values={[prescriptions.od_iod,'-','-','-','-', prescriptions.os_iod,'-','-','-','-']} />
            </tbody>
          </table>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', fontSize: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ fontSize: '13px' }}>{prescriptions.constant_use ? '☑' : '☐'}</span>
              <span style={{ fontWeight: 600 }}>Constant Use</span>
            </div>
            <div style={{ fontWeight: 900, fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase' }}>Optometrist</div>
          </div>

        </>
      )}

      {/* Single spacer — pushes footer to bottom, absorbs all remaining space */}
      <div style={{ flex: 1 }} />

      {/* ── BRAND LOGOS FOOTER — two rows, all logos same size ────────── */}
      <div style={{ borderTop: '2px solid #C0392B', paddingTop: '10px' }}>
        {/* Row 1 */}
        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', marginBottom: '10px' }}>
          {LOGO_ROW_1.map(logo => (
            <div key={logo.alt} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 6px' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={logo.src} alt={logo.alt}
                style={{ height: `${LOGO_H}px`, maxWidth: '100%', objectFit: 'contain' }}
                onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            </div>
          ))}
        </div>
        {/* Row 2 */}
        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
          {LOGO_ROW_2.map(logo => (
            <div key={logo.alt} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 6px' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={logo.src} alt={logo.alt}
                style={{ height: `${LOGO_H}px`, maxWidth: '100%', objectFit: 'contain' }}
                onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function RxRow({ label, values }: { label: string; values: (string | null | undefined)[] }) {
  return (
    <tr>
      <td style={{ border: '1px solid #555', padding: '4px 6px', fontWeight: 700, textAlign: 'center', background: '#f9f9f9' }}>
        {label}
      </td>
      {values.map((v, i) => (
        <td key={i} style={{ border: '1px solid #ccc', padding: '4px 6px', textAlign: 'center' }}>
          {v ?? '-'}
        </td>
      ))}
    </tr>
  );
}
