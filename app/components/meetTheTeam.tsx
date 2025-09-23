import teamData from '@/data/team.json';
import Image from 'next/image';

export default function MeetTheTeam({ marginTop, title, subtitle, className }: {
  marginTop: string;
  title: string;
  subtitle: string;
  className: string;
}) {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6 text-center">{title}</h2>
      
              <div className="grid grid-cols-3 gap-4">
        {teamData.map((member) => (
          <div key={member.name} className="text-center p-4 bg-slate-800 rounded-lg shadow-md hover:shadow-lg hover:-translate-y-2 transition-all duration-300">
            <div className="w-20 h-20 mx-auto mb-3 relative overflow-hidden rounded-full">
              <Image 
                src={member.headshot} 
                alt={member.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-white">{member.name}</h3>
              <p className="text-gray-300 text-xs font-medium">{member.major}</p>
              <div className="pt-2 border-t border-gray-700">
                <p className="text-xs text-gray-400 mb-1">Currently Reading:</p>
                <p className="text-xs text-gray-200 italic">{member.currently_reading}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}