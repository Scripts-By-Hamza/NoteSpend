import React from 'react';
import { 
  Utensils, Car, ShoppingBag, CreditCard, Film, 
  Activity, BookOpen, Plane, Home, MoreHorizontal,
  Briefcase, Laptop, TrendingUp, PieChart, Gift
} from 'lucide-react';

const iconMap = {
  Utensils, Car, ShoppingBag, CreditCard, Film, 
  Activity, BookOpen, Plane, Home, MoreHorizontal,
  Briefcase, Laptop, TrendingUp, PieChart, Gift
};

export const CategoryIcon = ({ name, size = 20, className = "" }) => {
  const Icon = iconMap[name] || MoreHorizontal;
  return <Icon size={size} className={className} />;
};
