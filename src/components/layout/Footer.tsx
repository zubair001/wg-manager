export default function Footer() {
  return (
    <footer className="h-12 border-t text-sm text-center flex items-center justify-center bg-white text-muted-foreground">
      &copy; {new Date().getFullYear()} Zubair Hossain
    </footer>
  );
}
