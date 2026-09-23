"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { deleteEntity, reorderEntities, toggleEntityField } from "@/lib/admin/actions";
import type { ToggleFieldConfig } from "@/lib/admin/entities";
import { ConfirmSubmitButton } from "@/components/admin/confirm-submit-button";

export type ReorderableRow = {
  id: string;
  title: string;
  subtitle: string;
  toggleValue?: boolean;
};

function PublishToggle({
  entityKey,
  id,
  value,
  config,
}: {
  entityKey: string;
  id: string;
  value: boolean;
  config: ToggleFieldConfig;
}) {
  const [on, setOn] = useState(value);
  const [pending, setPending] = useState(false);

  async function toggle() {
    const next = !on;
    setOn(next); // optimistic
    setPending(true);
    try {
      await toggleEntityField(entityKey, id, next);
    } catch {
      setOn(!next); // revert on failure
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={pending}
      aria-pressed={on}
      aria-label={on ? config.onLabel : config.offLabel}
      className="flex shrink-0 items-center gap-2 disabled:opacity-60"
    >
      <span className={`text-xs ${on ? "text-fg" : "text-fg-faint"}`}>
        {on ? config.onLabel : config.offLabel}
      </span>
      <span
        className={`relative h-5 w-9 rounded-full transition-colors ${on ? "bg-accent" : "bg-border-strong"}`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-bg transition-transform ${
            on ? "translate-x-4" : "translate-x-0.5"
          }`}
        />
      </span>
    </button>
  );
}

export function ReorderableList({
  entityKey,
  initialRows,
  toggleField,
}: {
  entityKey: string;
  initialRows: ReorderableRow[];
  toggleField?: ToggleFieldConfig;
}) {
  const [rows, setRows] = useState(initialRows);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const dragIndex = useRef<number | null>(null);

  function move(from: number, to: number) {
    if (to < 0 || to >= rows.length) return;
    setRows((prev) => {
      const next = [...prev];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return next;
    });
    setDirty(true);
  }

  async function saveOrder() {
    setSaving(true);
    try {
      await reorderEntities(entityKey, rows.map((r) => r.id));
      setDirty(false);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      {dirty && (
        <div className="mb-4 flex items-center gap-3 rounded-lg border border-accent/30 bg-accent-soft px-4 py-2.5 text-sm text-fg">
          Order changed.
          <button
            type="button"
            onClick={saveOrder}
            disabled={saving}
            className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-fg disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save order"}
          </button>
        </div>
      )}

      <div className="divide-y divide-border border-y border-border">
        {rows.length === 0 && <p className="py-6 text-sm text-fg-muted">Nothing here yet.</p>}

        {rows.map((row, i) => {
          const boundDelete = deleteEntity.bind(null, entityKey, row.id);

          return (
            <div
              key={row.id}
              draggable
              onDragStart={() => {
                dragIndex.current = i;
              }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (dragIndex.current !== null && dragIndex.current !== i) {
                  move(dragIndex.current, i);
                }
                dragIndex.current = null;
              }}
              className="flex items-center gap-3 py-4"
            >
              <span
                aria-hidden="true"
                className="cursor-grab select-none text-fg-faint"
                title="Drag to reorder"
              >
                ⠿
              </span>

              <div className="flex shrink-0 flex-col">
                <button
                  type="button"
                  onClick={() => move(i, i - 1)}
                  disabled={i === 0}
                  aria-label="Move up"
                  className="text-fg-faint transition-colors hover:text-fg disabled:opacity-30"
                >
                  ▲
                </button>
                <button
                  type="button"
                  onClick={() => move(i, i + 1)}
                  disabled={i === rows.length - 1}
                  aria-label="Move down"
                  className="text-fg-faint transition-colors hover:text-fg disabled:opacity-30"
                >
                  ▼
                </button>
              </div>

              <Link href={`/admin/${entityKey}/${row.id}`} className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-fg">{row.title}</p>
                {row.subtitle && <p className="truncate text-xs text-fg-muted">{row.subtitle}</p>}
              </Link>

              <div className="flex shrink-0 items-center gap-4">
                {toggleField && (
                  <PublishToggle
                    entityKey={entityKey}
                    id={row.id}
                    value={row.toggleValue ?? false}
                    config={toggleField}
                  />
                )}
                <Link
                  href={`/admin/${entityKey}/${row.id}`}
                  className="text-sm text-fg-muted transition-colors hover:text-fg"
                >
                  Edit
                </Link>
                <form action={boundDelete}>
                  <ConfirmSubmitButton
                    confirmMessage={`Delete "${row.title}"? This can't be undone.`}
                    className="text-sm text-fg-muted transition-colors hover:text-danger"
                  >
                    Delete
                  </ConfirmSubmitButton>
                </form>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
