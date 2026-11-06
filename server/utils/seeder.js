import Invoice from '../models/Invoice.js';

export const seedSampleInvoices = async () => {
  const now = new Date();

  const getDate = (offsetDays) => {
    const d = new Date(now);
    d.setDate(d.getDate() + offsetDays);
    return d;
  };

  const sampleData = [
    {
      invoiceNumber: 'INV-2026-001',
      clientName: 'Acuity Tech Solutions',
      clientEmail: 'accounts@acuitytech.io',
      invoiceDate: getDate(-45),
      dueDate: getDate(-15),
      amount: 45000,
      description: 'Cloud Infrastructure Migration & Docker Setup',
      notes: 'Net-30 agreement.',
      payments: [
        {
          amount: 20000,
          paymentDate: getDate(-20),
          paymentMethod: 'Bank Transfer',
          reference: 'NEFT-88392101',
        },
        {
          amount: 25000,
          paymentDate: getDate(-14),
          paymentMethod: 'UPI',
          reference: 'UPI-ACUITY-SETTLE',
        },
      ],
      // Status: PAID
    },
    {
      invoiceNumber: 'INV-2026-002',
      clientName: 'BlueSky Digital Agency',
      clientEmail: 'billing@blueskydigital.com',
      invoiceDate: getDate(-5),
      dueDate: getDate(10),
      amount: 32000,
      description: 'Monthly Frontend Development Retainer',
      notes: 'Due next week.',
      payments: [],
      // Status: PENDING
    },
    {
      invoiceNumber: 'INV-2026-003',
      clientName: 'Apex Logistics & Freight',
      clientEmail: 'finance@apexlogistics.in',
      invoiceDate: getDate(-12),
      dueDate: getDate(6),
      amount: 75000,
      description: 'Custom Warehouse Dispatch & Fleet Tracker Portal',
      notes: 'Milestone 1 advance received.',
      payments: [
        {
          amount: 30000,
          paymentDate: getDate(-10),
          paymentMethod: 'Bank Transfer',
          reference: 'IMPS-9920192',
        },
      ],
      // Status: PARTIALLY_PAID
    },
    {
      invoiceNumber: 'INV-2026-004',
      clientName: 'Vertex Marketing Labs',
      clientEmail: 'pay@vertexlabs.co',
      invoiceDate: getDate(-25),
      dueDate: getDate(-4),
      amount: 24000,
      description: 'SEO & Landing Page Performance Optimization',
      notes: 'Client promised payment on Monday.',
      payments: [],
      // Status: OVERDUE (Recently overdue - 4 days)
    },
    {
      invoiceNumber: 'INV-2026-005',
      clientName: 'Zenith Retail Enterprise',
      clientEmail: 'vendor.desk@zenithretail.in',
      invoiceDate: getDate(-70),
      dueDate: getDate(-42),
      amount: 48000,
      description: 'Point-of-Sale Integration & Payment Gateway Setup',
      notes: 'Severely overdue. Escalate follow-up.',
      payments: [],
      // Status: OVERDUE (Severely overdue - 42 days, High Age Score)
    },
    {
      invoiceNumber: 'INV-2026-006',
      clientName: 'Nova Global Ventures',
      clientEmail: 'treasury@novaglobal.com',
      invoiceDate: getDate(-50),
      dueDate: getDate(-21),
      amount: 145000,
      description: 'Enterprise React Native Mobile Application Phase 2',
      notes: 'High-value account. Requires urgent attention.',
      payments: [],
      // Status: OVERDUE (High Value - ₹1,45,000, 21 days overdue)
    },
    {
      invoiceNumber: 'INV-2026-007',
      clientName: 'Urban Coffee Co.',
      clientEmail: 'owner@urbancoffee.co',
      invoiceDate: getDate(-55),
      dueDate: getDate(-28),
      amount: 9500,
      description: 'Menu QR Code Digital Ordering Page',
      notes: 'Small local business.',
      payments: [],
      // Status: OVERDUE (Low Value - ₹9,500, 28 days overdue)
    },
    {
      invoiceNumber: 'INV-2026-008',
      clientName: 'Starlight Media Studios',
      clientEmail: 'accounts@starlightstudios.net',
      invoiceDate: getDate(-40),
      dueDate: getDate(-14),
      amount: 80000,
      description: 'Interactive 3D Portfolio & Branding Website',
      notes: '50% advance cleared. Balance overdue by 14 days.',
      payments: [
        {
          amount: 40000,
          paymentDate: getDate(-35),
          paymentMethod: 'Bank Transfer',
          reference: 'NEFT-STAR-001',
        },
      ],
      // Status: OVERDUE (Partial payment received, ₹40,000 balance remaining, 14 days overdue)
    },
  ];

  let seededCount = 0;

  for (const item of sampleData) {
    const existing = await Invoice.findOne({ invoiceNumber: item.invoiceNumber });
    if (!existing) {
      await Invoice.create(item);
      seededCount++;
    } else {
      // Refresh sample data to preserve consistency
      existing.invoiceDate = item.invoiceDate;
      existing.dueDate = item.dueDate;
      existing.amount = item.amount;
      existing.description = item.description;
      existing.notes = item.notes;
      existing.payments = item.payments;
      await existing.save();
    }
  }

  return { totalSeeded: sampleData.length, newlyAdded: seededCount };
};
