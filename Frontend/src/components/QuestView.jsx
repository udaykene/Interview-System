import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Flame,
  Trophy,
  Target,
  Zap,
  Award,
  Star,
  Crown,
  Gem,
  Shield,
  ArrowRight,
  CheckCircle2,
  Circle,
  Play,
  Sparkles,
  Loader2,
  Compass,
} from "lucide-react";
import {
  useQuests,
  useClaimDailyQuest,
  useClaimWeeklyBounty,
  useClaimAdminQuest,
} from "../hooks/useQuests";

function QuestView() {
  const navigate = useNavigate();
  const { data, isLoading, error } = useQuests();
  
  const claimDaily = useClaimDailyQuest();
  const claimWeekly = useClaimWeeklyBounty();
  const claimQuest = useClaimAdminQuest();

  const getRankIcon = (level) => {
    switch (level) {
      case 5:
        return <Gem size={32} color="#f59e0b" className="animate-pulse" />;
      case 4:
        return <Crown size={32} color="#8b5cf6" />;
      case 3:
        return <Star size={32} color="#3b82f6" />;
      case 2:
        return <Shield size={32} color="#10b981" />;
      default:
        return <Award size={32} color="#6b7280" />;
    }
  };

  const getDifficultyColor = (diff) => {
    const d = diff?.toLowerCase();
    if (d === "easy") return "#00b8a3";
    if (d === "medium") return "#ffc01e";
    return "#ff375f";
  };

  if (isLoading) {
    return (
      <div style={{ height: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Loader2 size={36} className="animate-spin" color="var(--accent-violet)" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="card" style={{ maxWidth: 520, margin: "64px auto", padding: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>Failed to load Quests</h2>
        <p style={{ color: "var(--text-muted)" }}>{error?.response?.data?.message || "Please try again later."}</p>
      </div>
    );
  }

  const { daily, weeklyBounties, quests, user } = data || {};
  const isDailySolved = daily?.solved;
  // If the user's last active date is today, they've claimed the daily quest today
  const todayStr = new Date().toISOString().split("T")[0];
  const isDailyClaimed = user?.lastActiveDate === todayStr;

  // Calculate percentage of progress to next level
  const rank = user?.rank || { level: 1, title: "Array Squire", next: 500, color: "#6b7280" };
  const currentXp = user?.xp || 0;
  const levelXpFloor =
    rank.level === 5 ? 5000 : rank.level === 4 ? 3000 : rank.level === 3 ? 1500 : rank.level === 2 ? 500 : 0;
  const levelXpCeil = rank.next || 5000;
  const levelXpRange = levelXpCeil - levelXpFloor;
  const progressXp = currentXp - levelXpFloor;
  const progressPercentage = rank.level === 5 ? 100 : Math.max(0, Math.min(100, Math.round((progressXp / levelXpRange) * 100)));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      {/* HEADER SECTION: Rank & Streak */}
      <div
        className="glass"
        style={{
          padding: 24,
          borderRadius: 16,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 24,
          background: "linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.01) 100%)",
        }}
      >
        {/* User Rank Card */}
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
            }}
          >
            {getRankIcon(rank.level)}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: rank.color, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Level {rank.level}
              </span>
              <span style={{ width: 4, height: 4, borderRadius: "50%", background: "rgba(255,255,255,0.2)" }} />
              <span style={{ fontSize: 13, color: "var(--text-muted)" }}>{rank.title}</span>
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 800, marginTop: 2, color: "white" }}>
              {currentXp} <span style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 500 }}>XP Total</span>
            </h2>

            {/* Progress Bar */}
            <div style={{ marginTop: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--text-muted)", marginBottom: 4 }}>
                <span>{progressPercentage}% to next rank</span>
                {rank.level < 5 && <span>{currentXp}/{rank.next} XP</span>}
              </div>
              <div style={{ width: "100%", height: 6, background: "rgba(255,255,255,0.05)", borderRadius: 99, overflow: "hidden" }}>
                <div
                  style={{
                    width: `${progressPercentage}%`,
                    height: "100%",
                    background: rank.color,
                    borderRadius: 99,
                    transition: "width 0.4s ease",
                    boxShadow: `0 0 10px ${rank.color}88`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Streak Card */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 24px",
            borderRadius: 16,
            background: "rgba(249, 115, 22, 0.03)",
            border: "1px solid rgba(249, 115, 22, 0.1)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: "rgba(249, 115, 22, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Flame size={24} color="#f97316" className={user?.streak > 0 ? "animate-pulse" : ""} fill={user?.streak > 0 ? "#f97316" : "none"} />
            </div>
            <div>
              <span style={{ fontSize: 12, color: "#f97316", fontWeight: 700, textTransform: "uppercase" }}>Streak Counter</span>
              <h3 style={{ fontSize: 22, fontWeight: 900, color: "white", marginTop: 1 }}>
                {user?.streak || 0} {user?.streak === 1 ? "Day" : "Days"}
              </h3>
            </div>
          </div>
          <div style={{ fontSize: 12, color: "var(--text-muted)", textAlign: "right" }}>
            {isDailyClaimed ? (
              <span style={{ color: "#10b981", fontWeight: 600 }}>Daily Quest Completed!</span>
            ) : (
              <span>Solve the Daily Quest to maintain streak!</span>
            )}
          </div>
        </div>
      </div>

      {/* CORE WORKSPACE GRID */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24, alignItems: "start" }}>
        {/* LEFT COLUMN: Quests & Daily */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Daily Quest Section */}
          <div
            className="glass"
            style={{
              padding: 24,
              borderRadius: 16,
              border: "1px solid rgba(138, 5, 255, 0.15)",
              background: "linear-gradient(135deg, rgba(138, 5, 255, 0.05) 0%, rgba(5, 5, 5, 0) 100%)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                width: 150,
                height: 150,
                background: "radial-gradient(circle, rgba(138, 5, 255, 0.1) 0%, transparent 70%)",
                pointerEvents: "none",
              }}
            />

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <Sparkles size={14} color="#8a05ff" />
                  <span style={{ fontSize: 11, fontWeight: 800, color: "#8a05ff", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                    Daily Challenge
                  </span>
                </div>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: "white" }}>Problem of the Day</h2>
              </div>
              <div
                style={{
                  background: "rgba(138, 5, 255, 0.1)",
                  border: "1px solid rgba(138, 5, 255, 0.2)",
                  color: "#c995ff",
                  padding: "4px 10px",
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                +100 XP
              </div>
            </div>

            {daily?.problem ? (
              <div
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.05)",
                  padding: 20,
                  borderRadius: 12,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 16,
                }}
              >
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: "white", display: "flex", alignItems: "center", gap: 8 }}>
                    {daily.problem.title}
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: getDifficultyColor(daily.problem.difficulty),
                        background: `${getDifficultyColor(daily.problem.difficulty)}1a`,
                        padding: "2px 8px",
                        borderRadius: 4,
                      }}
                    >
                      {daily.problem.difficulty}
                    </span>
                  </h3>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 }}>
                    {daily.problem.tags?.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        style={{
                          fontSize: 11,
                          color: "var(--text-muted)",
                          background: "rgba(255,255,255,0.03)",
                          padding: "2px 6px",
                          borderRadius: 4,
                        }}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ display: "flex", gap: 12 }}>
                  <button
                    onClick={() => navigate(`/problem/${daily.problem.slug}`)}
                    className="btn"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      background: isDailySolved ? "rgba(255,255,255,0.05)" : "var(--accent-violet)",
                      color: "white",
                      border: "none",
                      padding: "10px 18px",
                      borderRadius: 8,
                      fontWeight: 600,
                      cursor: "pointer",
                      fontSize: 13,
                    }}
                  >
                    <Play size={14} fill={isDailySolved ? "none" : "white"} />
                    {isDailySolved ? "Practice Again" : "Solve Problem"}
                  </button>

                  {isDailySolved && (
                    <button
                      onClick={() => claimDaily.mutate()}
                      disabled={isDailyClaimed || claimDaily.isPending}
                      style={{
                        background: isDailyClaimed ? "rgba(16, 185, 129, 0.1)" : "var(--accent-green)",
                        color: isDailyClaimed ? "#10b981" : "white",
                        border: isDailyClaimed ? "1px solid rgba(16, 185, 129, 0.2)" : "none",
                        padding: "10px 18px",
                        borderRadius: 8,
                        fontWeight: 600,
                        cursor: isDailyClaimed || claimDaily.isPending ? "default" : "pointer",
                        fontSize: 13,
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      {claimDaily.isPending ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : isDailyClaimed ? (
                        <>
                          <CheckCircle2 size={14} /> Claimed
                        </>
                      ) : (
                        "Claim XP"
                      )}
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div style={{ color: "var(--text-muted)", fontSize: 13, padding: "20px 0" }}>
                No daily challenge available. Make sure problems are seeded.
              </div>
            )}
          </div>

          {/* Admin Created Quests Section */}
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: "white", marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
              <Compass size={20} color="var(--accent-indigo)" />
              Active Quests
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {quests && quests.length > 0 ? (
                quests.map((quest) => {
                  const percent = quest.targetCount > 0 ? Math.round((quest.progress / quest.targetCount) * 100) : 0;
                  return (
                    <div
                      key={quest._id}
                      className="glass"
                      style={{
                        padding: 20,
                        borderRadius: 12,
                        display: "flex",
                        flexDirection: "column",
                        gap: 14,
                        borderLeft: `4px solid ${quest.color || "#8b5cf6"}`,
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
                        <div>
                          <h4 style={{ fontSize: 15, fontWeight: 700, color: "white" }}>{quest.title}</h4>
                          <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>{quest.description}</p>
                          {quest.targetProblem && (
                            <span
                              onClick={() => navigate(`/problem/${quest.targetProblem.slug}`)}
                              style={{
                                fontSize: 11,
                                color: "var(--accent-indigo)",
                                marginTop: 6,
                                display: "inline-block",
                                cursor: "pointer",
                                textDecoration: "underline",
                              }}
                            >
                              Target Problem: {quest.targetProblem.title}
                            </span>
                          )}
                        </div>

                        {/* Rewards */}
                        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                          <span style={{ fontSize: 11, fontWeight: 600, background: "rgba(255,255,255,0.03)", padding: "4px 8px", borderRadius: 6, color: "var(--text-secondary)" }}>
                            +{quest.xpReward} XP
                          </span>
                          {quest.badgeReward && (
                            <span
                              title={`Awards Badge: ${quest.badgeReward.name}`}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 4,
                                fontSize: 11,
                                fontWeight: 600,
                                background: `${quest.badgeReward.color}15`,
                                border: `1px solid ${quest.badgeReward.color}30`,
                                padding: "4px 8px",
                                borderRadius: 6,
                                color: quest.badgeReward.color,
                              }}
                            >
                              🏆 {quest.badgeReward.name}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Progress Bar & Claim Button */}
                      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--text-muted)", marginBottom: 4 }}>
                            <span>Progress</span>
                            <span>
                              {quest.progress} / {quest.targetCount}
                            </span>
                          </div>
                          <div style={{ width: "100%", height: 4, background: "rgba(255,255,255,0.05)", borderRadius: 99, overflow: "hidden" }}>
                            <div
                              style={{
                                width: `${percent}%`,
                                height: "100%",
                                background: quest.color || "var(--accent-indigo)",
                                borderRadius: 99,
                              }}
                            />
                          </div>
                        </div>

                        <button
                          disabled={!quest.completed || claimQuest.isPending}
                          onClick={() => claimQuest.mutate(quest._id)}
                          style={{
                            background: quest.completed ? "var(--accent-violet)" : "rgba(255,255,255,0.02)",
                            color: quest.completed ? "white" : "var(--text-muted)",
                            border: quest.completed ? "none" : "1px solid rgba(255,255,255,0.05)",
                            padding: "8px 16px",
                            borderRadius: 8,
                            fontSize: 12,
                            fontWeight: 700,
                            cursor: quest.completed && !claimQuest.isPending ? "pointer" : "default",
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                          }}
                        >
                          {claimQuest.isPending ? <Loader2 size={12} className="animate-spin" /> : "Claim"}
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="glass" style={{ padding: 24, borderRadius: 12, color: "var(--text-muted)", textAlign: "center", fontSize: 13 }}>
                  No active quests from administration. Check back later!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Weekly Bounties */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: "white", display: "flex", alignItems: "center", gap: 10 }}>
            <Trophy size={20} color="var(--accent-yellow)" />
            Weekly Bounties
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {weeklyBounties && weeklyBounties.length > 0 ? (
              weeklyBounties.map((bounty) => {
                const percent = Math.round((bounty.progress / bounty.target) * 100);
                return (
                  <div
                    key={bounty.id}
                    className="glass"
                    style={{
                      padding: 16,
                      borderRadius: 12,
                      display: "flex",
                      flexDirection: "column",
                      gap: 12,
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <h4 style={{ fontSize: 14, fontWeight: 700, color: "white" }}>{bounty.title}</h4>
                        <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{bounty.description}</p>
                      </div>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          color: bounty.color,
                          background: `${bounty.color}15`,
                          padding: "2px 6px",
                          borderRadius: 4,
                        }}
                      >
                        +{bounty.xpReward} XP
                      </span>
                    </div>

                    {/* Progress details */}
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "var(--text-muted)", marginBottom: 4 }}>
                        <span>
                          {bounty.progress} / {bounty.target}
                        </span>
                        <span>{percent}%</span>
                      </div>
                      <div style={{ width: "100%", height: 4, background: "rgba(255,255,255,0.05)", borderRadius: 99, overflow: "hidden" }}>
                        <div
                          style={{
                            width: `${percent}%`,
                            height: "100%",
                            background: bounty.color,
                            borderRadius: 99,
                          }}
                        />
                      </div>
                    </div>

                    {bounty.completed && (
                      <button
                        onClick={() => claimWeekly.mutate(bounty.id)}
                        disabled={claimWeekly.isPending}
                        style={{
                          background: "var(--accent-yellow)",
                          color: "black",
                          border: "none",
                          padding: "6px 12px",
                          borderRadius: 6,
                          fontSize: 11,
                          fontWeight: 800,
                          cursor: claimWeekly.isPending ? "default" : "pointer",
                          marginTop: 4,
                          width: "100%",
                          textAlign: "center",
                        }}
                      >
                        {claimWeekly.isPending ? "Claiming..." : "Claim Bounty"}
                      </button>
                    )}
                  </div>
                );
              })
            ) : (
              <div style={{ color: "var(--text-muted)", fontSize: 12 }}>No weekly bounties generated.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuestView;
