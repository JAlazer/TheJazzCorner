import React from "react";
import Image from "next/image";

type PageHeaderProps = {
    title: string;
    subtitle?: string;
    description?: string;
    extra?: React.ReactNode;
};

const PageHeader: React.FC<PageHeaderProps> = ({
    title = "Welcome to the Jazz Corner",
    subtitle = "About the Jazz Corner",
    description = "The Jazz corner is the place to be when it comes to jazz, coding and good times. Through a thorough interview process, three members were chosen to work in the jazz corner. This page helps to introduce those members and some of their projects and interests.",
    extra,
}) => (
    <header
        style={{
            marginTop: '6rem',
            padding: '2rem 0',
            textAlign: 'center',
        }}
    >
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1rem',
                marginBottom: '1rem',
            }}
        >
            <Image
                src="https://static.thenounproject.com/png/28978-200.png"
                alt="Orca"
                width={60}
                height={60}
                style={{
                    objectFit: 'cover',
                    borderRadius: '8px',
                }}
                priority
            />
            <h1 style={{ margin: 0, fontSize: '3rem' }}>{title}</h1>
        </div>
        <h2 style={{ margin: '0.5rem 0', color: '#666', fontSize: '2rem' }}>{subtitle}</h2>
        <p style={{ margin: '1rem 0', color: '#888' }}>{description}</p>
        {extra}
    </header>
);

export default PageHeader;