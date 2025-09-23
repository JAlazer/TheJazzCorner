import teamData from '@/data/team.json';
import Image from 'next/image';

export default function MeetTheTeam({ marginTop, title, subtitle, className }: {
  marginTop: string;
  title: string;
  subtitle: string;
  className: string;
}) {
  return (
    <div className={`p-10 ${className}`}>
        
      <h2 className="text-2xl font-bold mb-6 text-centers">{title}</h2>
      
      <div className="grid grid-cols-3 gap-6">
        {teamData.map((member) => (
          <div key={member.name} className="text-center p-4 bg-gray-50 rounded">
            <div className="w-20 h-20 mx-auto mb-4 relative overflow-hidden rounded-full">
              <Image 
                src={member.headshot} 
                alt={member.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="font-semibold">{member.name}</h3>
              <p className="text-gray-600">{member.major}</p>
              <p className="text-sm">Reading: {member.currently_reading}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}