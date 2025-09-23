"use client"
import React, { useState } from 'react';

const QUOTES = [
    "Of all creatures that breathe and move upon the earth, nothing is bred that is weaker than man.",
    "There is a time for many words, and there is also a time for sleep.",
    "There is nothing more admirable than when two people who see eye to eye keep house as man and wife, confounding their enemies and delighting their friends.",
    "A man who has been through bitter experiences and travelled far enjoys even his sufferings after a time",
    "Be strong, saith my heart; I am a soldier; I have seen worse sights than this.",
    "Men are so quick to blame the gods: they say that we devise their misery. But they themselves- in their depravity- design grief greater than the griefs that fate assigns.",
    "My name is Nobody.",
    "I won't scatter your sorrow to the heartless sea. I will always be with you. Plant your roots in me. I won't see you end as ashes. You're all diamonds.",
];

function getRandomQuotes(count: number): string[] {
    const shuffled = QUOTES.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

const Quotes: React.FC = () => {
    const [quotes, setQuotes] = useState<string[]>(getRandomQuotes(2));

    const handleGenerate = () => {
        setQuotes(getRandomQuotes(2));
    };

    return (
        <div style={{ maxWidth: 2500, margin: '2rem auto', textAlign: 'center' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>Odyssey Quotes</h2>
            <div
            style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'stretch',
                marginBottom: '1rem',
                gap: '3rem',
                padding: '0 1rem',
            }}
            >
            <textarea
                value={quotes[0]}
                readOnly
                rows={6}
                style={{
                flex: 1,
                marginRight: '0.5rem',
                minHeight: '120px',
                fontSize: '1.1rem',
                minWidth: '350px',
                width: '100%',
                resize: 'none',
                }}
            />
            <textarea
                value={quotes[1]}
                readOnly
                rows={6}
                style={{
                flex: 1,
                marginLeft: '0.5rem',
                minHeight: '120px',
                fontSize: '1.1rem',
                minWidth: '350px',
                width: '100%',
                resize: 'none',
                }}
            />
            </div>
            <button
                onClick={handleGenerate}
                style={{
                    backgroundColor: 'black',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '6px',
                    fontSize: '1rem',
                    cursor: 'pointer',
                }}
            >
                Generate New Quotes
            </button>
        </div>
    );
};

export default Quotes;