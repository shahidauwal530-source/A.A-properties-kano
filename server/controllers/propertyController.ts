import { Request, Response } from 'express';
import { isMongoConnected, localStore } from '../db.ts';
import { PropertyModel, IProperty } from '../models/Property.ts';
import { UserModel } from '../models/User.ts';
import { InspectionModel } from '../models/Inspection.ts';
import { AuthRequest } from '../middleware/auth.ts';

export async function getProperties(req: Request, res: Response) {
  try {
    const {
      search,
      type,
      area,
      minPrice,
      maxPrice,
      bedrooms,
      document,
      sort = 'newest',
      status = 'Available',
    } = req.query as Record<string, string>;

    if (isMongoConnected) {
      const query: any = {};
      if (status && status !== 'all') {
        query.status = status;
      }
      if (type && type !== 'all') {
        query.type = type;
      }
      if (area && area !== 'all') {
        query.area = area;
      }
      if (document && document !== 'all') {
        query.document = document;
      }
      if (bedrooms && bedrooms !== 'all') {
        query.bedrooms = { $gte: Number(bedrooms) };
      }
      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
      }
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { area: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { type: { $regex: search, $options: 'i' } },
        ];
      }

      let sortOption: any = { createdAt: -1 };
      if (sort === 'price-low') sortOption = { price: 1 };
      if (sort === 'price-high') sortOption = { price: -1 };
      if (sort === 'popular') sortOption = { views: -1, favoritesCount: -1 };

      const properties = await PropertyModel.find(query).sort(sortOption);
      return res.json({ success: true, count: properties.length, properties });
    } else {
      let properties = [...localStore.getCollection('properties')];

      if (status && status !== 'all') {
        properties = properties.filter((p) => p.status === status);
      }
      if (type && type !== 'all') {
        properties = properties.filter((p) => p.type === type);
      }
      if (area && area !== 'all') {
        properties = properties.filter(
          (p) => p.area.toLowerCase() === area.toLowerCase()
        );
      }
      if (document && document !== 'all') {
        properties = properties.filter((p) => p.document === document);
      }
      if (bedrooms && bedrooms !== 'all') {
        properties = properties.filter((p) => (p.bedrooms || 0) >= Number(bedrooms));
      }
      if (minPrice) {
        properties = properties.filter((p) => p.price >= Number(minPrice));
      }
      if (maxPrice) {
        properties = properties.filter((p) => p.price <= Number(maxPrice));
      }
      if (search) {
        const q = search.toLowerCase();
        properties = properties.filter(
          (p) =>
            p.title.toLowerCase().includes(q) ||
            p.area.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.type.toLowerCase().includes(q)
        );
      }

      if (sort === 'price-low') {
        properties.sort((a, b) => a.price - b.price);
      } else if (sort === 'price-high') {
        properties.sort((a, b) => b.price - a.price);
      } else if (sort === 'popular') {
        properties.sort((a, b) => (b.views || 0) - (a.views || 0));
      } else {
        properties.sort(
          (a, b) =>
            new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
        );
      }

      return res.json({ success: true, count: properties.length, properties });
    }
  } catch (err: any) {
    console.error('getProperties error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

export async function getPropertyById(req: Request, res: Response) {
  try {
    const { id } = req.params;

    if (isMongoConnected) {
      const property = await PropertyModel.findByIdAndUpdate(
        id,
        { $inc: { views: 1 } },
        { new: true }
      );

      if (!property) {
        return res.status(404).json({ success: false, message: 'Babu wannan gidan' });
      }

      const similar = await PropertyModel.find({
        _id: { $ne: property._id },
        $or: [{ type: property.type }, { area: property.area }],
        status: 'Available',
      }).limit(3);

      return res.json({ success: true, property, similar });
    } else {
      const properties = localStore.getCollection('properties');
      const property = properties.find((p) => p._id === id || p.id === id);

      if (!property) {
        return res.status(404).json({ success: false, message: 'Babu wannan gidan' });
      }

      property.views = (property.views || 0) + 1;
      localStore.save();

      const similar = properties
        .filter(
          (p) =>
            (p._id !== id && p.id !== id) &&
            (p.type === property.type || p.area === property.area) &&
            p.status === 'Available'
        )
        .slice(0, 3);

      return res.json({ success: true, property, similar });
    }
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

export async function getFeaturedProperties(_req: Request, res: Response) {
  try {
    if (isMongoConnected) {
      const featured = await PropertyModel.find({
        status: 'Available',
        isFeatured: true,
      })
        .limit(12)
        .sort({ createdAt: -1 });

      return res.json({ success: true, count: featured.length, properties: featured });
    } else {
      const properties = localStore.getCollection('properties');
      const featured = properties
        .filter((p) => p.status === 'Available' && p.isFeatured)
        .slice(0, 12);
      return res.json({ success: true, count: featured.length, properties: featured });
    }
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

export async function createProperty(req: AuthRequest, res: Response) {
  try {
    const {
      title,
      type,
      area,
      price,
      dealType,
      bedrooms,
      bathrooms,
      size,
      document,
      water,
      power,
      fence,
      parking,
      security,
      description,
      images,
      videoUrl,
      mapPin,
      status,
      isFeatured,
    } = req.body;

    if (!title || !type || !area || !price || !dealType || !description) {
      return res.status(400).json({
        success: false,
        message: 'Cika dukkan mahimman bayanan gidan/filin (Title, type, area, price, dealType, description required)',
      });
    }

    const newPropertyData = {
      title: title.trim(),
      type,
      area: area.trim(),
      price: Number(price),
      dealType,
      bedrooms: Number(bedrooms || 0),
      bathrooms: Number(bathrooms || 0),
      size: size || '',
      document: document || 'None',
      water: water || 'Borehole',
      power: power || 'NEPA Available',
      fence: fence !== undefined ? Boolean(fence) : true,
      parking: parking !== undefined ? Boolean(parking) : true,
      security: security !== undefined ? Boolean(security) : true,
      description: description.trim(),
      images: Array.isArray(images) && images.length > 0 ? images : ['/src/assets/images/hero_kano_mansion_1793795009227.jpg'],
      videoUrl: videoUrl || '',
      mapPin: mapPin || `${area}, Kano`,
      status: status || 'Available',
      views: 0,
      whatsappClicks: 0,
      favoritesCount: 0,
      isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : true,
      createdBy: req.user?._id || req.user?.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (isMongoConnected) {
      const property = await PropertyModel.create(newPropertyData);
      return res.status(201).json({
        success: true,
        message: 'An dora sabon gida/fili cikin nasara!',
        property,
      });
    } else {
      const properties = localStore.getCollection('properties');
      const newProp = {
        _id: 'prop_' + Date.now(),
        ...newPropertyData,
      };
      properties.unshift(newProp);
      localStore.save();
      return res.status(201).json({
        success: true,
        message: 'An dora sabon gida/fili cikin nasara!',
        property: newProp,
      });
    }
  } catch (err: any) {
    console.error('createProperty error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

export async function updateProperty(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const updateData = { ...req.body, updatedAt: new Date() };

    if (isMongoConnected) {
      const property = await PropertyModel.findByIdAndUpdate(id, updateData, { new: true });
      if (!property) {
        return res.status(404).json({ success: false, message: 'Babu wannan gidan' });
      }
      return res.json({ success: true, message: 'An sabunta bayanan gidan!', property });
    } else {
      const properties = localStore.getCollection('properties');
      const index = properties.findIndex((p) => p._id === id || p.id === id);
      if (index === -1) {
        return res.status(404).json({ success: false, message: 'Babu wannan gidan' });
      }
      properties[index] = { ...properties[index], ...updateData };
      localStore.save();
      return res.json({ success: true, message: 'An sabunta bayanan gidan!', property: properties[index] });
    }
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

export async function deleteProperty(req: Request, res: Response) {
  try {
    const { id } = req.params;
    if (isMongoConnected) {
      const deleted = await PropertyModel.findByIdAndDelete(id);
      if (!deleted) {
        return res.status(404).json({ success: false, message: 'Babu wannan gidan' });
      }
    } else {
      const properties = localStore.getCollection('properties');
      const index = properties.findIndex((p) => p._id === id || p.id === id);
      if (index === -1) {
        return res.status(404).json({ success: false, message: 'Babu wannan gidan' });
      }
      properties.splice(index, 1);
      localStore.save();
    }
    return res.json({ success: true, message: 'An goge gidan cikin nasara!' });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

export async function updatePropertyStatus(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status || !['Available', 'Sold', 'Rented', 'Draft'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Status ba daidai ba ne' });
    }

    if (isMongoConnected) {
      const prop = await PropertyModel.findByIdAndUpdate(id, { status }, { new: true });
      return res.json({ success: true, message: `An canza matsayin gidan zuwa ${status}`, property: prop });
    } else {
      const properties = localStore.getCollection('properties');
      const prop = properties.find((p) => p._id === id || p.id === id);
      if (!prop) {
        return res.status(404).json({ success: false, message: 'Babu wannan gidan' });
      }
      prop.status = status;
      localStore.save();
      return res.json({ success: true, message: `An canza matsayin gidan zuwa ${status}`, property: prop });
    }
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

export async function recordWhatsAppClick(req: Request, res: Response) {
  try {
    const { id } = req.params;
    if (isMongoConnected) {
      await PropertyModel.findByIdAndUpdate(id, { $inc: { whatsappClicks: 1 } });
    } else {
      const properties = localStore.getCollection('properties');
      const prop = properties.find((p) => p._id === id || p.id === id);
      if (prop) {
        prop.whatsappClicks = (prop.whatsappClicks || 0) + 1;
        localStore.save();
      }
    }
    return res.json({ success: true });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

export async function toggleFavorite(req: AuthRequest, res: Response) {
  try {
    const { propertyId } = req.params;
    const userId = req.user._id || req.user.id;

    if (isMongoConnected) {
      const user = await UserModel.findById(userId);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });

      const propIdStr = propertyId.toString();
      const favIndex = user.favorites.findIndex((f: any) => f.toString() === propIdStr);
      let isFavorited = false;

      if (favIndex > -1) {
        user.favorites.splice(favIndex, 1);
        await PropertyModel.findByIdAndUpdate(propertyId, { $inc: { favoritesCount: -1 } });
        isFavorited = false;
      } else {
        user.favorites.push(propertyId as any);
        await PropertyModel.findByIdAndUpdate(propertyId, { $inc: { favoritesCount: 1 } });
        isFavorited = true;
      }

      await user.save();
      return res.json({
        success: true,
        isFavorited,
        favorites: user.favorites,
        message: isFavorited ? 'An ajiye a Jerin Abubuwan da kake so ❤️' : 'An cire daga Jerin Abubuwan da kake so',
      });
    } else {
      const users = localStore.getCollection('users');
      const user = users.find((u) => u._id === userId || u.id === userId);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });

      if (!user.favorites) user.favorites = [];
      const favIndex = user.favorites.findIndex((f: string) => f === propertyId);
      let isFavorited = false;

      const properties = localStore.getCollection('properties');
      const prop = properties.find((p) => p._id === propertyId || p.id === propertyId);

      if (favIndex > -1) {
        user.favorites.splice(favIndex, 1);
        if (prop) prop.favoritesCount = Math.max(0, (prop.favoritesCount || 1) - 1);
        isFavorited = false;
      } else {
        user.favorites.push(propertyId);
        if (prop) prop.favoritesCount = (prop.favoritesCount || 0) + 1;
        isFavorited = true;
      }

      localStore.save();
      return res.json({
        success: true,
        isFavorited,
        favorites: user.favorites,
        message: isFavorited ? 'An ajiye a Jerin Abubuwan da kake so ❤️' : 'An cire daga Jerin Abubuwan da kake so',
      });
    }
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

export async function getFavorites(req: AuthRequest, res: Response) {
  try {
    const userId = req.user._id || req.user.id;

    if (isMongoConnected) {
      const user = await UserModel.findById(userId).populate('favorites');
      return res.json({ success: true, favorites: user?.favorites || [] });
    } else {
      const users = localStore.getCollection('users');
      const user = users.find((u) => u._id === userId || u.id === userId);
      const favIds = user?.favorites || [];

      const properties = localStore.getCollection('properties');
      const favorites = properties.filter((p) => favIds.includes(p._id || p.id));
      return res.json({ success: true, favorites });
    }
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

export async function getAdminDashboard(req: AuthRequest, res: Response) {
  try {
    if (isMongoConnected) {
      const totalProperties = await PropertyModel.countDocuments();
      const totalAvailable = await PropertyModel.countDocuments({ status: 'Available' });
      const totalSold = await PropertyModel.countDocuments({ status: 'Sold' });
      const totalRented = await PropertyModel.countDocuments({ status: 'Rented' });
      const totalUsers = await UserModel.countDocuments({ role: 'user' });
      const totalInspections = await InspectionModel.countDocuments();

      const stats = await PropertyModel.aggregate([
        {
          $group: {
            _id: null,
            totalViews: { $sum: '$views' },
            totalWhatsAppClicks: { $sum: '$whatsappClicks' },
          },
        },
      ]);

      const totalViews = stats[0]?.totalViews || 0;
      const totalWhatsAppClicks = stats[0]?.totalWhatsAppClicks || 0;
      const recentProperties = await PropertyModel.find().sort({ createdAt: -1 }).limit(5);
      const recentInspections = await InspectionModel.find().sort({ createdAt: -1 }).limit(5);

      return res.json({
        success: true,
        stats: {
          totalProperties,
          totalAvailable,
          totalSold,
          totalRented,
          totalViews,
          totalUsers,
          totalInspections,
          totalWhatsAppClicks,
        },
        recentProperties,
        recentInspections,
      });
    } else {
      const properties = localStore.getCollection('properties');
      const users = localStore.getCollection('users');
      const inspections = localStore.getCollection('inspections');

      const totalProperties = properties.length;
      const totalAvailable = properties.filter((p) => p.status === 'Available').length;
      const totalSold = properties.filter((p) => p.status === 'Sold').length;
      const totalRented = properties.filter((p) => p.status === 'Rented').length;
      const totalUsers = users.filter((u) => u.role === 'user').length;
      const totalInspections = inspections.length;

      const totalViews = properties.reduce((acc, p) => acc + (p.views || 0), 0);
      const totalWhatsAppClicks = properties.reduce((acc, p) => acc + (p.whatsappClicks || 0), 0);

      const recentProperties = properties.slice(0, 5);
      const recentInspections = inspections.slice(0, 5);

      return res.json({
        success: true,
        stats: {
          totalProperties,
          totalAvailable,
          totalSold,
          totalRented,
          totalViews,
          totalUsers,
          totalInspections,
          totalWhatsAppClicks,
        },
        recentProperties,
        recentInspections,
      });
    }
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
