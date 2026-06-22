import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { STAGES, PRIORITIES } from "@/components/StatusBadges";

const EMPTY = {
  customerName: "",
  contactName: "",
  contactEmail: "",
  contactPhone: "",
  requirement: "",
  estimatedValue: "",
  stage: "New",
  priority: "Medium",
  nextFollowUpDate: "",
  notes: "",
};

function toDateInput(d) {
  if (!d) return "";
  try {
    return new Date(d).toISOString().slice(0, 10);
  } catch {
    return "";
  }
}

function normalizeEstimatedValue(value) {
  if (value == null || value === "") return "";
  return String(value);
}

export function OpportunityForm({
  initialValues,
  onSubmit,
  submitting,
  submitLabel = "Save",
  readOnly = false,
}) {
  const [values, setValues] = useState(() => ({
    ...EMPTY,
    ...(initialValues ?? {}),
    estimatedValue: normalizeEstimatedValue(initialValues?.estimatedValue),
    nextFollowUpDate: toDateInput(initialValues?.nextFollowUpDate),
  }));
  const [errors, setErrors] = useState({});

  const set = (key) => (e) => {
    const v = e?.target ? e.target.value : e;
    setValues((s) => ({ ...s, [key]: v }));
  };

  const setEstimatedValue = (e) => {
    const v = e.target.value;
    if (v === "" || /^\d*\.?\d*$/.test(v)) {
      setValues((s) => ({ ...s, estimatedValue: v }));
    }
  };

  const validate = () => {
    const e = {};
    if (!values.customerName.trim()) e.customerName = "Required";
    if (!values.requirement.trim()) e.requirement = "Required";
    if (values.estimatedValue !== "") {
      const n = Number(values.estimatedValue);
      if (Number.isNaN(n)) e.estimatedValue = "Must be a number";
      else if (n < 0) e.estimatedValue = "Must be zero or greater";
    }
    if (values.contactEmail && !/^\S+@\S+\.\S+$/.test(values.contactEmail))
      e.contactEmail = "Invalid email";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    if (readOnly) return;
    if (!validate()) return;
    onSubmit?.({
      ...values,
      estimatedValue: values.estimatedValue === "" ? null : Number(values.estimatedValue),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <section className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Customer
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Customer name" error={errors.customerName} required>
            <Input
              value={values.customerName}
              onChange={set("customerName")}
              placeholder="Acme Inc."
              readOnly={readOnly}
              disabled={readOnly}
            />
          </Field>
          <Field label="Contact name">
            <Input
              value={values.contactName}
              onChange={set("contactName")}
              placeholder="Jane Doe"
              readOnly={readOnly}
              disabled={readOnly}
            />
          </Field>
          <Field label="Contact email" error={errors.contactEmail}>
            <Input
              type="email"
              value={values.contactEmail}
              onChange={set("contactEmail")}
              placeholder="jane@acme.com"
              readOnly={readOnly}
              disabled={readOnly}
            />
          </Field>
          <Field label="Contact phone">
            <Input
              value={values.contactPhone}
              onChange={set("contactPhone")}
              placeholder="+1 555 123 4567"
              readOnly={readOnly}
              disabled={readOnly}
            />
          </Field>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Opportunity
        </h3>
        <Field label="Requirement" error={errors.requirement} required>
          <Textarea
            rows={3}
            value={values.requirement}
            onChange={set("requirement")}
            placeholder="What does the customer need?"
            readOnly={readOnly}
            disabled={readOnly}
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Estimated value (USD)" error={errors.estimatedValue}>
            <Input
              type="text"
              inputMode="decimal"
              value={values.estimatedValue}
              onChange={setEstimatedValue}
              placeholder="10000"
              readOnly={readOnly}
              disabled={readOnly}
            />
          </Field>
          <Field label="Next follow-up date">
            <Input
              type="date"
              value={values.nextFollowUpDate}
              onChange={set("nextFollowUpDate")}
              readOnly={readOnly}
              disabled={readOnly}
            />
          </Field>
          <Field label="Stage">
            <Select value={values.stage} onValueChange={set("stage")} disabled={readOnly}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {STAGES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Priority">
            <Select value={values.priority} onValueChange={set("priority")} disabled={readOnly}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {PRIORITIES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
        </div>

        <Field label="Notes">
          <Textarea
            rows={4}
            value={values.notes}
            onChange={set("notes")}
            placeholder="Internal notes, meeting summaries, etc."
            readOnly={readOnly}
            disabled={readOnly}
          />
        </Field>
      </section>

      {!readOnly && (
        <div className="flex justify-end gap-2 border-t border-border/60 pt-4">
          <Button type="submit" disabled={submitting}>
            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {submitLabel}
          </Button>
        </div>
      )}
    </form>
  );
}

function Field({ label, error, required, children }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm">
        {label}
        {required && <span className="ml-1 text-destructive">*</span>}
      </Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
