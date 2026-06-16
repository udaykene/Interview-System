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
import { Loader2, BookOpen, Users, Star, Code2, LayoutDashboard } from "lucide-react";

function ProblemsPage() {
  const { user } = useAuth();
  const {
    data: problemsData,
    isLoading: problemsLoading,
    isError: problemsError,
    error: problemsErrorDetails,
  } = useProblems();
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
  const selectedPlaylist = useMemo(() => {
    if (!activeView.startsWith("list-")) return null;
    const playlistId = activeView.replace("list-", "");
    return playlists.find((playlist) => playlist._id === playlistId) || null;
  }, [activeView, playlists]);
  const favoritesPlaylist = useMemo(() => ({
    _id: "favorites",
    name: "Favorite",
    problems: favData?.favorites || [],
    userId: user ? { name: user.name } : null,
    isPublic: false,
  }), [favData, user]);

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

    if (problemsError) {
      return (
        <div className="card" style={{ maxWidth: 520, margin: '64px auto', padding: 28 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>Problems failed to load</h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>
            {problemsErrorDetails?.response?.data?.message || "The problems library request failed. Please refresh and try again."}
          </p>
        </div>
      );
    }

    if (activeView === "study-plan") {
      return <StudyPlanView problems={problems} />;
    }

    if (activeView === "favorites") {
      return (
        <PlaylistView
          playlist={favoritesPlaylist}
          isSolved={isSolved}
          favoriteIds={favoriteIds}
          onToggleFavorite={(id) => toggleFavMutation.mutate(id)}
          onAddToList={(id) => setPopoverProblemId(id)}
        />
      );
    }

    if (selectedPlaylist) {
      return (
        <PlaylistView
          playlist={selectedPlaylist}
          isSolved={isSolved}
          favoriteIds={favoriteIds}
          onToggleFavorite={(id) => toggleFavMutation.mutate(id)}
          onAddToList={(id) => setPopoverProblemId(id)}
        />
      );
    }

    return (
      <ProblemsLibrary
        problems={problems}
        favoriteIds={favoriteIds}
        onToggleFavorite={(id) => toggleFavMutation.mutate(id)}
        isSolved={isSolved}
        onAddToList={(id) => setPopoverProblemId(id)}
        activeView={activeView}
      />
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

        <main className="problems-content" style={{ padding: '24px 32px' }}>
          {/* Header Tabs */}
          {/* <div style={{ display: 'flex', gap: 24, marginBottom: 24, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            {[
              { id: 'library', label: 'Problems', icon: <BookOpen size={16} /> },
              { id: 'users', label: 'Users', icon: <Users size={16} /> },
              { id: 'public-lists', label: 'Public Lists', icon: <Star size={16} /> },
              { id: 'knowledge', label: 'Knowledge', icon: <Code2 size={16} /> },
              { id: 'companies', label: 'Companies', icon: <LayoutDashboard size={16} /> },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '12px 16px',
                  background: activeView === tab.id ? 'rgba(255,255,255,0.05)' : 'transparent',
                  color: activeView === tab.id ? 'white' : 'var(--text-muted)',
                  border: 'none',
                  borderBottom: activeView === tab.id ? '2px solid #ffa116' : '2px solid transparent',
                  borderRadius: '8px 8px 0 0',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div> */}

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
