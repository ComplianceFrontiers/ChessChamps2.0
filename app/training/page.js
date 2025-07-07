'use client';

import React, { useState } from 'react';

const Training = () => {
    const [activeTab, setActiveTab] = useState('upcoming'); // ✅ Correct



    const upcomingSessions = [
        { date: '25-July-2025', topic: 'Basics of Chess', coach: 'GM Sergey Kasparov' },
        { date: '27-July-2025', topic: 'Basics of Chess', coach: 'GM Sergey Kasparov' },
        { date: '29-July-2025', topic: 'Basics of Chess', coach: 'GM Sergey Kasparov' },
        { date: '31-July-2025', topic: 'Basics of Chess', coach: 'GM Sergey Kasparov' },
    ];

    return (
        <div style={{ backgroundColor: '#0D2649', color: 'white', minHeight: '100vh', padding: '2rem', fontFamily: 'sans-serif' }}>
            <h1 style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '2rem', marginBottom: '1rem' }}>TRAINING SCHEDULE</h1>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid #ccc', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
                <span
                    style={{
                        fontWeight: activeTab === 'upcoming' ? 'bold' : 'normal',
                        borderBottom: activeTab === 'upcoming' ? '3px solid white' : 'none',
                        cursor: 'pointer'
                    }}
                    onClick={() => setActiveTab('upcoming')}
                >
                    Upcoming Sessions
                </span>
                <span
                    style={{
                        fontWeight: activeTab === 'past' ? 'bold' : 'normal',
                        borderBottom: activeTab === 'past' ? '3px solid white' : 'none',
                        cursor: 'pointer'
                    }}
                    onClick={() => setActiveTab('past')}
                >
                    Past Sessions
                </span>
            </div>

            {/* Session List */}
            {activeTab === 'upcoming' && upcomingSessions.map((session, index) => (
                <div key={index} style={{
                    backgroundColor: 'white',
                    color: '#0D2649',
                    marginBottom: '1rem',
                    padding: '1rem',
                    borderRadius: '5px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <span style={{ fontSize: '1.2rem' }}>{`${session.date} | ${session.topic} | ${session.coach}`}</span>
                    <button style={{
                        backgroundColor: '#6A5841',
                        color: 'white',
                        border: 'none',
                        borderRadius: '25px',
                        padding: '0.5rem 1.5rem',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}>
                        JOIN
                    </button>
                </div>
            ))}

            {/* Past Sessions Placeholder */}
            {activeTab === 'past' && (
                <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                    <p>No past sessions available yet.</p>
                </div>
            )}
        </div>
    );
};

export default Training;
