"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AtSign, Lock, Sparkles, Zap } from "lucide-react";

import { Button } from "@/components/portal-ui/button";
import { Input } from "@/components/portal-ui/input";
import { Label } from "@/components/portal-ui/label";
import { Card } from "@/components/portal-ui/card";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (loading) return;

        setLoading(true);
        setError("");

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError("Invalid email or password");
                return;
            }

            router.push("/portal/dashboard");
            router.refresh();
        } catch {
            setError("Invalid email or password");
        } finally {
            setLoading(false);
        }
    }

    function handleGoogleSignIn() {
        setError("Google sign-in is not available yet.");
    }

    return (
        <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-surface px-4 py-16">
            <div className="pointer-events-none absolute inset-0 bg-grid-fade" />

            <div className="relative z-10 mx-auto grid w-full max-w-4xl grid-cols-1 items-stretch gap-0 lg:grid-cols-[1.05fr_0.95fr]">
                <div className="flex flex-col items-center text-center lg:items-center lg:justify-center lg:pr-10">
                    <span className="flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-[0_0_30px_rgba(255,92,0,0.35)]">
                        <Zap className="size-7" />
                    </span>
                    <h1 className="mt-5 font-portal-display text-2xl font-bold">TechParivar</h1>
                    <p className="mt-1 text-sm text-on-surface-variant">
                        Enter the Client Portal Ecosystem
                    </p>

                    <Card className="mt-8 w-full max-w-sm gap-5 border-border/80 p-6 text-left">
                        <form onSubmit={handleSubmit}>
                            <Button
                                type="button"
                                variant="secondary"
                                size="lg"
                                className="w-full justify-center gap-3"
                                onClick={handleGoogleSignIn}
                            >
                                <span className="flex size-5 items-center justify-center rounded-full bg-white text-[11px] font-bold text-[#4285F4]">
                                    G
                                </span>
                                Continue with Google
                            </Button>

                            <div className="flex items-center gap-3">
                                <div className="h-px flex-1 bg-border" />
                                <span className="font-portal-data text-[10px] uppercase tracking-wider text-on-surface-variant">
                                    Or Email
                                </span>
                                <div className="h-px flex-1 bg-border" />
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <div className="relative">
                                        <AtSign className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-on-surface-variant" />
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="name@company.com"
                                            className="pl-10"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="password">Password</Label>
                                        <Link href="#" className="text-xs font-semibold text-primary">
                                            Forgot?
                                        </Link>
                                    </div>
                                    <div className="relative">
                                        <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-on-surface-variant" />
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="••••••••"
                                            className="pl-10"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {error && (
                                <p className="text-sm text-red-500 text-center">
                                    {error}
                                </p>
                            )}

                            <Button
                                type="submit"
                                size="lg"
                                className="w-full"
                                disabled={loading}
                            >
                                {loading ? "Signing In..." : "Sign In"}
                            </Button>

                            <div className="space-y-3 border-t border-border/60 pt-5 text-center">
                                <p className="text-xs text-on-surface-variant">Tired of passwords?</p>
                                <Link
                                    href="#"
                                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary"
                                >
                                    <Sparkles className="size-4" />
                                    Send a Magic Link
                                </Link>
                            </div>
                        </form>
                    </Card>

                    <div className="mt-6 flex items-center gap-5 text-xs text-on-surface-variant">
                        <Link href="#" className="hover:text-foreground">Privacy</Link>
                        <Link href="#" className="hover:text-foreground">Terms</Link>
                        <Link href="#" className="hover:text-foreground">Support</Link>
                        <span className="flex items-center gap-1.5">
                            <span className="size-1.5 rounded-full bg-mint-green" />
                            System Operational
                        </span>
                    </div>
                </div>

                <Card className="glass-card hidden gap-0 overflow-hidden p-0 lg:flex lg:flex-col">
                    <div className="relative flex-1 bg-gradient-to-br from-[#1a1420] via-[#171a26] to-[#0e1c2e] p-6">
                        <div className="pointer-events-none absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_20%_20%,rgba(255,92,0,0.25),transparent_45%),radial-gradient(circle_at_80%_70%,rgba(91,141,239,0.25),transparent_45%)]" />
                        <div className="relative flex h-full flex-col justify-between">
                            <div className="flex items-center justify-between text-[10px] font-portal-data uppercase tracking-wider text-on-surface-variant">
                                <span>Store Network</span>
                                <span className="flex items-center gap-1 text-mint-green">
                                    <span className="size-1.5 rounded-full bg-mint-green" /> Connected
                                </span>
                            </div>

                            <div className="ml-auto w-56 rounded-xl border border-white/10 bg-surface/80 p-4 backdrop-blur-xl">
                                <div className="flex items-center gap-2">
                                    <span className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                                        <Zap className="size-3.5" />
                                    </span>
                                    <span className="font-portal-display text-sm font-bold">AETERNA</span>
                                </div>
                                <p className="mt-1 font-portal-data text-[9px] uppercase tracking-wider text-on-surface-variant">
                                    Secure Client Portal
                                </p>
                                <div className="mt-4 space-y-2">
                                    <div className="rounded-md border border-white/10 bg-surface-container-low px-3 py-2 text-[10px] text-on-surface-variant">
                                        client@aeterna.io
                                    </div>
                                    <div className="rounded-md border border-white/10 bg-surface-container-low px-3 py-2 text-[10px] text-on-surface-variant">
                                        ••••••••
                                    </div>
                                    <div className="rounded-md bg-primary py-2 text-center text-[10px] font-bold text-primary-foreground">
                                        Login
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-white/10 p-6">
                        <p className="font-portal-data text-[10px] font-semibold uppercase tracking-wider text-primary">
                            Latest Updates
                        </p>
                        <h3 className="mt-2 font-portal-display text-lg font-semibold">
                            New Security Layer
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
                            We&apos;ve upgraded all client portals with hardware-level
                            encryption and biometric-ready MFA. Secure by design.
                        </p>
                    </div>
                </Card>
            </div>
        </main>
    );
}