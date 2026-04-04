"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, UserPlus, X } from "lucide-react";

import { useCreateAgreement, useUserSearch } from "@/features/agreements/api";
import type { UserSnippet } from "@/features/agreements/types";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import { getDisplayName } from "@/lib/utils";

interface CreateAgreementModalProps {
  open: boolean;
  onClose: () => void;
}

interface DraftObligation {
  id: string;
  description: string;
  assignedToId: string;
}

function createDraftObligation(assignedToId: string): DraftObligation {
  return {
    id: crypto.randomUUID(),
    description: "",
    assignedToId,
  };
}

export function CreateAgreementModal({
  open,
  onClose,
}: CreateAgreementModalProps) {
  const router = useRouter();
  const { user } = useAuth();
  const createAgreement = useCreateAgreement();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState(
    new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString().slice(0, 10),
  );
  const [participantSearch, setParticipantSearch] = useState("");
  const [selectedParticipants, setSelectedParticipants] = useState<UserSnippet[]>([]);
  const [obligations, setObligations] = useState<DraftObligation[]>([
    createDraftObligation(""),
  ]);
  const [error, setError] = useState<string | null>(null);

  const creator: UserSnippet | null = user
    ? {
        id: user.id,
        email: user.email ?? "",
        name:
          typeof user.user_metadata?.name === "string"
            ? user.user_metadata.name
            : null,
        trustScore: 100,
      }
    : null;

  const allParticipants = useMemo(
    () => (creator ? [creator, ...selectedParticipants] : selectedParticipants),
    [creator, selectedParticipants],
  );

  const userSearch = useUserSearch(participantSearch);

  return (
    <Modal
      open={open}
      onClose={() => {
        setError(null);
        onClose();
      }}
      title="Create a new agreement"
      description="Define the shared commitment, add the right people, and break delivery into specific obligations."
    >
      <div className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
        <div className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">
              Agreement title
            </label>
            <Input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Launch the community funding page"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">
              Description
            </label>
            <Textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Describe the expectations, context, and what success should look like."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Due date</label>
            <Input
              type="date"
              value={dueDate}
              onChange={(event) => setDueDate(event.target.value)}
            />
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="font-display text-xl font-bold text-slate-950">
                  Obligations
                </h3>
                <p className="text-sm text-slate-500">
                  Assign concrete responsibilities to specific participants.
                </p>
              </div>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() =>
                  setObligations((current) => [
                    ...current,
                    createDraftObligation(creator?.id ?? ""),
                  ])
                }
              >
                <Plus className="h-4 w-4" />
                Add obligation
              </Button>
            </div>

            <div className="space-y-4">
              {obligations.map((obligation, index) => (
                <div
                  key={obligation.id}
                  className="rounded-[24px] border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-900">
                      Obligation {index + 1}
                    </p>
                    {obligations.length > 1 ? (
                      <button
                        type="button"
                        className="rounded-full p-1 text-slate-400 transition hover:bg-white hover:text-slate-700"
                        onClick={() =>
                          setObligations((current) =>
                            current.filter((item) => item.id !== obligation.id),
                          )
                        }
                      >
                        <X className="h-4 w-4" />
                      </button>
                    ) : null}
                  </div>
                  <div className="space-y-3">
                    <Input
                      value={obligation.description}
                      onChange={(event) =>
                        setObligations((current) =>
                          current.map((item) =>
                            item.id === obligation.id
                              ? { ...item, description: event.target.value }
                              : item,
                          ),
                        )
                      }
                      placeholder="Prepare launch copy, publish assets, or confirm legal review."
                    />
                    <select
                      className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                      value={obligation.assignedToId}
                      onChange={(event) =>
                        setObligations((current) =>
                          current.map((item) =>
                            item.id === obligation.id
                              ? { ...item, assignedToId: event.target.value }
                              : item,
                          ),
                        )
                      }
                    >
                      <option value="">Assign to...</option>
                      {allParticipants.map((participant) => (
                        <option key={participant.id} value={participant.id}>
                          {getDisplayName(participant.name, participant.email)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-[28px] border border-slate-200 bg-white p-5">
            <div className="mb-4">
              <h3 className="font-display text-xl font-bold text-slate-950">
                Participants
              </h3>
              <p className="text-sm text-slate-500">
                Add existing TrustLoop users by name or email.
              </p>
            </div>

            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={participantSearch}
                onChange={(event) => setParticipantSearch(event.target.value)}
                placeholder="Search by email or name"
                className="pl-11"
              />
            </div>

            <div className="mt-4 space-y-2">
              {userSearch.data?.map((candidate) => {
                const alreadySelected = selectedParticipants.some(
                  (participant) => participant.id === candidate.id,
                );

                return (
                  <button
                    key={candidate.id}
                    type="button"
                    className="flex w-full items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-left transition hover:bg-slate-50"
                    onClick={() => {
                      if (alreadySelected) {
                        return;
                      }

                      setSelectedParticipants((current) => [...current, candidate]);
                      setParticipantSearch("");
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar
                        name={candidate.name}
                        email={candidate.email}
                        className="h-9 w-9 rounded-xl"
                      />
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {getDisplayName(candidate.name, candidate.email)}
                        </p>
                        <p className="text-xs text-slate-500">{candidate.email}</p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-slate-400">
                      {alreadySelected ? "Added" : `Trust ${candidate.trustScore}`}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-5">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                Selected participants
              </p>
              <div className="space-y-3">
                {allParticipants.map((participant) => (
                  <div
                    key={participant.id}
                    className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar
                        name={participant.name}
                        email={participant.email}
                        className="h-9 w-9 rounded-xl"
                      />
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {getDisplayName(participant.name, participant.email)}
                        </p>
                        <p className="text-xs text-slate-500">
                          {participant.id === creator?.id ? "Creator" : "Participant"}
                        </p>
                      </div>
                    </div>
                    {participant.id !== creator?.id ? (
                      <button
                        type="button"
                        className="rounded-full p-1 text-slate-400 transition hover:bg-white hover:text-slate-700"
                        onClick={() =>
                          setSelectedParticipants((current) =>
                            current.filter((item) => item.id !== participant.id),
                          )
                        }
                      >
                        <X className="h-4 w-4" />
                      </button>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-[28px] bg-slate-950 p-5 text-white">
            <div className="flex items-center gap-3 text-sm font-semibold">
              <UserPlus className="h-4 w-4 text-emerald-300" />
              TrustLoop creates accountability in layers
            </div>
            <p className="mt-3 text-sm leading-6 text-white/70">
              Agreements track the shared commitment. Obligations track the exact
              follow-through. Trust changes when execution does.
            </p>
          </div>

          {error ? (
            <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700 ring-1 ring-rose-100">
              {error}
            </div>
          ) : null}

          <Button
            className="w-full"
            size="lg"
            isLoading={createAgreement.isPending}
            onClick={async () => {
              try {
                setError(null);

                const agreement = await createAgreement.mutateAsync({
                  title,
                  description,
                  dueDate,
                  participantIds: selectedParticipants.map((participant) => participant.id),
                  obligations: obligations.map((obligation) => ({
                    assignedToId: obligation.assignedToId || creator?.id || "",
                    description: obligation.description,
                  })),
                });

                setTitle("");
                setDescription("");
                setDueDate(
                  new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
                    .toISOString()
                    .slice(0, 10),
                );
                setSelectedParticipants([]);
                setObligations([createDraftObligation(creator?.id ?? "")]);
                onClose();
                router.push(`/agreements/${agreement.id}`);
              } catch (mutationError) {
                const message =
                  mutationError instanceof Error
                    ? mutationError.message
                    : "Failed to create agreement.";

                setError(message);
              }
            }}
          >
            Launch agreement
          </Button>
        </div>
      </div>
    </Modal>
  );
}
