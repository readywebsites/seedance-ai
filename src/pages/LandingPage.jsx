import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Video, Sparkles, Wand2, ShieldCheck, Zap, 
  Play, Download, Share2, Star, HelpCircle, 
  Cpu, Languages, Layers, ChevronDown 
} from 'lucide-react';
import GlassCard from '../components/GlassCard';
import Navbar from '../components/Navbar';

export default function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { y: 25, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  const features = [
    {
      icon: Wand2,
      title: "Text to Video AI",
      desc: "Turn raw text descriptions into hyper-realistic, cinema-grade video clips in seconds."
    },
    {
      icon: Layers,
      title: "Image to Video",
      desc: "Upload reference frames, character sheets, or landscapes to seed your cinematic narratives."
    },
    {
      icon: Zap,
      title: "Dynamic Camera Controls",
      desc: "Program movements like pans, orbits, tilts, and zoom ratios without complex camera rigs."
    },
    {
      icon: Languages,
      title: "Negative Prompting",
      desc: "Filter out artifacts, deformations, and unwanted textures with precise negative token tags."
    },
    {
      icon: ShieldCheck,
      title: "Enterprise Provider API",
      desc: "Integrate Seedance, Runway, Veo, and Kling into your pipeline using one API key."
    },
    {
      icon: Cpu,
      title: "Seed Consistency",
      desc: "Re-use seed seeds, frame-rates, and creative settings to preserve consistency across scenes."
    }
  ];

  const models = [
    { name: "Seedance v2", type: "Native", desc: "Best for high-fidelity character motion & physics", speed: "Ultra Fast", quality: "Cinematic" },
    { name: "Runway Gen-3", type: "External", desc: "Creative transitions & atmospheric simulation", speed: "Fast", quality: "Standard" },
    { name: "Kling 1.5 Pro", type: "External", desc: "Photorealistic human facial expressions", speed: "Medium", quality: "Ultra HD" },
    { name: "Google Veo", type: "External", desc: "High-definition structural environments", speed: "Slow", quality: "8K Cinematic" },
    { name: "Pika 2.0", type: "External", desc: "Cartoony assets & rapid animation prototyping", speed: "Ultra Fast", quality: "Stylized" },
  ];

  const examples = [
    {
      title: "Cyberpunk Metropolis",
      prompt: "A stunning ultra-realistic cyberpunk city with towering neon skyscrapers and wet reflective streets.",
      img: "/cyberpunk.jpg",
      model: "Seedance v2"
    },
    {
      title: "Steampunk Waterfall",
      prompt: "A gorgeous steampunk floating island in the sky, golden hour light cascading waterfalls.",
      img: "/steampunk.jpg",
      model: "Kling 1.5 Pro"
    },
    {
      title: "Nebula Astronaut",
      prompt: "Cinematic astronaut floating in space near a giant purple and pink stellar nebula.",
      img: "/astronaut.jpg",
      model: "Runway Gen-3"
    }
  ];

  const plans = [
    {
      name: "Free",
      price: "$0",
      credits: "1,000 / mo",
      desc: "Perfect for testing the AI generation engine.",
      features: ["Seedance v2 Standard", "480p Output Resolution", "3 Second Videos", "Community Support"],
      cta: "Try Now",
      highlight: false
    },
    {
      name: "Starter",
      price: "$19",
      credits: "300 / mo",
      desc: "Ideal for video content creators & designers.",
      features: ["All Models Access", "720p Resolution", "5 Second Videos", "Email Support", "No Watermark"],
      cta: "Subscribe",
      highlight: false
    },
    {
      name: "Pro",
      price: "$49",
      credits: "1,000 / mo",
      desc: "Designed for professionals & studios.",
      features: ["Priority Queue Processing", "1080p Resolution", "Up to 10s Videos", "Advanced Camera Motion", "Priority Support"],
      cta: "Subscribe",
      highlight: true
    },
    {
      name: "Business",
      price: "$149",
      credits: "4,000 / mo",
      desc: "Enterprise workflows & custom pipelines.",
      features: ["Dedicated API Keys", "Custom Provider Class Integration", "8K Resolution Support", "Unlimited Active Jobs", "Dedicated Manager"],
      cta: "Contact Sales",
      highlight: false
    }
  ];

  const faqs = [
    { q: "How do generation credits work?", a: "Each plan grants monthly generation credits. A typical 5-second video costs 15 credits. If you run out, you can top up credits in increments of 100 on the Billing dashboard." },
    { q: "Can I connect my own Seedance or Runway API key?", a: "Yes. In the Developer settings, you can add your custom external keys to bypass platform credit fees entirely and pay provider rates." },
    { q: "What is the difference between AI models?", a: "Seedance offers physics consistency, Kling specializes in human-centric motions, Runway excels in scenic transformations, and Google Veo specializes in detailed long-form prompts." },
    { q: "Can I cancel my subscription anytime?", a: "Absolutely. You can cancel or upgrade your subscription from the Billing settings instantly with no hidden costs." }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#03000a] cyber-grid">
      {/* Background neon blurs */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] radial-glow-purple opacity-50 pointer-events-none" />
      <div className="absolute top-[35%] right-[-10%] w-[60%] h-[60%] radial-glow-blue opacity-45 pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[10%] w-[65%] h-[65%] radial-glow-cyan opacity-40 pointer-events-none" />
      <div className="absolute bottom-[25%] right-[25%] w-[45%] h-[45%] radial-glow-pink opacity-30 pointer-events-none" />

      {/* Floating visual cards for cyberpunk layout */}
      <div className="hidden lg:block absolute top-[25%] left-[6%] w-48 float-1 pointer-events-none z-20">
        <GlassCard className="p-4 border-cyber-purple/20 neon-border-purple text-left space-y-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
          <span className="text-[10px] text-zinc-500 font-semibold block">DISPATCHED JOB</span>
          <span className="text-xs text-zinc-300 font-mono block">sd_job_f8a9e2</span>
        </GlassCard>
      </div>

      <div className="hidden lg:block absolute top-[50%] right-[5%] w-56 float-2 pointer-events-none z-20">
        <GlassCard className="p-4 border-cyber-cyan/20 neon-border-cyan text-left space-y-2">
          <span className="text-[9px] text-zinc-400 font-mono block">RUNNING WORKERS</span>
          <div className="w-full bg-zinc-950 h-1.5 rounded-full overflow-hidden">
            <div className="bg-cyber-cyan h-full w-[70%]" />
          </div>
          <span className="text-[10px] text-zinc-400 block font-medium">Generating Frame 120/240</span>
        </GlassCard>
      </div>

      <Navbar />

      {/* Hero Section */}
      <section className="pt-36 pb-24 px-6 max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4.5 py-1.5 rounded-full bg-cyber-purple/10 border border-cyber-purple/20 text-cyber-purple text-xs font-semibold uppercase tracking-wider mb-8"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Next Generation AI Video Model</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-5xl md:text-8xl font-heading font-extrabold tracking-tight text-white leading-[1.05] mb-6"
        >
          Craft Hyper-Realistic <br />
          <span className="text-gradient">AI Videos Instantly</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-zinc-400 text-lg md:text-xl max-w-2xl leading-relaxed mb-10"
        >
          Combine prompt inputs, style presets, camera motions, and multi-model AI providers to create production-ready video assets in seconds.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 mb-16"
        >
          <Link
            to="/register"
            className="px-8 py-4 bg-cyber-purple hover:bg-cyber-purple/90 text-white font-bold rounded-xl shadow-lg shadow-cyber-purple/10 hover:shadow-cyber-purple/20 transition-all hover:-translate-y-0.5"
          >
            Start Generating Free
          </Link>
          <a
            href="#models"
            className="px-8 py-4 bg-[#0d0b18]/60 border border-cyber-purple/20 text-zinc-300 hover:text-white font-semibold rounded-xl transition-all hover:bg-[#161327]/60"
          >
            Explore AI Models
          </a>
        </motion.div>

        {/* Hero Interactive Preview Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 50, delay: 0.4 }}
          className="w-full max-w-4xl"
        >
          <GlassCard className="p-2.5 border-cyber-purple/35 bg-[#0d0b18]/50 shadow-2xl relative group neon-border-purple">
            <div className="aspect-video rounded-xl overflow-hidden relative bg-zinc-900 border border-zinc-800">
              <img
                src="/seedance-ai/cyberpunk.jpg"
                alt="Cyberpunk Metropolis Hero Preview"
                className="w-full h-full object-cover opacity-85"
              />
              <div className="absolute inset-0 bg-black/35 backdrop-blur-[0.5px] flex items-center justify-center">
                <Link
                  to="/login"
                  className="p-5 rounded-full bg-cyber-purple text-white shadow-xl hover:scale-110 transition-transform cursor-pointer"
                >
                  <Play className="w-8 h-8 fill-current translate-x-0.5" />
                </Link>
              </div>
              <div className="absolute bottom-4 left-4 right-4 bg-black/60 border border-white/5 backdrop-blur-md px-4 py-3 rounded-lg flex items-center justify-between text-left text-xs">
                <div>
                  <span className="text-zinc-500 font-medium block">PROMPT INPUT</span>
                  <span className="text-zinc-200 truncate block max-w-md">"A stunning ultra-realistic cyberpunk city with wet streets reflecting neon purple..."</span>
                </div>
                <span className="px-3 py-1 rounded bg-cyber-cyan/10 border border-cyber-cyan/20 text-cyber-cyan uppercase font-mono tracking-wider font-semibold">Seedance v2</span>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 border-t border-zinc-900 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-heading font-extrabold text-white mb-4">Complete Creative Control</h2>
            <p className="text-zinc-400 max-w-xl mx-auto">
              Everything you need to orchestrate cinema-grade video segments with advanced physics and lighting control.
            </p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div key={i} variants={itemVariants}>
                  <GlassCard className="h-full flex flex-col justify-between border-cyber-purple/20 hover:border-cyber-cyan/40">
                    <div>
                      <div className="w-12 h-12 rounded-xl bg-cyber-purple/10 border border-cyber-purple/20 flex items-center justify-center text-cyber-purple mb-5">
                        <Icon className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-heading font-semibold text-zinc-100 mb-3">{feature.title}</h3>
                      <p className="text-zinc-400 text-sm leading-relaxed">{feature.desc}</p>
                    </div>
                  </GlassCard>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* AI Models Section */}
      <section id="models" className="py-24 border-t border-zinc-900 bg-zinc-950/40 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-heading font-extrabold text-white mb-4">Integrate Leading AI Models</h2>
            <p className="text-zinc-400 max-w-xl mx-auto">
              Swap providers seamlessly. Our backend leverages a provider-class design, adapting parameters instantly.
            </p>
          </div>

          <GlassCard className="overflow-x-auto p-0 border-cyber-purple/20">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-cyber-purple/20 text-zinc-400 font-semibold bg-[#0d0b18]/50">
                  <th className="p-4 pl-6">Model</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Use Case</th>
                  <th className="p-4">Speed</th>
                  <th className="p-4 pr-6">Max Quality</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cyber-purple/10">
                {models.map((model, i) => (
                  <tr key={i} className="hover:bg-cyber-purple/5 transition-colors">
                    <td className="p-4 pl-6 font-semibold text-zinc-200">{model.name}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 text-xs font-semibold rounded ${model.type === 'Native' ? 'bg-cyber-purple/20 text-cyber-purple border border-cyber-purple/30' : 'bg-zinc-800 text-zinc-400 border border-zinc-700'}`}>
                        {model.type}
                      </span>
                    </td>
                    <td className="p-4 text-zinc-400">{model.desc}</td>
                    <td className="p-4 font-medium text-cyber-cyan">{model.speed}</td>
                    <td className="p-4 pr-6 font-mono text-zinc-300">{model.quality}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </GlassCard>
        </div>
      </section>

      {/* Example Videos Gallery */}
      <section className="py-24 border-t border-zinc-900 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-heading font-extrabold text-white mb-4">Sample Generations</h2>
            <p className="text-zinc-400 max-w-xl mx-auto">
              Inspect raw video presets and outputs created directly on our generation grid.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {examples.map((item, i) => (
              <div key={i} className="flex flex-col gap-4">
                <div className="rounded-xl overflow-hidden aspect-video border border-cyber-purple/20 bg-zinc-950 relative group shadow-lg hover:border-cyber-cyan/40 transition-colors">
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/35 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-4 rounded-full bg-cyber-purple text-white shadow-lg cursor-pointer">
                      <Play className="w-6 h-6 fill-current translate-x-0.5" />
                    </button>
                  </div>
                  <div className="absolute top-3 left-3 bg-black/60 border border-zinc-800 text-zinc-300 font-mono text-xs px-2 py-0.5 rounded-full">
                    {item.model}
                  </div>
                </div>
                <div className="text-left">
                  <h4 className="text-lg font-heading font-semibold text-zinc-100 mb-1">{item.title}</h4>
                  <p className="text-zinc-400 text-xs italic">"{item.prompt}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 border-t border-zinc-900 bg-zinc-950/40 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-heading font-extrabold text-white mb-4">Pricing Plans</h2>
            <p className="text-zinc-400 max-w-xl mx-auto">
              Choose the plan that matches your production output needs. Save 20% on annual billing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan, i) => (
              <div
                key={i}
                className={`relative rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 ${
                  plan.highlight
                    ? 'bg-[#0d0b18]/65 border-2 border-cyber-purple shadow-xl shadow-cyber-purple/20 hover:border-cyber-cyan/80'
                    : 'bg-[#0d0b18]/40 border border-cyber-purple/10 hover:border-cyber-purple/35'
                }`}
              >
                {plan.highlight && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-cyber-purple border border-cyber-purple/20 text-white text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full animate-pulse">
                    Most Popular
                  </span>
                )}
                <div className="text-left">
                  <div className="mb-4">
                    <span className="text-zinc-400 text-sm font-semibold uppercase tracking-wider block mb-1">{plan.name}</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl md:text-4xl font-heading font-extrabold text-white">{plan.price}</span>
                      <span className="text-zinc-500 text-xs">/ mo</span>
                    </div>
                  </div>
                  <div className="py-2.5 py-3 rounded-lg bg-zinc-950 border border-zinc-800 mb-6 flex items-center justify-between text-xs">
                    <span className="text-zinc-400">Monthly Credits:</span>
                    <span className="font-bold text-cyber-pink font-mono">{plan.credits}</span>
                  </div>
                  <p className="text-zinc-400 text-xs leading-relaxed mb-6">{plan.desc}</p>
                  
                  <hr className="border-zinc-850 mb-6" />
                  
                  <ul className="space-y-3.5 mb-8">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-zinc-300">
                        <Sparkles className="w-4 h-4 text-cyber-purple shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  to="/register"
                  className={`w-full py-3 rounded-xl text-center text-xs font-bold transition-all ${
                    plan.highlight
                      ? 'bg-cyber-purple hover:bg-cyber-purple/90 text-white shadow-md shadow-cyber-purple/10'
                      : 'bg-zinc-800 hover:bg-zinc-700/80 text-zinc-200'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 border-t border-zinc-900 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-heading font-extrabold text-white mb-4">Used by Creative Innovators</h2>
            <p className="text-zinc-400 max-w-xl mx-auto">
              See how digital visual artists and cinematographers scale their content production.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GlassCard className="border-cyber-purple/15 hover:border-cyber-purple/45">
              <div className="flex items-center gap-1 text-cyber-purple mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
              <p className="text-zinc-300 text-sm leading-relaxed italic mb-6">
                "Seedance v2 allows us to render complex physical simulations in high resolution that would take hours to compute traditionally. The API integrations are incredibly clean."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-sm">JS</div>
                <div className="text-left">
                  <h5 className="text-sm font-semibold text-zinc-200">Julien Sorel</h5>
                  <span className="text-zinc-500 text-xs">VFX Director, Nexus Media</span>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="border-cyber-purple/15 hover:border-cyber-purple/45">
              <div className="flex items-center gap-1 text-cyber-purple mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
              <p className="text-zinc-300 text-sm leading-relaxed italic mb-6">
                "We use the platform's multi-provider support to swap models for different scenes. Kling works wonders for characters, while Seedance v2 handles physics motions perfectly."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-sm">AM</div>
                <div className="text-left">
                  <h5 className="text-sm font-semibold text-zinc-200">Aisha Mercer</h5>
                  <span className="text-zinc-500 text-xs">Lead animator, Cyberia Studio</span>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="border-cyber-purple/15 hover:border-cyber-purple/45">
              <div className="flex items-center gap-1 text-cyber-purple mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
              <p className="text-zinc-300 text-sm leading-relaxed italic mb-6">
                "The credits system is perfect. Top-ups are frictionless via Stripe and Razorpay, and we can manage our active rendering jobs directly inside the developer dashboard."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-sm">TN</div>
                <div className="text-left">
                  <h5 className="text-sm font-semibold text-zinc-200">Tyler Ngo</h5>
                  <span className="text-zinc-500 text-xs">Freelance Cinematographer</span>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 border-t border-zinc-900 bg-zinc-950/40 px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-heading font-extrabold text-white mb-4">Frequently Asked Questions</h2>
            <p className="text-zinc-400">
              Got questions? We've got answers.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <GlassCard key={i} className="p-5 border-cyber-purple/15 hover:border-cyber-purple/35 text-left">
                <h4 className="text-base font-semibold text-zinc-100 mb-2 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-cyber-purple shrink-0" />
                  <span>{faq.q}</span>
                </h4>
                <p className="text-zinc-400 text-sm pl-7 leading-relaxed">{faq.a}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-[#03000a] py-12 px-6 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-cyber-purple/10 border border-cyber-purple/20 rounded-lg text-cyber-purple">
              <Cpu className="w-5 h-5" />
            </div>
            <span className="font-heading font-bold text-base text-white">SEEDANCE AI</span>
          </div>

          <div className="text-zinc-500 text-xs">
            &copy; {new Date().getFullYear()} Seedance Technologies Inc. All rights reserved.
          </div>

          <div className="flex gap-6 text-zinc-400 text-xs font-semibold">
            <a href="#" className="hover:text-zinc-200 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-zinc-200 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-zinc-200 transition-colors">Documentation</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
