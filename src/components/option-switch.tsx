import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

type OptionSwitchProps = {
  checked: boolean;
  id: string;
  label: string;
  onCheckedChange: (checked: boolean) => void;
};

export function OptionSwitch({
  checked,
  id,
  label,
  onCheckedChange,
}: OptionSwitchProps) {
  return (
    <div className="inline-flex min-w-0 items-center gap-2 rounded-md border bg-background px-3 py-2">
      <Label htmlFor={id} className="truncate">
        {label}
      </Label>
      <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}
