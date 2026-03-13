import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { briefList } from '../../data/aboutData';

const AboutContent: React.FC = () => {
    const [selectedTab, setSelectedTab] = useState<number>(0);

    return (
        <div style={{ marginBottom: '2rem' }}>
            {/* Tab buttons */}
            <div
                style={{
                    display: 'flex',
                    gap: '0.25rem',
                    marginBottom: '1.5rem',
                    overflowX: 'auto',
                    WebkitOverflowScrolling: 'touch',
                    scrollbarWidth: 'none',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                }}
            >
                {briefList.map(({ audience }, index) => {
                    const isActive = selectedTab === index;
                    return (
                        <button
                            key={index}
                            onClick={() => setSelectedTab(index)}
                            style={{
                                padding: '0.5rem 1.25rem',
                                fontSize: 'clamp(0.78rem, 1.2vw, 0.95rem)',
                                fontWeight: 600,
                                background: 'none',
                                border: 'none',
                                borderBottom: isActive
                                    ? '3px solid var(--color-primary)'
                                    : '3px solid transparent',
                                color: isActive
                                    ? 'var(--color-primary)'
                                    : 'var(--color-text-secondary)',
                                cursor: 'pointer',
                                transition: 'color 0.2s, border-color 0.2s',
                                whiteSpace: 'nowrap',
                                fontFamily: 'inherit',
                            }}
                            aria-selected={isActive}
                            role="tab"
                        >
                            {audience}
                        </button>
                    );
                })}
            </div>

            {/* Tab content */}
            <div role="tabpanel" style={{ padding: '0.5rem 0.5rem' }}>
                <AnimatePresence mode="wait">
                    <motion.p
                        key={selectedTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.25 }}
                        style={{
                            lineHeight: 1.7,
                            color: 'var(--color-text-secondary)',
                            fontSize: 'clamp(0.9rem, 1.3vw, 1.1rem)',
                            textAlign: 'justify',
                            maxWidth: '100%',
                        }}
                    >
                        {briefList[selectedTab].brief}
                    </motion.p>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default AboutContent;
