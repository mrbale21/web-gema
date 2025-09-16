import * as Icons from "lucide-react";

export default function DynamicIcon({
  name,
  className,
}: {
  name?: string | null;
  className?: string;
}) {
  if (!name)
    return (
      <Icons.HelpCircle className={className || "w-6 h-6 text-gray-400"} />
    );
  const LucideIcon = (Icons as any)[name];
  if (!LucideIcon)
    return (
      <Icons.HelpCircle className={className || "w-6 h-6 text-gray-400"} />
    );
  return <LucideIcon className={className || "w-6 h-6 text-gray-700"} />;
}
