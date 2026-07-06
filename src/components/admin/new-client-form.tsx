"use client";

import { useActionState } from "react";
import Link from "next/link";

import { Button } from "@/components/portal-ui/button";
import { Input } from "@/components/portal-ui/input";
import { Label } from "@/components/portal-ui/label";
import { Textarea } from "@/components/portal-ui/textarea";
import { createClientAction, type ActionState } from "@/app/admin/clients/actions";

const initialState: ActionState = {};

export function NewClientForm() {
  const [state, formAction, isPending] = useActionState(
    createClientAction,
    initialState
  );

  return (
    <form action={formAction} className="space-y-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" required disabled={isPending} />
          {state.fieldErrors?.name && (
            <p className="text-xs text-red-500">{state.fieldErrors.name[0]}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            disabled={isPending}
          />
          {state.fieldErrors?.email && (
            <p className="text-xs text-red-500">{state.fieldErrors.email[0]}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="companyName">Company Name</Label>
          <Input
            id="companyName"
            name="companyName"
            required
            disabled={isPending}
          />
          {state.fieldErrors?.companyName && (
            <p className="text-xs text-red-500">
              {state.fieldErrors.companyName[0]}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            disabled={isPending}
          />
          {state.fieldErrors?.password && (
            <p className="text-xs text-red-500">
              {state.fieldErrors.password[0]}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" type="tel" disabled={isPending} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            name="website"
            type="url"
            placeholder="https://"
            disabled={isPending}
          />
          {state.fieldErrors?.website && (
            <p className="text-xs text-red-500">
              {state.fieldErrors.website[0]}
            </p>
          )}
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            name="status"
            defaultValue="ACTIVE"
            disabled={isPending}
            className="h-11 w-full rounded-lg border border-border bg-surface-container-low px-4 text-sm text-foreground outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="SUSPENDED">Suspended</option>
          </select>
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea id="notes" name="notes" rows={4} disabled={isPending} />
        </div>
      </div>

      {state.error && <p className="text-sm text-red-500">{state.error}</p>}

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Creating..." : "Create Client"}
        </Button>
        <Button type="button" variant="outline" asChild>
          <Link href="/admin/clients">Cancel</Link>
        </Button>
      </div>
    </form>
  );
}
