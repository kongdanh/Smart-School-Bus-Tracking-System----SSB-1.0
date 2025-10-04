export default function Navbar({ title }: { title: string }) {
  return (
    <div className="w-full bg-blue-600 text-white p-4 font-bold shadow-md">
      {title}
    </div>
  );
}
