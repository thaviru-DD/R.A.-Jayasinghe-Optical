import { EyeMark } from "@/components/EyeMark";

export default function Loading() {
  return (
    <div className="grid min-h-[50vh] place-items-center" role="status" aria-label="Loading">
      <EyeMark className="blink h-16 w-32 text-navy" />
    </div>
  );
}
