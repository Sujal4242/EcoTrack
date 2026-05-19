import { usePrivy } from "@privy-io/react-auth";
import { Recycle, Shield, BarChart3, Truck } from "lucide-react";

const features = [
  { icon: BarChart3, text: "Track e-waste disposal in real time" },
  { icon: Shield,   text: "Secure, verified business accounts" },
  { icon: Truck,    text: "Manage pickups and disposal logs" },
  { icon: Recycle,  text: "Stay compliant with green standards" },
];

export default function LoginPage() {
  const { login } = usePrivy();

  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Left Panel */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-emerald-900/40 to-gray-950 flex-col justify-between p-12 border-r border-gray-800">
        <div className="flex items-center gap-3">
          <Recycle className="text-emerald-400 w-8 h-8" />
          <span className="text-white text-2xl font-bold tracking-tight">
            EcoTrack
          </span>
        </div>

        <div>
          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            Responsible E-Waste <br />
            <span className="text-emerald-400">Management</span> for Business
          </h1>
          <p className="text-gray-400 text-lg mb-10">
            The all-in-one B2B platform for tracking, logging, and disposing of
            electronic waste sustainably.
          </p>

          <div className="space-y-4">
            {features.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-emerald-400" />
                </div>
                <span className="text-gray-300 text-sm">{text}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-gray-600 text-sm">
          © 2025 EcoTrack. Built for a greener future.
        </p>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        {/* Mobile logo */}
        <div className="flex lg:hidden items-center gap-2 mb-10">
          <Recycle className="text-emerald-400 w-7 h-7" />
          <span className="text-white text-xl font-bold">EcoTrack</span>
        </div>

        <div className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-2">
              Welcome back
            </h2>
            <p className="text-gray-400">
              Sign in to your EcoTrack workspace
            </p>
          </div>

          <button
            onClick={login}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-400/30 hover:scale-[1.02]"
          >
            <Recycle className="w-5 h-5" />
            Continue with Email
          </button>

          <p className="text-center text-gray-600 text-xs mt-6">
            By signing in, you agree to our Terms of Service and Privacy Policy.
            <br /> A one-time code will be sent to your email.
          </p>
        </div>
      </div>
    </div>
  );
}