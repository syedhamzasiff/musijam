import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom"; 

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-100 to-white">
      <header className="container mx-auto px-4 py-8">
        <nav className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-indigo-600">
            Musijam
          </Link>
          <div className="space-x-4">
            <Link to="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link to="/register">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </nav>
      </header>
      <main className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-bold text-indigo-800 mb-6">
          Share and Discover Music Together
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Create groups, share your favorite tracks, and vote on the next song to play. Musijam brings music lovers together in perfect harmony.
        </p>
        <Link to="/register">
          <Button size="lg" className="text-lg px-8 py-4">
            Get Started
          </Button>
        </Link>
      </main>
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-indigo-600 mb-4">Create Groups</h2>
            <p className="text-gray-600">Form music communities around your favorite genres or themes.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-indigo-600 mb-4">Share Tracks</h2>
            <p className="text-gray-600">Add YouTube or Spotify links to share your favorite songs with the group.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-indigo-600 mb-4">Vote and Play</h2>
            <p className="text-gray-600">Upvote songs to create a dynamic playlist that reflects the group's preferences.</p>
          </div>
        </div>
      </section>
      <footer className="container mx-auto px-4 py-8 text-center text-gray-600">
        <p>&copy; 2023 Musijam. All rights reserved.</p>
      </footer>
    </div>
  );
}
