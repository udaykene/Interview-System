import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import ProblemsSidebar from "../components/ProblemsSidebar";
import ProblemsLibrary from "../components/ProblemsLibrary";
import StudyPlanView from "../components/StudyPlanView";
import PlaylistView from "../components/PlaylistView";
import CreateListModal from "../components/CreateListModal";
import AddToListPopover from "../components/AddToListPopover";
import { useProblems, useToggleFavorite, useFavorites } from "../hooks/useProblems";
import { usePlaylists, useCreatePlaylist, useAddProblemToPlaylist, useRemoveProblemFromPlaylist } from "../hooks/usePlaylists";
import { useAuth } from "../context/AuthContextState";
import { Loader2 } from "lucide-react";

function ProblemsPage() {
  const { user } = useAuth();
  const { data: problemsData, isLoading: problemsLoading } = useProblems();
  const { data: favData } = useFavorites();
  const { data: playlistsData } = usePlaylists();
  
  const toggleFavMutation = useToggleFavorite();
  const createPlaylistMutation = useCreatePlaylist();
  const addProblemMutation = useAddProblemToPlaylist();
  const removeProblemMutation = useRemoveProblemFromPlaylist();

  const [activeView, setActiveView] = useState("library");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [popoverProblemId, setPopoverProblemId] = useState(null);

  const problems = problemsData?.problems || [];
  const playlists = playlistsData?.playlists || [];
  const favoriteIds = useMemo(() => (favData?.favorites || []).map(f => typeof f === 'string' ? f : f._id), [favData]);

  const isSolved = (problemId) => user?.stats?.solvedProblems?.includes(problemId);

  const handleCreateList = (data) => {
    createPlaylistMutation.mutate(data);
  };

  const handleTogglePlaylistProblem = (playlistId, problemId, isIncluded) => {
    if (isIncluded) {
      removeProblemMutation.mutate({ playlistId, problemId });
    } else {
      addProblemMutation.mutate({ playlistId, problemId });
    }
  };

  const renderContent = () => {
    if (problemsLoading) {
      return (
        <div style={{ height: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Loader2 size={32} className="animate-spin" color="var(--accent-violet)" />
        </div>
      );
    }

    if (activeView === "library") {
      return <ProblemsLibrary 
        problems={problems} 
        favoriteIds={favoriteIds} 
        onToggleFavorite={(id) => toggleFavMutation.mutate(id)}
        isSolved={isSolved}
        onAddToList={(id) => setPopoverProblemId(id)}
      />;
    }

    if (activeView === "study-plan") {
      return <StudyPlanView />;
    }

    if (activeView === "favorites") {
      const favProblems = problems.filter(p => favoriteIds.includes(p._id));
      return <PlaylistView 
        playlist={{ name: "Favorite", problems: favProblems, userId: user }}
        isSolved={isSolved}
        favoriteIds={favoriteIds}
        onToggleFavorite={(id) => toggleFavMutation.mutate(id)}
        onAddToList={(id) => setPopoverProblemId(id)}
      />;
    }

    if (activeView.startsWith("list-")) {
      const listId = activeView.replace("list-", "");
      const playlist = playlists.find(l => l._id === listId);
      return <PlaylistView 
        playlist={playlist}
        isSolved={isSolved}
        favoriteIds={favoriteIds}
        onToggleFavorite={(id) => toggleFavMutation.mutate(id)}
        onAddToList={(id) => setPopoverProblemId(id)}
      />;
    }

    return (
      <div style={{ textAlign: 'center', padding: 64, color: 'var(--text-muted)' }}>
        View "{activeView}" coming soon...
      </div>
    );
  };

  return (
    <div style={{ minHeight: '100vh', background: '#050505' }}>
      <Navbar />

      <div className="problems-layout">
        <ProblemsSidebar 
          activeView={activeView} 
          setActiveView={(view) => {
            if (view === "create-list") setIsCreateModalOpen(true);
            else setActiveView(view);
          }} 
          playlists={playlists}
        />

        <main className="problems-content">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <CreateListModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateList}
      />

      <AddToListPopover 
        isOpen={!!popoverProblemId}
        onClose={() => setPopoverProblemId(null)}
        playlists={playlists}
        problemId={popoverProblemId}
        onToggleProblem={handleTogglePlaylistProblem}
        onCreateNew={() => {
          setPopoverProblemId(null);
          setIsCreateModalOpen(true);
        }}
      />
    </div>
  );
}

export default ProblemsPage;
