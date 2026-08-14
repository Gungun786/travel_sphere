import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import type { Member } from '@/types';
import { formatINR } from './shared';

export function MemberCard({ member }: { member: Member }) {
  return (
    <Card className="p-5 transition-shadow hover:shadow-soft">
      <div className="flex items-start gap-4">
        <Avatar className="h-12 w-12">
          <AvatarFallback className={member.avatarColor}>
            {member.initials}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-base font-semibold">{member.name}</h3>
          <p className="truncate text-sm text-muted-foreground">
            {member.email}
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-3 text-sm">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Travel style
          </p>
          <p className="mt-0.5 font-medium">{member.travelStyle}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Interests
          </p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {member.interests.map((i) => (
              <Badge key={i} variant="secondary" className="font-normal">
                {i}
              </Badge>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Food
          </p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {member.food.map((f) => (
              <Badge key={f} variant="outline" className="font-normal">
                {f}
              </Badge>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-border pt-3">
          <span className="text-muted-foreground">Budget preference</span>
          <span className="font-medium">{formatINR(member.budgetPerPerson)}</span>
        </div>
      </div>
    </Card>
  );
}
