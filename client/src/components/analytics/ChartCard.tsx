import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { MoreHorizontal } from "lucide-react";

interface ChartCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  actions?: ReactNode;
}

const ChartCard: React.FC<ChartCardProps> = ({
  title,
  description,
  children,
  actions,
}) => {
  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-xl border border-blue-100 dark:border-gray-700 shadow-sm overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      }}
    >
      <div className="p-4 border-b border-blue-50 dark:border-gray-700 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">{title}</h3>
          {description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</p>
          )}
        </div>
        <div className="flex items-center">
          {actions || (
            <button className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
              <MoreHorizontal size={20} />
            </button>
          )}
        </div>
      </div>
      <div className="p-4 overflow-x-auto overflow-y-hidden">
        {children}
      </div>
    </motion.div>
  );
};

export default ChartCard;
