'use client';

import {
  Database,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  Clock,
  Shield,
  Link,
  FileText,
  AlertCircle,
  Server,
  HelpCircle,
  ShieldOff,
  Puzzle,
  Users,
  FileSpreadsheet,
  Lock,
  Unlink,
  Edit3,
  EyeOff,
  GitBranch,
  AlertOctagon,
} from 'lucide-react';

interface PainPoint {
  title: string;
  description: string;
  icon: string;
}

interface LPPainPointsProps {
  headline: string;
  painPoints: PainPoint[];
}

const ICON_MAP: Record<string, React.ElementType> = {
  database: Database,
  'alert-triangle': AlertTriangle,
  'trending-up': TrendingUp,
  'dollar-sign': DollarSign,
  clock: Clock,
  shield: Shield,
  link: Link,
  'file-text': FileText,
  'alert-circle': AlertCircle,
  server: Server,
  'help-circle': HelpCircle,
  'shield-off': ShieldOff,
  puzzle: Puzzle,
  users: Users,
  'file-spreadsheet': FileSpreadsheet,
  lock: Lock,
  unlink: Unlink,
  'edit-3': Edit3,
  'eye-off': EyeOff,
  'git-branch': GitBranch,
  'alert-octagon': AlertOctagon,
};

export default function LPPainPoints({ headline, painPoints }: LPPainPointsProps) {
  return (
    <section className="py-16 lg:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{headline}</h2>
          <div className="w-24 h-1 bg-[#0066FF] mx-auto" />
        </div>

        {/* Pain Points Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {painPoints.map((point, index) => {
            const IconComponent = ICON_MAP[point.icon] || AlertTriangle;

            return (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-red-100 transition-all group"
              >
                <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-red-100 transition-colors">
                  <IconComponent className="w-6 h-6 text-red-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{point.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{point.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
