import { useState, useRef, useMemo, useEffect } from "react";
import { useParams, useNavigate,Link } from "react-router-dom";
import { useAuth } from "../context/AuthContextState";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import {
  Camera,
  Check,
  X,
  MapPin,
  Eye,
  MessageSquare,
  Award,
  Star,
  Info,
  ChevronDown,
  UserPlus,
  UserMinus,
  Loader2,
  ChevronLeft,
} from "lucide-react";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";
import {
  useUserStats,
  useUserActivity,
  useUserHistory,
} from "../hooks/useStats";
import ProgressGauge from "../components/ProgressGauge";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] },
});

/* ─── Activity Heatmap & Streaks ─────────────────── */
function ProfileActivity({ activityMap = {} }) {
  const weeks = useMemo(() => {
    const today = new Date();
    const result = [];
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 363);
    startDate.setDate(startDate.getDate() - startDate.getDay());

    let currentDate = new Date(startDate);
    let week = [];

    while (currentDate <= today) {
      const dateStr = currentDate.toISOString().split("T")[0];
      week.push({
        date: dateStr,
        count: activityMap[dateStr] || 0,
        dayOfWeek: currentDate.getDay(),
      });

      if (currentDate.getDay() === 6) {
        result.push(week);
        week = [];
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    if (week.length > 0) result.push(week);
    return result;
  }, [activityMap]);

  const getColor = (count) => {
    if (count === 0) return "rgba(255,255,255,0.03)";
    if (count <= 1) return "#0e4429";
    if (count <= 3) return "#006d32";
    if (count <= 5) return "#26a641";
    return "#39d353";
  };

  const totalSubmissions = Object.values(activityMap).reduce(
    (s, c) => s + c,
    0,
  );
  const activeDays = Object.values(activityMap).filter((c) => c > 0).length;

  return (
    <div
      style={{
        background: "#111111",
        borderRadius: 16,
        border: "1px solid rgba(255,255,255,0.05)",
        padding: "20px 24px",
      }}
    >
      {/* Header row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 20,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <h3
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: "rgba(255,255,255,0.9)",
          }}
        >
          {totalSubmissions} submissions in the past one year
          <Info
            size={12}
            style={{
              display: "inline",
              color: "#4b5563",
              marginLeft: 6,
              verticalAlign: "middle",
            }}
          />
        </h3>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            color: "#6b7280",
          }}
        >
          <span>
            Total active days:{" "}
            <span style={{ color: "white", fontWeight: 700 }}>
              {activeDays}
            </span>
          </span>
          <span>
            Max streak:{" "}
            <span style={{ color: "white", fontWeight: 700 }}>3</span>
          </span>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              background: "rgba(255,255,255,0.05)",
              padding: "3px 8px",
              borderRadius: 6,
              border: "1px solid rgba(255,255,255,0.05)",
              cursor: "pointer",
            }}
          >
            Current <ChevronDown size={12} />
          </div>
        </div>
      </div>

      {/* Heatmap grid */}
      <div
        style={{ display: "flex", gap: 2, overflowX: "auto", paddingBottom: 4 }}
      >
        {weeks.map((week, wi) => (
          <div
            key={wi}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              flexShrink: 0,
            }}
          >
            {[0, 1, 2, 3, 4, 5, 6].map((dayIdx) => {
              const day = week.find((d) => d.dayOfWeek === dayIdx);
              return (
                <div
                  key={dayIdx}
                  title={
                    day
                      ? `${day.date}: ${day.count} submission${day.count !== 1 ? "s" : ""}`
                      : ""
                  }
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 2,
                    background: day ? getColor(day.count) : "transparent",
                    transition: "all 0.2s",
                    cursor: day ? "pointer" : "default",
                  }}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

function ProfilePage() {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user: currentUser, refresh: refreshAuth } = useAuth();

  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [following, setFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState("Recent AC");
  const [showFollowList, setShowFollowList] = useState(false);
  const [followListType, setFollowListType] = useState("following");
  const [followListData, setFollowListData] = useState([]);
  const [followListLoading, setFollowListLoading] = useState(false);
  const fileRef = useRef();

  const isOwnProfile = !username || username === currentUser?.username;
  const targetUsername = username || currentUser?.username;

  const { data: statsData } = useUserStats(targetUsername);
  const { data: activityData } = useUserActivity(targetUsername);
  const { data: historyData } = useUserHistory(targetUsername, 1, 10);

  const submissions = historyData?.submissions || [];

  useEffect(() => {
    if (!targetUsername) return;

    const fetchProfile = async () => {
      setLoading(true);
      setShowFollowList(false);
      try {
        if (isOwnProfile && currentUser) {
          setProfileUser((prev) => ({ ...prev, ...currentUser }));
        }
        const { data } = await axiosInstance.get(
          `/auth/user/${targetUsername}`,
        );
        setProfileUser(data.user);
        setFollowing(data.user.isFollowing);
      } catch (err) {
        toast.error("User not found");
        navigate("/problems");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [targetUsername, navigate, isOwnProfile, currentUser]);

  const stats = statsData || profileUser?.stats || {};
  // const favorites = profileUser?.favorites || [];

  const [form, setForm] = useState({
    name: "",
    username: "",
    bio: "",
    profileImage: "",
    socialLinks: { github: "", linkedin: "", twitter: "", website: "" },
  });

  useEffect(() => {
    if (profileUser && isOwnProfile) {
      setForm({
        name: profileUser.name || "",
        username: profileUser.username || "",
        bio: profileUser.bio || "",
        profileImage: profileUser.profileImage || "",
        socialLinks: {
          github: profileUser.socialLinks?.github || "",
          linkedin: profileUser.socialLinks?.linkedin || "",
          twitter: profileUser.socialLinks?.twitter || "",
          website: profileUser.socialLinks?.website || "",
        },
      });
    }
  }, [profileUser, isOwnProfile]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be under 2MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () =>
      setForm((f) => ({ ...f, profileImage: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await axiosInstance.put("/auth/me", form);
      await refreshAuth();
      setProfileUser((prev) => ({ ...prev, ...data.user }));
      setEditing(false);
      toast.success("Profile updated!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleFollow = async () => {
    if (!profileUser) return;
    try {
      const { data } = await axiosInstance.post(
        `/auth/user/${profileUser.id}/follow`,
      );
      setFollowing(data.isFollowing);
      setProfileUser((prev) => ({
        ...prev,
        followersCount: data.followersCount,
      }));
      toast.success(
        data.isFollowing
          ? `Following ${profileUser.name}`
          : `Unfollowed ${profileUser.name}`,
      );
    } catch (err) {
      toast.error("Failed to update follow status");
    }
  };

  const handleShowList = async (type) => {
    setShowFollowList(true);
    setFollowListType(type);
    setFollowListLoading(true);
    try {
      const { data } = await axiosInstance.get(
        `/auth/user/${targetUsername}/${type}`,
      );
      setFollowListData(type === "followers" ? data.followers : data.following);
    } catch (err) {
      toast.error(`Failed to fetch ${type}`);
    } finally {
      setFollowListLoading(false);
    }
  };

  const handleToggleFollowInList = async (userInList) => {
    try {
      const { data } = await axiosInstance.post(
        `/auth/user/${userInList.id}/follow`,
      );
      setFollowListData((prev) =>
        prev.map((u) =>
          u.id === userInList.id ? { ...u, isFollowing: data.isFollowing } : u,
        ),
      );
    } catch (err) {
      toast.error("Failed to update follow status");
    }
  };

  const tabs = ["Recent AC", "List", "Solutions", "Discuss"];

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#050505",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Loader2
          size={32}
          className="animate-spin"
          color="var(--accent-violet)"
        />
      </div>
    );
  }

  const userToShow = profileUser;
  // Note: we'll use local stats for now as userToShow has them.
  // For activity heatmap and history, we'd ideally fetch them for the target user too.
  // But let's assume we use the existing hooks which might need userId.
  // For simplicity, we'll just show what we have in userToShow.

  return (
    <div
      style={{ minHeight: "100vh", background: "#050505", color: "#f0f0f0" }}
    >
      <Navbar />

      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "40px clamp(16px, 4vw, 48px)",
        }}
      >
        <div
          style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 40 }}
        >
          {/* ─── Sidebar ─────────────────────────────── */}
          <aside>
            <motion.div
              {...fadeUp(0)}
              style={{
                // backgroundColor: "red",
                display: "flex",
                flexDirection: "column",
                gap: 0,
              }}
            >
              {/* Avatar */}
              <div className="flex gap-5">
                <div
                  style={{
                    
                    position: "relative",
                    width: "fit-content",
                    marginBottom: 16,
                  }}
                >
                  {isOwnProfile ? (
                    form.profileImage ? (
                      <img
                        src={form.profileImage}
                        alt={form.name}
                        style={{
                          width: 100,
                          height: 100,
                          borderRadius: 16,
                          objectFit: "cover",
                          border: "2px solid rgba(255,255,255,0.08)",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: 100,
                          height: 100,
                          borderRadius: 16,
                          background:
                            "linear-gradient(135deg, #7c5bf0, #818cf8)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 36,
                          fontWeight: 800,
                          color: "white",
                        }}
                      >
                        {userToShow?.name?.[0]?.toUpperCase()}
                      </div>
                    )
                  ) : userToShow?.profileImage ? (
                    <img
                      src={userToShow.profileImage}
                      alt={userToShow.name}
                      style={{
                        width: 100,
                        height: 100,
                        borderRadius: 16,
                        objectFit: "cover",
                        border: "2px solid rgba(255,255,255,0.08)",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 100,
                        height: 100,
                        borderRadius: 16,
                        background: "linear-gradient(135deg, #7c5bf0, #818cf8)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 36,
                        fontWeight: 800,
                        color: "white",
                      }}
                    >
                      {userToShow?.name?.[0]?.toUpperCase()}
                    </div>
                  )}
                  {editing && (
                    <>
                      <button
                        onClick={() => fileRef.current?.click()}
                        style={{
                          position: "absolute",
                          bottom: -4,
                          right: -4,
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          background: "#818cf8",
                          border: "2px solid #050505",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                        }}
                      >
                        <Camera size={12} color="white" />
                      </button>
                      <input
                        ref={fileRef}
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={handleImageChange}
                      />
                    </>
                  )}
                </div>

                <div>
                  {/* Name & Username */}
                  <h1
                    style={{
                      fontSize: 20,
                      fontWeight: 800,
                      letterSpacing: "-0.02em",
                      marginBottom: 2,
                    }}
                  >
                    {userToShow?.name}
                  </h1>
                  <p
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 13,
                      color: "#6b7280",
                      marginBottom: 12,
                    }}
                  >
                    @{userToShow?.username}
                  </p>

                  {/* Rank */}
                  <p
                    style={{ fontSize: 13, color: "#9ca3af", marginBottom: 8 }}
                  >
                    Rank{" "}
                    <span
                      style={{
                        color: "white",
                        fontWeight: 700,
                        fontFamily: "'JetBrains Mono', monospace",
                      }}
                    >
                      ~5,000,000
                    </span>
                  </p>
                </div>
              </div>

              {/* Following / Followers */}
              <div
                style={{
                  display: "flex",
                  gap: 16,
                  fontSize: 12,
                  marginBottom: 16,
                }}
              >
                <div
                  onClick={() => handleShowList("following")}
                  style={{ cursor: "pointer" }}
                  className="flex gap-1 justify-center items-center group"
                >
                  <strong
                    style={{ color: "white", fontSize: "14px" }}
                    className="group-hover:text-[#10b981] transition-colors"
                  >
                    {userToShow?.followingCount || 0}
                  </strong>{" "}
                  <span style={{ color: "#6b7280", fontSize: "14px" }}>
                    Following
                  </span>
                </div>
                <div
                  onClick={() => handleShowList("followers")}
                  style={{ cursor: "pointer" }}
                  className="flex gap-1 justify-center items-center group"
                >
                  <strong
                    style={{ color: "white", fontSize: "14px" }}
                    className="group-hover:text-[#10b981] transition-colors"
                  >
                    {userToShow?.followersCount || 0}
                  </strong>{" "}
                  <span style={{ color: "#6b7280", fontSize: "14px" }}>
                    Followers
                  </span>
                </div>
              </div>

              {/* Action Button: Edit or Follow */}
              {isOwnProfile ? (
                !editing ? (
                  <button
                    onClick={() => setEditing(true)}
                    style={{
                      width: "100%",
                      padding: "8px 0",
                      borderRadius: 8,
                      background: "rgba(16,185,129,0.1)",
                      color: "#10b981",
                      border: "1px solid rgba(16,185,129,0.2)",
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: "pointer",
                      transition: "all 0.2s",
                      marginBottom: 16,
                    }}
                  >
                    Edit Profile
                  </button>
                ) : (
                  <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                    <button
                      onClick={() => setEditing(false)}
                      className="btn btn-sm btn-ghost"
                      style={{ flex: 1 }}
                    >
                      <X size={13} />
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="btn btn-sm btn-primary"
                      style={{ flex: 1 }}
                    >
                      {saving ? (
                        <div
                          className="spinner"
                          style={{ width: 14, height: 14 }}
                        />
                      ) : (
                        <Check size={13} />
                      )}
                      Save
                    </button>
                  </div>
                )
              ) : (
                <button
                  onClick={handleToggleFollow}
                  style={{
                    width: "100%",
                    padding: "10px 0",
                    borderRadius: 10,
                    background: following
                      ? "rgba(255,255,255,0.05)"
                      : "#10b981",
                    color: following ? "white" : "white",
                    border: "none",
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    transition: "all 0.2s",
                    marginBottom: 16,
                  }}
                >
                  {following ? (
                    <>
                      <UserMinus size={16} /> Unfollow
                    </>
                  ) : (
                    <>
                      <UserPlus size={16} /> Follow
                    </>
                  )}
                </button>
              )}

              {/* Location */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 12,
                  color: "#6b7280",
                  marginBottom: 24,
                }}
              >
                <MapPin size={14} /> India
              </div>

              {/* Bio if exists */}
              {userToShow?.bio && (
                <div
                  style={{
                    fontSize: 13,
                    color: "#9ca3af",
                    marginBottom: 24,
                    lineHeight: 1.5,
                  }}
                >
                  {userToShow.bio}
                </div>
              )}

              {/* Divider */}
              <div
                style={{
                  height: 1,
                  background: "rgba(255,255,255,0.05)",
                  marginBottom: 24,
                }}
              />

              {/* Community Stats */}
              <h3
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#6b7280",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  marginBottom: 16,
                }}
              >
                Community Stats
              </h3>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                  marginBottom: 24,
                }}
              >
                {[
                  { icon: <Eye size={14} />, label: "Views", color: "#38bdf8" },
                  {
                    icon: <Award size={14} />,
                    label: "Solution",
                    color: "#10b981",
                  },
                  {
                    icon: <MessageSquare size={14} />,
                    label: "Discuss",
                    color: "#f59e0b",
                  },
                  {
                    icon: <Star size={14} />,
                    label: "Reputation",
                    color: "#818cf8",
                  },
                ].map(({ icon, label, color }) => (
                  <div
                    key={label}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        fontSize: 12,
                        color: "#9ca3af",
                      }}
                    >
                      <span style={{ color }}>{icon}</span> {label}
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: "white",
                        }}
                      >
                        0
                      </div>
                      <div style={{ fontSize: 10, color: "#4b5563" }}>
                        Last week 0
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Divider */}
              <div
                style={{
                  height: 1,
                  background: "rgba(255,255,255,0.05)",
                  marginBottom: 24,
                }}
              />

              {/* Languages */}
              <h3
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#6b7280",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  marginBottom: 12,
                }}
              >
                Languages
              </h3>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span
                  style={{
                    padding: "4px 10px",
                    borderRadius: 6,
                    fontSize: 11,
                    background: "rgba(255,255,255,0.05)",
                    color: "#9ca3af",
                    fontWeight: 500,
                  }}
                >
                  Java
                </span>
                <span style={{ fontSize: 11, color: "#4b5563" }}>
                  {userToShow?.stats?.problemsSolved || 0} problems solved
                </span>
              </div>
            </motion.div>
          </aside>

          {/* ─── Main Content ────────────────────────── */}
          <main style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {showFollowList ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                style={{
                  background: "#111111",
                  borderRadius: 16,
                  border: "1px solid rgba(255,255,255,0.05)",
                  minHeight: 500,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* Header Row */}
                <div
                  style={{
                    padding: "20px 24px",
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <button
                    onClick={() => setShowFollowList(false)}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      background: "rgba(255,255,255,0.04)",
                      border: "none",
                      color: "#9ca3af",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background =
                        "rgba(255,255,255,0.08)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background =
                        "rgba(255,255,255,0.04)")
                    }
                  >
                    <ChevronLeft size={18} />
                  </button>
                </div>

                {/* Tabs Row */}
                <div
                  style={{
                    padding: "16px 24px",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <button
                    onClick={() => handleShowList("following")}
                    style={{
                      background: followListType === "following" ? "rgba(255,255,255,0.05)" : "none",
                      border: followListType === "following" ? "1px solid rgba(255,255,255,0.4)" : "1px solid transparent",
                      borderRadius: 8,
                      fontSize: 13,
                      fontWeight: 600,
                      color: followListType === "following" ? "white" : "#6b7280",
                      cursor: "pointer",
                      padding: "6px 16px",
                      transition: "all 0.2s",
                    }}
                  >
                    Following
                  </button>
                  <button
                    onClick={() => handleShowList("followers")}
                    style={{
                      background: followListType === "followers" ? "rgba(255,255,255,0.05)" : "none",
                      border: followListType === "followers" ? "1px solid rgba(255,255,255,0.4)" : "1px solid transparent",
                      borderRadius: 8,
                      fontSize: 13,
                      fontWeight: 600,
                      color: followListType === "followers" ? "white" : "#6b7280",
                      cursor: "pointer",
                      padding: "6px 16px",
                      transition: "all 0.2s",
                    }}
                  >
                    Followers
                  </button>
                </div>

                <div
                  style={{
                    height: 1,
                    background: "rgba(255,255,255,0.05)",
                    marginBottom: 16,
                  }}
                />

                {/* List Content */}
                <div style={{ flex: 1, padding: "0 24px 24px" }}>
                  {followListLoading ? (
                    <div
                      style={{
                        height: 200,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Loader2
                        className="animate-spin"
                        size={24}
                        color="#4b5563"
                      />
                    </div>
                  ) : followListData.length > 0 ? (
                    <div
                      style={{ display: "flex", flexDirection: "column", gap: 12 }}
                    >
                      {followListData.map((u) => (
                        <div
                          key={u.id}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "12px 16px",
                            borderRadius: 12,
                            background: "rgba(255,255,255,0.02)",
                            border: "1px solid rgba(255,255,255,0.04)",
                          }}
                        >
                          <div
                            onClick={() => {
                              navigate(`/u/${u.username}`);
                              setShowFollowList(false);
                            }}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 12,
                              cursor: "pointer",
                            }}
                            className="group/item"
                          >
                            {u.profileImage ? (
                              <img
                                src={u.profileImage}
                                alt={u.name}
                                style={{
                                  width: 40,
                                  height: 40,
                                  borderRadius: "50%",
                                  objectFit: "cover",
                                }}
                              />
                            ) : (
                              <div
                                style={{
                                  width: 40,
                                  height: 40,
                                  borderRadius: "50%",
                                  background:
                                    "linear-gradient(135deg, #7c5bf0, #818cf8)",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: 14,
                                  fontWeight: 700,
                                  color: "white",
                                }}
                              >
                                {u.name?.[0]?.toUpperCase()}
                              </div>
                            )}
                            <div>
                              <div
                                style={{
                                  fontSize: 14,
                                  fontWeight: 600,
                                  color: "white",
                                }}
                                className="group-hover/item:text-[#10b981] transition-colors"
                              >
                                {u.name}
                              </div>
                              <div
                                style={{
                                  fontSize: 12,
                                  color: "#6b7280",
                                  fontFamily: "'JetBrains Mono', monospace",
                                }}
                              >
                                @{u.username}
                              </div>
                            </div>
                          </div>

                          {currentUser?.id !== u.id && (
                            <button
                              onClick={() => handleToggleFollowInList(u)}
                              style={{
                                padding: "6px 16px",
                                borderRadius: 8,
                                background: u.isFollowing
                                  ? "rgba(255,255,255,0.05)"
                                  : "#10b981",
                                color: "white",
                                border: "none",
                                fontSize: 13,
                                fontWeight: 700,
                                cursor: "pointer",
                                transition: "all 0.2s",
                              }}
                            >
                              {u.isFollowing ? "Unfollow" : "+ Follow"}
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div
                      style={{
                        height: 200,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#4b5563",
                        fontSize: 14,
                        fontStyle: "italic",
                      }}
                    >
                      No {followListType} found.
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <>
                {/* Top Row: Gauge & Badges */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 20,
                  }}
                >
                  <motion.div {...fadeUp(0.1)}>
                    <ProgressGauge
                      solved={stats.totalSolved || 0}
                      total={stats.totalProblems || 0}
                      easy={stats.byDifficulty?.Easy || 0}
                      medium={stats.byDifficulty?.Medium || 0}
                      hard={stats.byDifficulty?.Hard || 0}
                      totalEasy={stats.totalByDifficulty?.Easy || 0}
                      totalMedium={stats.totalByDifficulty?.Medium || 0}
                      totalHard={stats.totalByDifficulty?.Hard || 0}
                    />
                  </motion.div>

                  <motion.div
                    {...fadeUp(0.2)}
                    style={{
                      background: "#111111",
                      borderRadius: 16,
                      border: "1px solid rgba(255,255,255,0.05)",
                      padding: 24,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: 10,
                          fontWeight: 700,
                          color: "#6b7280",
                          letterSpacing: "0.06em",
                          textTransform: "uppercase",
                          marginBottom: 4,
                        }}
                      >
                        Badges
                      </div>
                      <div
                        style={{ fontSize: 36, fontWeight: 800, color: "white" }}
                      >
                        0
                      </div>
                    </div>

                    <div style={{ marginTop: "auto" }}>
                      <div
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: 10,
                          fontWeight: 700,
                          color: "#6b7280",
                          letterSpacing: "0.06em",
                          textTransform: "uppercase",
                          marginBottom: 10,
                        }}
                      >
                        Locked Badge
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          cursor: "pointer",
                        }}
                      >
                        <div
                          style={{
                            width: 44,
                            height: 44,
                            borderRadius: "50%",
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.08)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            opacity: 0.5,
                          }}
                        >
                          <Award size={18} color="#4b5563" />
                        </div>
                        <span
                          style={{
                            fontSize: 13,
                            fontWeight: 700,
                            color: "#6b7280",
                          }}
                        >
                          May LeetCoding Challenge
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Heatmap Section */}
                <motion.div {...fadeUp(0.3)}>
                  <ProfileActivity activityMap={activityData?.activity || {}} />
                </motion.div>

                {/* Recent Activity Tabs */}
                <motion.div
                  {...fadeUp(0.4)}
                  style={{
                    background: "#111111",
                    borderRadius: 16,
                    border: "1px solid rgba(255,255,255,0.05)",
                    overflow: "hidden",
                  }}
                >
                  {/* Tab bar */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      borderBottom: "1px solid rgba(255,255,255,0.05)",
                      padding: "0 20px",
                    }}
                  >
                    {tabs.map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{
                          padding: "14px 16px",
                          fontSize: 12,
                          fontWeight: 700,
                          color: activeTab === tab ? "white" : "#6b7280",
                          background: "none",
                          border: "none",
                          borderBottom:
                            activeTab === tab
                              ? "2px solid #818cf8"
                              : "2px solid transparent",
                          cursor: "pointer",
                          transition: "all 0.2s",
                        }}
                      >
                        {tab}
                      </button>
                    ))}
                    <span
                      style={{
                        marginLeft: "auto",
                        fontSize: 11,
                        color: "#4b5563",
                        cursor: "pointer",
                        fontWeight: 500,
                      }}
                    >
                      View all submissions ›
                    </span>
                  </div>

                  {/* Submission list */}
                  <div>
                    {submissions.length > 0 ? (
                      submissions.map((sub) => (
                        <div
                          key={sub._id}
                          style={{
                            padding: "14px 20px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            borderBottom: "1px solid rgba(255,255,255,0.03)",
                            cursor: "pointer",
                            transition: "background 0.2s",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.background =
                              "rgba(255,255,255,0.02)")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.background = "transparent")
                          }
                        >
                          <span
                            style={{
                              fontSize: 13,
                              fontWeight: 600,
                              color: "rgba(255,255,255,0.9)",
                            }}
                          >
                            {sub.problemId?.title}
                          </span>
                          <span
                            style={{
                              fontSize: 11,
                              color: "#4b5563",
                              fontFamily: "'JetBrains Mono', monospace",
                            }}
                          >
                            {sub.createdAt &&
                              new Date(sub.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div
                        style={{
                          padding: "40px 20px",
                          textAlign: "center",
                          fontSize: 13,
                          color: "#4b5563",
                          fontStyle: "italic",
                        }}
                      >
                        No activity yet.
                      </div>
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
