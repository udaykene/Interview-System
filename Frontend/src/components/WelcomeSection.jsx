import { motion } from "framer-motion";

function WelcomeSection({ userName }) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <span className="mono-label" style={{ marginBottom: 8, display: 'block' }}>{greeting} 👋</span>
      <h1 style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-0.03em', color: 'white' }}>
        {userName || 'Coder'}
      </h1>
    </motion.div>
  );
}

export default WelcomeSection;
