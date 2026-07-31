import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileQuestion, Home } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const NotFoundPage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col items-center justify-center min-h-[500px] text-center p-6 space-y-4 max-w-md mx-auto"
    >
      <div className="w-20 h-20 rounded-3xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shadow-xl shadow-blue-500/10">
        <FileQuestion className="w-10 h-10" />
      </div>

      <div className="space-y-2">
        <h1 className="text-4xl font-extrabold text-white tracking-tight font-mono">404</h1>
        <h2 className="text-lg font-semibold text-white tracking-tight">Page Not Found</h2>
        <p className="text-xs text-neutral-400 leading-relaxed">
          The route you are trying to access does not exist or has been moved.
        </p>
      </div>

      <div className="pt-2">
        <Link to="/">
          <Button leftIcon={<Home className="w-4 h-4" />}>
            Return to Dashboard
          </Button>
        </Link>
      </div>
    </motion.div>
  );
};
