import { Request, Response } from 'express';
import { isMongoConnected, localStore } from '../db.ts';
import { InspectionModel } from '../models/Inspection.ts';
import { PropertyModel } from '../models/Property.ts';
import { AuthRequest } from '../middleware/auth.ts';

const ADAM_WHATSAPP = '2349042782681';

export async function createInspection(req: AuthRequest, res: Response) {
  try {
    const { propertyId, date, time, customerName, customerPhone, notes } = req.body;

    if (!propertyId || !date || !time) {
      return res.status(400).json({
        success: false,
        message: 'Zabi rana da lokacin duba gidan (Date and time are required)',
      });
    }

    const name = customerName || req.user?.fullName;
    const phone = customerPhone || req.user?.phone;

    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Shigar da sunanka da lambar WhatsApp (Name and phone number are required)',
      });
    }

    let propertyTitle = 'Gida / Fili a Kano';

    if (isMongoConnected) {
      const prop = await PropertyModel.findById(propertyId);
      if (prop) propertyTitle = prop.title;

      const inspection = await InspectionModel.create({
        propertyId,
        propertyTitle,
        userId: req.user?._id || req.user?.id,
        customerName: name,
        customerPhone: phone,
        date: new Date(date),
        time,
        notes: notes || '',
        status: 'Pending',
      });

      // Build WhatsApp message for Adam Auwal Adam
      const formattedDate = new Date(date).toLocaleDateString('en-GB');
      const waText = encodeURIComponent(
        `Salam Malam Adam (A.A Properties Kano),\n\nIna son yin Booking na FREE Inspection domin duba wannan kaya:\n📌 *${propertyTitle}*\n📅 *Rana:* ${formattedDate}\n⏰ *Lokaci:* ${time}\n👤 *Sunana:* ${name}\n📞 *Lamba:* ${phone}\n${notes ? `📝 *Karin Bayani:* ${notes}\n` : ''}\nNa gode!`
      );
      const whatsappUrl = `https://wa.me/${ADAM_WHATSAPP}?text=${waText}`;

      return res.status(201).json({
        success: true,
        message: 'An yi nasarar yin booking na FREE Inspection! Adam zai tuntube ka a WhatsApp.',
        inspection,
        whatsappUrl,
      });
    } else {
      const properties = localStore.getCollection('properties');
      const prop = properties.find((p) => p._id === propertyId || p.id === propertyId);
      if (prop) propertyTitle = prop.title;

      const inspections = localStore.getCollection('inspections');
      const newInspection = {
        _id: 'insp_' + Date.now(),
        propertyId,
        propertyTitle,
        userId: req.user?._id || req.user?.id,
        customerName: name,
        customerPhone: phone,
        date: new Date(date),
        time,
        notes: notes || '',
        status: 'Pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      inspections.unshift(newInspection);
      localStore.save();

      const formattedDate = new Date(date).toLocaleDateString('en-GB');
      const waText = encodeURIComponent(
        `Salam Malam Adam (A.A Properties Kano),\n\nIna son yin Booking na FREE Inspection domin duba wannan kaya:\n📌 *${propertyTitle}*\n📅 *Rana:* ${formattedDate}\n⏰ *Lokaci:* ${time}\n👤 *Sunana:* ${name}\n📞 *Lamba:* ${phone}\n${notes ? `📝 *Karin Bayani:* ${notes}\n` : ''}\nNa gode!`
      );
      const whatsappUrl = `https://wa.me/${ADAM_WHATSAPP}?text=${waText}`;

      return res.status(201).json({
        success: true,
        message: 'An yi nasarar yin booking na FREE Inspection! Adam zai tuntube ka a WhatsApp.',
        inspection: newInspection,
        whatsappUrl,
      });
    }
  } catch (err: any) {
    console.error('Inspection error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

export async function getMyInspections(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?._id || req.user?.id;
    const userPhone = req.user?.phone;

    if (isMongoConnected) {
      const inspections = await InspectionModel.find({
        $or: [{ userId }, { customerPhone: userPhone }],
      }).sort({ createdAt: -1 });

      return res.json({ success: true, inspections });
    } else {
      const inspections = localStore.getCollection('inspections');
      const myInspections = inspections.filter(
        (i) => (userId && i.userId === userId) || (userPhone && i.customerPhone === userPhone)
      );
      return res.json({ success: true, inspections: myInspections });
    }
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

export async function getAllInspections(_req: AuthRequest, res: Response) {
  try {
    if (isMongoConnected) {
      const inspections = await InspectionModel.find().sort({ createdAt: -1 });
      return res.json({ success: true, count: inspections.length, inspections });
    } else {
      const inspections = localStore.getCollection('inspections');
      return res.json({ success: true, count: inspections.length, inspections });
    }
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

export async function updateInspectionStatus(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['Pending', 'Confirmed', 'Done', 'Cancelled'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    if (isMongoConnected) {
      const updated = await InspectionModel.findByIdAndUpdate(id, { status }, { new: true });
      return res.json({ success: true, message: `An canza matsayin inspection zuwa ${status}`, inspection: updated });
    } else {
      const inspections = localStore.getCollection('inspections');
      const insp = inspections.find((i) => i._id === id || i.id === id);
      if (!insp) return res.status(404).json({ success: false, message: 'Inspection not found' });
      insp.status = status;
      localStore.save();
      return res.json({ success: true, message: `An canza matsayin inspection zuwa ${status}`, inspection: insp });
    }
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
