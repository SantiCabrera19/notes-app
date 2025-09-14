import React from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Archive, 
  Tag, 
  TrendingUp, 
  Calendar,
  Clock,
  Star
} from 'lucide-react';
import type { Note, Tag as TagType } from '../../services/api';
import { DashboardSkeleton } from './Skeleton';
import { 
  getNotesCreatedToday, 
  getNotesWithTags, 
  getRecentNotes, 
  getTagUsage 
} from '../../utils/noteUtils';

interface DashboardProps {
  notes: Note[];
  tags: TagType[];
  loading?: boolean;
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  description?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, description }) => (
  <motion.div
    className="bg-gray-800 rounded-lg p-4 md:p-6 border border-gray-700"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ scale: 1.02, y: -2 }}
    transition={{ type: 'spring', stiffness: 300 }}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs md:text-sm font-medium text-gray-400">{title}</p>
        <p className="text-xl md:text-2xl font-bold text-white mt-1">{value}</p>
        {description && (
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        )}
      </div>
      <div className={`p-2 md:p-3 rounded-lg ${color}`}>
        {icon}
      </div>
    </div>
  </motion.div>
);

const RecentNotes: React.FC<{ notes: Note[] }> = ({ notes }) => {
  const recentNotes = getRecentNotes(notes, 5);

  return (
    <motion.div
      className="bg-gray-800 rounded-lg p-4 md:p-6 border border-gray-700 max-h-[50vh] md:max-h-none overflow-auto md:overflow-visible"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex items-center space-x-2 mb-4">
        <Clock className="w-5 h-5 text-blue-400" />
        <h3 className="text-base md:text-lg font-semibold text-white">Recent Notes</h3>
      </div>
      <div className="space-y-3 pr-1">
        {recentNotes.length === 0 ? (
          <p className="text-gray-400 text-sm">No notes yet</p>
        ) : (
          recentNotes.map((note) => (
            <motion.div
              key={note.id}
              className="flex items-center justify-between p-3 bg-gray-700 rounded-lg"
              whileHover={{ scale: 1.01 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm md:text-base font-medium text-white truncate">{note.title}</p>
                <p className="text-xs md:text-sm text-gray-400 truncate">{note.content}</p>
              </div>
              <div className="flex items-center space-x-2 ml-3">
                {note.tags && note.tags.length > 0 && (
                  <span className="text-xs bg-blue-900/50 text-blue-300 px-2 py-1 rounded-full">
                    {note.tags.length} tag{note.tags.length !== 1 ? 's' : ''}
                  </span>
                )}
                <span className="text-xs text-gray-500">
                  {new Date(note.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
};

const PopularTags: React.FC<{ tags: TagType[]; notes: Note[] }> = ({ tags, notes }) => {
  const tagUsage = getTagUsage(tags, notes).slice(0, 5);

  return (
    <motion.div
      className="bg-gray-800 rounded-lg p-4 md:p-6 border border-gray-700 max-h-[50vh] md:max-h-none overflow-auto md:overflow-visible"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div className="flex items-center space-x-2 mb-4">
        <Star className="w-5 h-5 text-yellow-400" />
        <h3 className="text-base md:text-lg font-semibold text-white">Popular Tags</h3>
      </div>
      <div className="space-y-3 pr-1">
        {tagUsage.length === 0 ? (
          <p className="text-gray-400 text-sm">No tags yet</p>
        ) : (
          tagUsage.map((tag) => (
            <motion.div
              key={tag.id}
              className="flex items-center justify-between p-3 bg-gray-700 rounded-lg"
              whileHover={{ scale: 1.01 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <span className="text-sm font-medium text-white">{tag.name}</span>
              <span className="text-xs bg-blue-900/50 text-blue-300 px-2 py-1 rounded-full">
                {tag.usage} note{tag.usage !== 1 ? 's' : ''}
              </span>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export const Dashboard: React.FC<DashboardProps> = ({ notes, tags, loading = false }) => {
  if (loading) {
    return <DashboardSkeleton />;
  }
  const totalNotes = notes.length;
  const activeNotes = notes.filter(note => !note.isArchived).length;
  const archivedNotes = notes.filter(note => note.isArchived).length;
  const totalTags = tags.length;
  const notesWithTags = getNotesWithTags(notes).length;
  const todayNotes = getNotesCreatedToday(notes).length;

  const stats = [
    {
      title: 'Total Notes',
      value: totalNotes,
      icon: <FileText className="w-6 h-6 text-white" />,
      color: 'bg-blue-500',
      description: 'All notes created'
    },
    {
      title: 'Active Notes',
      value: activeNotes,
      icon: <TrendingUp className="w-6 h-6 text-white" />,
      color: 'bg-green-500',
      description: 'Currently active'
    },
    {
      title: 'Archived',
      value: archivedNotes,
      icon: <Archive className="w-6 h-6 text-white" />,
      color: 'bg-gray-500',
      description: 'Archived notes'
    },
    {
      title: 'Total Tags',
      value: totalTags,
      icon: <Tag className="w-6 h-6 text-white" />,
      color: 'bg-purple-500',
      description: 'Available tags'
    },
    {
      title: 'Today\'s Notes',
      value: todayNotes,
      icon: <Calendar className="w-6 h-6 text-white" />,
      color: 'bg-orange-500',
      description: 'Created today'
    },
    {
      title: 'Tagged Notes',
      value: notesWithTags,
      icon: <Tag className="w-6 h-6 text-white" />,
      color: 'bg-indigo-500',
      description: 'Notes with tags'
    }
  ];

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-1 md:mb-2">Dashboard</h1>
        <p className="text-gray-400 text-sm md:text-base">Overview of your notes and activity</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
        {stats.map((stat, _index) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
            description={stat.description}
          />
        ))}
      </div>

      {/* Recent Notes and Popular Tags */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <RecentNotes notes={notes} />
        <PopularTags tags={tags} notes={notes} />
      </div>
    </div>
  );
};