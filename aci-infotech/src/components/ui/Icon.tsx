'use client';

import { LucideIcon, LucideProps } from 'lucide-react';
import * as Icons from 'lucide-react';

interface IconProps extends Omit<LucideProps, 'ref'> {
  name: keyof typeof Icons;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
}

const sizeMap = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
  '2xl': 48,
};

export default function Icon({
  name,
  size = 'md',
  className = '',
  ...props
}: IconProps) {
  const LucideIcon = Icons[name] as LucideIcon;

  if (!LucideIcon) {
    console.warn(`Icon "${name}" not found in lucide-react`);
    return null;
  }

  return (
    <LucideIcon
      size={sizeMap[size]}
      className={className}
      {...props}
    />
  );
}

// Re-export commonly used icons for convenience
export {
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  ChevronLeft,
  X,
  Menu,
  Search,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  User,
  Users,
  Building2,
  Briefcase,
  Code,
  Database,
  Cloud,
  Shield,
  Brain,
  Zap,
  Settings,
  Check,
  CheckCircle,
  AlertCircle,
  Info,
  ExternalLink,
  Download,
  Upload,
  Play,
  Pause,
  Loader2,
  Star,
  Heart,
  Share2,
  Copy,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  Github,
  Youtube,
} from 'lucide-react';
